package handlers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/rj-2006/techtalk/internal/database"
	"github.com/rj-2006/techtalk/internal/models"
)

func CreateThread(c *gin.Context) {
	var req struct {
		Title   string `json:"title" binding:"required,min=3,max=200"`
		Content string `json:"content"`
		Images  []struct {
			URL     string `json:"url" binding:"required"`
			Caption string `json:"caption"`
		} `json:"images"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetUint("user_id")

	thread := models.Thread{
		Title:  req.Title,
		UserID: userID,
	}

	if err := database.DB.Create(&thread).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Thread."})
		return
	}

	// If content is provided, create initial post
	if req.Content != "" {
		post := models.Post{
			Content:  req.Content,
			ThreadID: thread.ID,
			UserID:   userID,
		}
		database.DB.Create(&post)
	}

	if len(req.Images) > 0 {
		images := make([]models.ThreadImage, 0, len(req.Images))
		for _, image := range req.Images {
			images = append(images, models.ThreadImage{
				ThreadID: thread.ID,
				URL:      image.URL,
				Caption:  image.Caption,
			})
		}
		if err := database.DB.Create(&images).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to attach thread images."})
			return
		}
	}

	database.DB.Preload("User").Preload("Posts").Preload("Images").First(&thread, thread.ID)

	c.JSON(http.StatusCreated, thread)
}

func GetThread(c *gin.Context) {
	threadID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
		return
	}

	var thread models.Thread

	// Use distinct queries to load related data
	if err := database.DB.Preload("User").First(&thread, threadID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found."})
		return
	}

	// Load posts with user
	database.DB.Where("thread_id = ?", threadID).Find(&thread.Posts)
	for i := range thread.Posts {
		database.DB.First(&thread.Posts[i].User, thread.Posts[i].UserID)
	}

	// Load reactions with user
	database.DB.Where("thread_id = ?", threadID).Find(&thread.Reactions)
	for i := range thread.Reactions {
		database.DB.First(&thread.Reactions[i].User, thread.Reactions[i].UserID)
	}

	database.DB.Where("thread_id = ?", threadID).Find(&thread.Images)

	log.Printf("=== GetThread: returning thread with %d reactions ===", len(thread.Reactions))

	c.JSON(http.StatusOK, thread)
}

func GetThreads(c *gin.Context) {
	var threads []models.Thread
	query := database.DB.
		Preload("User").
		Preload("Posts").
		Preload("Posts.User").
		Preload("Images").
		Preload("Reactions").
		Preload("Reactions.User").
		Order("created_at DESC")

	search := c.Query("search")
	if search != "" {
		query = query.Where("title ILIKE ?", "%"+search+"%")
	}

	if err := query.Find(&threads).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch threads"})
		return
	}

	c.JSON(http.StatusOK, threads)
}

func CreatePost(c *gin.Context) {
	threadID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread id"})
		return
	}

	var req struct {
		Content string `json:"content" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var thread models.Thread

	if err := database.DB.First(&thread, threadID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Thread not Found"})
		return
	}

	userID := c.GetUint("user_id")

	post := models.Post{
		Content:  req.Content,
		ThreadID: uint(threadID),
		UserID:   userID,
	}

	if err := database.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Post."})
		return
	}

	database.DB.Preload("User").First(&post, post.ID)

	c.JSON(http.StatusCreated, post)
}
