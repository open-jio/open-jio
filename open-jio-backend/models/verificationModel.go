package models

import (
	"time"

	"gorm.io/gorm"
)

type Verification struct {
	gorm.Model
	UserID           uint
	VerificationHash string
	Expires_at       time.Time
	Used_at          *time.Time
}
