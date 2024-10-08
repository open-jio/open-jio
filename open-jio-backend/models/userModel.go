package models

import (
	"github.com/rachelyeohm/open-jio/go-crud/initializers"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string
	Password string
	Email string
  	EmailIsVerified bool
	Events []Event `gorm:"foreignKey:UserID"`//user can create many events
	Registrations []Registration `gorm:"foreignKey:UserID"`//user has many registrations
	Likes []Likes `gorm:"foreignKey:UserID"`//one event pollOptions can have many likes
}

func (user *User) Save() (*User, error) {
	//creates the user in the database
	err := initializers.DB.Create(&user).Error
	if err != nil {
		return &User{}, err
	}
	return user, nil
}

func (user *User) ValidatePassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
}
