package websocket

import (
	"encoding/json"

	"github.com/rj-2006/techtalk/internal/models"
)

const (
	MessageTypeChat     = "chat"
	MessageTypeSendChat = "send_message"
	MessageTypeGameMove = "game_move"
	MessageTypeJoin     = "join"
	MessageTypeLeave    = "leave"
	MessageTypeError    = "error"
	MessageTypeTyping   = "typing"
	MessageTypeReaction = "reaction"
	EventTypeNewMessage = "new_message"
	EventTypeUserJoined = "user_joined"
	EventTypeUserLeft   = "user_left"
)

type IncomingMessage struct {
	Type      string          `json:"type"`
	RoomID    string          `json:"room_id,omitempty"`
	UserID    uint            `json:"user_id,omitempty"`
	Username  string          `json:"username,omitempty"`
	Content   string          `json:"content,omitempty"`
	Payload   json.RawMessage `json:"payload,omitempty"`
	Data      json.RawMessage `json:"data,omitempty"`
	Timestamp int64           `json:"timestamp,omitempty"`
}

type Event struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload,omitempty"`
}

type ChatMessage struct {
	Content string `json:"content"`
}

type GameMoveMessage struct {
	PlayerID  uint    `json:"player_id"`
	X         float64 `json:"x"`
	Y         float64 `json:"y"`
	VelocityX float64 `json:"velocity_x"`
	VelocityY float64 `json:"velocity_y"`
	Rotation  float64 `json:"rotation"`
}

type TypingMessage struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
}

type ReactionMessage struct {
	MessageID uint   `json:"message_id"`
	UserID    uint   `json:"user_id"`
	Username  string `json:"username"`
	Emoji     string `json:"emoji"`
	Action    string `json:"action"`
}

type OutgoingChatMessage struct {
	ID         uint                     `json:"id"`
	ChatroomID uint                     `json:"chatroom_id"`
	UserID     uint                     `json:"user_id"`
	User       models.User              `json:"user"`
	Content    string                   `json:"content"`
	CreatedAt  string                   `json:"created_at"`
	Reactions  []models.MessageReaction `json:"reactions,omitempty"`
}
