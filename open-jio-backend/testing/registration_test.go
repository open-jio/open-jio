package main

import (
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

func TestRegistrationEvent(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
	r := SetUpRouter()

	// Add the mock authentication middleware
	r.Use(MockAuthMiddleware)

	r.POST("/events/register/:id", controllers.RegisterEvent)
	req, _ := http.NewRequest("POST", "/events/register/3", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	//check theres an entry in the registration database
	//check if poll event exists
	var registration models.Registration
	initializers.DB.Where("event_id=?", uint(3)).
		Where("user_id=?", os.Getenv("EXAMPLE_ID")).Where("deleted_at IS NULL").First(&registration)

	assert.NotEqual(t, uint(0), registration.ID)
}

func TestDeregistrationEvent(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
	r := SetUpRouter()

	// Add the mock authentication middleware
	r.Use(MockAuthMiddleware)

	r.POST("/events/deregister/:id", controllers.DeregisterEvent)
	req, _ := http.NewRequest("POST", "/events/deregister/3", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	//check theres an entry in the registration database
	//check if poll event exists
	var registration models.Registration
	initializers.DB.Where("event_id=?", uint(3)).
		Where("user_id=?", os.Getenv("EXAMPLE_ID")).Where("deleted_at IS NULL").First(&registration)

	assert.Equal(t, uint(0), registration.ID)
}
