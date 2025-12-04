package models

import "gorm.io/gorm"

type APIAuth struct {
	gorm.Model
	Token  string
	UserID int
	User   *User
}
