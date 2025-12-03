package models

import (
	"gorm.io/gorm"
)

type Session struct {
	gorm.Model
	Code       int
	IsStarted  bool
	IsFinished bool
	Users      []User
}
