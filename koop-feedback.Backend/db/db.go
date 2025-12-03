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
	connStr := "postgres://root:6CvTq5FnbeyTKlCFSUrNJcL6ByjGuIArm0hGW@192.168.1.97:5332/koop-feedback"

	conn, err := pgx.Connect(context.Background(), connStr)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to db: %v\n", err)
		os.Exit(1)
	}

	Database = conn
}
