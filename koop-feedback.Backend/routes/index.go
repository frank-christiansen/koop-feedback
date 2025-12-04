package routes

import (
	"github.com/gin-gonic/gin"
)

func IndexRoute(ctx *gin.Context) {

	ctx.JSON(200, gin.H{
		"message": "Koop-Feedback APIAuth Endpoint...",
	})
	return
}
