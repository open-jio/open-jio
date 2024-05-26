package helper

import (
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/rachelyeohm/open-jio/go-crud/models"
)

func GenerateJWT(user models.User, privateKey string) (string, error) {
	//generates JWT token with the userID, current time and expiry time
	//returns signed JWT
	tokenTTL, _ := strconv.Atoi(os.Getenv("TOKEN_TTL"))
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"iat": time.Now().Unix(),
		"eat": time.Now().Add(time.Second * time.Duration(tokenTTL)).Unix(),
	})

	return token.SignedString([]byte(privateKey))
}
