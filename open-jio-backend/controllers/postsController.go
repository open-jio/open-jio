package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/models"
)

func CreatePosts(c *gin.Context) {
	//get data from req body
	var body struct {
		Content      string
		Eventid 	int
		Registered bool
	}
	c.BindJSON(&body)

	//get user
	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)

	//check if event exists
	var event models.Event
	initializers.DB.Where("id=?", uint(body.Eventid)).First(&event)
	if event.ID == 0 || event.DeletedAt.Valid { //event has been deleted
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event does not exist"})
		return
	}

	//Check if user is correct
	if event.UserID != user.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only the creator of the event can post"})
		return
	}

	//create post
	
	post := models.Post{Content: body.Content, EventID: uint(body.Eventid), Registered : body.Registered }
	

	result := initializers.DB.Create(&post)
	
	//response
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create post",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"post": post,
	})
}

func FetchSinglePost(c * gin.Context) {
	var post models.Post
	id := c.Param("id")

	initializers.DB.Model(&models.Post{}).First(&post, id)
	//return it
	if post.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error" : "invalid post"})
	} else {
		c.JSON(200, gin.H{
			"post": post,
		})
	}
}


func FetchPosts(c *gin.Context) {

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
	registeredInput := c.DefaultQuery("registered", "false")
	registered := registeredInput == "true"

	//get user
	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)

	eventID, _ := strconv.Atoi(c.Query("event"))
	var event models.Event
	initializers.DB.Where("id=?", uint(eventID)).First(&event)
	if event.ID == 0 || event.DeletedAt.Valid { //event has been deleted
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event does not exist"})
		return
	}
	//Check if user is correct
	isUserAuthorised := event.UserID == user.ID;



	var posts []models.Post

	if registered  {

		//most recent posts first, only registered posts
		initializers.DB.Model(&models.Post{}).Where("event_id = ?", eventID).
			Where("registered = ? ", true).
			Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&posts)
	} else {
		//most recent posts first
		initializers.DB.Model(&models.Post{}).Where("event_id = ?", eventID).
			Where("registered = ? ", false).	
			Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&posts)
	}
	if posts == nil { //prevents events = null
		posts = []models.Post{}
	}
	c.JSON(200, gin.H{
		"posts": posts,
		"authorised" : isUserAuthorised,
	})
}


func UpdatePost(c * gin.Context) {
	//need to make sure user is the correct one
	var post models.Post
	id := c.Param("id")
	var input struct {
		Content string
	}
	err := c.ShouldBindJSON(&input) // binds input to context, returns possible error
	initializers.DB.First(&post, id)
	if post.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post"})
		return
	}
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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
	initializers.DB.Where("id=?", uint(post.EventID)).First(&event)
	if event.ID == 0 || event.DeletedAt.Valid { //event has been deleted
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event does not exist"})
		return
	}

	//Check if user is correct
	if event.UserID != user.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only the creator of the event can update the post"})
		return
	}


	initializers.DB.Model(&post).Updates(models.Post{
		Content : input.Content,
	})

	c.JSON(200, gin.H{
		"post": post,
	})
}


// Delete
func DeletePost(c *gin.Context) {

	//get id off the url
	id := c.Param("id")
	var post models.Post
	initializers.DB.First(&post, id)
	if post.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post"})
		return
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
	initializers.DB.Where("id=?", uint(post.EventID)).First(&event)
	if event.ID == 0 || event.DeletedAt.Valid { //event has been deleted
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event does not exist"})
		return
	}

	//Check if user is correct
	if event.UserID != user.ID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Only the creator of the event can delete the post"})
		return
	}

	initializers.DB.Delete(&models.Post{}, id)

	c.Status(200)

}
