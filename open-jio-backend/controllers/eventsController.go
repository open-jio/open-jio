package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/models"
)

func CreateEvents(c *gin.Context) {
	//get data from the request body
	var input struct {
		UserID uint
		Title string
		Description string
		Date string //parse later
		Time string //24 hour cycle
		Location string
	}
	err := c.ShouldBindJSON(&input);  // binds input to context, returns possible error
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
	}

	//find if user id exists
	var user models.User
	initializers.DB.First(&user, input.UserID)
	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid user",
		})
		return
	}

	//parse date
	const DateLayout = "2006/01/02"
	parsedDate , err:= time.Parse(DateLayout, input.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
	}
	const TimeLayout = "3.00pm"
	parsedTime, err2 := time.Parse(TimeLayout, input.Time)
	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err2})
	}
	combinedDateTime := time.Date(
		parsedDate.Year(),
		parsedDate.Month(),
		parsedDate.Day(),
		parsedTime.Hour(),
		parsedTime.Minute(),
		parsedTime.Second(),
		0,                 // Nanoseconds
		time.UTC,          // Location 
	)

	event := models.Event{
		UserID: user.ID,
		Title : input.Title,
		Description : input.Description,
		Time : combinedDateTime,
		Location : input.Location,
	}

	result := initializers.DB.Create(&event)

	if result.Error != nil {
		c.Status(400)
		return
	}
	
	//return it
	c.JSON(200, gin.H{
		"event" : event,
	})

}

//Read
func FetchEvents(c *gin.Context) {

	var events []models.Event

	initializers.DB.Find(&events)
	//return it
	c.JSON(200, gin.H{
		"events" : events,
	})

}

func FetchSingleEvent(c *gin.Context) {

	var event models.Event
	id := c.Param("id")
	initializers.DB.First(&event, id)
	//return it
	c.JSON(200, gin.H{
		"event" : event,
	})

}

func UpdateEvent(c *gin.Context) {
	//need to make sure user is the correct one

}