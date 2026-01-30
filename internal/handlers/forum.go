package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/rj-2006/techtalk/internal/database"
	"github.com/rj-2006/techtalk/internal/models"
)

func CreateThread(c *gin.Context) {
	var req struct {
		Title string `json:"title" binding:"required,min=5,max=200"`
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

	database.DB.Preload("User").First(&thread, thread.ID)

	c.JSON(http.StatusCreated, thread)
}

func GetThread(c *gin.Context) {
	threadID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid thread ID"})
		return
	}

	var thread models.Thread

	if err := database.DB.Preload("User").Preload("Posts.User").First(&thread, threadID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Thread not found."})
		return
	}

	c.JSON(http.StatusOK, thread)
}
