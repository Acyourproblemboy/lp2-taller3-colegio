"use client"

import { useEffect, useState } from "react"
import { BookOpen, TrendingUp, Award, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getGradesByStudent, type Grade, calculateAverage, getGradeStatus } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  highlight?: boolean
}

function StatCard({ title, value, description, icon, highlight }: StatCardProps) {
  return (
    <Card className={`bg-card border-border ${highlight ? "border-primary/50" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            highlight ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${highlight ? "text-primary" : "text-card-foreground"}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

function AverageIndicator({ average }: { average: number }) {
  const getAverageColor = (avg: number) => {
    if (avg >= 90) return "text-primary"
    if (avg >= 80) return "text-chart-2"
    if (avg >= 70) return "text-chart-4"
    return "text-destructive"
  }

  const status = getGradeStatus(average)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Promedio General</CardTitle>
        <CardDescription>Tu rendimiento académico actual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(average / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                className={getAverageColor(average)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getAverageColor(average)}`}>{average}</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className={`text-lg font-semibold ${getAverageColor(average)}`}>{status}</p>
          <p className="text-sm text-muted-foreground">
            {average >= 90
              ? "Sigue así, excelente trabajo"
              : average >= 70
              ? "Buen progreso, sigue mejorando"
              : "Necesitas enfocarte más en tus estudios"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentGrades({ grades }: { grades: Grade[] }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-primary/10 text-primary border-primary/20"
    if (score >= 80) return "bg-chart-2/10 text-chart-2 border-chart-2/20"
    if (score >= 70) return "bg-chart-4/10 text-chart-4 border-chart-4/20"
    return "bg-destructive/10 text-destructive border-destructive/20"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Calificaciones Recientes</CardTitle>
        <CardDescription>Tus últimas notas registradas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {grades.slice(0, 5).map((grade) => (
            <div
              key={grade.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
            >
              <div className="flex-1">
                <p className="font-medium text-card-foreground">{grade.subject}</p>
                <p className="text-xs text-muted-foreground">Prof. {grade.teacher_name}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-lg font-bold text-lg border ${getScoreColor(grade.score)}`}
              >
                {grade.score}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SubjectProgress({ grades }: { grades: Grade[] }) {
  const subjectScores = grades.reduce((acc, grade) => {
    if (!acc[grade.subject]) {
      acc[grade.subject] = []
    }
    acc[grade.subject].push(grade.score)
    return acc
  }, {} as Record<string, number[]>)

  const subjectAverages = Object.entries(subjectScores).map(([subject, scores]) => ({
    subject,
    average: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
  }))

  const getProgressColor = (avg: number) => {
    if (avg >= 90) return "bg-primary"
    if (avg >= 80) return "bg-chart-2"
    if (avg >= 70) return "bg-chart-4"
    return "bg-destructive"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Progreso por Materia</CardTitle>
        <CardDescription>Tu desempeño en cada asignatura</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjectAverages.map(({ subject, average }) => (
          <div key={subject} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-card-foreground font-medium">{subject}</span>
              <span className="text-muted-foreground">{average}/100</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(average)}`}
                style={{ width: `${average}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function StudentDashboard() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchData() {
      try {
        const gradesData = await getGradesByStudent(user?.username || "maria_garcia")
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

  const average = calculateAverage(grades)
  const highestGrade = grades.length > 0 ? Math.max(...grades.map((g) => g.score)) : 0
  const subjects = new Set(grades.map((g) => g.subject)).size

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Panel</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido, {user?.username?.replace("_", " ") || "Estudiante"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Promedio General"
          value={average}
          description="De todas tus calificaciones"
          icon={<TrendingUp className="w-4 h-4" />}
          highlight
        />
        <StatCard
          title="Mejor Calificación"
          value={highestGrade}
          description="Tu nota más alta"
          icon={<Award className="w-4 h-4" />}
        />
        <StatCard
          title="Total Materias"
          value={subjects}
          description="Materias cursadas"
          icon={<BookOpen className="w-4 h-4" />}
        />
        <StatCard
          title="Calificaciones"
          value={grades.length}
          description="Notas registradas"
          icon={<Target className="w-4 h-4" />}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AverageIndicator average={average} />
        <RecentGrades grades={grades} />
        <SubjectProgress grades={grades} />
      </div>
    </div>
  )
}
