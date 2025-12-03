package user

import (
	"context"
	db2 "koopfeedback/db"
	"koopfeedback/db/models"
	"koopfeedback/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UserLogoutRoute(ctx *gin.Context) {
	db := db2.Database
	bCtx := context.Background()

	auth, _ := ctx.Get("authId")

	user, err := gorm.G[models.User](db).Preload("Feedback", nil).Where("api_auth_id = ?", auth).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	db.Unscoped().Delete(&user.Feedback)
	db.Unscoped().Delete(&user)

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "LOGOUT",
	})
	return
}
