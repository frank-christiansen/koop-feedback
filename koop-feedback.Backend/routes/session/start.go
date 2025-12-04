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
	authId, _ := ctx.Get("authId")

	isHost := util.DBCheckHostWithAuth(authId.(string))
	if !isHost {
		util.APIHostError(ctx)
		return
	}

	user, err := gorm.G[models.User](db).Preload("Session", nil).Where("api_auth_id = ?", authId).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
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
