import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number
}

interface NavSection {
  title?: string
  items: NavItem[]
}

interface SidebarProps {
  navSections: NavSection[]
  className?: string
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

interface SidebarItemProps {
  item: NavItem
  collapsed?: boolean
  active?: boolean
}

function SidebarItem({ item, collapsed, active }: SidebarItemProps) {
  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? item.label : undefined}
    >
      <span className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-5 w-5")}>
        {item.icon}
      </span>
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  )
}

export function Sidebar({
  navSections,
  className,
  collapsed = false,
  onCollapsedChange,
}: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-200",
        collapsed ? "w-[72px]" : "w-[260px]",
        className
      )}
    >
      {/* Logo / Brand */}
      <div className={cn(
        "flex h-14 items-center border-b px-4",
        collapsed ? "justify-center" : "gap-2"
      )}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">T</span>
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold">TechTalk</span>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-6">
          {navSections.map((section, sectionIndex) => (
            <div key={section.title || sectionIndex}>
              {section.title && !collapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h3>
              )}
              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.href}
                    item={item}
                    collapsed={collapsed}
                    active={location.pathname === item.href}
                  />
                ))}
              </div>
              {sectionIndex < navSections.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse Toggle */}
      {onCollapsedChange && (
        <div className="border-t p-3">
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      )}
    </aside>
  )
}
