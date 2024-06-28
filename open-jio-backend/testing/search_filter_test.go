package main

import (
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/joho/godotenv"
	"github.com/rachelyeohm/open-jio/go-crud/controllers"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/stretchr/testify/assert"
)

func TestSearch(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
    r.GET("/events?search=search&filter=likes&pageSize=4&page=1", controllers.FetchEventsSearch)
    req, _ := http.NewRequest("GET", "/events?search=search&filter=likes&pageSize=4&page=1", nil)

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
	mockResponse := `{"event":{"ID":3,"CreatedAt":"2024-05-15T23:29:40.659526+08:00","UpdatedAt":"2024-06-26T02:57:33.196619+08:00","DeletedAt":null,"UserID":6,"Title":"Badminton but BETTERRRRRRR","Description":" :) :) :)))    ","Time":"2024-09-25T23:00:00+08:00","Location":"MPSH 1","NumberOfLikes":21,"Registrations":null,"PollsOptions":null}}`

	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
    assert.Equal(t, http.StatusOK, w.Code)
}