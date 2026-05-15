# Proyecto Base: Frontend + Backend

Este repositorio sirve como plantilla para el desarrollo de un sitio web moderno con **frontend en Next.js + Tailwind CSS** y **backend en FastAPI + SQLite + pytest**. La estructura está diseñada para mantener una separación clara entre cliente y servidor, fomentar buenas prácticas y facilitar la escalabilidad.


## 📂 Estructura del proyecto

```
project-root/
│
├── frontend/                # Aplicación cliente con Next.js y Tailwind CSS
│   ├── SKILL.md             # Buenas prácticas para frontend
│   ├── package.json         # Dependencias y scripts de frontend
│   └── README.md            # Documentación específica del frontend
│
├── backend/                 # API con FastAPI, SQLite y pytest
│   ├── SKILL.md             # Buenas prácticas para backend
│   ├── requirements.txt     # Dependencias de Python
│   ├── pytest.ini           # Configuración de pytest
│   └── README.md            # Documentación específica del backend
│
├── docs/                    # Documentación general del proyecto
│   └── architecture.md      # Explicación de arquitectura y decisiones
│
├── .gitignore               # Ignorar archivos comunes
├── README.md                # Este archivo
└── LICENSE                  # Licencia del proyecto
```


## 🚀 Tecnologías principales

- **Next.js**: Framework de React para aplicaciones web modernas.
- **Tailwind CSS**: Librería de utilidades CSS para diseño rápido y consistente.
- **FastAPI**: Framework Python para construir APIs rápidas y tipadas.
- **SQLite**: Base de datos ligera y embebida.
- **pytest**: Framework de pruebas para Python.


## 📖 Documentación

- **frontend/SKILL.md**: Guía de buenas prácticas para desarrollo con Next.js y Tailwind.
- **backend/SKILL.md**: Guía de buenas prácticas para FastAPI, SQLite y pytest.
- **docs/architecture.md**: Explicación de la arquitectura, comunicación entre frontend y backend, y posibles mejoras futuras.


## 🛠️ Instalación inicial

Cada entorno se configura de manera independiente:

### Frontend
1. Entrar al directorio `frontend/`.
2. Instalar dependencias:  
   ```bash
   npm install
   ```
3. Levantar servidor de desarrollo:  
   ```bash
   npm run dev
   ```

### Backend
1. Entrar al directorio `backend/`.
2. Crear entorno virtual e instalar dependencias:  
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Levantar servidor FastAPI:  
   ```bash
   uvicorn main:app --reload
   ```


## 📌 Próximos pasos

- Definir la primera ruta de prueba en el backend.
- Configurar Tailwind en el frontend.
- Documentar la comunicación entre cliente y servidor en `docs/architecture.md`.
- Implementar pruebas iniciales con pytest.

