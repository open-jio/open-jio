package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/models"
)

func RegisterEvent(c *gin.Context) { //registers user for event
	//get eventID
	eventID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot parse event ID"})
	}

	//get user
	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)

	//check if event exists
	var event models.Event
	initializers.DB.Where("id=?", uint(eventID)).First(&event)
	if event.ID == 0 || event.DeletedAt.Valid { //event has been deleted
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event does not exist"})
		return
	}

	//register
	registration := models.Registration{
		UserID:  user.ID,
		EventID: uint(eventID),
	}

	result := initializers.DB.FirstOrCreate(&registration, models.Registration{UserID: user.ID,
		EventID: uint(eventID)})

	if result.Error != nil {
		c.Status(400)
		return
	}

	//return it
	c.JSON(200, gin.H{
		"registration": registration,
	})

}

func DeregisterEvent(c *gin.Context) { //deregisters user from event
	//get event
	eventID := c.Param("id")

	//get user
	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)

	var registration models.Registration
	initializers.DB.Where("user_id = ?", user.ID).Where("event_id = ? ", eventID).Delete(&registration)

	c.JSON(200, gin.H{})
}
