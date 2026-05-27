"use client"

import { AuthProvider } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StudentGrades } from "@/components/student/student-grades"

export default function StudentGradesPage() {
  return (
    <AuthProvider>
      <DashboardLayout role="estudiante">
        <StudentGrades />
      </DashboardLayout>
    </AuthProvider>
  )
}
