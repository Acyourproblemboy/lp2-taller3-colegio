"use client"

import { useEffect, useState } from "react"
import { Mail, GraduationCap, User, Calendar, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getGradesByStudent, type Grade, calculateAverage, getGradeStatus } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

export function StudentProfile() {
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

  const getInitials = (name: string) => {
    return name
      .split("_")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    )
  }

  const average = calculateAverage(grades)
  const status = getGradeStatus(average)
  const highestGrade = grades.length > 0 ? Math.max(...grades.map((g) => g.score)) : 0
  const lowestGrade = grades.length > 0 ? Math.min(...grades.map((g) => g.score)) : 0
  const subjects = new Set(grades.map((g) => g.subject)).size

  const formatName = (username: string) => {
    return username
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">Información personal y resumen académico</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user?.username ? getInitials(user.username) : "US"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-card-foreground">
                {user?.username ? formatName(user.username) : "Estudiante"}
              </h2>
              <p className="text-muted-foreground text-sm">@{user?.username || "estudiante"}</p>
              <Badge variant="secondary" className="mt-3 bg-primary/10 text-primary border-primary/20">
                Estudiante
              </Badge>

              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-card-foreground">{user?.email || "usuario@colegio.edu"}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-card-foreground">3ro Secundaria</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-card-foreground">Ciclo 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Summary */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Resumen Académico</CardTitle>
            <CardDescription>Tu desempeño durante el ciclo actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border text-center">
                <p className="text-2xl font-bold text-primary">{average}</p>
                <p className="text-xs text-muted-foreground mt-1">Promedio</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border text-center">
                <p className="text-2xl font-bold text-card-foreground">{grades.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Calificaciones</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border text-center">
                <p className="text-2xl font-bold text-card-foreground">{highestGrade}</p>
                <p className="text-xs text-muted-foreground mt-1">Mejor Nota</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border text-center">
                <p className="text-2xl font-bold text-card-foreground">{subjects}</p>
                <p className="text-xs text-muted-foreground mt-1">Materias</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold text-card-foreground">Estado Académico: {status}</p>
                  <p className="text-sm text-muted-foreground">
                    {average >= 90
                      ? "Felicitaciones, mantienes un excelente rendimiento académico."
                      : average >= 80
                      ? "Buen trabajo, sigue esforzándote para alcanzar la excelencia."
                      : average >= 70
                      ? "Tu rendimiento es regular, enfócate en mejorar tus calificaciones."
                      : "Necesitas mejorar tu rendimiento, busca apoyo de tus profesores."}
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Breakdown */}
            <div className="mt-6">
              <h3 className="font-semibold text-card-foreground mb-3">Calificaciones por Materia</h3>
              <div className="space-y-2">
                {Array.from(new Set(grades.map((g) => g.subject))).map((subject) => {
                  const subjectGrades = grades.filter((g) => g.subject === subject)
                  const subjectAvg = calculateAverage(subjectGrades)
                  return (
                    <div
                      key={subject}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border"
                    >
                      <span className="text-card-foreground">{subject}</span>
                      <span
                        className={`font-bold ${
                          subjectAvg >= 90
                            ? "text-primary"
                            : subjectAvg >= 80
                            ? "text-chart-2"
                            : subjectAvg >= 70
                            ? "text-chart-4"
                            : "text-destructive"
                        }`}
                      >
                        {subjectAvg}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
