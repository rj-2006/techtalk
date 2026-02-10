package handlers

import (
	"os"
	"path/filepath"

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
}
