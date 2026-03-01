import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { queryClient } from './lib/query-provider'
import { useAuthStore } from './stores/auth-store'
import './index.css'
import App from './App'

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading TechTalk...</p>
      </div>
    </div>
  )
}

function AppLoader() {
  const isLoading = useAuthStore((state) => state.isLoading)
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowLoading(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (showLoading && isLoading) {
    return <LoadingScreen />
  }

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider
          defaultTheme="system"
          storageKey="techtalk-theme"
        >
          <AppLoader />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
