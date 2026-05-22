import os
from typing import Optional, List
from sqlmodel import Field, Relationship, SQLModel, create_engine, Session, select
from passlib.context import CryptContext
# Tablas modelos
class User(SQLModel, table=True): #tabla para manejar el acceso al sistema
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str
    role: str # estos serán los roles 'maestro' o 'estudiante'
    
class Student(SQLModel, table=True): #tabla para manejar la informacion de los estudiantes
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    grade: str
    user_id: Optional[int] =Field(default=None, foreign_key= "user.id") #relacion con la tabla de usuarios
    
class Grade(SQLModel, table=True): #tabla para manejar las calificaciones de los estudiantes
    id: Optional[int] = Field(default=None, primary_key=True)
    subject: str
    score: float
    student_id: Optional[int] = Field(foreign_key="student.id")
    #se actualiza la tabla de calificaciones para relacionarla con los profesores.
    teacher_id: Optional[int] = Field(default=None, foreign_key="teacher.id")

class Teacher(SQLModel, table=True): #tabla para manejar la informacion de los maestros
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    specialty: str
    user_id: Optional[int] =Field(default=None, foreign_key= "user.id") #relacion con la tabla de usuarios
    
# Crear la base de datos y las tablas con sus llaves primarias y foraneas
sqlite_url = os.getenv("COLEGIO_DB_URL", "sqlite:///backend/colegio.db")
engine = create_engine(sqlite_url, echo=True)
# Se lee todos los modelos
def crear_bd_and_tables():
    SQLModel.metadata.create_all(engine)
    print("***¡Base de datos y tablas creadas exitosamente!***")
   
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#crear estudiantes 
def create_students():
    with Session(engine) as session:
        #verificar si el estudiante ya existe para evitar duplicados
        if session.exec(select(Student)).first():
            print("*** ¡Estudiante ya existe! ***")
            return
            
        # Crear el usuario para el estudiante
        user_student = User(
            username="juanperez",
            password_hash=pwd_context.hash("juan123"), 
            role="estudiante"
        )
        session.add(user_student)
        session.commit() # Guardamos para obtener el ID
        session.refresh(user_student)

        #Crear el estudiante usando el ID del usuario recién creado
        student1 = Student(     
        
            full_name="Juan Perez", 
            grade="10mo grado", 
            user_id=user_student.id # Usamos el ID dinámico
        )
        session.add(student1)
        session.commit()
        print("*** ¡Estudiante creado exitosamente! ***")

def create_teachers():
    with Session(engine) as session:
        #verificar si el maestro ya existe para evitar duplicados
        if session.exec(select(Teacher)).first():
            print("*** ¡Maestro ya existe! ***")
            return
            
        # Crear el usuario para el maestro
        user_teacher = User(
            username="mariarodriguez",
            password_hash=pwd_context.hash("maria123"), 
            role="maestro"
        )
        session.add(user_teacher)
        session.commit() # Guardamos para obtener el ID
        session.refresh(user_teacher)

        #Crear el maestro usando el ID del usuario recién creado
        teacher1 = Teacher(     
        
            full_name="Maria Rodriguez", 
            specialty="Matemáticas", 
            user_id=user_teacher.id # Usamos el ID dinámico
        )
        session.add(teacher1)
        session.commit()
        print("*** ¡Maestro creado exitosamente! ***")
        
# Función para agregar notas vinculadas a un profesor y a un estudiante
def add_grade_by_teacher(teacher_username: str, student_username: str, subject: str, score: float):
    with Session(engine) as session:
        teacher_user = session.exec(select(User).where(User.username == teacher_username)).first()
        student_user = session.exec(select(User).where(User.username == student_username)).first()

        if not teacher_user:
            print(f"*** No se encontró el usuario del profesor '{teacher_username}' ***")
            return
        if not student_user:
            print(f"*** No se encontró el usuario del estudiante '{student_username}' ***")
            return

        teacher = session.exec(select(Teacher).where(Teacher.user_id == teacher_user.id)).first()
        student = session.exec(select(Student).where(Student.user_id == student_user.id)).first()

        if not teacher or not student:
            print("*** Verifica que el profesor y el estudiante existan y estén relacionados con usuarios válidos. ***")
            return

        grade = Grade(
            subject=subject,
            score=score,
            student_id=student.id,
            teacher_id=teacher.id
        )
        session.add(grade)
        session.commit()
        print(f"*** ¡Nota registrada para {student.full_name} con el profesor {teacher.full_name}! ***")

# Función para crear notas de ejemplo por profesor
def create_grades():
    with Session(engine) as session:
        if session.exec(select(Grade)).first():
            print("*** ¡Las notas ya existen! ***")
            return

    add_grade_by_teacher("mariarodriguez", "juanperez", "Matemáticas", 9.5)
    add_grade_by_teacher("mariarodriguez", "juanperez", "Física", 8.7)
    add_grade_by_teacher("mariarodriguez", "juanperez", "Química", 9.0)

# ejecutar la función para crear los datos iniciales
if __name__ == "__main__":    
    crear_bd_and_tables()
    create_students()
    create_teachers()
    create_grades()
