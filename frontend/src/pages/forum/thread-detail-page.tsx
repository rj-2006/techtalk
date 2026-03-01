import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useThread, useCreatePost, useAddReaction, useRemoveReaction } from '../../hooks/use-threads'
import { useAuthStore } from '../../stores/auth-store'
import { PageContainer, PageContent } from '../../components/layout/page-container'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '../../lib/utils'
import { ReactionButton } from '../../components/forum/reaction-button'
import { ThreadDetailSkeleton } from '../../components/forum/thread-skeleton'
import { EmptyState } from '../../components/layout/protected-route'

export function ThreadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const threadId = Number(id)
  const [newPost, setNewPost] = useState('')
  
  const { data: thread, isLoading, error } = useThread(threadId)
  const createPost = useCreatePost(threadId)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const userId = useAuthStore((state) => state.user?.id)

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim() || !isAuthenticated) return
    
    await createPost.mutateAsync(newPost)
    setNewPost('')
  }

  const handleAddReaction = (emoji: string) => {
    if (!isAuthenticated) return
  }

  const handleRemoveReaction = (emoji: string) => {
    if (!isAuthenticated) return
  }

  const reactions = thread?.reactions ? thread.reactions.reduce((acc, reaction) => {
    const existing = acc.find((r) => r.emoji === reaction.emoji)
    if (existing) {
      existing.count++
      if (reaction.user_id === userId) {
        existing.hasReacted = true
      }
    } else {
      acc.push({
        emoji: reaction.emoji,
        count: 1,
        hasReacted: reaction.user_id === userId,
      })
    }
    return acc
  }, [] as { emoji: string; count: number; hasReacted: boolean }[]) : []

  if (isLoading) {
    return (
      <PageContainer>
        <PageContent>
          <ThreadDetailSkeleton />
        </PageContent>
      </PageContainer>
    )
  }

  if (error || !thread) {
    return (
      <PageContainer>
        <PageContent>
          <EmptyState
            title="Thread not found"
            description="This thread may have been deleted or doesn't exist"
          />
        </PageContent>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageContent>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Thread */}
          <article className="rounded-lg border bg-card p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                {thread.user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div>
                <Link
                  to={`/user/${thread.user?.username}`}
                  className="font-medium hover:underline"
                >
                  {thread.user?.username}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>

            {/* Images */}
            {thread.images && thread.images.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-2">
                {thread.images.map((image, index) => (
                  <img
                    key={image.id || index}
                    src={image.url}
                    alt={image.caption || ''}
                    className={cn(
                      'rounded-md object-cover',
                      thread.images!.length === 1 ? 'max-h-96 w-full' : 'h-48 w-full'
                    )}
                  />
                ))}
              </div>
            )}

            {/* Reactions */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <ReactionButton
                reactions={reactions}
                onAddReaction={handleAddReaction}
                onRemoveReaction={handleRemoveReaction}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </article>

          {/* Posts */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {thread.posts?.length || 0} {thread.posts?.length === 1 ? 'Reply' : 'Replies'}
            </h2>

            {/* Create Post Form */}
            {isAuthenticated ? (
              <form onSubmit={handleSubmitPost} className="rounded-lg border bg-card p-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Write a reply..."
                  className={cn(
                    'flex w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm',
                    'placeholder:text-muted-foreground',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                    'min-h-[100px]'
                  )}
                />
                <div className="flex justify-end mt-2">
                  <Button type="submit" disabled={!newPost.trim() || createPost.isPending}>
                    Reply
                  </Button>
                </div>
              </form>
            ) : (
              <div className="rounded-lg border bg-card p-4 text-center">
                <p className="text-muted-foreground">
                  <Link to="/login" className="text-primary hover:underline">Sign in</Link> to reply
                </p>
              </div>
            )}

            {/* Posts List */}
            {thread.posts && thread.posts.length > 0 ? (
              <div className="space-y-4">
                {thread.posts.map((post) => (
                  <article key={post.id} className="rounded-lg border bg-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium text-sm">
                        {post.user?.username?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <div>
                        <Link
                          to={`/user/${post.user?.username}`}
                          className="font-medium hover:underline text-sm"
                        >
                          {post.user?.username}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No replies yet. Be the first to respond!
              </p>
            )}
          </div>
        </div>
      </PageContent>
    </PageContainer>
  )
}
