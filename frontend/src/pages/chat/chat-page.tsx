import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useChatrooms, useChatHistory, useCreateChatroom } from '../../hooks/use-chat'
import { useChatWebSocket } from '../../hooks/use-websocket'
import { useAuthStore } from '../../stores/auth-store'
import { PageContainer } from '../../components/layout/page-container'
import { ChatroomSidebar } from '../../components/chat/chatroom-sidebar'
import { MessageList } from '../../components/chat/message-list'
import { MessageInput } from '../../components/chat/message-input'
import { TypingIndicator } from '../../components/chat/typing-indicator'
import { cn } from '../../lib/utils'
import type { ChatMessage } from '../../types/api'

export function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const chatroomId = id ? Number(id) : undefined
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  
  const { data: chatrooms, isLoading: chatroomsLoading } = useChatrooms()
  const { data: history, isLoading: historyLoading } = useChatHistory(chatroomId!)
  const createChatroom = useCreateChatroom()
  
  const userId = useAuthStore((state) => state.user?.id)

  const handleNewMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev
      return [...prev, message]
    })
  }, [])

  const { isConnected, sendMessage, sendTyping, joinRoom, leaveRoom } = useChatWebSocket({
    chatroomId: chatroomId!,
    onMessage: handleNewMessage,
  })

  useEffect(() => {
    if (history?.data) {
      setMessages(history.data.reverse())
    }
  }, [history])

  useEffect(() => {
    if (chatroomId) {
      joinRoom()
      return () => leaveRoom()
    }
  }, [chatroomId, joinRoom, leaveRoom])

  const handleSendMessage = (content: string) => {
    sendMessage(content)
  }

  const handleTyping = () => {
    sendTyping()
  }

  const handleCreateChatroom = (name: string, description?: string) => {
    createChatroom.mutate({ name, description })
  }

  const currentChatroom = chatrooms?.find((c) => c.id === chatroomId)

  return (
    <PageContainer className="flex!">
      <ChatroomSidebar
        chatrooms={chatrooms || []}
        currentChatroomId={chatroomId}
        isLoading={chatroomsLoading}
        onCreateChatroom={handleCreateChatroom}
        isCreating={createChatroom.isPending}
      />

      <div className="flex flex-1 flex-col">
        {chatroomId ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                #
              </span>
              <h2 className="font-semibold">{currentChatroom?.name || 'Chat'}</h2>
              {currentChatroom?.description && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{currentChatroom.description}</span>
                </>
              )}
              <div className="ml-auto flex items-center gap-2">
                <span className={cn(
                  'h-2 w-2 rounded-full',
                  isConnected ? 'bg-green-500' : 'bg-muted'
                )} />
                <span className="text-xs text-muted-foreground">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Messages */}
            {historyLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-muted-foreground">Loading messages...</div>
              </div>
            ) : (
              <MessageList
                messages={messages}
                currentUserId={userId}
                className="flex-1"
              />
            )}

            {/* Typing Indicator */}
            <TypingIndicator users={typingUsers} />

            {/* Input */}
            <MessageInput
              onSend={handleSendMessage}
              onTyping={handleTyping}
              disabled={!isConnected}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Welcome to Chat</h3>
              <p className="text-muted-foreground">Select a chatroom to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
