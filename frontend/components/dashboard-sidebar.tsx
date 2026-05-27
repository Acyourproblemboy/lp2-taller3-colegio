"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const teacherNavItems: NavItem[] = [
  { label: "Panel Principal", href: "/dashboard/teacher", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Estudiantes", href: "/dashboard/teacher/students", icon: <Users className="w-5 h-5" /> },
  { label: "Asignar Notas", href: "/dashboard/teacher/grades", icon: <ClipboardList className="w-5 h-5" /> },
  { label: "Historial", href: "/dashboard/teacher/history", icon: <BookOpen className="w-5 h-5" /> },
]

const studentNavItems: NavItem[] = [
  { label: "Panel Principal", href: "/dashboard/student", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Mis Calificaciones", href: "/dashboard/student/grades", icon: <ClipboardList className="w-5 h-5" /> },
  { label: "Mi Perfil", href: "/dashboard/student/profile", icon: <Settings className="w-5 h-5" /> },
]

export function DashboardSidebar({ role }: { role: "maestro" | "estudiante" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const navItems = role === "maestro" ? teacherNavItems : studentNavItems

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const getInitials = (name: string) => {
    return name
      .split("_")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5 text-sidebar-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-sidebar-primary" />
            <span className="font-semibold text-sidebar-foreground">Colegio API</span>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          aria-label="Cambiar tema"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-sidebar-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-sidebar-foreground" />
          )}
        </button>
      </header>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sidebar-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-sidebar-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-sidebar-foreground text-sm">Colegio API</h1>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-4 h-4 text-sidebar-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-3 border-t border-sidebar-border space-y-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>{isDark ? "Modo Claro" : "Modo Oscuro"}</span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="w-9 h-9 bg-sidebar-accent">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                {user?.username ? getInitials(user.username) : "US"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.username || "Usuario"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "usuario@colegio.edu"}</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
    </>
  )
}
