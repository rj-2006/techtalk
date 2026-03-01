import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface TopNavbarProps {
  className?: string
  children?: React.ReactNode
}

export function TopNavbar({ className, children }: TopNavbarProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6",
        className
      )}
    >
      {children}
    </header>
  )
}

interface TopNavbarBrandProps {
  className?: string
  children?: React.ReactNode
}

export function TopNavbarBrand({ className, children }: TopNavbarBrandProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  )
}

interface TopNavbarContentProps {
  className?: string
  children?: React.ReactNode
}

export function TopNavbarContent({ className, children }: TopNavbarContentProps) {
  return (
    <div className={cn("flex flex-1 items-center justify-end gap-2", className)}>
      {children}
    </div>
  )
}

interface TopNavbarSearchProps {
  className?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function TopNavbarSearch({
  className,
  placeholder = "Search...",
  value,
  onChange,
}: TopNavbarSearchProps) {
  return (
    <div className={cn("relative", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-9",
          "text-sm shadow-sm transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
    </div>
  )
}

interface TopNavbarActionProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
  asChild?: boolean
}

export function TopNavbarAction({
  className,
  children,
  onClick,
}: TopNavbarActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md",
        "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        "transition-colors",
        className
      )}
    >
      {children}
    </button>
  )
}

interface TopNavbarUserProps {
  className?: string
  name?: string
  email?: string
  avatar?: string
  onClick?: () => void
}

export function TopNavbarUser({
  className,
  name,
  email,
  avatar,
  onClick,
}: TopNavbarUserProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5",
        "hover:bg-accent transition-colors",
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium text-primary-foreground">
            {name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        )}
      </div>
      <div className="hidden flex-col items-start text-left text-sm lg:flex">
        <span className="font-medium">{name}</span>
        {email && (
          <span className="text-xs text-muted-foreground">{email}</span>
        )}
      </div>
    </button>
  )
}

TopNavbar.Brand = TopNavbarBrand
TopNavbar.Content = TopNavbarContent
TopNavbar.Search = TopNavbarSearch
TopNavbar.Action = TopNavbarAction
TopNavbar.User = TopNavbarUser
