package controllers

import (
	"bytes"
	"html/template"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/rachelyeohm/open-jio/go-crud/helper"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/models"
)

func SendConfirmationEmail(c *gin.Context) {
	//get user info
	userinfo, exists := c.Get("user")
	if exists == false {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)

	//check that email is valid
	email, err := mail.ParseAddress(user.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email"})
		return
	}
	//check that email is NUS email
	domainname := strings.Split(email.Address, "@")
	if domainname[1] != "u.nus.edu" && domainname[1] != "nus.edu" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Not an NUS email"})
		return
	}
	//generate JWT
	jwt, err := helper.GenerateJWT(user, os.Getenv("JWT_PRIVATE_EMAILVERIFY_KEY"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//Get confirmation link
	confirmationurl := os.Getenv("BACKEND_URL") + "/verifyemail/?token=" + jwt
	//Get html
	var body bytes.Buffer
	t, err := template.ParseFiles("./templates/confirmsignup.html")
	t.Execute(&body, struct{ ConfirmationURL string }{ConfirmationURL: confirmationurl})

	//Send email
	err = SendMail("Confirm Your Signup", body, []string{email.Address})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	//respond
	c.Status(200)
}

func CheckConfirmationEmail(c *gin.Context) {
	urltoken := c.DefaultQuery("token", "nil")

	//get the JWT token stored in the cookie
	token, err := jwt.Parse(urltoken, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_PRIVATE_EMAILVERIFY_KEY")), nil
	})

	//check validity of JWT token
	if err != nil || token == nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
		c.Abort()
		return
	}
	//check whether token is expired yet
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		expiryDate, _ := claims["eat"].(float64)
		var user models.User
		if sub, ok := claims["sub"].(float64); ok {
			// Use strconv.FormatFloat here
			stringValue := strconv.FormatFloat(sub, 'f', -1, 64) // Example formatting
			c.String(http.StatusOK, stringValue)
			//Find the user with token userid
			initializers.DB.First(&user, stringValue)

			if user.ID == 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user"})
				c.AbortWithStatus(http.StatusUnauthorized)
				return
			}
			if float64(time.Now().Unix()) > expiryDate {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Token expired"})
				c.AbortWithStatus(http.StatusUnauthorized)
			}

			initializers.DB.Model(&user).Update("email_is_verified", true)

			//respond
			c.Status(200)
		} else {
			c.Status(400)
		}
	}
}

func SendMail(subject string, body bytes.Buffer, to []string) error {
	headers := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";"
	msg := "Subject: " + subject + "\n" + headers + "\n\n" + body.String()
	auth := smtp.PlainAuth(
		"",
		"nusopenjio@gmail.com",
		os.Getenv("EMAIL_KEY"),
		"smtp.gmail.com",
	)
	err := smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		"nusopenjio@gmail.com",
		to,
		[]byte(msg),
	)
	if err != nil {
		return err
	}
	return nil
}
