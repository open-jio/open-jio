package models

import (
	"time"

	"gorm.io/gorm"
)

type EventWithMoreInfo struct {
	gorm.Model
	UserID        uint
	Title         string
	Description   string
	Time          time.Time
	Location      string
	NumberOfLikes int
	Registrations []Registration `gorm:"foreignKey:EventID"` //event has many registrations
	PollsOptions  []PollsOptions `gorm:"foreignKey:EventID"` //event cld have many poll options
	Images        []Image        `gorm:"foreignKey:EventID"` //event cld have many images
	Liked         bool           `gorm:"column:liked"`
	Joined        bool           `gorm:"column:joined"`
}
