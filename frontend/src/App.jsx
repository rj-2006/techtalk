import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth-store'
import { AppLayout } from './components/layout/app-layout'
import { ProtectedRoute } from './components/layout/protected-route'
import { LoginPage } from './pages/auth/login-page'
import { RegisterPage } from './pages/auth/register-page'

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
              <Route path="/" element={<HomePage />} />
            </Routes>
          </AppLayout>
        }
      />
    </Routes>
  )
}

function HomePage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Welcome to TechTalk</h1>
        <p className="mt-2 text-muted-foreground">
          Your hub for tech collaboration
        </p>
      </div>
    </div>
  )
}

export default App
