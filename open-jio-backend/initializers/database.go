package initializers

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// global variable to store pointer to database. allows it to be accessed from other packages
var DB *gorm.DB

func ConnectToDB() {
	var err error
	dsn := os.Getenv("DB_URL") //gets the url from the .env file.
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	//if there is an error, log a fatal log
	if err != nil {
		log.Fatal("Failed to connect to database")
	}
}
