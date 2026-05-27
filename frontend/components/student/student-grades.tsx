"use client"

import { useEffect, useState } from "react"
import { Search, Calendar, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getGradesByStudent, type Grade, getGradeStatus, calculateAverage } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

export function StudentGrades() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchGrades() {
      try {
        const data = await getGradesByStudent(user?.username || "maria_garcia")
        setGrades(data)
        setFilteredGrades(data)
      } catch (error) {
        console.error("Error fetching grades:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrades()
  }, [user?.username])

  useEffect(() => {
    const filtered = grades.filter(
      (grade) =>
        grade.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.teacher_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredGrades(filtered)
  }, [searchQuery, grades])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary"
    if (score >= 80) return "text-chart-2"
    if (score >= 70) return "text-chart-4"
    return "text-destructive"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-primary/10 border-primary/20"
    if (score >= 80) return "bg-chart-2/10 border-chart-2/20"
    if (score >= 70) return "bg-chart-4/10 border-chart-4/20"
    return "bg-destructive/10 border-destructive/20"
  }

  const getStatusBadge = (score: number) => {
    const status = getGradeStatus(score)
    const variants: Record<string, string> = {
      Excelente: "bg-primary/10 text-primary border-primary/20",
      Bueno: "bg-chart-2/10 text-chart-2 border-chart-2/20",
      Regular: "bg-chart-4/10 text-chart-4 border-chart-4/20",
      "Necesita mejorar": "bg-destructive/10 text-destructive border-destructive/20",
    }
    return (
      <Badge variant="outline" className={variants[status] || ""}>
        {status}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  const average = calculateAverage(grades)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mis Calificaciones</h1>
        <p className="text-muted-foreground mt-1">Revisa tu rendimiento académico por materia</p>
      </div>

      {/* Summary Card */}
      <Card className="bg-card border-border border-primary/30">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Promedio General</p>
              <p className={`text-3xl font-bold ${getScoreColor(average)}`}>{average}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Calificaciones</p>
              <p className="text-3xl font-bold text-card-foreground">{grades.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mejor Calificación</p>
              <p className="text-3xl font-bold text-primary">
                {grades.length > 0 ? Math.max(...grades.map((g) => g.score)) : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por materia o profesor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {/* Grades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGrades.map((grade) => (
          <Card
            key={grade.id}
            className={`bg-card border-border hover:border-primary/50 transition-all duration-200`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-card-foreground">{grade.subject}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <User className="w-3 h-3" />
                    {grade.teacher_name}
                  </CardDescription>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl border ${getScoreBgColor(
                    grade.score
                  )} ${getScoreColor(grade.score)}`}
                >
                  {grade.score}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{grade.date}</span>
                </div>
                {getStatusBadge(grade.score)}
              </div>
              {grade.comments && (
                <p className="text-sm text-muted-foreground mt-3 italic border-l-2 border-primary/30 pl-3">
                  &ldquo;{grade.comments}&rdquo;
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGrades.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron calificaciones</p>
        </div>
      )}
    </div>
  )
}
