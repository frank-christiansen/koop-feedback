package session

import (
	"context"
	db2 "koopfeedback/db"
	"koopfeedback/db/models"
	"koopfeedback/util"
	"math/rand"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type POSTSession struct {
	HostName string
}

func SessionPOST(ctx *gin.Context) {
	db := db2.Database
	bCtx := context.Background()
	body, hasBody := util.APIBindBody[POSTSession](ctx)

	if !hasBody {
		util.APIErrorResponse[POSTSession](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	if len(body.HostName) <= 2 {
		util.APIErrorResponse[any](ctx, "You name is to short. (min 2 characters)", http.StatusBadRequest)
		return
	}

	authId := uuid.New().String()

	err := gorm.G[models.User](db).Create(bCtx, &models.User{
		APIAuth: &models.APIAuth{
			Token: authId,
		},
		Name:         body.HostName,
		HasSubmitted: false,
		IsHost:       true,
		Feedback:     nil,
		Session: models.Session{
			Code:       rand.Intn(1000),
			IsStarted:  false,
			IsFinished: false,
		},
	})

	if err != nil {
		util.APIErrorResponse[POSTSession](ctx, "Failed to create session!", http.StatusBadRequest)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "SESSION",
		Data: gin.H{
			"authId": authId,
		},
	})
	return
}

type GETResponseSession struct {
	Self    models.User
	Session models.Session
	Users   []models.User
}

func SessionGET(ctx *gin.Context) {
	db := db2.Database
	bCtx := context.Background()
	userId, _ := ctx.Get("userId")

	user, err := gorm.G[models.User](db).Where("id = ?", userId).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusBadRequest)
		return
	}

	session, err := gorm.G[models.Session](db).Where("id = ?", user.SessionID).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusBadRequest)
		return
	}
	users, err := gorm.G[models.User](db).Where("session_id = ?", session.ID).Find(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusBadRequest)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[GETResponseSession]{
		Success: true,
		Message: "SESSION - USERS",
		Data: GETResponseSession{
			Self:    user,
			Session: session,
			Users:   users,
		},
	})
	return

}
