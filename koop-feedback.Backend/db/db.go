package db

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
)

var Database *pgx.Conn

func ConnectToDatabase() {

	// os.Getenv("DATABASE_URL")
	connStr := os.Getenv("DATABASE_URL")

	conn, err := pgx.Connect(context.Background(), connStr)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to db: %v\n", err)
		os.Exit(1)
	}

	Database = conn
}
