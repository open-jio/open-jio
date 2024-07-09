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

	"github.com/joho/godotenv"
	"github.com/rachelyeohm/open-jio/go-crud/controllers"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/models"
	"github.com/stretchr/testify/assert"
)


func TestLikeEvent(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()

	// Add the mock authentication middleware
    r.Use(MockAuthMiddleware)
	
    r.POST("/likes/:id", controllers.LikeOrUnlike)

	likeinput := controllers.Like{
        LikeStatus: true,
    }
    jsonValue, _ := json.Marshal(likeinput)
    req, _ := http.NewRequest("POST", "/likes/3", bytes.NewBuffer(jsonValue))

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
	mockResponse := true
	responseData, _ := io.ReadAll(w.Body)

	type LikeReponse struct {
		Liked bool
		NumberOfLikes int
	}
	var likeresponse LikeReponse
    err = json.Unmarshal(responseData, &likeresponse)
    if err != nil {
        t.Fatalf("Failed to unmarshal response: %v", err)
    }


	assert.Equal(t, mockResponse, likeresponse.Liked)
    assert.Equal(t, http.StatusOK, w.Code)

	//check theres an entry in the likes database
	//check if poll event exists 
	var pollOptions models.PollsOptions 
	initializers.DB.Where("event_id=?", uint(3)).First(&pollOptions) 

	//check if like exist 
	var likes models.Likes 
	initializers.DB.Where("user_id=?", os.Getenv("EXAMPLE_ID")). 
	  Where("poll_options_id=?", uint(pollOptions.ID)).Where("likes.deleted_at IS NULL").First(&likes) 

	assert.NotEqual(t, uint(0), likes.ID)
}

func TestUnLikeEvent(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal(err)
	}
	initializers.ConnectToDB()
    r := SetUpRouter()

	// Add the mock authentication middleware
    r.Use(MockAuthMiddleware)
	
    r.POST("/likes/:id", controllers.LikeOrUnlike)

	likeinput := controllers.Like{
        LikeStatus: false,
    }
    jsonValue, _ := json.Marshal(likeinput)
    req, _ := http.NewRequest("POST", "/likes/3", bytes.NewBuffer(jsonValue))

    w := httptest.NewRecorder()
    r.ServeHTTP(w, req)
	mockResponse := false
	responseData, _ := io.ReadAll(w.Body)

	type LikeReponse struct {
		Liked bool
		NumberOfLikes int
	}
	var likeresponse LikeReponse
    err = json.Unmarshal(responseData, &likeresponse)
    if err != nil {
        t.Fatalf("Failed to unmarshal response: %v", err)
	}

	assert.Equal(t, mockResponse, likeresponse.Liked)
    assert.Equal(t, http.StatusOK, w.Code)

	//check theres no present entry in the likes database
	var pollOptions models.PollsOptions 
	initializers.DB.Where("event_id=?", uint(3)).First(&pollOptions) 

	//check if like exist 
	var likes models.Likes 
	initializers.DB.Where("user_id=?", os.Getenv("EXAMPLE_ID")). 
	  Where("poll_options_id=?", uint(pollOptions.ID)).Where("likes.deleted_at IS NULL").First(&likes) 
	fmt.Println(likes.ID)
	assert.Equal(t, uint(0), likes.ID)
}

