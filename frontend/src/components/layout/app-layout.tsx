import * as React from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { cn } from "../../lib/utils"
import { Sidebar } from "./sidebar"
import { TopNavbar } from "./top-navbar"
import { useAuthStore } from "../../stores/auth-store"

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const ForumIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.993 1.993 0 01-1-1.75V5.25A1.993 1.993 0 019 4H5a2 2 0 00-2 2v6a2 2 0 001 2h2v4l.5-.5z" />
  </svg>
)

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const defaultNavSections = [
  {
    title: "Menu",
    items: [
      { label: "Home", href: "/", icon: <HomeIcon /> },
      { label: "Forum", href: "/", icon: <ForumIcon /> },
      { label: "Chat", href: "/chat", icon: <ChatIcon /> },
    ],
  },
]

export function AppLayout({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const navigate = useNavigate()
  
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className={cn("flex h-screen w-full bg-background", className)}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          navSections={defaultNavSections}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar
              navSections={defaultNavSections}
              onCollapsedChange={() => {}}
              className="h-full"
            />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md",
              "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              "lg:hidden"
            )}
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <TopNavbar.Search placeholder="Search..." />

          <TopNavbar.Content>
            <TopNavbar.Action>
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </TopNavbar.Action>
            <TopNavbar.User 
              name={user?.username || "User"} 
              onClick={handleLogout}
            />
          </TopNavbar.Content>
        </TopNavbar>

        {/* Page Content */}
        <div className="flex flex-1 overflow-hidden">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  )
}

export function AuthLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-screen w-full items-center justify-center",
        "bg-background p-4",
        className
      )}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">T</span>
            </div>
            <span className="text-xl font-semibold">TechTalk</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
