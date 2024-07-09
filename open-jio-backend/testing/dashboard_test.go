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

func TestFetchUserJoinedEvents(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
	r := SetUpRouter()
	r.Use(MockAuthMiddleware)
	r.GET("/joinedevents", controllers.FetchJoinedEvents)
	req, _ := http.NewRequest("GET", "/joinedevents", nil)

	//add query parameters
	q := req.URL.Query()
	q.Add("pageSize", "3")
	q.Add("page", "1")
	req.URL.RawQuery = q.Encode()

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	mockResponse := `{"events":[{"ID":24,"CreatedAt":"2024-05-27T15:40:40.488668+08:00","UpdatedAt":"2024-06-26T03:04:38.257924+08:00","DeletedAt":null,"UserID":6,"Title":"try12345","Description":"try123","Time":"2027-07-23T23:00:00+08:00","Location":"MPSH 1","NumberOfLikes":101,"Registrations":null,"PollsOptions":null,"Images":null,"Liked":true,"Joined":true}]}`
	
	
	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
	assert.Equal(t, http.StatusOK, w.Code)
}


func TestFetchUserLikedEvents(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
	r := SetUpRouter()
	r.Use(MockAuthMiddleware)
	r.GET("/likedevents", controllers.FetchLikedEvents)
	req, _ := http.NewRequest("GET", "/likedevents", nil)

	//add query parameters
	q := req.URL.Query()
	q.Add("pageSize", "3")
	q.Add("page", "1")
	req.URL.RawQuery = q.Encode()

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	mockResponse := `{"events":[{"ID":17,"CreatedAt":"2024-05-27T15:40:15.940925+08:00","UpdatedAt":"2024-06-26T02:37:26.558238+08:00","DeletedAt":null,"UserID":6,"Title":"try12345","Description":"try123","Time":"2024-11-14T11:00:00+08:00","Location":"MPSH 1","NumberOfLikes":44,"Registrations":null,"PollsOptions":null,"Images":null,"Liked":true,"Joined":false}]}`
	
	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
	assert.Equal(t, http.StatusOK, w.Code)
}
