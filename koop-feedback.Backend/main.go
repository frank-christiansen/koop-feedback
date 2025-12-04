package main

import (
	"koopfeedback/cron"
	"koopfeedback/db"
	"koopfeedback/middleware"
	"koopfeedback/routes"
	"koopfeedback/routes/session"
	"koopfeedback/routes/user"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/metalblueberry/console"
)

func main() {
	console.Log("Loading Environment")
	err := godotenv.Load()
	if err != nil {

	}

	// Database connection
	console.Log("Loading Database")
	db.ConnectToDatabase()

	// CronJob
	console.Log("Loading CronJob")
	cron.ScheduleCronJob()

	// Gin Gonic
	console.Log("Loading API")
	// gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	console.Log("Loading Assets, Language and Frontend")
	r.Static("/assets", "/app/koop-feedback.Frondend/build/client/assets")
	r.Static("/language", "/app/koop-feedback.Frondend/build/client/language")
	r.StaticFile("/", "/app/koop-feedback.Frondend/build/client/index.html")
	r.NoRoute(func(c *gin.Context) {
		c.File("/app/koop-feedback.Frondend/build/client/index.html")
	})
	console.Info("Done.")

	console.Log("Loading API Routes")
	v2API := r.Group("/api/v2")
	{
		// Index
		v2API.GET("/", routes.IndexRoute)

		// Start Session
		// Session Group
		sessionV2API := v2API.Group("/session")
		sessionV2API.POST("/", session.SessionPOST)
		sessionV2API.GET("/", middleware.UserAuthMiddleware(), session.SessionGET)
		sessionV2API.POST("/feedback", middleware.UserAuthMiddleware(), session.SessionFeedbackPOST) // Add User Feedback for Session
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
		userV2API.GET("/:id", user.UserIndexRoute)        // Get User
		userV2API.DELETE("/:id", user.UserDeleteRoute)    // Remove User from Session
		userV2API.GET("/feedback", user.UserFeedbackGET)  // Get User Feedback from Session
		userV2API.DELETE("/logout", user.UserLogoutRoute) // Remove User from Session
		// End User
	}
	console.Info("Done.")
	console.Info("Works! Serving API at port 3000.")
	err = r.Run("0.0.0.0:3000")
	if err != nil {
		console.Error("Failed")
		panic(err.Error())
		return
	}

}
