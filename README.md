# Zero Trust Cloud

Production-style fullstack security platform built around Zero Trust principles.

Version: 1.0.0

## Why this project stands out

Most student projects stop at simple auth.
This one goes further and implements an end-to-end security flow:

- identity + contextual access verification
- risk-based decisions (ALLOW / CHALLENGE / DENY)
- security observability (logs, policies, risk insights)
- profile-aware security context
- real deployment mindset (Vercel + Render + PostgreSQL + Docker)

## Demo video (placeholder)

Add your final demo video link here:

`[DEMO_VIDEO_LINK_HERE]`

Suggested format for the final demo:

1. Landing page walkthrough
2. Register + login flow
3. Access check engine demonstration
4. Dashboard metrics, logs, and policy filters
5. Settings/profile update flow
6. Architecture and deployment quick recap

## Product scope - v1.0.0

### Core features

- JWT authentication (register/login)
- protected routes in frontend
- access check engine with contextual fields (resource, action, IP, location, device)
- risk score and decision response
- audit logs dashboard
- interactive risk insights and policy filtering
- profile management endpoints and UI
- account deletion with password confirmation

### Tech stack

Backend:

- Java 17
- Spring Boot (Web MVC, Security, Data JPA)
- PostgreSQL
- JWT (jjwt)
- Maven

Frontend:

- React + TypeScript
- Parcel
- Axios
- React Router

Infra and deployment:

- Docker / Docker Compose
- Vercel (frontend)
- Render (backend)
- AWS RDS PostgreSQL (production database)

## Architecture

```text
Browser (React + Parcel)
	|
	| HTTPS
	v
Spring Boot API (JWT, CORS, Zero Trust engine)
	|
	| JDBC
	v
PostgreSQL (local Docker / AWS RDS in prod)
```

## Repository structure

```text
.
|- src/main/java                # Spring Boot backend
|- src/main/resources           # application properties + SQL migrations
|- frontend-app/src             # React frontend
|- docker-compose.yml           # local PostgreSQL + optional backend container
|- Dockerfile                   # backend image build
|- postman/                     # API collection examples
```

## Local development setup

### 1) Start PostgreSQL with Docker

```powershell
Set-Location "C:\Stages\Zero_Trust_Cloud"
docker compose up -d postgres
```

PostgreSQL local mapping in this project:

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

Note:

- local frontend should target local backend during dev (`http://localhost:5000`)
- production frontend should target Render backend

## Docker usage in this project

Docker is used to standardize local DB setup and reduce environment drift.

Main practical benefits:

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

## API endpoints (v1)

Auth:

- `POST /auth/register`
- `POST /auth/login`

Access and observability:

- `POST /access/check`
- `GET /access/scenarios`
- `POST /access/simulate/{scenarioId}`
- `GET /logs`
- `GET /alerts`
- `GET /policies`

Context and profile:

- `GET /context/me`
- `GET /context/profile`
- `PUT /context/profile`
- `DELETE /context/account`

Health:

- `GET /health`

## Terminal commands used during the project

Backend:

```powershell
.\mvnw.cmd -DskipTests compile
.\mvnw.cmd spring-boot:run
.\mvnw.cmd test
```

Frontend:

```powershell
npm run dev
npm run typecheck
npm run lint
npm run build
```

Docker:

```powershell
docker compose up -d postgres
docker compose down
```

Git:

```powershell
git add .
git commit -m "feat: ..."
git push
```

## Deployment notes

Current deployment model:

- frontend on Vercel
- backend on Render
- PostgreSQL on AWS RDS

Critical production checks:

- correct `VITE_API_URL`
- CORS allowed origins aligned with real domains
- DB env variables correctly set on backend service
- health endpoint returns database UP

## Future updates roadmap

### UX and product

- light/dark mode polishing and full theme parity
- improved language switch and complete EN/FR coverage
- richer dashboard widgets and investigation timeline
- notifications center and user-defined security thresholds

### Security

- MFA / 2FA
- refresh token rotation and session management
- stronger anomaly detection and behavior baselines
- admin RBAC and audit exports

### DevOps / Cloud

- Terraform infrastructure as code
- AWS CloudFront in front of frontend
- backend containerization flow for AWS ECS/Fargate
- CI/CD with automated tests + security checks
- central logging and monitoring (CloudWatch / OpenTelemetry)

## Recruiter-friendly highlights

- End-to-end fullstack ownership (backend, frontend, infra)
- Security-focused product thinking (not just CRUD)
- Production debugging experience (CORS, auth, env, deployment)
- Clean code documentation (JSDoc/Javadoc pass)
- Realistic roadmap from v1.0.0 to cloud-scale architecture

## Author

Samy Baouche

- GitHub: `[ADD_GITHUB_LINK]`
- LinkedIn: `[ADD_LINKEDIN_LINK]`
