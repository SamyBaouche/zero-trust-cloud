# 🔐 Zero Trust Cloud

Production-style fullstack security platform built around Zero Trust principles.

**Version:** `1.0.0`

---

## 📚 Table of Contents

- [🌟 Why This Project Stands Out](#-why-this-project-stands-out)
- [🎬 Demo Video (Placeholder)](#-demo-video-placeholder)
- [🚀 Product Scope - v1.0.0](#-product-scope---v100)
- [🧰 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🗂️ Repository Structure](#️-repository-structure)
- [💻 Local Development Setup](#-local-development-setup)
- [🐳 Docker Usage](#-docker-usage)
- [🔌 API Endpoints (v1)](#-api-endpoints-v1)
- [🖥️ Terminal Commands Used During the Project](#️-terminal-commands-used-during-the-project)
- [☁️ Deployment Notes](#️-deployment-notes)
- [🛣️ Future Updates Roadmap](#️-future-updates-roadmap)
- [🎯 Recruiter-Friendly Highlights](#-recruiter-friendly-highlights)
- [👨‍💻 Author](#-author)

---

## 🌟 Why This Project Stands Out

Most student projects stop at simple authentication.
This project goes further with a practical end-to-end security flow:

- ✅ identity + contextual access verification
- ✅ risk-based decisions (`ALLOW / CHALLENGE / DENY`)
- ✅ security observability (logs, policies, risk insights)
- ✅ profile-aware security context
- ✅ deployment mindset (`Vercel + Render + PostgreSQL + Docker`)

---

## 🎬 Demo Video (Placeholder)

Add your final demo video link here:

`[DEMO_VIDEO_LINK_HERE]`

Suggested structure for your demo:

1. Landing page walkthrough
2. Register + login flow
3. Access check engine demonstration
4. Dashboard metrics, logs, and policy filters
5. Settings/profile update flow
6. Architecture and deployment recap

---

## 🚀 Product Scope - v1.0.0

### Core Features

- JWT authentication (`register/login`)
- Protected routes in frontend
- Access check engine with contextual fields (resource, action, IP, location, device)
- Risk score + decision response
- Audit logs dashboard
- Interactive risk insights and policy filtering
- Profile management endpoints and UI
- Account deletion with password confirmation

---

## 🧰 Tech Stack

### Backend

- Java 17
- Spring Boot (`Web MVC`, `Security`, `Data JPA`)
- PostgreSQL
- JWT (`jjwt`)
- Maven

### Frontend

- React + TypeScript
- Parcel
- Axios
- React Router

### Infra & Deployment

- Docker / Docker Compose
- Vercel (frontend)
- Render (backend)
- AWS RDS PostgreSQL (production database)

---

## 🏗️ Architecture

```text
Browser (React + Parcel)
    |
    | HTTPS
    v
Spring Boot API (JWT, CORS, Zero Trust engine)
    |
    | JDBC
    v
PostgreSQL (local Docker / AWS RDS in production)
```

---

## 🗂️ Repository Structure

```text
.
|- src/main/java                # Spring Boot backend
|- src/main/resources           # application properties + SQL migrations
|- frontend-app/src             # React frontend
|- docker-compose.yml           # local PostgreSQL + optional backend container
|- Dockerfile                   # backend image build
|- postman/                     # API collection examples
```

---

## 💻 Local Development Setup

### 1) Start PostgreSQL with Docker

```powershell
Set-Location "C:\Stages\Zero_Trust_Cloud"
docker compose up -d postgres
```

PostgreSQL local mapping:

- host: `localhost`
- port: `5433`
- db: `zero_trust_cloud`
- user: `postgres`

### 2) Start backend locally

```powershell
Set-Location "C:\Stages\Zero_Trust_Cloud"
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5433/zero_trust_cloud"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="postgres"
$env:PORT="5000"
.\mvnw.cmd spring-boot:run
```

### 3) Start frontend locally

```powershell
Set-Location "C:\Stages\Zero_Trust_Cloud\frontend-app"
npm install
npm run dev
```

Notes:

- local frontend should target local backend (`http://localhost:5000`)
- production frontend should target Render backend

---

## 🐳 Docker Usage

Docker is used to standardize local database setup and reduce environment drift.

Benefits:

- same DB baseline for every machine
- faster onboarding
- reproducible local debugging

Useful commands:

```powershell
docker compose up -d postgres
docker compose ps
docker compose logs -f postgres
docker compose down
```

---

## 🔌 API Endpoints (v1)

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Access & Observability

- `POST /access/check`
- `GET /access/scenarios`
- `POST /access/simulate/{scenarioId}`
- `GET /logs`
- `GET /alerts`
- `GET /policies`

### Context & Profile

- `GET /context/me`
- `GET /context/profile`
- `PUT /context/profile`
- `DELETE /context/account`

### Health

- `GET /health`

---

## 🖥️ Terminal Commands Used During the Project

### Backend

```powershell
.\mvnw.cmd -DskipTests compile
.\mvnw.cmd spring-boot:run
.\mvnw.cmd test
```

### Frontend

```powershell
npm run dev
npm run typecheck
npm run lint
npm run build
```

### Docker

```powershell
docker compose up -d postgres
docker compose down
```

### Git

```powershell
git add .
git commit -m "feat: ..."
git push
```

---

## ☁️ Deployment Notes

Current deployment model:

- frontend on Vercel
- backend on Render
- PostgreSQL on AWS RDS

Critical production checks:

- correct `VITE_API_URL`
- CORS allowed origins aligned with real domains
- DB env variables correctly set on backend service
- health endpoint returns database `UP`

---

## 🛣️ Future Updates Roadmap

### 🎨 UX & Product

- dark/light mode polishing and full theme parity
- improved language switch and complete EN/FR coverage
- richer dashboard widgets and investigation timeline
- notification center and user-defined security thresholds

### 🛡️ Security

- MFA / 2FA
- refresh token rotation and session management
- stronger anomaly detection and behavior baselines
- admin RBAC and audit exports

### ☁️ DevOps / Cloud

- Terraform infrastructure as code
- AWS CloudFront in front of frontend
- backend containerization flow for AWS ECS/Fargate
- CI/CD with automated tests + security checks
- centralized logging and monitoring (CloudWatch / OpenTelemetry)

---

## 🎯 Recruiter-Friendly Highlights

- End-to-end fullstack ownership (backend, frontend, infra)
- Security-focused product thinking (not just CRUD)
- Production debugging experience (CORS, auth, env, deployment)
- Clean code documentation (`JSDoc` + `Javadoc`)
- Realistic roadmap from `v1.0.0` to cloud-scale architecture

---

## 👨‍💻 Author

Samy Baouche

- GitHub: `[ADD_GITHUB_LINK]`
- LinkedIn: `[ADD_LINKEDIN_LINK]`
