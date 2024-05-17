package middleware

import (
	"net/http"
	"os"
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
		return []byte(os.Getenv("TOKEN_SECRET")), nil
	})
	//check validity of JWT token
	if err != nil || token == nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
		c.Abort()
		return
	}
	//check whether token is expired yet
	if claims, ok := token.Claims.(*jwt.MapClaims); ok {
		//check user exists and expiry date is not ovr
		username, _ := claims.GetIssuer()
		expiryDate, _ := claims.GetExpirationTime()
		//float64(time.Now().Unix()) > expiryDate.Time 

		if initializers.DB.Where("Username = ", username).Find(&models.User{}).RowsAffected != 0 || 
		time.Now().After(expiryDate.Time) {
			c.AbortWithStatus(http.StatusUnauthorized)
		}		
		
	}
	c.String(http.StatusOK, "Cookie value: %s", cookie)
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