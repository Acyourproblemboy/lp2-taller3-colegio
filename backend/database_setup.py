from typing import  Optional, List
from sqlmodel import Field, Relationship, SQLModel, create_engine, Session, select
from passlib.context import CryptContext
#Tablas modelos
class User(SQLModel, table=True): #tabla para manejar el acceso al sistema
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str
    role: str # estos seran los roles 'admin' o 'user', 'estudiante'
    
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

#Crear la base de datos y las tablas con sus llaves primarias y foraneas
sqlite_url = "sqlite:///colegio.db"
engine = create_engine(sqlite_url, echo=True)
#Se lee todos los modelos 
def crear_bd_and_tables():
    SQLModel.metadata.create_all(engine)
    print("***¡Base de datos y tablas creadas exitosamente!***")
   
#se añaden un usuario administrador 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin():
    with Session(engine) as session:
        # verificar si el usuario admin ya existe
        statement = select(User).where(User.username == "admin")
        admin_exists = session.exec(statement).first()
        
        if not admin_exists:
            admin_user = User(
                username="admin",
                password_hash=pwd_context.hash("andres123"),
                role="admin"
            )
            session.add(admin_user)
            session.commit()
            print("*** ¡Usuario admin creado exitosamente! ***")
            
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

# ejecutar la función para crear el admin y el estudiante
if __name__ == "__main__":    
    crear_bd_and_tables()
    create_admin()
    create_students()
