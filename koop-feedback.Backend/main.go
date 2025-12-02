package main

import (
	"koopfeedback/db"
	"koopfeedback/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	// Database connection
	db.ConnectToDatabase()
	// routes

	r := gin.Default()

	r.Static("/assets", "../koop-feedback.Frondend/build/client/assets")
	r.Static("/language", "../koop-feedback.Frondend/build/client/language")
	r.StaticFile("/", "../koop-feedback.Frondend/build/client/index.html")
	r.NoRoute(func(c *gin.Context) {
		c.File("../koop-feedback.Frondend/build/client/index.html")
	})

	v1API := r.Group("/api/v1")
	{
		v1API.GET("/", routes.IndexRoute)
	}

	r.GET("sfsd", func(context *gin.Context) {
		context.JSON(200, gin.H{})
	})

	err := r.Run(":3000")
	if err != nil {
		return
	}
}
