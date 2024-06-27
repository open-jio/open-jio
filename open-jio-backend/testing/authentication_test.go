package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/rachelyeohm/open-jio/go-crud/controllers"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/models"
	"github.com/stretchr/testify/assert"
)

func TestWrongLogin(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
    r.POST("/login", controllers.Login)
    user := models.User{
        Username: "user1",
        Password: "saljlfdjflkjsaf",
    }
    jsonValue, _ := json.Marshal(user)
    req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(jsonValue))

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestCorrectLogin(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
    r.POST("/login", controllers.Login)
    user := models.User{
        Username: os.Getenv("EXAMPLE_USERNAME"),
        Password: os.Getenv("EXAMPLE_PASSWORD"),
    }
    jsonValue, _ := json.Marshal(user)
    req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(jsonValue))

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    assert.Equal(t, http.StatusOK, w.Code)
}

func TestLoginUnverified(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
    r.POST("/login", controllers.Login)
    user := models.User{
        Username: "user112312312312313",
        Password: "passw123ord1123123",
    }
    jsonValue, _ := json.Marshal(user)
    req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(jsonValue))

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    assert.Equal(t, http.StatusNotAcceptable, w.Code)
}

func TestRegisterWithExistingEmail(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
    r.POST("/register", controllers.Register)
    user := models.User{
        Username: "user1123123",
		Email: "e1157417@u.nus.edu",
        Password: "passw123ord1123123",
    }
    jsonValue, _ := json.Marshal(user)
    req, _ := http.NewRequest("POST", "/register", bytes.NewBuffer(jsonValue))

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    assert.Equal(t, http.StatusNotAcceptable, w.Code)
}

func TestRegisterWithExistingUsername(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
    r.POST("/register", controllers.Register)
    user := models.User{
        Username: "user1",
		Email: "e1@u.nus.edu",
        Password: "passw123ord1123123",
    }
    jsonValue, _ := json.Marshal(user)
    req, _ := http.NewRequest("POST", "/register", bytes.NewBuffer(jsonValue))

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    assert.Equal(t, http.StatusNotAcceptable, w.Code)
}

func TestRegisterWithNonNUSEmail(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
    r.POST("/register", controllers.Register)
    user := models.User{
        Username: "user111231",
		Email: "e@gmail.com",
        Password: "passw123ord1123123",
    }
    jsonValue, _ := json.Marshal(user)
    req, _ := http.NewRequest("POST", "/register", bytes.NewBuffer(jsonValue))

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    assert.Equal(t, http.StatusNotAcceptable, w.Code)
}

func TestCorrectRegister(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
    r.POST("/register", controllers.Register)
    user := models.User{
        Username: "user112312312312313",
		Email: "elajsdf@u.nus.edu",
        Password: "passw123ord1123123",
    }
    jsonValue, _ := json.Marshal(user)
    req, _ := http.NewRequest("POST", "/register", bytes.NewBuffer(jsonValue))

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
    assert.Equal(t, http.StatusCreated, w.Code)
}