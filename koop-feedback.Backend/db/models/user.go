package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name         string
	HasSubmitted bool
	IsHost       bool
	Feedback     []Feedback
	APIAuth      *APIAuth
	SessionID    int
	Session      Session
}
