package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/models"
	"gorm.io/gorm"
) 
 
type Like struct { 
 LikeStatus bool 
} 
 
func LikeOrUnlike(c *gin.Context) {  
 //Summary : set the user's like status based on the info given 
  
 //get user 
 userinfo, exists := c.Get("user") 
 if !exists { 
  c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User"}) 
  return 
 } 
 user := userinfo.(models.User) 
 
 //get event  
 eventID, err := strconv.Atoi(c.Param("id")) 
 if err != nil { 
  c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot parse event ID"}) 
 } 
 
 //get like 
 var input Like 
 
 err = c.ShouldBindJSON(&input) // binds input to context, returns possible error 
 if err != nil { 
  c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) 
  return 
 } 
 
 //check if event exists 
 var event models.Event 
 initializers.DB.Where("id=?", uint(eventID)).First(&event) 
 if event.ID == 0 || event.DeletedAt.Valid { //event has been deleted 
  c.JSON(http.StatusBadRequest, gin.H{"error": "Event does not exist"}) 
  return 
 } 
 //check if poll event exists 
 var pollOptions models.PollsOptions 
 initializers.DB.Where("event_id=?", uint(eventID)).First(&pollOptions) 
 if pollOptions.ID == 0 {  
  pollOptions = models.PollsOptions { 
   Title : "Likes", 
   EventID : event.ID, 
  } 
  //add the poll option in 
  initializers.DB.Create(&pollOptions) 
 } 
 
 //check if like exist 
 var likes models.Likes 
 initializers.DB.Where("user_id=?", uint(user.ID)). 
   Where("poll_options_id=?", uint(pollOptions.ID)).First(&likes) 
 if input.LikeStatus { //if user indicated liked 
  likenumber := 0 
  if likes.ID == 0 { //if not liked yet, like the thing 
   initializers.DB.Create(&models.Likes { 
    PollOptionsID: pollOptions.ID, 
    UserID: user.ID, 
   }) 
   initializers.DB.Model(&event).UpdateColumn("number_of_likes", gorm.Expr("number_of_likes + ?", 1)) 
   likenumber = 1 
  } 
  c.JSON(http.StatusOK, gin.H{ 
     
   "liked": true, 
   "numberOfLikes" : event.NumberOfLikes+likenumber, 
  }) 
  return 
 
   
 } else { // user indicated like = false 
  likesnumber := 0 
  if likes.ID != 0 { //if liked, unlike the thing 
   results := initializers.DB.Where("user_id=?", uint(user.ID)). 
   Where("poll_options_id=?", uint(pollOptions.ID)).Delete(&models.Likes{}) 
   //update the event 
   initializers.DB.Model(&event).UpdateColumn("number_of_likes", gorm.Expr("number_of_likes - ?", results.RowsAffected)) 
   likesnumber = int(results.RowsAffected) 
  } 
 
  c.JSON(http.StatusOK, gin.H{ 
   "liked": false, 
   "numberOfLikes": event.NumberOfLikes-likesnumber, 
  }) 
  return 
 } 
}