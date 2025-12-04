package db

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"koopfeedback/db/models"
)

var Database *gorm.DB

func ConnectToDatabase() {

	// os.Getenv("DATABASE_URL")
	connStr := os.Getenv("DATABASE_URL")
	db, dbErr := gorm.Open(postgres.Open(connStr), &gorm.Config{})

	if dbErr != nil {
		panic("Failed to connect to database.")
	}

	// Migrate the schema
	dbMigrateErr := db.AutoMigrate(&models.User{}, &models.APIAuth{}, &models.Feedback{}, &models.Session{})

	if dbMigrateErr != nil {
		panic("Failed to migrate the database...")
	}

	Database = db
}
