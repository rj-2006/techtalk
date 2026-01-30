package server

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rj-2006/techtalk/internal/database"
	"github.com/rj-2006/techtalk/internal/handlers"
	"github.com/rj-2006/techtalk/internal/middleware"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	if err := database.Connect(
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	); err != nil {
		log.Fatal("Database connection failed:", err)
	}

	if err := database.Migrate(); err != nil {
		log.Fatal("Migration failed: ", err)
	}

	r := gin.Default() // router

	r.POST("/api/register", handlers.Register)
	r.POST("/api/login", handlers.Login)

	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/threads", handlers.CreateThread)
		protected.GET("/threads", handlers.GetThread)
		protected.GET("/threads/:id", handlers.GetThread)
		protected.POST("/threads/:id/posts", handlers.CreatePost)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "5070"
	}

	log.Printf("Starting server on port: %s", port)
	r.Run(":" + port)
}
