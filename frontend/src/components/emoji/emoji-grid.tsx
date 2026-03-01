import { cn } from '../../lib/utils'
import type { CustomEmoji } from '../../types/api'

interface EmojiGridProps {
  emojis: CustomEmoji[]
  onSelect?: (emoji: CustomEmoji) => void
  selectedEmoji?: string
  className?: string
}

export function EmojiGrid({ emojis, onSelect, selectedEmoji, className }: EmojiGridProps) {
  if (emojis.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-8 text-muted-foreground', className)}>
        <p>No custom emojis available</p>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-8 gap-1', className)}>
      {emojis.map((emoji) => (
        <button
          key={emoji.id}
          onClick={() => onSelect?.(emoji)}
          className={cn(
            'flex aspect-square items-center justify-center rounded p-1 transition-colors',
            'hover:bg-accent',
            selectedEmoji === emoji.name && 'bg-accent'
          )}
          title={emoji.name}
        >
          <img
            src={emoji.url}
            alt={emoji.name}
            className="h-8 w-8 object-contain"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  )
}
