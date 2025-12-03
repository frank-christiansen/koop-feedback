package routes

import (
	"context"
	"koopfeedback/db"

	"github.com/gin-gonic/gin"
)

func IndexRoute(ctx *gin.Context) {

	_, err := db.Database.Exec(context.Background(), "CREATE TABLE IF NOT EXISTS secretdata (column1 int, column2 int, column3 int)")

	if err != nil {
		println(err.Error())
		ctx.JSON(400, gin.H{"success": "false"})
		return
	}

	ctx.JSON(200, gin.H{
		"success": "true",
	})
	return
}
