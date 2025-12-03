package db

import (
	"context"
	"fmt"
	"os"

	"gorm.io/gorm"
	"gorm.io/driver/postgres"

	"koopfeedback/models"
)

var Database *gorm.Conn

func ConnectToDatabase() {

	// os.Getenv("DATABASE_URL")
	connStr := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})

	ctx := context.Background()

	// Migrate the schema
	db.AutoMigrate(&User{})

	Database = db
}
