package middleware

import (
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/models"
)

func ValidateCookie(c *gin.Context) {
	//attain cookie
	cookie, err := c.Cookie("Authorisation")
	if err != nil {
		c.String(http.StatusNotFound, "Cookie not found")
		return
	}
	//get the JWT token stored in the cookie
	token, err := jwt.Parse(cookie, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_PRIVATE_LOGIN_KEY")), nil
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
			}
			c.Set("user", user)
		} else {
			c.String(http.StatusOK, "not ok")
		}

	}

	c.String(http.StatusOK, "Cookie value: %s", cookie)
	c.Next()
}

func SetCookie(c *gin.Context, JWT string) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorisation", JWT, 3600, "", "", false, true)
	c.String(http.StatusOK, "Cookie has been set")
}

func DeleteCookie(c *gin.Context) {
	c.SetCookie("Authorisation", "", -1, "", "", false, true)
	c.String(http.StatusOK, "Cookie has been deleted")
}
