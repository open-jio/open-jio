package models

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	UserID uint
	Title string
	Description string
	Time time.Time
	Location string
}
