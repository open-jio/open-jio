package models

import (
	"gorm.io/gorm"
)

type PollsOptions struct {
	gorm.Model
	Title             string
	EventID            uint	
	PollOptionChosen []Likes `gorm:"foreignKey:PollOptionsID"`//one event pollOptions can have many likes
}