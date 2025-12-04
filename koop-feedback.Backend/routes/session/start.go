package session

import (
	"context"
	db2 "koopfeedback/db"
	"koopfeedback/db/models"
	"koopfeedback/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func StartSession(ctx *gin.Context) {

	bCtx := context.Background()
	db := db2.Database
	userId, _ := ctx.Get("userId")

	isHost := util.DBCheckHostWithId(userId.(int))
	if !isHost {
		util.APIHostError(ctx)
		return
	}

	user, err := gorm.G[models.User](db).Preload("Session", nil).Where("id = ?", userId).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}
	session, err := gorm.G[models.Session](db).Preload("Users", nil).Where("id = ?", user.SessionID).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(session.Users) < 2 {
		util.APIErrorResponse[any](ctx, "NotEnoughUsers", http.StatusConflict)
		return
	}
	if user.Session.IsStarted {
		util.APIErrorResponse[any](ctx, "IsStarted", http.StatusConflict)
		return
	}
	if user.Session.IsFinished {
		util.APIErrorResponse[any](ctx, "IsFinished", http.StatusConflict)
		return
	}

	_, err = gorm.G[models.Session](db).Where("id = ?", user.SessionID).Update(bCtx, "is_started", true)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "STARTED",
	})
}
