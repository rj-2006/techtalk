package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	MaxAvatarSize = 6 * 1024 * 1024
	MaxImageSize  = 10 * 1024 * 1024
	UploadPath    = "./uploads"
)

func init() {
	os.MkdirAll(filepath.Join(UploadPath, "avatars"), 0755)
	os.MkdirAll(filepath.Join(UploadPath, "images"), 0755)
	os.MkdirAll(filepath.Join(UploadPath, "emojis"), 0755)
}

func UploadAvatar(c *gin.Context) {
	userID := c.GetUint("user_id")

	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest,gin.H{"error":"No File Uploaded"})
		return 
	}

	if file.size > MaxAvatarSize {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file size is too big"})
		return
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext != ".jpg" && ext! = ".jpeg" && ext != ".png" && ext != ".webp" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid file type"})
		return
	}

	filename := fmt.Sprintf("%d_%s%s", userID, uuid.New().String(), ext)
	filepath := filepath.Join(UploadPath, "avatars", filename)

	if err := c.SaveUploadedFile(file,filepath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
		return
	}
}
