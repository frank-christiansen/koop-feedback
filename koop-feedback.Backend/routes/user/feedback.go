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

type GETResponseUserFeedback struct {
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
	var filteredFeedback []GETResponseUserFeedback
	for i := range len(feedback) {
		f := feedback[i]
		filteredFeedback = append(filteredFeedback, GETResponseUserFeedback{
			Type:        int(f.Type),
			Description: f.Description,
		})

	}

	ctx.JSON(200, util.DefaultAPIResponse[[]GETResponseUserFeedback]{
		Success: true,
		Message: "FEEDBACK",
		Data:    filteredFeedback,
	})
	return
}

type POSTFeedback struct {
	Type        models.FeedbackType
	Description string
}

func UserFeedbackPOST(ctx *gin.Context) {
	db := db2.Database
	bCtx := context.Background()
	body := util.APIBindBody[POSTFeedback](ctx)
	url := util.APIBindUri[GETUser](ctx)

	auth, _ := ctx.Get("authId")
	isSelf := util.DBCheckSelf(auth.(string), url.ID)
	isSameSession := util.DBCheckSameSession(auth.(string), url.ID)

	if !isSameSession {
		util.APISameSessionError(ctx)
		return
	}
	if isSelf {
		util.APISelfError(ctx)
		return
	}

	if !models.IsFeedbackType(body.Type) {
		util.APIErrorResponse[POSTFeedback](ctx, "Use a valid feedback type 0, 1.", http.StatusInternalServerError)
		return
	}
	if len(body.Description) <= 10 {
		util.APIErrorResponse[POSTFeedback](ctx, "You need to have more then 10 characters!", http.StatusInternalServerError)
		return
	}

	user, err := gorm.G[models.User](db).Where("id = ?", url.ID).First(bCtx)
	if err != nil {
		util.APIErrorResponse[POSTFeedback](ctx, err.Error(), http.StatusInternalServerError)
		return
	}

	err = gorm.G[models.Feedback](db).Create(bCtx, &models.Feedback{
		Type:        body.Type,
		Description: body.Description,
		UserID:      int(user.ID),
	})

	if err != nil {
		util.APIErrorResponse[POSTFeedback](ctx, err.Error(), http.StatusBadRequest)
		return
	}

	ctx.JSON(200, util.DefaultAPIResponse[any]{
		Success: true,
		Message: "FEEDBACK",
	})
	return
}
