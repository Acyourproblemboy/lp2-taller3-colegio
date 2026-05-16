from typing import  Optional, List
from sqlmodel import Field, Relationship, SQLModel, create_engine, Session

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
SQLModel.metadata.create_all(engine)
print("Base de datos y tablas creadas exitosamente")
