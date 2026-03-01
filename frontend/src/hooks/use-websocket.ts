import { useEffect, useRef, useCallback, useState } from 'react'
import { useAuthStore } from '../stores/auth-store'

interface WebSocketMessage {
  type: string
  payload: unknown
}

interface UseWebSocketOptions {
  url: string
  onMessage?: (message: WebSocketMessage) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  reconnectAttempts?: number
  reconnectInterval?: number
}

interface UseWebSocketReturn {
  isConnected: boolean
  sendMessage: (message: WebSocketMessage) => void
  lastMessage: WebSocketMessage | null
}

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectAttempts = 5,
  reconnectInterval = 3000,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectCountRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const token = useAuthStore((state) => state.token)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    const wsUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url
    
    try {
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        reconnectCountRef.current = 0
        onOpen?.()
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage
          setLastMessage(message)
          onMessage?.(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onclose = () => {
        setIsConnected(false)
        onClose?.()

        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectCountRef.current++
            connect()
          }, reconnectInterval)
        }
      }

      ws.onerror = (error) => {
        onError?.(error)
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }, [url, token, onMessage, onOpen, onClose, onError, reconnectAttempts, reconnectInterval])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setIsConnected(false)
    reconnectCountRef.current = 0
  }, [])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message)
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    sendMessage,
    lastMessage,
  }
}

interface ChatMessage {
  id: number
  chatroom_id: number
  user_id: number
  user: {
    id: number
    username: string
    avatar?: string
  }
  content: string
  created_at: string
}

interface UseChatWebSocketOptions {
  chatroomId: number
  onMessage?: (message: ChatMessage) => void
  onUserJoined?: (userId: number, username: string) => void
  onUserLeft?: (userId: number) => void
}

interface UseChatWebSocketReturn {
  isConnected: boolean
  sendMessage: (content: string) => void
  sendTyping: () => void
  joinRoom: () => void
  leaveRoom: () => void
}

export function useChatWebSocket({
  chatroomId,
  onMessage,
  onUserJoined,
  onUserLeft,
}: UseChatWebSocketOptions): UseChatWebSocketReturn {
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/^http/, 'ws') || 'ws://localhost:5070'
  const wsUrl = `${baseUrl}/api/chatrooms/${chatroomId}/ws`

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'new_message':
        onMessage?.(message.payload as ChatMessage)
        break
      case 'user_joined':
        const joined = message.payload as { user_id: number; username: string }
        onUserJoined?.(joined.user_id, joined.username)
        break
      case 'user_left':
        onUserLeft?.(message.payload as { user_id: number })
        break
    }
  }, [onMessage, onUserJoined, onUserLeft])

  const {
    isConnected,
    sendMessage: rawSendMessage,
  } = useWebSocket({
    url: wsUrl,
    onMessage: handleMessage,
  })

  const sendMessage = useCallback((content: string) => {
    rawSendMessage({
      type: 'send_message',
      payload: { content },
    })
  }, [rawSendMessage])

  const sendTyping = useCallback(() => {
    rawSendMessage({
      type: 'typing',
      payload: {},
    })
  }, [rawSendMessage])

  const joinRoom = useCallback(() => {
    rawSendMessage({
      type: 'join_room',
      payload: {},
    })
  }, [rawSendMessage])

  const leaveRoom = useCallback(() => {
    rawSendMessage({
      type: 'leave_room',
      payload: {},
    })
  }, [rawSendMessage])

  return {
    isConnected,
    sendMessage,
    sendTyping,
    joinRoom,
    leaveRoom,
  }
}
