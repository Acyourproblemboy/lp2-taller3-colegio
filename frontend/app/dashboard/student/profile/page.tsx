"use client"

import { AuthProvider } from "@/components/auth-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StudentProfile } from "@/components/student/student-profile"

export default function StudentProfilePage() {
  return (
    <AuthProvider>
      <DashboardLayout role="estudiante">
        <StudentProfile />
      </DashboardLayout>
    </AuthProvider>
  )
}
