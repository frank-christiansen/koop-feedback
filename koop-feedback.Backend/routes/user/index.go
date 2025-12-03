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

type GETUser struct {
	ID int `uri:"id" bindings:"required"`
}

func UserIndexRoute(ctx *gin.Context) {
	db := db2.Database
	bCtx := context.Background()
	body := util.APIBindUri[GETUser](ctx)

	println(body.ID)

	user, err := gorm.G[models.User](db).Preload("Session", nil).Where("id = ?", body.ID).First(bCtx)

	if err != nil {
		util.APIErrorResponse[GETUser](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[models.User]{
		Success: true,
		Message: "User",
		Data:    user,
	})
	return
}

func UserDeleteRoute(ctx *gin.Context) {
	db := db2.Database
	bCtx := context.Background()
	body := util.APIBindUri[GETUser](ctx)

	auth, _ := ctx.Get("authId")
	isSelf := util.DBCheckSelf(auth.(string), body.ID)
	isHost := util.DBCheckHostWithAuth(auth.(string))

	if isSelf {
		util.APISelfError(ctx)
		return
	}
	if !isHost {
		util.APIHostError(ctx)
		return
	}

	user, err := gorm.G[models.User](db).Where("id = ?", body.ID).First(bCtx)
	if err != nil {
		util.APIErrorResponse[GETUser](ctx, err.Error(), http.StatusInternalServerError)
		return
	}
	db.Unscoped().Delete(&user)
	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "DELETED",
	})
	return
}
