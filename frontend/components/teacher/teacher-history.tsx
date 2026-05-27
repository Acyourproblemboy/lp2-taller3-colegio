"use client"

import { useEffect, useState } from "react"
import { Search, Calendar, User, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getGradesByTeacher, type Grade, getGradeStatus } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

export function TeacherHistory() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchGrades() {
      try {
        const data = await getGradesByTeacher(user?.username || "prof_rodriguez")
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
        grade.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredGrades(filtered)
  }, [searchQuery, grades])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary"
    if (score >= 80) return "text-chart-2"
    if (score >= 70) return "text-chart-4"
    return "text-destructive"
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
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Historial de Calificaciones</h1>
        <p className="text-muted-foreground mt-1">Revisa todas las notas que has asignado</p>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por estudiante o materia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filteredGrades.length} calificaciones</span>
        </div>
      </div>

      {/* Table Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Registro de Notas</CardTitle>
          <CardDescription>Historial completo de calificaciones asignadas</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile View */}
          <div className="lg:hidden space-y-4">
            {filteredGrades.map((grade) => (
              <div key={grade.id} className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-card-foreground">{grade.student_name}</span>
                  </div>
                  <span className={`font-bold text-xl ${getScoreColor(grade.score)}`}>{grade.score}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>{grade.subject}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{grade.date}</span>
                  </div>
                  {getStatusBadge(grade.score)}
                </div>
                {grade.comments && (
                  <p className="text-sm text-muted-foreground italic">&ldquo;{grade.comments}&rdquo;</p>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Estudiante</TableHead>
                  <TableHead className="text-muted-foreground">Materia</TableHead>
                  <TableHead className="text-muted-foreground">Calificación</TableHead>
                  <TableHead className="text-muted-foreground">Estado</TableHead>
                  <TableHead className="text-muted-foreground">Fecha</TableHead>
                  <TableHead className="text-muted-foreground">Comentarios</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade) => (
                  <TableRow key={grade.id} className="border-border">
                    <TableCell className="font-medium text-card-foreground">{grade.student_name}</TableCell>
                    <TableCell className="text-muted-foreground">{grade.subject}</TableCell>
                    <TableCell className={`font-bold ${getScoreColor(grade.score)}`}>{grade.score}</TableCell>
                    <TableCell>{getStatusBadge(grade.score)}</TableCell>
                    <TableCell className="text-muted-foreground">{grade.date}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {grade.comments || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredGrades.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron calificaciones</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
