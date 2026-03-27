package middleware

import (
	"errors"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func JWTSecret() ([]byte, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return nil, errors.New("JWT_SECRET is not configured")
	}
	return []byte(secret), nil
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := normalizeToken(c.Query("token"))

		if token == "" {
			authHeader := c.GetHeader("Authorization")
			if authHeader == "" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization Header Required"})
				c.Abort()
				return
			}
			token = normalizeToken(authHeader)
		}

		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization Header Required"})
			c.Abort()
			return
		}

		secret, err := JWTSecret()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Authentication is not configured"})
			c.Abort()
			return
		}

		parsedToken, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return secret, nil
		})

		if err != nil || !parsedToken.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
			c.Abort()
			return
		}

		claims := parsedToken.Claims.(*Claims)
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Next()
	}
}

func normalizeToken(value string) string {
	value = strings.TrimSpace(value)
	value = strings.Trim(value, "\"'")
	value = strings.TrimPrefix(value, "Bearer ")
	if value == "" {
		return ""
	}

	if decoded, err := url.QueryUnescape(value); err == nil && decoded != "" {
		value = decoded
	}

	// Some clients/transports convert `+` to spaces in query params.
	value = strings.ReplaceAll(value, " ", "+")
	return value
}
