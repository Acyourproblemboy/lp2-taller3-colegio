"use client"

import { AuthProvider } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TeacherGrades } from "@/components/teacher/teacher-grades"

export default function TeacherGradesPage() {
  return (
    <AuthProvider>
      <DashboardLayout role="maestro">
        <TeacherGrades />
      </DashboardLayout>
    </AuthProvider>
  )
}
