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
	NumberOfLikes int
	Registrations []Registration `gorm:"foreignKey:EventID"`//event has many registrations
	PollsOptions []PollsOptions `gorm:"foreignKey:EventID"` //event cld have many poll options
}
