from typing import Generator, List, Optional

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, SQLModel, select

from .database_setup import Grade, Student, Teacher, User, crear_bd_and_tables, engine, pwd_context

app = FastAPI(title="Colegio API", version="1.0")

class StudentRead(BaseModel):
    id: int
    full_name: str
    grade: str
    user_id: Optional[int]

    class Config:
        orm_mode = True


class TeacherRead(BaseModel):
    id: int
    full_name: str
    specialty: str
    user_id: Optional[int]

    class Config:
        orm_mode = True


class GradeRead(BaseModel):
    id: int
    subject: str
    score: float
    student_id: Optional[int]
    teacher_id: Optional[int]

    class Config:
        orm_mode = True


class CreateStudentRequest(BaseModel):
    username: str
    password: str
    full_name: str
    grade: str


class CreateTeacherRequest(BaseModel):
    username: str
    password: str
    full_name: str
    specialty: str


class CreateGradeRequest(BaseModel):
    teacher_username: str
    student_username: str
    subject: str
    score: float


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


@app.on_event("startup")
def startup_event():
    crear_bd_and_tables()


@app.get("/students", response_model=List[StudentRead])
def list_students(session: Session = Depends(get_session)):
    students = session.exec(select(Student)).all()
    return students


@app.post("/students", response_model=StudentRead)
def create_student(payload: CreateStudentRequest, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == payload.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")

    user = User(
        username=payload.username,
        password_hash=pwd_context.hash(payload.password),
        role="estudiante",
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    student = Student(
        full_name=payload.full_name,
        grade=payload.grade,
        user_id=user.id,
    )
    session.add(student)
    session.commit()
    session.refresh(student)
    return student


@app.get("/teachers", response_model=List[TeacherRead])
def list_teachers(session: Session = Depends(get_session)):
    teachers = session.exec(select(Teacher)).all()
    return teachers


@app.post("/teachers", response_model=TeacherRead)
def create_teacher(payload: CreateTeacherRequest, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.username == payload.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya existe")

    user = User(
        username=payload.username,
        password_hash=pwd_context.hash(payload.password),
        role="maestro",
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    teacher = Teacher(
        full_name=payload.full_name,
        specialty=payload.specialty,
        user_id=user.id,
    )
    session.add(teacher)
    session.commit()
    session.refresh(teacher)
    return teacher


@app.get("/grades", response_model=List[GradeRead])
def list_grades(session: Session = Depends(get_session)):
    grades = session.exec(select(Grade)).all()
    return grades


@app.post("/grades", response_model=GradeRead)
def create_grade(payload: CreateGradeRequest, session: Session = Depends(get_session)):
    teacher_user = session.exec(select(User).where(User.username == payload.teacher_username)).first()
    student_user = session.exec(select(User).where(User.username == payload.student_username)).first()

    if not teacher_user or teacher_user.role != "maestro":
        raise HTTPException(status_code=400, detail="No existe el profesor o el usuario no es maestro")
    if not student_user or student_user.role != "estudiante":
        raise HTTPException(status_code=400, detail="No existe el estudiante o el usuario no es estudiante")

    teacher = session.exec(select(Teacher).where(Teacher.user_id == teacher_user.id)).first()
    student = session.exec(select(Student).where(Student.user_id == student_user.id)).first()

    if not teacher or not student:
        raise HTTPException(status_code=400, detail="Profesor o estudiante no están registrados correctamente")

    grade = Grade(
        subject=payload.subject,
        score=payload.score,
        student_id=student.id,
        teacher_id=teacher.id,
    )
    session.add(grade)
    session.commit()
    session.refresh(grade)
    return grade


@app.get("/grades/student/{student_username}", response_model=List[GradeRead])
def get_student_grades(student_username: str, session: Session = Depends(get_session)):
    student_user = session.exec(select(User).where(User.username == student_username)).first()
    if not student_user or student_user.role != "estudiante":
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    student = session.exec(select(Student).where(Student.user_id == student_user.id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    grades = session.exec(select(Grade).where(Grade.student_id == student.id)).all()
    return grades


@app.get("/grades/teacher/{teacher_username}", response_model=List[GradeRead])
def get_teacher_grades(teacher_username: str, session: Session = Depends(get_session)):
    teacher_user = session.exec(select(User).where(User.username == teacher_username)).first()
    if not teacher_user or teacher_user.role != "maestro":
        raise HTTPException(status_code=404, detail="Profesor no encontrado")

    teacher = session.exec(select(Teacher).where(Teacher.user_id == teacher_user.id)).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")

    grades = session.exec(select(Grade).where(Grade.teacher_id == teacher.id)).all()
    return grades
