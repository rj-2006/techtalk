import { Routes, Route, useLocation } from 'react-router-dom'
import { useAuthStore } from './stores/auth-store'
import { AppLayout } from './components/layout/app-layout'
import { ProtectedRoute } from './components/layout/protected-route'
import { LoginPage } from './pages/auth/login-page'
import { RegisterPage } from './pages/auth/register-page'
import { ThreadListPage } from './pages/forum/thread-list-page'
import { ThreadDetailPage } from './pages/forum/thread-detail-page'
import { ChatPage } from './pages/chat/chat-page'
import { AnimatePresence, motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeOut' },
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageVariants.transition}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PageWrapper>
                <LoginPage />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PageWrapper>
                <RegisterPage />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/*"
          element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<PageWrapper><ThreadListPage /></PageWrapper>} />
                <Route path="/threads/:id" element={<PageWrapper><ThreadDetailPage /></PageWrapper>} />
                <Route path="/chat" element={<PageWrapper><ChatPage /></PageWrapper>} />
                <Route path="/chat/:id" element={<PageWrapper><ChatPage /></PageWrapper>} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default App
