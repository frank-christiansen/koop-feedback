package session

import (
	"context"
	db2 "koopfeedback/db"
	"koopfeedback/db/models"
	"koopfeedback/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type POSTJoinSession struct {
	Code int    `bindings:"required"`
	Name string `bindings:"required"`
}

func JoinSession(ctx *gin.Context) {

	bCtx := context.Background()
	db := db2.Database
	body, hasBody := util.APIBindBody[POSTJoinSession](ctx)

	if !hasBody {
		util.APIErrorResponse[POSTJoinSession](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	authId := uuid.New().String()

	session, err := gorm.G[models.Session](db).Where("code = ?", body.Code).First(bCtx)
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}
	err = gorm.G[models.User](db).Create(bCtx, &models.User{
		APIAuth: &models.APIAuth{
			Token: authId,
		},
		Name:         body.Name,
		HasSubmitted: false,
		IsHost:       false,
		Feedback:     nil,
		SessionID:    int(session.ID),
	})
	if err != nil {
		util.APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "JOINED",
		Data: gin.H{
			"authId": authId,
		},
	})

}
