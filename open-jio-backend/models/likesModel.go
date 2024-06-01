package models

import (
	"gorm.io/gorm"
)

type Likes struct {
	gorm.Model
	PollOptionsID uint
	UserID uint
}