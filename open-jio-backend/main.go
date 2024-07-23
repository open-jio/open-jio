package main

import (
	"github.com/gin-gonic/gin"
	"github.com/rachelyeohm/open-jio/go-crud/controllers"
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"github.com/rachelyeohm/open-jio/go-crud/middleware"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func main() {

	r := gin.Default() // initializes a new Gin router instance
	r.Use(middleware.CORSMiddleware)
	//create
	corsGroup := r.Group("/")
    
    {
	corsGroup.Use(middleware.CORSMiddleware)
	corsGroup.POST("/admin", controllers.CreateUser)
	//read
	corsGroup.GET("/admin", controllers.FetchUsers)
	corsGroup.GET("/users/:id", controllers.FetchSingleUser)
	//update
	corsGroup.PUT("/users/:id", controllers.UpdateUser)
	//delete
	corsGroup.DELETE("/users/:id", controllers.DeleteUser)

	//Authentication
	corsGroup.POST("/register", controllers.Register)
	corsGroup.POST("/login", controllers.Login)

	//Events
	corsGroup.GET("/events/full", middleware.ValidateCookie, controllers.FetchEvents)
	corsGroup.GET("/events", middleware.ValidateCookie, controllers.FetchFilterEvent)
	corsGroup.GET("/events/:id", middleware.ValidateCookie, controllers.FetchSingleEvent)
	corsGroup.GET("/likedevents", middleware.ValidateCookie, controllers.FetchLikedEvents)
	corsGroup.GET("/createdevents", middleware.ValidateCookie, controllers.FetchCreatedEvents)
	corsGroup.GET("/joinedevents", middleware.ValidateCookie, controllers.FetchJoinedEvents)
	corsGroup.GET("/eventimages/:id", middleware.ValidateCookie, controllers.GetEventImages)
	corsGroup.POST("/events", middleware.ValidateCookie, controllers.CreateEvents)
	corsGroup.GET("/events/search", middleware.ValidateCookie, controllers.FetchEventsSearch)
	corsGroup.PUT("/events/:id", middleware.ValidateCookie, controllers.UpdateEvent)
	corsGroup.GET("/events/seeusers/:id", middleware.ValidateCookie, controllers.SeeUsers)
	corsGroup.DELETE("/events/:id", middleware.ValidateCookie, controllers.DeleteEvent)
	corsGroup.POST("/events/register/:id", middleware.ValidateCookie, controllers.RegisterEvent)
	corsGroup.DELETE("/events/deregister/:id", middleware.ValidateCookie, controllers.DeregisterEvent)


	//event posts
	corsGroup.POST("/events/posts",  middleware.ValidateCookie, controllers.CreatePosts)
	corsGroup.GET("/events/posts/:id",  middleware.ValidateCookie, controllers.FetchSinglePost)
	corsGroup.GET("/events/posts",  middleware.ValidateCookie, controllers.FetchPosts)
	corsGroup.PUT("/events/posts/:id",  middleware.ValidateCookie, controllers.UpdatePost)
	corsGroup.DELETE("/events/posts/:id",  middleware.ValidateCookie, controllers.DeletePost)

	//Sign out
	corsGroup.POST("/logout", middleware.ValidateCookie, controllers.Logout)

	//verify
	corsGroup.POST("/sendverifyemail", controllers.SendConfirmationEmail)
	corsGroup.POST("/verifyemail", controllers.CheckConfirmationEmail)

	//reset password
	corsGroup.POST("/sendresetpassword", controllers.SendRecoveryEmail)
	corsGroup.POST("/resetpassword", controllers.CheckRecoveryEmail)
	//likes
	corsGroup.POST("/likes/:id", middleware.ValidateCookie, controllers.LikeOrUnlike)
	}

	corsGroupNoCredentials := r.Group("/cors-group-no-credentials")
    corsGroupNoCredentials.Use(middleware.CORSMiddlewareNoCredentials)
    {
		corsGroupNoCredentials.POST("/events/multiple", middleware.ValidateCookie, controllers.FetchMultipleEvent)
	}
	r.Run() // listen and serve on 0.0.0.0:3000 (because defined in env variable)
}
