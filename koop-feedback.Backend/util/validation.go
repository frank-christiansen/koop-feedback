package util

import (
	"context"
	db2 "koopfeedback/db"
	"koopfeedback/db/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DefaultAPIResponse[T any] struct {
	Success bool
	Message string
	Data    T
}

func APIErrorResponse[T any](ctx *gin.Context, err string, statusCode int) {
	ctx.JSON(statusCode,
		DefaultAPIResponse[T]{
			Success: false,
			Message: err,
		})
	return
}

func APIBindBody[T any](ctx *gin.Context) (x *T) {
	var bind *T

	err := ctx.ShouldBindBodyWithJSON(&bind)
	if err != nil {
		APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}
	return bind
}

func APIBindUri[T any](ctx *gin.Context) (x *T) {
	var bind *T

	err := ctx.ShouldBindUri(&bind)
	if err != nil {
		APIErrorResponse[any](ctx, err.Error(), http.StatusInternalServerError)
		return
	}
	return bind
}

func DBCheckSelf(authId string, userId int) (x bool) {
	db := db2.Database
	_, err := gorm.G[models.User](db).Where("id = ? AND api_auth_id = ?", userId, authId).First(context.Background())

	if err != nil {
		return false
	}
	return true
}

func DBCheckHostWithId(userId int) (x bool) {
	db := db2.Database
	user, err := gorm.G[models.User](db).Where("id = ?", userId).First(context.Background())

	if err != nil || !user.IsHost {
		return false
	}
	return true
}
func DBCheckHostWithAuth(authId string) (x bool) {
	db := db2.Database
	user, err := gorm.G[models.User](db).Where("api_auth_id = ?", authId).First(context.Background())

	if err != nil || !user.IsHost {
		return false
	}
	return true
}

func DBCheckSameSession(authId string, otherUserId int) (x bool) {
	db := db2.Database

	user1, err1 := gorm.G[models.User](db).Where("api_auth_id = ?", authId).First(context.Background())
	user2, err2 := gorm.G[models.User](db).Where("id = ?", otherUserId).First(context.Background())

	if err1 != nil || err2 != nil {
		return false
	}
	if user1.SessionID != user2.SessionID {
		return false
	}
	return true
}
