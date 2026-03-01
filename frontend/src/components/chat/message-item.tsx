import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '../../lib/utils'
import type { ChatMessage } from '../../types/api'

interface MessageItemProps {
  message: ChatMessage
  isOwn?: boolean
  showAvatar?: boolean
  showUsername?: boolean
  className?: string
}

export function MessageItem({
  message,
  isOwn = false,
  showAvatar = true,
  showUsername = true,
  className,
}: MessageItemProps) {
  return (
    <div
      className={cn(
        'group flex gap-3 px-4 py-1 hover:bg-accent/50',
        isOwn && 'flex-row-reverse',
        className
      )}
    >
      {showAvatar && !isOwn && (
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {message.user?.username?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
      )}
      
      <div className={cn('flex max-w-[70%] flex-col', isOwn && 'items-end')}>
        {showUsername && !isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/user/${message.user?.username}`}
              className="text-sm font-medium hover:underline"
            >
              {message.user?.username}
            </Link>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
          </div>
        )}
        
        <div
          className={cn(
            'rounded-lg px-3 py-2 text-sm',
            isOwn
              ? 'bg-primary text-primary-foreground rounded-tr-none'
              : 'bg-muted rounded-tl-none'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {isOwn && (
          <span className="mt-1 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  )
}
