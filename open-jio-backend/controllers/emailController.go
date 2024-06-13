package controllers

import (
	"bytes"
	"fmt"
	"html/template"
	"math/rand"
	"net/http"
	"net/mail"
	"net/smtp"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/rachelyeohm/open-jio/go-crud/helper"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/middleware"
	"github.com/rachelyeohm/open-jio/go-crud/models"
	"golang.org/x/crypto/bcrypt"
)

type Email struct {
	Email string
}

func SendConfirmationEmail(c *gin.Context) {
	//get user info
	var input Email
	err := c.ShouldBindJSON(&input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if initializers.DB.Where("Email=?", input.Email).Find(&models.User{}).RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email does not exist"})
		return
	}

	var user models.User
	initializers.DB.First(&user, "email = ?", input.Email)

	//check that email is valid
	email, err := mail.ParseAddress(user.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//generate JWT
	jwt, err := helper.GenerateJWT(user, os.Getenv("JWT_PRIVATE_EMAILVERIFY_KEY"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//Get confirmation link
	confirmationurl := os.Getenv("FRONTEND_URL") + "/verifyemail/?token=" + jwt
	//Get html
	var body bytes.Buffer
	t, _ := template.ParseFiles("./templates/confirmsignup.html")
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

	//get the JWT token stored in the url
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
				return
			}

			initializers.DB.Model(&user).Update("email_is_verified", true)

			//then generate JWT
			jwt, err := helper.GenerateJWT(user, os.Getenv("JWT_PRIVATE_LOGIN_KEY"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			//generate cookie
			middleware.SetCookie(c, jwt)

			//respond
			c.Status(200)
		} else {
			c.Status(400)
		}
	}
}

func SendRecoveryEmail(c *gin.Context) {
	//Check if email exists in db and user is verified
	var input Email
	err := c.ShouldBindJSON(&input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//check that email is valid
	email, err := mail.ParseAddress(input.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if initializers.DB.Where("Email=?", email.Address).Find(&models.User{}).RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email does not exist"})
		return
	}
	var user models.User
	initializers.DB.First(&user, "email = ?", email.Address)
	if !user.EmailIsVerified {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to send recovery email, please try again later"})
		return
	}
	//Create new email temp password
	var verification models.Verification
	var emailVerificationPassword string
	emailVerificationPassword, verification.VerificationHash, err = NewEmailVerificationPassword()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to send recovery email, please try again later"})
		return
	}
	//Update temp password in db for email verification
	newverify := models.Verification{UserID: strconv.FormatUint(uint64(user.ID), 10), VerificationHash: verification.VerificationHash, Expires_at: time.Now().Add(time.Minute * 5), Used_at: nil}
	//if user has not reset password before (no record in verification table) create entry
	//if user has reset password before (record exist in verification table) find entry
	initializers.DB.FirstOrCreate(&verification, models.Verification{UserID: strconv.FormatUint(uint64(user.ID), 10)})
	initializers.DB.Model(&verification).Select("user_id", "expires_at", "used_at", "verification_hash").Updates(newverify)
	//Get confirmation link
	confirmationurl := os.Getenv("FRONTEND_URL") + "/resetpassword?id=" + strconv.FormatUint(uint64(user.ID), 10) + "&temp=" + emailVerificationPassword
	//Get html
	var body bytes.Buffer
	t, _ := template.ParseFiles("./templates/resetpassword.html")
	t.Execute(&body, struct{ ConfirmationURL string }{ConfirmationURL: confirmationurl})

	//Send email
	err = SendMail("Reset your password", body, []string{email.Address})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	//Response
	c.Status(200)
}
func CheckRecoveryEmail(c *gin.Context) {
	//Check if id and hash is same as in database
	userid := c.DefaultQuery("id", "nil")
	temppassword := c.DefaultQuery("temp", "nil")
	var verification models.Verification
	initializers.DB.First(&verification, "user_id = ?", userid)
	err := bcrypt.CompareHashAndPassword([]byte(verification.VerificationHash), []byte(temppassword))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to reset password, please try again"})
		return
	}
	//check if link has been used
	usedtime := verification.Used_at
	if usedtime != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Link has expired, please try again"})
		return
	}

	//check if link has expired
	if time.Now().After(verification.Expires_at) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Link has expired, please try again"})
		return
	}
	//get input
	var input models.User
	err = c.ShouldBindJSON(&input) // binds input to context, returns possible error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//encrypts the passwords
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var user models.User
	initializers.DB.First(&user, userid)
	initializers.DB.Model(&user).Update("password", hashedPassword)
	//Set temp password to used
	initializers.DB.Model(&verification).Update("used_at", time.Now())
	//Response
	c.Status(200)
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

func NewEmailVerificationPassword() (emailVerificationPassword string, emailVerificationHash string, err error) {
	//Generate random password for email
	var Bytes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	Randomrune := make([]rune, 60)
	for i := range Randomrune {
		Randomrune[i] = Bytes[rand.Intn(len(Bytes))]
	}
	emailVerificationPassword = string(Randomrune)
	var emailVerificationPasswordHash []byte
	emailVerificationPasswordHash, err = bcrypt.GenerateFromPassword([]byte(emailVerificationPassword), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println(err)
		return emailVerificationPassword, emailVerificationHash, err
	}
	emailVerificationHash = string(emailVerificationPasswordHash)
	return emailVerificationPassword, emailVerificationHash, err
}
