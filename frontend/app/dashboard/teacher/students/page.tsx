"use client"

import { AuthProvider } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TeacherStudents } from "@/components/teacher/teacher-students"

export default function TeacherStudentsPage() {
  return (
    <AuthProvider>
      <DashboardLayout role="maestro">
        <TeacherStudents />
      </DashboardLayout>
    </AuthProvider>
  )
}
