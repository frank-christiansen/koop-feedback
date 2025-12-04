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

type GETResponseFeedback struct {
	Type        int
	Description string
}

func UserFeedbackGET(ctx *gin.Context) {
	db := db2.Database
	bCtx := context.Background()
	uri := util.APIBindUri[GETUser](ctx)

	auth, _ := ctx.Get("authId")
	isSelf := util.DBCheckSelf(auth.(string), uri.ID)

	if !isSelf {
		util.APINotSelfError(ctx)
		return
	}

	feedback, err := gorm.G[models.Feedback](db).Where("user_id = ?", uri.ID).Find(bCtx)
	if err != nil {
		util.APIErrorResponse[GETUser](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	// Maybe i need to make this better...
	var filteredFeedback []GETResponseFeedback
	for i := range len(feedback) {
		f := feedback[i]
		filteredFeedback = append(filteredFeedback, GETResponseFeedback{
			Type:        int(f.Type),
			Description: f.Description,
		})

	}

	ctx.JSON(200, util.DefaultAPIResponse[[]GETResponseFeedback]{
		Success: true,
		Message: "FEEDBACK",
		Data:    filteredFeedback,
	})
	return
}

type APIFeedback struct {
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

func UserFeedbackPOST(ctx *gin.Context) {
	db := db2.Database
	bCtx := context.Background()
	body := util.APIBindBody[POSTFeedback](ctx)
	url := util.APIBindUri[GETUser](ctx)

	auth, _ := ctx.Get("authId")
	isSelf := util.DBCheckSelf(auth.(string), url.ID)
	isSameSession := util.DBCheckSameSession(auth.(string), url.ID)
	authUser, err := gorm.G[models.User](db).Where("api_auth_id = ?", auth).First(bCtx)

	if !isSameSession {
		util.APISameSessionError(ctx)
		return
	}
	if isSelf {
		util.APISelfError(ctx)
		return
	}
	if authUser.HasSubmitted {
		util.APIErrorResponse[POSTFeedback](ctx, "HasSubmitted", http.StatusInternalServerError)
		return
	}

	if len(body.Feedback) == 0 {
		util.APIErrorResponse[POSTFeedback](ctx, "No Feedback found", http.StatusInternalServerError)
		return
	}

	// User Check...
	user, err := gorm.G[models.User](db).Where("id = ?", url.ID).First(bCtx)
	if err != nil {
		util.APIErrorResponse[POSTFeedback](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	successFeedback := 0
	for i := range body.Feedback {
		f := body.Feedback[i]

		if !models.IsFeedbackType(f.Type) {
			continue
		}
		if len(f.Description) <= 10 {
			continue
		}

		err = gorm.G[models.Feedback](db).Create(bCtx, &models.Feedback{
			Type:        f.Type,
			Description: f.Description,
			UserID:      int(user.ID),
		})

		if err != nil {
			util.APIErrorResponse[POSTFeedback](ctx, err.Error(), http.StatusBadRequest)
			continue
		}
		successFeedback++
	}

	if successFeedback != 0 {
		_, err := gorm.G[models.User](db).Where("api_auth_id = ?", auth).Update(bCtx, "has_submitted", true)
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
