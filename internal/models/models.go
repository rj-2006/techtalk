package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Username  string         `gorm:"unique;not null" json:"username"`
	Email     string         `gorm:"unique;not null" json:"email"`
	Password  string         `gorm:"not null" json:"-"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Avatar    string         `gorm:"default:null" json:"avatar,omitempty"`
}

type Thread struct {
	ID        uint             `gorm:"primaryKey" json:"id"`
	Title     string           `gorm:"not null" json:"title"`
	UserID    uint             `gorm:"not null" json:"user_id"`
	User      User             `gorm:"foreignKey:UserID" json:"user"`
	Posts     []Post           `gorm:"foreignKey:ThreadID" json:"posts,omitempty"`
	CreatedAt time.Time        `json:"created_at"`
	UpdatedAt time.Time        `json:"updated_at"`
	Images    []ThreadImage    `gorm:"foreignKey:ThreadID" json:"images,omitempty"`
	Reactions []ThreadReaction `gorm:"foreignKey:ThreadID" json:"reactions,omitempty"`
}

type Post struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	ThreadID  uint      `gorm:"not null" json:"thread_id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Chatroom struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	CreatedBy   uint      `gorm:"not null" json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
}

type ChatMessage struct {
	ID         uint              `gorm:"primaryKey" json:"id"`
	ChatroomID uint              `gorm:"not null;index" json:"chatroom_id"`
	UserID     uint              `gorm:"not null" json:"user_id"`
	User       User              `gorm:"foreignKey:UserID" json:"user"`
	Content    string            `gorm:"type:text;not null" json:"content"`
	CreatedAt  time.Time         `json:"created_at"`
	Reactions  []MessageReaction `gorm:"foreignKey:MessageID" json:"reactions,omitempty"`
}

type GameRoom struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Name       string    `gorm:"not null" json:"name"`
	GameType   string    `gorm:"not null" json:"game_type"` // "smash_karts"
	MaxPlayers int       `gorm:"default:8" json:"max_players"`
	Status     string    `gorm:"default:'waiting'" json:"status"` // waiting, playing, finished
	CreatedBy  uint      `gorm:"not null" json:"created_by"`
	CreatedAt  time.Time `json:"created_at"`
}

type GameState struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	GameRoomID uint      `gorm:"not null;uniqueIndex" json:"game_room_id"`
	StateData  string    `gorm:"type:jsonb" json:"state_data"` // JSON blob
	UpdatedAt  time.Time `json:"updated_at"`
}

type ThreadImage struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	ThreadID uint   `gorm:"not null;index" json:"thread_id"`
	URL      string `gorm:"not null" json:"url"`
	Caption  string `json:"caption,omitempty"`
}

type ThreadReaction struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ThreadID  uint      `gorm:"not null;index" json:"thread_id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Emoji     string    `gorm:"not null" json:"emoji"`
	CreatedAt time.Time `json:"created_at"`
}

type MessageReaction struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	MessageID uint      `gorm:"not null;index" json:"message_id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Emoji     string    `gorm:"not null" json:"emoji"`
	CreatedAt time.Time `json:"created_at"`
}

type CustomEmoji struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"unique;not null" json:"name"`
	URL       string    `gorm:"not null" json:"url"`
	CreatedBy uint      `gorm:"not null" json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
}
