package cron

import (
	"context"
	db2 "koopfeedback/db"
	"koopfeedback/db/models"
	"time"

	"github.com/go-co-op/gocron/v2"
	"github.com/metalblueberry/console"
	"gorm.io/gorm"
)

func ScheduleCronJob() {

	s, err := gocron.NewScheduler()
	if err != nil {
		console.Error("Failed to schedule... " + err.Error())
	}

	j, err := s.NewJob(
		gocron.DurationJob(
			24*time.Hour,
		),
		gocron.NewTask(
			func() {
				console.Log("Running Job for Database Cleanup....")

				db := db2.Database

				sessions, err := gorm.G[models.Session](db).Where("is_finished = ?", true).Preload("Users", nil).Find(context.Background())

				if err != nil {
					console.Error("Cleanup failed with err " + err.Error())
					return
				}

				for i := range sessions {
					session := sessions[i]

					for u := range session.Users {
						user := session.Users[u]

						dbUser, _ := gorm.G[models.User](db).Where("id = ?", user.ID).Preload("APIAuth", nil).Preload("Feedback", nil).First(context.Background())

						if len(dbUser.Feedback) > 0 {
							db.Unscoped().Delete(&dbUser.Feedback)
						}
						db.Unscoped().Delete(&dbUser.APIAuth)
						db.Unscoped().Delete(&dbUser)
					}

					db.Unscoped().Delete(&sessions)
				}

				console.Info("Cleanup done...")
			},
		),
	)
	if err != nil {
		console.Error("Failed to start... " + err.Error())
	}
	console.Info("Started Job with ID " + j.ID().String())

	s.Start()

	console.Info("Job is running every 24h")
}
