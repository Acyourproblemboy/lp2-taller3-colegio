"use client"

import { useEffect, useState } from "react"
import { Search, Mail, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getStudents, type Student } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await getStudents()
        setStudents(data)
        setFilteredStudents(data)
      } catch (error) {
        console.error("Error fetching students:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.grade.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredStudents(filtered)
  }, [searchQuery, students])

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
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estudiantes</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona y visualiza la información de tus estudiantes
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o grado..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                  {student.name.charAt(0)}
                </div>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  {student.grade}
                </Badge>
              </div>
              <CardTitle className="text-card-foreground mt-3">{student.name}</CardTitle>
              <CardDescription className="text-muted-foreground">@{student.username}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>{student.grade}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron estudiantes</p>
        </div>
      )}
    </div>
  )
}
