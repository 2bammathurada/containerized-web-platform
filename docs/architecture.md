
# System Architecture

## Overview

The application consists of four Docker services:
PostgreSQL, Django Backend, React Frontend, and Nginx.

Nginx acts as the single entry point for external HTTP
requests and routes traffic to the appropriate service.

## Architecture Diagram

```mermaid
flowchart TB
    User["User / Web Browser"]

    subgraph Docker["Docker Host"]
        subgraph Network["Docker Bridge Network: app-network"]

            Nginx["Nginx Reverse Proxy<br/>Port 80"]

            Frontend["React Frontend<br/>Vite :5173"]

            Backend["Django Backend<br/>Port 8000"]

            DB[("PostgreSQL 15.2<br/>Port 5432")]

            Volume[("postgres_data<br/>Persistent Volume")]

            Nginx -->|"/"| Frontend
            Nginx -->|"/api/*"| Backend

            Backend -->|"SQL / PostgreSQL Protocol"| DB
            DB --- Volume
        end

        HostPort["Host Port: 8080"]
        HostPort --- Nginx
    end

    User -->|"HTTP :8080"| HostPort
```

## Request Flow

1. The user accesses the application through
   `http://localhost:8080`.
2. Nginx receives the HTTP request on port 80
   inside its container.
3. Requests to `/` are forwarded to the React Frontend
   running on port 5173.
4. Requests to `/api/` are forwarded to the Django
   Backend running on port 8000.
5. Django communicates with PostgreSQL on port 5432
   to retrieve or store application data.
6. PostgreSQL data is persisted in the
   `postgres_data` Docker volume.

## Network Design

- All four services communicate through the
  `app-network` Docker bridge network.
- Nginx is the only service exposed to the host.
- Host port `8080` maps to Nginx container port `80`.
- PostgreSQL and Django ports are not published
  directly to the host.
- Docker Compose service names are used for
  internal service discovery.

## Service Components

| Service | Technology | Internal Port |
|---|---|---:|
| nginx | Nginx | 80 |
| frontend | React + Vite | 5173 |
| backend | Django 4.2 | 8000 |
| postgres | PostgreSQL 15.2 | 5432 |
