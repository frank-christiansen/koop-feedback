package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	APIAuthId    string
	Name         string
	HasSubmitted bool
	IsHost       bool

	Feedback  []Feedback
	SessionID int
	Session   Session
}
