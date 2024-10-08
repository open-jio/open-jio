package controllers

import (
	"context"
	"fmt"
	"math/rand"
	"mime/multipart"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/models"
	"gorm.io/gorm"
)

func CreateEvents(c *gin.Context) {
	fmt.Println("check 1")
	//get data from the request body
	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)
	var input struct {
		Title       string
		Description string
		Datetime    time.Time
		Location    string
		Files       []*multipart.FileHeader `form:"files"`
	}
	err := c.ShouldBind(&input) // binds input to context, returns possible error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	event := models.Event{
		UserID:        user.ID,
		Title:         input.Title,
		Description:   input.Description,
		Time:          input.Datetime,
		Location:      input.Location,
		NumberOfLikes: 0,
		Registrations: []models.Registration{},
	}

	result := initializers.DB.Create(&event)
	if result.Error != nil {
		c.Status(400)
		return
	}
	for _, formFile := range input.Files {
		imageURL, err := UploadToCloudinary(formFile, formFile.Filename)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
		image := models.Image{
			Imageurl: imageURL,
			EventID:  event.ID,
		}
		result := initializers.DB.Create(&image)
		if result.Error != nil {
			c.Status(400)
			return
		}
	}
	//create a poll option for the event.
	pollOption := models.PollsOptions{
		Title:   "Likes",
		EventID: event.ID,
	}
	//add the poll option in
	result = initializers.DB.Create(&pollOption)

	if result.Error != nil {
		c.Status(400)
		return
	}
	//return it
	c.JSON(200, gin.H{
		"event": event,
	})

}

// Read
func FetchEvents(c *gin.Context) {

	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)

	var events []models.EventWithMoreInfo

	initializers.DB.Model(&models.Event{}).Scopes(FilterEventsWithLikeInfo(user.ID)).Scan(&events)

	//return it
	c.JSON(200, gin.H{
		"events": events,
	})

}

func FetchSingleEvent(c *gin.Context) {

	var event models.EventWithMoreInfo
	id := c.Param("id")
	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)
	initializers.DB.Model(&models.Event{}).Scopes(FilterEventsWithLikeInfo(user.ID)).First(&event, id)
	//return it
	c.JSON(200, gin.H{
		"event": event,
	})

}
//takes in list of ids, gives out list of events
func FetchMultipleEvent(c *gin.Context) {

	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)
	var input struct {
		Eventids []int
	}
	err := c.ShouldBind(&input) // binds input to context, returns possible error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var orderCase strings.Builder
    orderCase.WriteString("CASE")
    for i, id := range input.Eventids {
        orderCase.WriteString(fmt.Sprintf(" WHEN events.id = %d THEN %d", id, i))
    }
    orderCase.WriteString(" END")

    var events []models.EventWithMoreInfo
    initializers.DB.Model(&models.Event{}).Scopes(FilterEventsWithLikeInfo(user.ID)).
		Where("events.id IN ?", input.Eventids).Order(orderCase.String()).Find(&events)

	
	//return it
	c.JSON(200, gin.H{
		"events": events,
	})

}


// filter and fetch
func FetchFilterEvent(c *gin.Context) {
	//url format: ?filter=date&pageSize=10&page=0
	//filter by date takes most recent first.
	//will implement the popularity later.
	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)
	searchTerm := c.DefaultQuery("search", "")
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
	var events []models.EventWithMoreInfo
	if searchTerm == "" {
		if filterCategory == "date" {

			// now := time.Now().Format("2006-01-02 00:00:00")
			//c.String(http.StatusOK, now)
			// .Where("time > ?", now)
			initializers.DB.Model(&models.Event{}).
				Scopes(FilterEventsWithLikeInfo(user.ID)).
				Order("time DESC").Offset(offset).Limit(pageSize).Scan(&events)

			if events == nil { //prevents events = null
				events = []models.EventWithMoreInfo{}
			}
			c.JSON(200, gin.H{
				"events": events,
			})
		} else if filterCategory == "likes" {
			initializers.DB.Model(&models.Event{}).
				Scopes(FilterEventsWithLikeInfo(user.ID)).
				Order("number_of_likes DESC").
				Offset(offset).Limit(pageSize).Scan(&events)

			if events == nil { //prevents events = null
				events = []models.EventWithMoreInfo{}
			}

			c.JSON(200, gin.H{
				"events": events,
			})
		} else {
			initializers.DB.Model(&models.Event{}).
				Scopes(FilterEventsWithLikeInfo(user.ID)).
				Offset(offset).Limit(pageSize).Find(&events)

			if events == nil { //prevents events = null
				events = []models.EventWithMoreInfo{}
			}

			c.JSON(200, gin.H{
				"events": events,
			})
		}
	} else {
		//need to search

		if filterCategory == "date" {
			now := time.Now().Format("2006-01-02 00:00:00")
			//c.String(http.StatusOK, now)
			initializers.DB.Model(&models.Event{}).
				Where("time > ?", now).Where("events.title ILIKE ?", "%"+searchTerm+"%").
				Scopes(FilterEventsWithLikeInfo(user.ID)).
				Order("events.time").Offset(offset).Limit(pageSize).Scan(&events)

			if events == nil { //prevents events = null
				events = []models.EventWithMoreInfo{}
			}

			c.JSON(200, gin.H{
				"events":  events,
				"keyword": searchTerm,
			})
		} else if filterCategory == "likes" {
			initializers.DB.Model(&models.Event{}).
				Scopes(FilterEventsWithLikeInfo(user.ID)).Where("events.title ILIKE ?", "%"+searchTerm+"%").
				Order("number_of_likes DESC").Offset(offset).Limit(pageSize).Find(&events)

			if events == nil { //prevents events = null
				events = []models.EventWithMoreInfo{}
			}
			c.JSON(200, gin.H{
				"events": events,
			})
		} else {
			initializers.DB.Model(&models.Event{}).
				Scopes(FilterEventsWithLikeInfo(user.ID)).Where("events.title ILIKE ?", "%"+searchTerm+"%").
				Offset(offset).Limit(pageSize).Find(&events)
			if events == nil { //prevents events = null
				events = []models.EventWithMoreInfo{}
			}
			c.JSON(200, gin.H{
				"events": events,
			})
		}
	}

}

// fetch events that user liked
func FetchLikedEvents(c *gin.Context) {

	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)
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
	var events []models.EventWithMoreInfo

	//c.String(http.StatusOK, now)
	initializers.DB.Model(&models.Event{}).
		Scopes(FilterEventsUserLiked(user.ID)).
		Order("time").Offset(offset).Limit(pageSize).Scan(&events)

	if events == nil { //prevents events = null
		events = []models.EventWithMoreInfo{}
	}
	c.JSON(200, gin.H{
		"events": events,
	})

}

// fetch events that user created
func FetchCreatedEvents(c *gin.Context) {

	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)
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
	var events []models.EventWithMoreInfo

	//c.String(http.StatusOK, now)
	initializers.DB.Model(&models.Event{}).Where("events.user_id = ? ", user.ID).
		Scopes(FilterEventsWithLikeInfo(user.ID)).
		Order("time").Offset(offset).Limit(pageSize).Scan(&events)

	if events == nil { //prevents events = null
		events = []models.EventWithMoreInfo{}
	}
	c.JSON(200, gin.H{
		"events": events,
	})

}

// fetch events that user created
func FetchJoinedEvents(c *gin.Context) {

	userinfo, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"})
		return
	}
	user := userinfo.(models.User)
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
	var events []models.EventWithMoreInfo

	//c.String(http.StatusOK, now)
	initializers.DB.Model(&models.Event{}).
		Scopes(FilterEventsUserJoined(user.ID)).
		Order("time").Offset(offset).Limit(pageSize).Scan(&events)

	if events == nil { //prevents events = null
		events = []models.EventWithMoreInfo{}
	}
	c.JSON(200, gin.H{
		"events": events,
	})

}

//fetch events with ... (for search bar)

func FetchEventsSearch(c *gin.Context) {
	searchTerm := c.DefaultQuery("search", "")
	pageSize, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	switch {
	case pageSize > 100:
		pageSize = 100
	case pageSize <= 0:
		pageSize = 10
	}
	//prioritise those that start with the word.
	//then put those that include the word
	var events []models.Event
	initializers.DB.Raw(`
        SELECT *
        FROM events
        WHERE title ILIKE ?
          AND deleted_at IS NULL
        ORDER BY (title ILIKE ?) DESC, title
        LIMIT ?
    `, "%"+searchTerm+"%", searchTerm+"%", pageSize).Scan(&events)

	c.JSON(200, gin.H{
		"keyword": searchTerm,
		"events":  events,
	})
}

func UpdateEvent(c *gin.Context) {
	//need to make sure user is the correct one
	var event models.Event
	id := c.Param("id")
	var input struct {
		UserID      uint
		Title       string
		Description string
		Datetime    time.Time
		Location    string
	}
	err := c.ShouldBindJSON(&input) // binds input to context, returns possible error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	initializers.DB.First(&event, id)
	if event.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event"})
		return
	}

	initializers.DB.Model(&event).Updates(models.Event{
		UserID:        event.UserID,
		Title:         input.Title,
		Description:   input.Description,
		Time:          input.Datetime,
		Location:      input.Location,
		NumberOfLikes: 0,
	})

	c.JSON(200, gin.H{
		"event": event,
	})

}

// Delete
func DeleteEvent(c *gin.Context) {

	//get id off the url
	id := c.Param("id")

	//find event to update
	initializers.DB.Delete(&models.Event{}, id)

	//delete all registrations and posts related to that event
	initializers.DB.Where("event_id = ? ", id).Delete(&models.Registration{})
	initializers.DB.Where("event_id = ? ", id).Delete(&models.Post{})
	//respond
	c.Status(200)

}

type SummarisedUser struct {
	Userid   int
	Username string
	Email    string
}

// View users that registered for the event
func SeeUsers(c *gin.Context) {
	id := c.Param("id")
	var event models.Event
	initializers.DB.First(&event, id)

	if event.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"users": []SummarisedUser{},
			"error": "Invalid event"})
		return
	}

	var registeredUsers []SummarisedUser

	initializers.DB.Model([]models.Registration{}).Select(`users.id AS userid, username, email`).
		Where("event_id = ? ", event.ID).
		Joins("left join users on registrations.user_id = users.id").Scan(&registeredUsers)

	if registeredUsers == nil {
		registeredUsers = []SummarisedUser{}
	}

	c.JSON(200, gin.H{
		"users": registeredUsers,
	})

}

func GetEventImages(c *gin.Context) {
	id := c.Param("id")
	var event models.Event
	initializers.DB.First(&event, id)
	if event.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"images": []string{},
			"error":  "Invalid event"})
		return
	}

	var images []models.Image
	initializers.DB.Model(&models.Image{}).Where("images.event_id = ? ", event.ID).Select("imageurl").Find(&images)
	var imageURLs []string
	imageURLs = make([]string, 0, 3)
	for _, image := range images {
		imageURLs = append(imageURLs, image.Imageurl)
	}
	c.JSON(http.StatusOK, gin.H{
		"images": imageURLs,
	})

}

/* func ParseDateTime(inputDate string, inputTime string, c *gin.Context) (time.Time, error) {
	const DateLayout = "2006/01/02"
	parsedDate, err := time.Parse(DateLayout, inputDate)
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
		0,        // Nanoseconds
		time.UTC, // Location
	), nil
} */

// SCOPES
func FilterEventsUserLiked(userID uint) func(db *gorm.DB) *gorm.DB {
	//where there exist a like data with the userID
	//and the polloptionID that corresponds to the event
	return func(db *gorm.DB) *gorm.DB {
		return db.Select(`
	  events.*,
	  COALESCE(ARRAY_AGG(images.imageurl), '{}') AS imageurls,
	  CASE WHEN likes.user_id = ? THEN TRUE ELSE FALSE END AS liked,
	  CASE WHEN registrations.user_id = ? THEN TRUE ELSE FALSE END AS joined
  `, userID, userID).
			Where("events.deleted_at IS NULL").
			Joins("LEFT JOIN images ON events.id = images.event_id AND images.deleted_at IS NULL").
			Joins("LEFT JOIN polls_options ON polls_options.event_id = events.id AND polls_options.deleted_at IS NULL").
			Joins("LEFT JOIN likes ON polls_options.id = likes.poll_options_id AND likes.deleted_at IS NULL AND likes.user_id = ?", userID).
			Joins("LEFT JOIN registrations ON events.id = registrations.event_id AND registrations.deleted_at IS NULL AND registrations.user_id = ?", userID).
			Where("likes.user_id = ? AND likes.id IS NOT NULL", userID).
			Group("events.id, likes.id, registrations.id")
	}
}

func FilterEventsUserJoined(userID uint) func(db *gorm.DB) *gorm.DB {
	//where there exist a like data with the userID
	//and the polloptionID that corresponds to the event
	return func(db *gorm.DB) *gorm.DB {
		return db.Select(`
	  events.*,
	  COALESCE(ARRAY_AGG(images.imageurl), '{}') AS imageurls,
	  CASE WHEN likes.user_id = ? THEN TRUE ELSE FALSE END AS liked,
	  CASE WHEN registrations.user_id = ? THEN TRUE ELSE FALSE END AS joined,
	  CASE WHEN events.user_id = ? THEN TRUE ELSE FALSE END AS iscreator
  `, userID, userID, userID).
			Where("events.deleted_at IS NULL").
			Joins("LEFT JOIN images ON events.id = images.event_id AND images.deleted_at IS NULL").
			Joins("LEFT JOIN registrations ON events.id = registrations.event_id AND registrations.deleted_at IS NULL AND registrations.user_id = ?", userID).
			Where("registrations.user_id = ?", userID).
			Joins("LEFT JOIN polls_options ON polls_options.event_id = events.id AND polls_options.deleted_at IS NULL").
			Joins("LEFT JOIN likes ON polls_options.id = likes.poll_options_id AND likes.deleted_at IS NULL AND likes.user_id = ?", userID).
			
			Group("events.id, registrations.id, likes.user_id")
	}
}

func FilterEventsWithLikeInfo(userID uint) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Select(`
	  events.*,
	  COALESCE(ARRAY_AGG(images.imageurl), '{}') AS imageurls,
	  CASE WHEN likes.user_id = ? THEN TRUE ELSE FALSE END AS liked,
	  CASE WHEN registrations.user_id  = ? THEN TRUE ELSE FALSE END AS joined,
	  CASE WHEN events.user_id = ? THEN TRUE ELSE FALSE END AS iscreator
  `, userID, userID, userID).
			Where("events.deleted_at IS NULL").
			Joins("LEFT JOIN images ON events.id = images.event_id AND images.deleted_at IS NULL").
			Joins("LEFT JOIN registrations ON events.id = registrations.event_id AND registrations.deleted_at IS NULL AND registrations.user_id = ?", userID).
			Joins("LEFT JOIN polls_options ON polls_options.event_id = events.id AND polls_options.deleted_at IS NULL").
			Joins("LEFT JOIN likes ON polls_options.id = likes.poll_options_id AND likes.deleted_at IS NULL AND likes.user_id = ?", userID).
			Group("events.id, likes.id, registrations.id")
	}
}
func UploadToCloudinary(file *multipart.FileHeader, filePath string) (string, error) {
	cldSecret := os.Getenv("CLOUDINARY_API_SECRET")
	cldName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	cldKey := os.Getenv("CLOUDINARY_API_KEY")
	cld, err := cloudinary.NewFromParams(cldName, cldKey, cldSecret)
	if err != nil {
		return "", err
	}
	ctx := context.Background()
	uploadParams := uploader.UploadParams{
		PublicID: filePath + GenerateRandomid(),
	}
	result, err := cld.Upload.Upload(ctx, file, uploadParams)
	if err != nil {
		return "", err
	}
	imageUrl := result.SecureURL
	return imageUrl, nil

}
func GenerateRandomid() string {
	var Bytes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	Randomrune := make([]rune, 60)
	for i := range Randomrune {
		Randomrune[i] = Bytes[rand.Intn(len(Bytes))]
	}
	randomid := string(Randomrune)
	return randomid
}
