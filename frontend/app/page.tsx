import { AuthProvider } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
