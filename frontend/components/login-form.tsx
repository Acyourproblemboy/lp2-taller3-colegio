"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { login as apiLogin } from "@/lib/api"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await apiLogin(username, password)
      login(response.user, response.access_token)
      
      // Redirect based on role
      if (response.user.role === "maestro") {
        router.push("/dashboard/teacher")
      } else {
        router.push("/dashboard/student")
      }
    } catch {
      setError("Usuario o contraseña incorrectos")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Colegio API</h1>
            <p className="text-muted-foreground mt-1">Sistema de Gestión Escolar</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-card border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-card-foreground">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">Credenciales de prueba:</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <p className="font-medium text-foreground">Maestro</p>
                  <p className="text-muted-foreground">prof_rodriguez</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <p className="font-medium text-foreground">Estudiante</p>
                  <p className="text-muted-foreground">maria_garcia</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">Contraseña: cualquiera</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          &copy; 2024 Colegio API. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
