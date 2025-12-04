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
	body, hasBody := util.APIBindUri[GETUser](ctx)

	if !hasBody {
		util.APIErrorResponse[GETUser](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

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
	body, hasBody := util.APIBindUri[GETUser](ctx)

	if !hasBody {
		util.APIErrorResponse[GETUser](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	authId, _ := ctx.Get("authId")
	userId, _ := ctx.Get("userId")
	isSelf := util.DBCheckSelf(authId.(string), body.ID)
	isHost := util.DBCheckHostWithId(userId.(int))

	if isSelf {
		util.APISelfError(ctx)
		return
	}
	if !isHost {
		util.APIHostError(ctx)
		return
	}

	user, err := gorm.G[models.User](db).Preload("APIAuth", nil).Where("id = ?", body.ID).First(bCtx)
	if err != nil {
		util.APIErrorResponse[GETUser](ctx, err.Error(), http.StatusInternalServerError)
		return
	}
	db.Unscoped().Delete(&user.APIAuth)
	db.Unscoped().Delete(&user)
	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "DELETED",
	})
	return
}
