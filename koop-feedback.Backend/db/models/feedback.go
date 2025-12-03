package models

import (
	"gorm.io/gorm"
)

type FeedbackType int

const (
	Normal FeedbackType = iota
	Positive
)

var FeedbackName = map[FeedbackType]string{
	Normal:   "normal",
	Positive: "positive",
}

type Feedback struct {
	gorm.Model
	Type        FeedbackType
	Description string
	UserID      int
	User        User
}

func IsFeedbackType(feedbackType FeedbackType) bool {
	switch feedbackType {
	case Normal:
		{
			return true
		}
	case Positive:
		{
			return true
		}
	}
	return false
}
