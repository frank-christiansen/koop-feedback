package util

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func APISelfError(ctx *gin.Context) {
	APIErrorResponse[any](ctx, "You cannot use the same account!", http.StatusConflict)
}

func APINotSelfError(ctx *gin.Context) {
	APIErrorResponse[any](ctx, "You can't view other infos here!", http.StatusConflict)
}

func APIHostError(ctx *gin.Context) {
	APIErrorResponse[any](ctx, "You are not the Host...", http.StatusConflict)
}

func APISameSessionError(ctx *gin.Context) {
	APIErrorResponse[any](ctx, "You are not in the same Session...", http.StatusConflict)
}
