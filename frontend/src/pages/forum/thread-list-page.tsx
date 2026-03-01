import { useState } from 'react'
import { useThreads, useCreateThread, useAddReaction, useRemoveReaction } from '../../hooks/use-threads'
import { useAuthStore } from '../../stores/auth-store'
import { PageContainer, PageHeader, PageTitle, PageDescription, PageActions } from '../../components/layout/page-container'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { ThreadCard } from '../../components/forum/thread-card'
import { ThreadListSkeleton } from '../../components/forum/thread-skeleton'
import { CreateThreadModal } from '../../components/forum/create-thread-modal'
import { EmptyState } from '../../components/layout/protected-route'

export function ThreadListPage() {
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const { data, isLoading, error } = useThreads({ search })
  const createThread = useCreateThread()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const handleCreateThread = async (data: { title: string; content?: string; images?: File[] }) => {
    await createThread.mutateAsync(data)
  }

  const handleAddReaction = (threadId: number) => (emoji: string) => {
    if (!isAuthenticated) return
    // This would need to be connected to the thread-specific mutation
  }

  const handleRemoveReaction = (threadId: number) => (emoji: string) => {
    if (!isAuthenticated) return
  }

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>Forum</PageTitle>
          <PageDescription>Discuss tech projects and collaborate with others</PageDescription>
        </div>
        <PageActions>
          {isAuthenticated && (
            <Button onClick={() => setShowCreateModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Thread
            </Button>
          )}
        </PageActions>
      </PageHeader>

      <div className="px-6 py-4">
        {/* Search */}
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search threads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <ThreadListSkeleton />
        ) : error ? (
          <EmptyState
            title="Failed to load threads"
            description="Something went wrong. Please try again."
          />
        ) : data?.data && data.data.length > 0 ? (
          <div className="space-y-4">
            {data.data.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                onAddReaction={handleAddReaction(thread.id)}
                onRemoveReaction={handleRemoveReaction(thread.id)}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        ) : search ? (
          <EmptyState
            title="No threads found"
            description="Try a different search term"
          />
        ) : (
          <EmptyState
            title="No threads yet"
            description="Be the first to start a discussion"
            action={
              isAuthenticated ? (
                <Button onClick={() => setShowCreateModal(true)}>
                  Create Thread
                </Button>
              ) : undefined
            }
          />
        )}
      </div>

      <CreateThreadModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateThread}
        isLoading={createThread.isPending}
      />
    </PageContainer>
  )
}
