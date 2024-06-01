package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/models"
)

func CreateEvents(c *gin.Context) {
	//get data from the request body
	userinfo, exists := c.Get("user")
	if exists == false {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)
	var input struct {
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

	//parse date
	combinedDateTime, err := ParseDateTime(input.Date, input.Time, c)
	if err != nil {
		c.Status(400)
		return
	}
	event := models.Event{
		UserID: user.ID,
		Title : input.Title,
		Description : input.Description,
		Time : combinedDateTime,
		Location : input.Location,
		NumberOfLikes: 0,
		Registrations: []models.Registration{},
	}

	result := initializers.DB.Create(&event)
	if result.Error != nil {
		c.Status(400)
		return
	}
	//create a poll option for the event.
	pollOption := models.PollsOptions {
		Title : "Likes",
		EventID : event.ID,
	}
	//add the poll option in
	result = initializers.DB.Create(&pollOption)

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

//filter and fetch
func FetchFilterEvent(c *gin.Context) {
	//url format: ?filter=date&pageSize=10&page=0
	//filter by date takes the events after time.Now(), most recent first.
	//will implement the popularity later.
	filterCategory := c.DefaultQuery("filter", "date")
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	switch {
    case pageSize > 100:
      pageSize = 100
    case pageSize <= 0:
      pageSize = 10
    }
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * pageSize
	if filterCategory == "date" {
		var events []models.Event
		now := time.Now().Format("2006-01-02 00:00:00")
		//c.String(http.StatusOK, now)
		initializers.DB.Where("time > ?", now).Order("time").Offset(offset).Limit(pageSize).Find(&events)
		c.JSON(200, gin.H{
			"events" : events,
		})
	} else if filterCategory == "likes" {
		var events []models.Event
		initializers.DB.Order("number_of_likes DESC").Offset(offset).Limit(pageSize).Find(&events)
		c.JSON(200, gin.H{
			"events" : events,
		})
	} else {
		var events []models.Event
		initializers.DB.Offset(offset).Limit(pageSize).Find(&events)
		c.JSON(200, gin.H{
			"events" : events,
		})
	}



}

func UpdateEvent(c *gin.Context) {
	//need to make sure user is the correct one
	var event models.Event
	id := c.Param("id")
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
	initializers.DB.First(&event, id)
	if event.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event"})
		return
	}

	combinedDateTime, err := ParseDateTime(input.Date, input.Time, c)
	if err != nil {
		c.Status(400)
		return
	}

	initializers.DB.Model(&event).Updates(models.Event{
		UserID: event.UserID,
		Title : input.Title,
		Description : input.Description,
		Time : combinedDateTime,
		Location : input.Location,
		NumberOfLikes:  0,
	})

	c.JSON(200, gin.H{
		"event" : event,
	})

}

//Delete
func DeleteEvent(c *gin.Context) {

	//get id off the url
	id := c.Param("id")

	//find event to update
	initializers.DB.Delete(&models.Event{}, id)

	//delete all registrations related to that event
	initializers.DB.Where("event_id = ? ", id).Delete(&models.Registration{})

	//respond
	c.Status(200)

}

func ParseDateTime(inputDate string, inputTime string, c *gin.Context) (time.Time, error) {
	const DateLayout = "2006/01/02"
	parsedDate , err:= time.Parse(DateLayout, inputDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return time.Now(), err
	}
	const TimeLayout = "3.00pm"
	parsedTime, err2 := time.Parse(TimeLayout, inputTime)
	if err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err2})
		return time.Now(), err
	}
	return time.Date(
		parsedDate.Year(),
		parsedDate.Month(),
		parsedDate.Day(),
		parsedTime.Hour(),
		parsedTime.Minute(),
		parsedTime.Second(),
		0,                 // Nanoseconds
		time.UTC,          // Location 
	), nil
}