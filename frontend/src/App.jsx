import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores/auth-store'
import { AppLayout } from './components/layout/app-layout'
import { ProtectedRoute } from './components/layout/protected-route'
import { LoginPage } from './pages/auth/login-page'
import { RegisterPage } from './pages/auth/register-page'
import { ThreadListPage } from './pages/forum/thread-list-page'
import { ThreadDetailPage } from './pages/forum/thread-detail-page'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <RegisterPage />
          </ProtectedRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <AppLayout>
            <Routes>
              <Route path="/" element={<ThreadListPage />} />
              <Route path="/threads/:id" element={<ThreadDetailPage />} />
            </Routes>
          </AppLayout>
        }
      />
    </Routes>
  )
}

export default App
