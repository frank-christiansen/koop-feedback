package session

import (
	"context"
	db2 "koopfeedback/db"
	"koopfeedback/db/models"
	"koopfeedback/util"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type APIFeedback struct {
	Id          int
	UserId      int
	Type        models.FeedbackType
	Description string
}

type POSTFeedback struct {
	Feedback []APIFeedback
}

type POSTResponseFeedback struct {
	Success int
	Failed  int
}

func SessionFeedbackPOST(ctx *gin.Context) {
	db := db2.Database
	bCtx := context.Background()
	body, hasBody := util.APIBindBody[POSTFeedback](ctx)
	authId, _ := ctx.Get("authId")
	userId, _ := ctx.Get("userId")

	authUser, err := gorm.G[models.User](db).Preload("Session", nil).Where("id = ?", userId).First(bCtx)

	if !hasBody {
		util.APIErrorResponse[POSTFeedback](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	if !authUser.Session.IsStarted {
		util.APIErrorResponse[POSTFeedback](ctx, "NotActive", http.StatusLocked)
		return
	}
	if authUser.Session.IsFinished {
		util.APIErrorResponse[POSTFeedback](ctx, "NotActive", http.StatusLocked)
		return
	}

	if authUser.HasSubmitted {
		util.APIErrorResponse[POSTFeedback](ctx, "HasSubmitted", http.StatusConflict)
		return
	}

	if len(body.Feedback) == 0 {
		util.APIErrorResponse[POSTFeedback](ctx, "No Feedback found", http.StatusNotFound)
		return
	}

	successFeedback := 0
	for i := range body.Feedback {
		f := body.Feedback[i]

		isSameSession := util.DBCheckSameSession(strconv.Itoa(userId.(int)), f.UserId)
		isSelf := util.DBCheckSelf(authId.(string), f.UserId)
		if isSelf {
			continue
		}
		if !isSameSession {
			continue
		}
		if !models.IsFeedbackType(f.Type) {
			continue
		}
		if len(f.Description) <= 10 {
			continue
		}

		err = gorm.G[models.Feedback](db).Create(bCtx, &models.Feedback{
			Type:        f.Type,
			Description: f.Description,
			UserID:      f.UserId,
		})

		if err != nil {
			util.APIErrorResponse[POSTFeedback](ctx, err.Error(), http.StatusBadRequest)
			continue
		}
		successFeedback++
	}

	if successFeedback != 0 {
		_, err := gorm.G[models.User](db).Where("id = ?", userId).Update(bCtx, "has_submitted", true)
		if err != nil {
			util.APIErrorResponse[POSTFeedback](ctx, err.Error(), http.StatusBadRequest)
			return
		}
		ctx.JSON(200, util.DefaultAPIResponse[POSTResponseFeedback]{
			Success: true,
			Message: "FEEDBACK",
			Data: POSTResponseFeedback{
				Success: successFeedback,
				Failed:  len(body.Feedback) - successFeedback,
			},
		})
		return
	}

	util.APIErrorResponse[POSTFeedback](ctx, "No Feedback submitted. try again", http.StatusBadRequest)
}
