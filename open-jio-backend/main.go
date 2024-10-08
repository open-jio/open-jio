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
	//corsGroup := r.Group("/")
    
    {
	//corsGroup.OPTIONS("/*credentials", middleware.CORSMiddleware)
	//corsGroup.Use(middleware.CORSMiddleware)
	r.POST("/admin", controllers.CreateUser)
	//read
	r.GET("/admin", controllers.FetchUsers)
	r.GET("/users/:id", controllers.FetchSingleUser)
	//update
	r.PUT("/users/:id", controllers.UpdateUser)
	//delete
	r.DELETE("/users/:id", controllers.DeleteUser)

	//Authentication
	r.POST("/register", controllers.Register)
	r.POST("/login",controllers.Login)

	//Events
	r.GET("/events/full", middleware.ValidateCookie, controllers.FetchEvents)
	r.GET("/events", middleware.ValidateCookie, controllers.FetchFilterEvent)
	r.GET("/events/:id", middleware.ValidateCookie, controllers.FetchSingleEvent)
	r.GET("/likedevents", middleware.ValidateCookie, controllers.FetchLikedEvents)
	r.GET("/createdevents", middleware.ValidateCookie, controllers.FetchCreatedEvents)
	r.GET("/joinedevents", middleware.ValidateCookie, controllers.FetchJoinedEvents)
	r.GET("/eventimages/:id", middleware.ValidateCookie, controllers.GetEventImages)
	r.POST("/events", middleware.ValidateCookie, controllers.CreateEvents)
	r.GET("/events/search", middleware.ValidateCookie, controllers.FetchEventsSearch)
	r.PUT("/events/:id", middleware.ValidateCookie, controllers.UpdateEvent)
	r.GET("/events/seeusers/:id", middleware.ValidateCookie, controllers.SeeUsers)
	r.DELETE("/events/:id", middleware.ValidateCookie, controllers.DeleteEvent)
	r.POST("/events/register/:id", middleware.ValidateCookie, controllers.RegisterEvent)
	r.DELETE("/events/deregister/:id", middleware.ValidateCookie, controllers.DeregisterEvent)


	//event posts
	r.POST("/events/posts",  middleware.ValidateCookie, controllers.CreatePosts)
	r.GET("/events/posts/:id",  middleware.ValidateCookie, controllers.FetchSinglePost)
	r.GET("/events/posts",  middleware.ValidateCookie, controllers.FetchPosts)
	r.PUT("/events/posts/:id",  middleware.ValidateCookie, controllers.UpdatePost)
	r.DELETE("/events/posts/:id",  middleware.ValidateCookie, controllers.DeletePost)

	//Sign out
	r.POST("/logout", middleware.ValidateCookie, controllers.Logout)

	//verify
	r.POST("/sendverifyemail", controllers.SendConfirmationEmail)
	r.POST("/verifyemail", controllers.CheckConfirmationEmail)

	//reset password
	r.POST("/sendresetpassword", controllers.SendRecoveryEmail)
	r.POST("/resetpassword", controllers.CheckRecoveryEmail)
	//likes
	r.POST("/likes/:id", middleware.ValidateCookie, controllers.LikeOrUnlike)

	r.POST("/events/multiple", middleware.ValidateCookie, controllers.FetchMultipleEvent)
	}

	// corsGroupNoCredentials := r.Group("/credentialsno")
    // corsGroupNoCredentials.Use(middleware.CORSMiddleware)
    // {
	// 	corsGroupNoCredentials.OPTIONS("/*credentialsno", middleware.CORSMiddleware)
	// 	corsGroupNoCredentials.POST("/events/multiple", middleware.ValidateCookie, controllers.FetchMultipleEvent)
	// }
	r.Run() // listen and serve on 0.0.0.0:3000 (because defined in env variable)
}
