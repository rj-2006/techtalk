import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth-store'
import { AppLayout } from './components/layout/app-layout'
import { AuthLayout } from './components/layout/app-layout'
import { ProtectedRoute } from './components/layout/protected-route'
import { ErrorBoundary } from './components/error-boundary'
import { NavigationLoader } from './components/navigation-loader'
import { LoginPage } from './pages/auth/login-page'
import { RegisterPage } from './pages/auth/register-page'
import { ThreadListPage } from './pages/forum/thread-list-page'
import { ThreadDetailPage } from './pages/forum/thread-detail-page'
import { ChatPage } from './pages/chat/chat-page'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <ErrorBoundary>
      <NavigationLoader />
      <Routes>
      {/* Public routes - redirect to home if already logged in */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
        }
      />

      {/* Protected routes - require authentication */}
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ThreadListPage />} />
        <Route path="threads/:id" element={<ThreadDetailPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="chat/:id" element={<ChatPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </ErrorBoundary>
  )
}

export default App
