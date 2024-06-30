package models

import "gorm.io/gorm"

type Image struct {
	gorm.Model
	Imageurl string
	EventID  uint
}
