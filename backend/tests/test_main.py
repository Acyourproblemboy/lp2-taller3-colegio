import os

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel


@pytest.fixture(scope="session")
def client(tmp_path_factory):
    db_path = tmp_path_factory.mktemp("data") / "test.db"
    os.environ["COLEGIO_DB_URL"] = f"sqlite:///{db_path}"

    import backend.main as main
    from backend.database_setup import engine

    SQLModel.metadata.create_all(engine)

    with TestClient(main.app) as test_client:
        yield test_client


def test_create_teacher_and_list(client: TestClient):
    response = client.post(
        "/teachers",
        json={
            "username": "profesor1",
            "password": "clave123",
            "full_name": "Profesor Uno",
            "specialty": "Ciencias",
        },
    )
    assert response.status_code == 200
    result = response.json()
    assert result["full_name"] == "Profesor Uno"
    assert result["specialty"] == "Ciencias"

    list_response = client.get("/teachers")
    assert list_response.status_code == 200
    teachers = list_response.json()
    assert any(teacher["full_name"] == "Profesor Uno" for teacher in teachers)


def test_create_student_and_list(client: TestClient):
    response = client.post(
        "/students",
        json={
            "username": "estudiante1",
            "password": "clave123",
            "full_name": "Estudiante Uno",
            "grade": "11vo grado",
        },
    )
    assert response.status_code == 200
    result = response.json()
    assert result["full_name"] == "Estudiante Uno"
    assert result["grade"] == "11vo grado"

    list_response = client.get("/students")
    assert list_response.status_code == 200
    students = list_response.json()
    assert any(student["full_name"] == "Estudiante Uno" for student in students)


def test_create_grade_and_query(client: TestClient):
    client.post(
        "/teachers",
        json={
            "username": "profesor2",
            "password": "clave123",
            "full_name": "Profesor Dos",
            "specialty": "Matemáticas",
        },
    )
    client.post(
        "/students",
        json={
            "username": "estudiante2",
            "password": "clave123",
            "full_name": "Estudiante Dos",
            "grade": "10mo grado",
        },
    )

    grade_response = client.post(
        "/grades",
        json={
            "teacher_username": "profesor2",
            "student_username": "estudiante2",
            "subject": "Matemáticas",
            "score": 9.2,
        },
    )
    assert grade_response.status_code == 200
    grade = grade_response.json()
    assert grade["subject"] == "Matemáticas"
    assert grade["score"] == 9.2

    student_grades = client.get("/grades/student/estudiante2")
    assert student_grades.status_code == 200
    assert len(student_grades.json()) == 1

    teacher_grades = client.get("/grades/teacher/profesor2")
    assert teacher_grades.status_code == 200
    assert len(teacher_grades.json()) == 1
