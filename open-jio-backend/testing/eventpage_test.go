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

func TestFetchIndividualEvent(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
    r.GET("/events/3", controllers.FetchSingleEvent)
    req, _ := http.NewRequest("GET", "/events/3", nil)

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
	mockResponse := `{"event":{"ID":3,"CreatedAt":"2024-05-15T23:29:40.659526+08:00","UpdatedAt":"2024-06-26T02:57:33.196619+08:00","DeletedAt":null,"UserID":6,"Title":"Badminton but BETTERRRRRRR","Description":" :) :) :)))    ","Time":"2024-09-25T23:00:00+08:00","Location":"MPSH 1","NumberOfLikes":21,"Registrations":null,"PollsOptions":null}}`

	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
    assert.Equal(t, http.StatusOK, w.Code)
}

func TestFetchPaginationEvent(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
    r.GET("/events", controllers.FetchFilterEvent)
    req, _ := http.NewRequest("GET", "/events", nil)

	//add query parameters
	q := req.URL.Query()
        q.Add("pageSize", "3")
        q.Add("page", "1")
        req.URL.RawQuery = q.Encode()

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
	mockResponse := `{"events":[{"ID":3,"CreatedAt":"2024-05-15T23:29:40.659526+08:00","UpdatedAt":"2024-06-26T02:57:33.196619+08:00","DeletedAt":null,"UserID":6,"Title":"Badminton but BETTERRRRRRR","Description":" :) :) :)))    ","Time":"2024-09-25T23:00:00+08:00","Location":"MPSH 1","NumberOfLikes":21,"Registrations":null,"PollsOptions":null,"Liked":true,"Joined":true},{"ID":17,"CreatedAt":"2024-05-27T15:40:15.940925+08:00","UpdatedAt":"2024-06-26T02:37:26.558238+08:00","DeletedAt":null,"UserID":6,"Title":"try12345","Description":"try123","Time":"2024-11-14T11:00:00+08:00","Location":"MPSH 1","NumberOfLikes":43,"Registrations":null,"PollsOptions":null,"Liked":false,"Joined":false},{"ID":31,"CreatedAt":"2024-06-03T02:56:42.772579+08:00","UpdatedAt":"2024-06-08T00:15:43.896252+08:00","DeletedAt":null,"UserID":52,"Title":"sEaRcH test (any case)","Description":"try123","Time":"2025-07-02T23:00:00+08:00","Location":"MPSH 1","NumberOfLikes":80,"Registrations":null,"PollsOptions":null,"Liked":false,"Joined":false}]}`

	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
    assert.Equal(t, http.StatusOK, w.Code)
}