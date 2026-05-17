from sqlmodel import Session, select
from database_setup import engine, Student, Grade

#funcion para llenar las notas de los estudiantes
def llenar_notas():
    with Session(engine) as session:
        #verificar los estudiantes existentes con el Id
        
        students = session.exec(select(Student)).all()
        
        if not students:
            print("*** ¡No hay estudiantes para llenar notas! ***")
            return
        #se definen las materias y las notas para cada estudiante
        materias = ["Matemáticas", "Ciencias", "Historia", "Literatura"]
        for student in students:
            for materia in materias:
                grade = Grade(
                    student_id=student.id,
                    subject=materia,
                    score=round(60 + 40 * (student.id % 5) / 4, 2) # Nota aleatoria entre 60 y 100
                )
                session.add(grade)
        session.commit()
        print("*** ¡Notas llenadas exitosamente! ***")
if __name__ == "__main__":
    llenar_notas()
    