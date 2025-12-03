package middleware

import (
	"context"
	db2 "koopfeedback/db"
	"koopfeedback/db/models"
	"koopfeedback/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Header struct {
	Authorization string
}

func UserAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		ctx := context.Background()
		db := db2.Database

		authId := c.GetHeader("Authorization")

		if len(authId) == 0 {
			util.APIErrorResponse[any](c, "Unauthorized", http.StatusUnauthorized)
			c.Abort()
			return
		}

		_, err := gorm.G[models.User](db).Select("*").Where("api_auth_id = ?", authId).First(ctx)
		if err != nil {
			util.APIErrorResponse[any](c, "Unauthorized - No User", http.StatusUnauthorized)
			c.Abort()
			return
		}

		c.Set("authId", authId)
		c.Next()
	}
}
