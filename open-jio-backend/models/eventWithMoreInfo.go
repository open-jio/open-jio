package models

import (
	"fmt"
	"strings"
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
	Imageurls     StringArray	`gorm:"column:imageurls;type:text[]"` //specify it shld be scanned as an array of text
	Liked         bool           `gorm:"column:liked"`
	Joined        bool           `gorm:"column:joined"`
}




//just for this model, so it goes here

type StringArray []string

func (a *StringArray) Scan(src interface{}) error {
	if src == nil {
		*a = nil
		return nil
	}
	switch src := src.(type) {
	case []byte:
		*a = parseArray(string(src))
	case string:
		*a = parseArray(src)
	default:
		return fmt.Errorf("unsupported scan type for StringArray: %T", src)
	}
	return nil
}

func parseArray(arrayStr string) []string {
	arrayStr = strings.Trim(arrayStr, "{}")
	if arrayStr == "" || arrayStr == "NULL" {
		return []string{}
	}
	return strings.Split(arrayStr, ",")
}