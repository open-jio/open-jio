package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rachelyeohm/open-jio/go-crud/controllers"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/models"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func MockAuthMiddleware(c *gin.Context) {
	var user models.User
	initializers.DB.Where("id = ?", os.Getenv("EXAMPLE_ID")).First(&user)
    c.Set("user", user)
    c.Next()
}

func TestCreateEvent(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()

	// Add the mock authentication middleware
    r.Use(MockAuthMiddleware)
	
    r.POST("/events", controllers.CreateEvents)
	type input struct {
		Title       string
		Description string
		Datetime    time.Time
		Location    string
	}

	newTime := time.Now()

	newModel := input{
		Title : "TestTitle",
		Description : "TestDescription",
		Datetime : newTime,
		Location : "MPHS1",
	}
    jsonValue, _ := json.Marshal(newModel)
    req, _ := http.NewRequest("POST", "/events", bytes.NewBuffer(jsonValue))

	
    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
	
	responseData, _ := io.ReadAll(w.Body)

	type createdEvent struct {
		gorm.Model
		ID int
		UserID        uint
		Title         string
		Description   string
		Time          time.Time
		Location      string
		NumberOfLikes int
		Registrations []models.Registration 
		PollsOptions  []models.PollsOptions
		Images        []models.Image

	}
	var createdEventt createdEvent
	fmt.Println("STRING IS HERE" + string(responseData))
    err = json.Unmarshal(responseData, &createdEventt)
	
    if err != nil {
        t.Fatalf("Failed to unmarshal response: %v", err)
    }

	var testEvent models.Event
	initializers.DB.Where("title = ?", "TestTitle").Where("description = ?", "TestDescription").
	Where("time = ?", newTime).Where("location = ?", "MPSH1").First(&testEvent)


	assert.Equal(t, testEvent.ID, createdEventt.ID)
    assert.Equal(t, http.StatusOK, w.Code)
}


func TestFetchIndividualEvent(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()

	// Add the mock authentication middleware
    r.Use(MockAuthMiddleware)
	
    r.GET("/events/3", controllers.FetchSingleEvent)
    req, _ := http.NewRequest("GET", "/events/3", nil)

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
	mockResponse := `{"event":{"ID":3,"CreatedAt":"2024-05-15T23:29:40.659526+08:00","UpdatedAt":"2024-06-26T02:57:33.196619+08:00","DeletedAt":null,"UserID":6,"Title":"Badminton but BETTERRRRRRR","Description":" :) :) :)))    ","Time":"2024-09-25T23:00:00+08:00","Location":"MPSH 1","NumberOfLikes":21,"Registrations":null,"PollsOptions":null,"Images":null,"Liked":false,"Joined":false}}`

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
	r.Use(MockAuthMiddleware)
    r.GET("/events", controllers.FetchFilterEvent)
    req, _ := http.NewRequest("GET", "/events", nil)

	//add query parameters
	q := req.URL.Query()
        q.Add("pageSize", "3")
        q.Add("page", "1")
        req.URL.RawQuery = q.Encode()

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
	mockResponse := `{"events":[{"ID":94,"CreatedAt":"2024-07-08T03:05:41.344049+08:00","UpdatedAt":"2024-07-08T03:05:41.344049+08:00","DeletedAt":null,"UserID":6,"Title":"Computing Rag Showcase","Description":"test description","Time":"2024-07-09T17:06:06+08:00","Location":"Utown Green","NumberOfLikes":0,"Registrations":null,"PollsOptions":null,"Images":null,"Liked":false,"Joined":false},{"ID":40,"CreatedAt":"2024-06-27T22:48:50.377049+08:00","UpdatedAt":"2024-06-27T22:48:50.377049+08:00","DeletedAt":null,"UserID":6,"Title":"leroy's test","Description":"try123","Time":"2024-07-27T22:03:00+08:00","Location":"MPSH 1","NumberOfLikes":1,"Registrations":null,"PollsOptions":null,"Images":null,"Liked":false,"Joined":false},{"ID":39,"CreatedAt":"2024-06-27T22:47:47.132392+08:00","UpdatedAt":"2024-06-27T22:47:47.132392+08:00","DeletedAt":null,"UserID":6,"Title":"1 search test (keyword in the middle)","Description":"try123","Time":"2024-07-27T22:03:00+08:00","Location":"MPSH 1","NumberOfLikes":0,"Registrations":null,"PollsOptions":null,"Images":null,"Liked":false,"Joined":false}]}`
	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
    assert.Equal(t, http.StatusOK, w.Code)
}

func TestFetchSearchDateEvent(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
	r.Use(MockAuthMiddleware)
    r.GET("/events", controllers.FetchFilterEvent)
    req, _ := http.NewRequest("GET", "/events", nil)

	//add query parameters
	q := req.URL.Query()
        q.Add("pageSize", "50")
        q.Add("page", "1")
		q.Add("search", "search")
        req.URL.RawQuery = q.Encode()

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
	mockResponse := `{"events":[{"ID":39,"CreatedAt":"2024-06-27T22:47:47.132392+08:00","UpdatedAt":"2024-06-27T22:47:47.132392+08:00","DeletedAt":null,"UserID":6,"Title":"1 search test (keyword in the middle)","Description":"try123","Time":"2024-07-27T22:03:00+08:00","Location":"MPSH 1","NumberOfLikes":70,"Registrations":null,"PollsOptions":null,"Images":null,"Liked":false,"Joined":false},{"ID":31,"CreatedAt":"2024-06-03T02:56:42.772579+08:00","UpdatedAt":"2024-06-08T00:15:43.896252+08:00","DeletedAt":null,"UserID":52,"Title":"sEaRcH test (any case)","Description":"try123","Time":"2025-07-02T23:00:00+08:00","Location":"MPSH 1","NumberOfLikes":80,"Registrations":null,"PollsOptions":null,"Images":null,"Liked":false,"Joined":false}],"keyword":"search"}`

	
	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
    assert.Equal(t, http.StatusOK, w.Code)
}


func TestFetchSearchLikesEvent(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
	r.Use(MockAuthMiddleware)
    r.GET("/events", controllers.FetchFilterEvent)
    req, _ := http.NewRequest("GET", "/events", nil)

	//add query parameters
	q := req.URL.Query()
		q.Add("filter", "likes")
        q.Add("pageSize", "50")
        q.Add("page", "1")
		q.Add("search", "search")
        req.URL.RawQuery = q.Encode()

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
	mockResponse := `{"events":[{"ID":31,"CreatedAt":"2024-06-03T02:56:42.772579+08:00","UpdatedAt":"2024-06-08T00:15:43.896252+08:00","DeletedAt":null,"UserID":52,"Title":"sEaRcH test (any case)","Description":"try123","Time":"2025-07-02T23:00:00+08:00","Location":"MPSH 1","NumberOfLikes":80,"Registrations":null,"PollsOptions":null,"Images":null,"Liked":false,"Joined":false},{"ID":39,"CreatedAt":"2024-06-27T22:47:47.132392+08:00","UpdatedAt":"2024-06-27T22:47:47.132392+08:00","DeletedAt":null,"UserID":6,"Title":"1 search test (keyword in the middle)","Description":"try123","Time":"2024-07-27T22:03:00+08:00","Location":"MPSH 1","NumberOfLikes":70,"Registrations":null,"PollsOptions":null,"Images":null,"Liked":false,"Joined":false}]}`


	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
    assert.Equal(t, http.StatusOK, w.Code)
}


func TestFetchSearchDropdownEvent(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()
	r.Use(MockAuthMiddleware)
    r.GET("/events", controllers.FetchEventsSearch)
    req, _ := http.NewRequest("GET", "/events", nil)

	//add query parameters
	q := req.URL.Query()
		q.Add("search", "search")
        req.URL.RawQuery = q.Encode()

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
	mockResponse := `{"events":[{"ID":31,"CreatedAt":"2024-06-03T02:56:42.772579+08:00","UpdatedAt":"2024-06-08T00:15:43.896252+08:00","DeletedAt":null,"UserID":52,"Title":"sEaRcH test (any case)","Description":"try123","Time":"2025-07-02T23:00:00+08:00","Location":"MPSH 1","NumberOfLikes":80,"Registrations":null,"PollsOptions":null,"Images":null},{"ID":39,"CreatedAt":"2024-06-27T22:47:47.132392+08:00","UpdatedAt":"2024-06-27T22:47:47.132392+08:00","DeletedAt":null,"UserID":6,"Title":"1 search test (keyword in the middle)","Description":"try123","Time":"2024-07-27T22:03:00+08:00","Location":"MPSH 1","NumberOfLikes":70,"Registrations":null,"PollsOptions":null,"Images":null}],"keyword":"search"}`

	responseData, _ := io.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
    assert.Equal(t, http.StatusOK, w.Code)
}


