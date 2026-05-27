"use client"

import { AuthProvider } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StudentDashboard } from "@/components/student/student-dashboard"

export default function StudentDashboardPage() {
  return (
    <AuthProvider>
      <DashboardLayout role="estudiante">
        <StudentDashboard />
      </DashboardLayout>
    </AuthProvider>
  )
}
