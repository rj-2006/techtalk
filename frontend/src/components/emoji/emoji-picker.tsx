import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { useCustomEmojis } from '../../hooks/use-emoji'
import { EmojiGrid } from './emoji-grid'
import type { CustomEmoji } from '../../types/api'

interface EmojiPickerProps {
  onSelect: (emoji: CustomEmoji) => void
  onAddNew?: () => void
  className?: string
}

export function EmojiPicker({ onSelect, onAddNew, className }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: emojis, isLoading } = useCustomEmojis()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredEmojis = emojis?.filter((emoji) =>
    emoji.name.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-72 rounded-lg border bg-background shadow-lg">
          {/* Search */}
          <div className="border-b p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emojis..."
              className={cn(
                'w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-1 focus:ring-ring'
              )}
              autoFocus
            />
          </div>

          {/* Grid */}
          <div className="max-h-48 overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <EmojiGrid
                emojis={filteredEmojis}
                onSelect={(emoji) => {
                  onSelect(emoji)
                  setIsOpen(false)
                  setSearch('')
                }}
              />
            )}
          </div>

          {/* Add new */}
          {onAddNew && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false)
                  onAddNew()
                }}
                className="w-full justify-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add custom emoji
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
