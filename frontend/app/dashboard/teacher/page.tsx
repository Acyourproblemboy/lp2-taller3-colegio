"use client"

import { AuthProvider } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard"

export default function TeacherDashboardPage() {
  return (
    <AuthProvider>
      <DashboardLayout role="maestro">
        <TeacherDashboard />
      </DashboardLayout>
    </AuthProvider>
  )
}
