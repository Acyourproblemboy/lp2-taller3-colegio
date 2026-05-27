"use client"

import { AuthProvider } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TeacherHistory } from "@/components/teacher/teacher-history"

export default function TeacherHistoryPage() {
  return (
    <AuthProvider>
      <DashboardLayout role="maestro">
        <TeacherHistory />
      </DashboardLayout>
    </AuthProvider>
  )
}
