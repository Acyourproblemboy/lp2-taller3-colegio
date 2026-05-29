"use client"

import { useEffect, useState } from "react"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getStudents, createGrade, type Student } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

const subjects = ["Matemáticas", "Español", "Ciencias", "Historia", "Inglés", "Educación Física", "Arte", "Música"]

interface StudentWithUsername extends Student {
  username: string
}

export function TeacherGrades() {
  const { user } = useAuth()
  const [students, setStudents] = useState<StudentWithUsername[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [formData, setFormData] = useState({
    student_id: "",
    subject: "",
    score: "",
    comments: "",
  })

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await getStudents()
        setStudents(data as StudentWithUsername[])
      } catch (error) {
        console.error("Error fetching students:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setNotification(null)

    try {
      const selectedStudent = students.find(s => s.id.toString() === formData.student_id)
      if (!selectedStudent) {
        throw new Error("Estudiante no encontrado")
      }

      await createGrade({
        teacher_username: user?.username || "",
        student_username: selectedStudent.username,
        subject: formData.subject,
        score: parseFloat(formData.score),
      })

      setNotification({ type: "success", message: "Calificación registrada exitosamente" })
      setFormData({ student_id: "", subject: "", score: "", comments: "" })
    } catch (error) {
      setNotification({ type: "error", message: error instanceof Error ? error.message : "Error al registrar la calificación" })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setNotification(null), 5000)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Asignar Calificaciones</h1>
        <p className="text-muted-foreground mt-1">Registra las calificaciones de tus estudiantes</p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg border flex items-center gap-3 shadow-lg animate-in slide-in-from-right ${
            notification.type === "success"
              ? "bg-primary/10 border-primary/20 text-primary"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Form Card */}
      <Card className="bg-card border-border max-w-2xl">
        <CardHeader>
          <CardTitle className="text-card-foreground">Nueva Calificación</CardTitle>
          <CardDescription>Completa el formulario para registrar una nota</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Select */}
            <div className="space-y-2">
              <Label htmlFor="student" className="text-foreground">
                Estudiante
              </Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => setFormData({ ...formData, student_id: value })}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Selecciona un estudiante" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.full_name} - {student.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject Select */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-foreground">
                Materia
              </Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData({ ...formData, subject: value })}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Score Input */}
            <div className="space-y-2">
              <Label htmlFor="score" className="text-foreground">
                Calificación (0-100)
              </Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="Ej: 85"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                className="bg-input border-border"
                required
              />
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="text-foreground">
                Comentarios (opcional)
              </Label>
              <Textarea
                id="comments"
                placeholder="Añade observaciones sobre el desempeño del estudiante..."
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="bg-input border-border resize-none"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting || !formData.student_id || !formData.subject || !formData.score}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Registrar Calificación"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
