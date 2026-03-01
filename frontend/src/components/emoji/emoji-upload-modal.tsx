import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useCreateEmoji, useCustomEmojis } from '../../hooks/use-emoji'
import { useAuthStore } from '../../stores/auth-store'

const emojiSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(20, 'Name must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
})

type EmojiFormData = z.infer<typeof emojiSchema>

interface EmojiUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EmojiUploadModal({ isOpen, onClose }: EmojiUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const createEmoji = useCreateEmoji()
  const { data: emojis } = useCustomEmojis()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EmojiFormData>({
    resolver: zodResolver(emojiSchema),
  })

  const handleClose = () => {
    reset()
    setPreview(null)
    setFile(null)
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      setError('name', { message: 'Please select an image file' })
      return
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      setError('name', { message: 'File must be less than 2MB' })
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  const onSubmit = async (data: EmojiFormData) => {
    if (!file) {
      setError('name', { message: 'Please select an image' })
      return
    }

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('url', file)

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5070'
      const token = useAuthStore.getState().token
      
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${baseUrl}/api/emojis`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload emoji')
      }

      handleClose()
    } catch {
      setError('name', { message: 'Failed to upload emoji' })
    }
  }

  if (!isOpen) return null

  const isNameTaken = emojis?.some((e) => 
    e.name === register('name').value
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      
      <div className="relative z-10 w-full max-w-md rounded-xl border bg-background p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add Custom Emoji</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="relative h-20 w-20 rounded-lg border bg-muted flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Preview" className="h-16 w-16 object-contain" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
          </div>

          {/* File input */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              {file ? 'Change Image' : 'Select Image'}
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">
              Max 2MB. PNG, JPG, GIF supported.
            </p>
          </div>

          {/* Name input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Emoji Name</label>
            <Input
              {...register('name')}
              placeholder="e.g., thumbsup, party, fire"
              error={errors.name?.message}
            />
            <p className="text-xs text-muted-foreground">
              Use letters, numbers, and underscores only
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={createEmoji.isPending} className="flex-1">
              Add Emoji
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
