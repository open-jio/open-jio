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
	r.POST("/login", controllers.Login)

	//Events
	r.GET("/events/full", middleware.ValidateCookie, controllers.FetchEvents)
	r.GET("/events", middleware.ValidateCookie, controllers.FetchFilterEvent)
	r.GET("/events/:id", middleware.ValidateCookie, controllers.FetchSingleEvent)
	r.POST("/events", middleware.ValidateCookie, controllers.CreateEvents)
	r.PUT("/events/:id", middleware.ValidateCookie, controllers.UpdateEvent)
	r.DELETE("/events/:id", middleware.ValidateCookie, controllers.DeleteEvent)
	r.POST("/events/register/:id", middleware.ValidateCookie, controllers.RegisterEvent)
	r.DELETE("/events/deregister/:id", middleware.ValidateCookie, controllers.DeregisterEvent)

	//Sign out
	r.DELETE("/signout", middleware.DeleteCookie)

	//verify
	r.POST("/sendverifyemail", middleware.ValidateCookie, controllers.SendConfirmationEmail)
	r.GET("/verifyemail", controllers.CheckConfirmationEmail)



	r.Run() // listen and serve on 0.0.0.0:3000 (because defined in env variable)
}
