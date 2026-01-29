package database

import (
	"fmt"
	"log"

	"github.com/rj-2006/techtalk/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect(host, user, password, dbname, port string) error {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disbale",
		host, user, password, dbname, port)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connect to the database: %w", err)
	}

	log.Println("Database connected successfully!")

	return nil
}

func Migrate() error {
	return DB.AutoMigrate(
		&models.User{},
		&models.Thread{},
		&models.Post{},
		&models.Chatroom{},
		&models.ChatMessage{},
		&models.GameRoom{},
		&models.GameState{},
	)
}
