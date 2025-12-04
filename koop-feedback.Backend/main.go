package main

import (
	"koopfeedback/db"
	"koopfeedback/middleware"
	"koopfeedback/routes"
	"koopfeedback/routes/session"
	"koopfeedback/routes/user"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// TODO: Exclude AuthId in extra table
// TODO: Add API to Frontend...
// TODO: Fixes, Improvements ...

func main() {
	err := godotenv.Load()
	if err != nil {
		return
	}

	// Database connection
	db.ConnectToDatabase()

	r := gin.Default()

	r.Static("/assets", "../koop-feedback.Frondend/build/client/assets")
	r.Static("/language", "../koop-feedback.Frondend/build/client/language")
	r.StaticFile("/", "../koop-feedback.Frondend/build/client/index.html")
	r.NoRoute(func(c *gin.Context) {
		c.File("../koop-feedback.Frondend/build/client/index.html")
	})

	v2API := r.Group("/api/v2")
	{
		// Index
		v2API.GET("/", routes.IndexRoute)

		// Start Session
		// Session Group
		sessionV2API := v2API.Group("/session")
		sessionV2API.POST("/", session.SessionPOST)
		sessionV2API.GET("/", middleware.UserAuthMiddleware(), session.SessionGET)
		sessionV2API.POST("/join", session.JoinSession)
		sessionV2API.POST("/start", middleware.UserAuthMiddleware(), session.StartSession)
		sessionV2API.POST("/end", middleware.UserAuthMiddleware(), session.EndSession)
		// End Session

		// Start User
		// User Group
		userV2API := v2API.Group("/user")

		// User Middleware
		userV2API.Use(middleware.UserAuthMiddleware())

		// User Routes
		userV2API.GET("/:id", user.UserIndexRoute)             // Get User
		userV2API.DELETE("/:id", user.UserDeleteRoute)         // Remove User from Session
		userV2API.POST("/:id/feedback", user.UserFeedbackPOST) // Add User Feedback for Session
		userV2API.GET("/:id/feedback", user.UserFeedbackGET)   // Get User Feedback from Session
		userV2API.DELETE("/logout", user.UserLogoutRoute)      // Remove User from Session
		// End User
	}

	err = r.Run(":3000")
	if err != nil {
		return
	}
}
