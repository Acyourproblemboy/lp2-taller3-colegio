"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { LoginResponse } from "@/lib/api"

interface User {
  id: number
  username: string
  role: "maestro" | "estudiante"
}

interface AuthContextType {
  user: User | null
  login: (user: User | LoginResponse, token?: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem("user")
    
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User | LoginResponse, token?: string) => {
    // Handle both User and LoginResponse types
    const user: User = {
      id: userData.id,
      username: userData.username,
      role: userData.role
    }
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
