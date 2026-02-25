package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/rj-2006/techtalk/internal/database"
	"github.com/rj-2006/techtalk/internal/handlers"
	"github.com/rj-2006/techtalk/internal/middleware"
	"github.com/rj-2006/techtalk/internal/websocket"
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

	handlers.ChatHub = websocket.NewHub()
	go handlers.ChatHub.Run()

	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// Forum
		protected.POST("/threads", handlers.CreateThread)
		protected.GET("/threads", handlers.GetThreads)
		protected.GET("/threads/:id", handlers.GetThread)
		protected.POST("/threads/:id/posts", handlers.CreatePost)

		// Thread Reactions
		protected.POST("/threads/:id/reactions", handlers.AddThreadReactions)
		protected.DELETE("/threads/:id/reactions/:emoji", handlers.RemoveThreadReaction)
		protected.GET("/threads/:id/reactions", handlers.GetThreadReactions)

		// Chat
		protected.POST("/chatrooms", handlers.CreateChatroom)
		protected.GET("/chatrooms", handlers.GetChatrooms)
		protected.GET("/chatrooms/:id/history", handlers.GetChatHistory)
		protected.GET("/chatrooms/:id/ws", handlers.HandleChatWebsocket)

		// Upload
		protected.POST("/upload/avatar", handlers.UploadAvatar)
		protected.POST("/upload/image", handlers.UploadThreadImage)

		// Custom Emojis
		protected.POST("/emojis", handlers.CreateCustomEmoji)       // Admin only
		protected.GET("/emojis", handlers.GetCustomEmojis)          // Everyone
		protected.DELETE("/emojis/:id", handlers.DeleteCustomEmoji) // Admin only
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "5070"
	}

	log.Printf("Starting server on port: %s", port)
	r.Static("/uploads", "./uploads")
	r.Run(":" + port)
}
