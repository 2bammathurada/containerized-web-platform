
# Containerized Web Platform

A containerized web application environment built with Docker Compose, PostgreSQL, Django, React, and Nginx.

This project demonstrates how to run multiple application services in isolated Docker containers and connect them through a shared Docker network.

## 1. System Architecture

The application consists of four services:

- **Nginx:** Acts as a reverse proxy and the single entry point for HTTP requests.
- **React Frontend:** Provides the user interface using React and Vite.
- **Django Backend:** Handles application logic and exposes the health check API.
- **PostgreSQL:** Stores application data.

All services communicate through a Docker bridge network managed by Docker Compose.

### Architecture Diagram

See [System Architecture](docs/architecture.md) for the architecture diagram, request flow, network design, and service details.

## 2. Technology Stack

| Component | Technology | Version |
|---|---|---|
| Containerization | Docker | - |
| Service Orchestration | Docker Compose | - |
| Database | PostgreSQL | 15.2 |
| Backend | Django | 4.2 |
| Backend Runtime | Python | 3.12 |
| Frontend | React | 19 |
| Frontend Build Tool | Vite | 8 |
| Web Server / Reverse Proxy | Nginx | 1.28-alpine |

## 3. Project Structure

```text
containerized-web-platform/
├── backend/
│   ├── api/
│   ├── config/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── nginx/
│   └── nginx.conf
│
├── docs/
│   └── architecture.md
│
└── docker-compose.yml
```

## 4. Prerequisites

Install the following tools before running the application:

- Docker Desktop
- Docker Compose

Verify the installations:

```bash
docker --version
docker compose version
```

## 5. Getting Started

### Step 1: Clone the repository

```bash
git clone https://github.com/2bammathurada/containerized-web-platform.git
cd containerized-web-platform
```

### Step 2: Build Docker images

```bash
docker compose build
```

### Step 3: Start the application

```bash
docker compose up -d
```

Docker Compose starts all four services and creates the required network and persistent database volume.

The backend waits for PostgreSQL to become healthy before running database migrations and starting Django.

### Step 4: Check service status

```bash
docker compose ps
```

Verify that all services are running and that PostgreSQL and the backend report a healthy status.

### Step 5: Access the application

Open the application in a web browser:

http://localhost:8080

## 6. Service Configuration

| Service | Container Name | Internal Port | Description |
|---|---|---:|---|
| Nginx | platform-nginx | 80 | Reverse proxy |
| Frontend | platform-frontend | 5173 | React application |
| Backend | platform-backend | 8000 | Django application |
| PostgreSQL | platform-postgres | 5432 | Database |

### Port Mapping

Only Nginx is exposed to the host machine:

```text
Host: 8080 → Nginx Container: 80
```

The other services communicate internally through the `app-network` Docker bridge network.

### Request Routing

| Request Path | Destination |
|---|---|
| `/` | React Frontend |
| `/api/` | Django Backend |

## 7. Health Check API

The backend provides an endpoint to verify application and database connectivity.

**Endpoint:**

```http
GET /api/health/
```

**Example request:**

```bash
curl http://localhost:8080/api/health/
```

**Successful response:**

```json
{
  "status": "ok",
  "database": "connected"
}
```

The endpoint executes a database query to verify that Django can connect to PostgreSQL.

If the database is unavailable, the endpoint returns HTTP 503.

## 8. Useful Docker Commands

Check running containers:

```bash
docker compose ps
```

View logs for all services:

```bash
docker compose logs
```

Follow logs in real time:

```bash
docker compose logs -f
```

View logs for a specific service:

```bash
docker compose logs -f backend
```

Stop the application and remove its containers and network:

```bash
docker compose down
```

To remove the persistent database volume as well:

```bash
docker compose down -v
```

**Warning:** Removing the volume permanently deletes the PostgreSQL data stored in it.

## 9. Data Persistence

PostgreSQL uses a named Docker volume:

```text
postgres_data
```

The volume is mounted at:

```text
/var/lib/postgresql/data
```

This allows database data to persist when containers are stopped or recreated.

## 10. Development Notes

- Django runs using its built-in development server.
- React runs using the Vite development server.
- Nginx acts as a reverse proxy for frontend and backend requests.
- PostgreSQL credentials and Django settings are provided through Docker Compose environment variables for local development.
- PostgreSQL data is persisted using a named Docker volume.

This setup is intended for assessment and local development purposes. Additional configuration, including a production-ready application server, frontend static asset serving, and production secrets management, is required before production deployment.
