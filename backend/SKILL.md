# SKILL.md

## Backend Project Overview

This backend is a modern REST API built with:

- Python
- FastAPI
- SQLite
- SQLAlchemy
- Pydantic
- Pytest

The backend provides services for:

- Authentication
- Authorization
- User management
- Business logic
- Data persistence
- API integration for the frontend application

The backend should prioritize:

- Clean architecture
- Security
- Scalability
- Maintainability
- Type safety
- Testability
- API consistency


# General Backend Principles

## Core Development Philosophy

- Prefer explicit code over implicit behavior.
- Keep endpoints thin.
- Keep business logic in services.
- Separate concerns clearly.
- Prefer composition over inheritance.
- Write testable code.
- Fail fast with meaningful errors.
- Keep functions small and focused.
- Avoid premature optimization.


# Recommended Project Structure

```txt
/backend
  /app
    /api
      /v1
        /routes
    /core
    /db
    /models
    /schemas
    /services
    /repositories
    /dependencies
    /middleware
    /utils
    /tests

  main.py

  requirements.txt
  pyproject.toml
````


# Folder Responsibilities

## `/api`

Defines API routes and endpoint registration.

Responsibilities:

* HTTP layer only
* Request validation
* Response formatting
* Dependency injection

Avoid:

* Database logic
* Business rules
* Complex transformations


## `/services`

Contains business logic.

Examples:

* Authentication workflows
* User registration
* Token handling
* Permission checks

Services should:

* Be reusable
* Be testable independently
* Avoid direct HTTP concerns


## `/repositories`

Responsible for data access.

Responsibilities:

* Database queries
* CRUD operations
* ORM interactions

Avoid:

* HTTP logic
* Business decisions


## `/schemas`

Pydantic schemas for:

* Requests
* Responses
* Validation
* Serialization

Use separate schemas for:

* Create
* Update
* Read
* Internal models


## `/models`

SQLAlchemy ORM models.

Rules:

* Keep models simple
* Avoid business logic inside models
* Use explicit relationships


## `/core`

Core application configuration.

Examples:

* Settings
* Security
* Logging
* Environment configuration
* JWT utilities


# FastAPI Best Practices

## Endpoint Design

### REST Conventions

Use clear RESTful naming:

```txt
GET    /users
GET    /users/{id}
POST   /users
PUT    /users/{id}
DELETE /users/{id}
```

Avoid verbs in routes:

```txt
❌ /getUsers
❌ /createUser
```


## Dependency Injection

Use FastAPI dependencies consistently.

Example:

```python id="v5wr0l"
from fastapi import Depends

def get_current_user():
    ...

@router.get("/me")
def read_me(user=Depends(get_current_user)):
    return user
```


## Response Models

Always define response models.

Example:

```python id="4p1hfj"
@router.get(
    "/users/{id}",
    response_model=UserResponse
)
async def get_user(id: int):
    ...
```


# Async Best Practices

## Prefer Async Endpoints

Use async when:

* Calling databases asynchronously
* Calling external APIs
* Performing I/O operations

Example:

```python id="fjlwmk"
@router.get("/")
async def healthcheck():
    return {"status": "ok"}
```


# SQLite Guidelines

## Usage Rules

* Use SQLite for local development and lightweight deployments.
* Use migrations consistently.
* Avoid raw SQL unless necessary.


## Database Access

Prefer SQLAlchemy ORM patterns.

Example:

```python id="v1wib9"
user = session.query(User).filter(User.email == email).first()
```


# SQLAlchemy Best Practices

## Model Design

Example:

```python id="zhg4ew"
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
```


## Relationships

Use explicit relationships.

Example:

```python id="hnn7hq"
posts = relationship("Post", back_populates="author")
```


## Session Handling

Use dependency injection for sessions.

Example:

```python id="o2c3wg"
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```


# Pydantic Standards

## Validation Rules

* Validate all external input.
* Prefer strict typing.
* Use enums when applicable.
* Use field constraints.

Example:

```python id="mwny44"
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
```


# Authentication and Security

## Authentication

Preferred stack:

* JWT access tokens
* Refresh tokens
* OAuth2PasswordBearer


## Password Security

Requirements:

* Never store plain passwords
* Use bcrypt or passlib hashing
* Enforce password policies

Example:

```python id="gaxg3o"
hashed_password = pwd_context.hash(password)
```


## Secrets Management

Never hardcode:

* API keys
* JWT secrets
* Database credentials

Use environment variables.

Example:

```python id="58gkhx"
SECRET_KEY = os.getenv("SECRET_KEY")
```


## CORS

Configure CORS explicitly.

Avoid:

```python id="3dbb8m"
allow_origins=["*"]
```

in production environments.


# Error Handling

## Principles

* Return meaningful HTTP status codes.
* Never expose internal stack traces.
* Use structured error responses.

Example:

```python id="azl4sg"
raise HTTPException(
    status_code=404,
    detail="User not found"
)
```


# Logging

## Logging Standards

Use structured logging.

Log:

* Errors
* Security events
* Important workflows

Avoid logging:

* Passwords
* Tokens
* Sensitive data


# Testing Standards

Testing is mandatory.


# Pytest Best Practices

## Folder Structure

```txt
/tests
  /unit
  /integration
  /fixtures
```


## Test Naming

Example:

```txt
test_create_user_success
test_login_invalid_password
test_delete_nonexistent_user
```


## Test Philosophy

Test:

* Success cases
* Failure cases
* Edge cases
* Authorization
* Validation
* Security rules


## API Testing

Use FastAPI TestClient.

Example:

```python id="87b3mh"
from fastapi.testclient import TestClient

def test_healthcheck():
    response = client.get("/health")
    assert response.status_code == 200
```


# Validation Rules

All incoming data must be validated.

Never trust:

* Request bodies
* Query parameters
* Headers
* Tokens


# API Design Standards

## Consistent Responses

Success example:

```json id="p93n3t"
{
  "success": true,
  "data": {}
}
```

Error example:

```json id="tvvd2z"
{
  "success": false,
  "error": "Invalid credentials"
}
```


# Versioning

Use API versioning.

Example:

```txt
/api/v1/users
```


# Performance Guidelines

## Performance Priorities

* Minimize unnecessary queries
* Avoid N+1 queries
* Paginate large datasets
* Use indexes when appropriate


# Pagination

Preferred pattern:

```txt
GET /users?page=1&limit=20
```


# Code Style

## Python Standards

Follow:

* PEP8
* Type hints everywhere
* Black formatting
* Ruff linting


## Function Design

Prefer:

```python id="uvt6la"
def create_user(
    db: Session,
    user_data: UserCreate
) -> User:
```

Avoid:

```python id="c0jlwm"
def create_user(data):
```


# Naming Conventions

## Files

snake_case:

```txt
user_service.py
auth_routes.py
jwt_utils.py
```


## Classes

PascalCase:

```python id="29sm6u"
class UserService:
```


## Variables

snake_case:

```python id="8vg22l"
current_user
access_token
```


# Environment Management

## Required Files

```txt
.env
.env.example
```


## Environment Variables

Examples:

```txt
DATABASE_URL=
SECRET_KEY=
ACCESS_TOKEN_EXPIRE_MINUTES=
```


# Migration Recommendations

Preferred migration tool:

* Alembic

Rules:

* Never modify production schema manually
* Use versioned migrations
* Keep migrations small and atomic


# Security Checklist

Before deployment:

* Validate all input
* Verify auth protections
* Restrict CORS
* Remove debug mode
* Secure secrets
* Verify dependency vulnerabilities


# Documentation Standards

## API Documentation

Use:

* FastAPI automatic OpenAPI docs
* Docstrings for services
* Typed schemas


# Copilot Instructions

When generating backend code:

* Use FastAPI idioms and best practices.
* Prefer async endpoints when appropriate.
* Use dependency injection.
* Use SQLAlchemy ORM.
* Use Pydantic validation.
* Keep routes thin.
* Keep business logic in services.
* Generate production-ready code.
* Use proper typing everywhere.
* Include meaningful error handling.
* Avoid duplicated logic.
* Write testable code.
* Generate pytest tests for new features.
* Prefer secure-by-default implementations.


# Recommended Libraries

## Core

* FastAPI
* SQLAlchemy
* Pydantic
* Alembic

## Security

* python-jose
* passlib
* bcrypt

## Testing

* pytest
* pytest-asyncio
* httpx


# Development Workflow

## Before Commit

Always:

* Run tests
* Run linting
* Check typing
* Remove debug prints
* Verify API docs


# Final Principles

This backend prioritizes:

1. Security
2. Maintainability
3. API consistency
4. Testability
5. Scalability
6. Clean architecture
7. Developer experience
8. Performance

