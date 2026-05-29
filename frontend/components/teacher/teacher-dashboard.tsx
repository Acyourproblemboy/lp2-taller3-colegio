"use client"

import { useEffect, useState } from "react"
import { Users, BookOpen, ClipboardList, TrendingUp, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStudents, getGradesByTeacher, type Student, type Grade, calculateAverage } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: string
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-card-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
          {trend && <span className="text-primary ml-1">{trend}</span>}
        </p>
      </CardContent>
    </Card>
  )
}

function RecentGradesTable({ grades }: { grades: Grade[] }) {
  const recentGrades = grades.slice(0, 5)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Calificaciones Recientes</CardTitle>
        <CardDescription>Las últimas notas asignadas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentGrades.map((grade) => (
            <div
              key={grade.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
            >
              <div className="flex-1">
                <p className="font-medium text-card-foreground text-sm">{grade.student_name}</p>
                <p className="text-xs text-muted-foreground">{grade.subject}</p>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold text-lg ${
                    grade.score >= 90
                      ? "text-primary"
                      : grade.score >= 70
                      ? "text-chart-4"
                      : "text-destructive"
                  }`}
                >
                  {grade.score}
                </p>
                <p className="text-xs text-muted-foreground">{grade.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function StudentsList({ students }: { students: Student[] }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Estudiantes</CardTitle>
        <CardDescription>Lista de estudiantes activos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {students.slice(0, 5).map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                {student.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-card-foreground text-sm truncate">{student.full_name}</p>
                <p className="text-xs text-muted-foreground">{student.grade}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsData, gradesData] = await Promise.all([
          getStudents(),
          getGradesByTeacher(user?.username || "prof_rodriguez"),
        ])
        setStudents(studentsData)
        setGrades(gradesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.username])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  const averageScore = calculateAverage(grades)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel de Control</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido, {user?.username?.replace("_", " ") || "Profesor"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Estudiantes"
          value={students.length}
          description="Estudiantes activos"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Calificaciones"
          value={grades.length}
          description="Notas asignadas"
          icon={<ClipboardList className="w-4 h-4" />}
        />
        <StatCard
          title="Promedio General"
          value={averageScore}
          description="De todas las notas"
          icon={<TrendingUp className="w-4 h-4" />}
          trend="+2.5%"
        />
        <StatCard
          title="Materias"
          value={new Set(grades.map((g) => g.subject)).size}
          description="Materias impartidas"
          icon={<BookOpen className="w-4 h-4" />}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentGradesTable grades={grades} />
        <StudentsList students={students} />
      </div>
    </div>
  )
}
