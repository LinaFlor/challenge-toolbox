# Challenge Toolbox - Fullstack App

Este repositorio contiene el **frontend** y **backend** de la aplicación del Challenge, listos para correr usando **Docker**.

## Estructura del repositorio

challenge-toolbox/
├── challenge-back/ # Backend Node.js (API)
├── challenge-front/ # Frontend React
└── docker-compose.yml # Orquesta ambos servicios con Docker


Cada subcarpeta tiene su propio `README.md` con instrucciones específicas.

---

## Requisitos

- Docker >= 20
- Docker Compose >= 1.29
- Node.js (14 para backend, 16 para frontend si lo ejecutas localmente)

---

## Ejecutar con Docker

1. Desde la raíz del repositorio (`challenge-toolbox`):

```bash
docker-compose up --build
```

Esto hará build de ambos servicios y levantará los contenedores:

Backend: http://localhost:3001

Frontend: http://localhost:3000

2. Para detener:

```bash
docker-compose down
```

## Notas
- Cada subproyecto tiene su propio README.md con detalles de instalación local, scripts y dependencias.
- Todo el proyecto puede correr completo sin depender de instalaciones locales de Node.js, configuraciones del sistema operativo o variables de entorno externas.