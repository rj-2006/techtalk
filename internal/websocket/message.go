package websocket

import "encoding/json"

const (
	MessageTypeChat     = "chat"
	MessageTypeGameMove = "game_move"
	MessageTypeJoin     = "join"
	MessageTypeLeave    = "leave"
	MessageTypeError    = "error"
	MessageTypeTyping   = "typing"
	MessageTypeReaction = "reaction"
)

type Message struct {
	Type      string          `json:"type"`
	RoomID    string          `json:"room_id,omitempty"`
	UserID    uint            `json:"user_id"`
	Username  string          `json:"username"`
	Content   string          `json:"content,omitempty"`
	Data      json.RawMessage `json:"data,omitempty"`
	Timestamp int64           `json:"Timestamp"`
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
