# Zero Trust Cloud

## Description
A cloud security platform that simulates Zero Trust access decisions for cloud resources using contextual risk scoring, JWT authentication, audit logs, and security monitoring.

## Key Features
- JWT authentication
- Context-aware access checks
- Cloud resource risk scoring
- ALLOW / CHALLENGE / DENY decisions
- Risk breakdown
- Audit logs
- Security alerts
- Active cloud policies
- Dockerized backend
- PostgreSQL database
- AWS-ready architecture

## Tech Stack
- Spring Boot
- React
- TypeScript
- PostgreSQL
- Docker
- JWT
- AWS-ready design

## Architecture
Frontend → Backend API → PostgreSQL

Backend includes:
- Auth service
- Access decision engine
- Policy engine
- Audit logs
- Security alerts

## How to run locally

Backend:
- `./mvnw spring-boot:run`

Frontend:
- `cd frontend-app`
- `npm install`
- `npm run dev`

Docker:
- `docker compose up --build`

## API endpoints
- POST /auth/register
- POST /auth/login
- POST /access/check
- GET /logs
- GET /context/me
- GET /context/profile
- PUT /context/profile
- POST /context/profile
- DELETE /context/account
- GET /policies
- GET /alerts
- GET /health

## Development checks (recommended before commit)
- Backend tests: `./mvnw -q test`
- Frontend build: `cd frontend-app && npm run build`

## Settings page capabilities
- Edit profile fields from registration (name, DOB, company, role, country, phone, department, clearance)
- Switch language (English/French)
- Switch theme (Dark/Light)
- Export profile as JSON
- Delete account with password confirmation

## Troubleshooting
- If profile save fails with `405 Method Not Allowed`, restart backend and retry.
- The profile update endpoint supports both `PUT /context/profile` and `POST /context/profile` for compatibility.

## Screenshots
- Landing page
- Dashboard
- Access check
- Logs
- Alerts
- Policies

## AWS Deployment Plan
- Backend sur AWS ECS ou EC2
- PostgreSQL sur AWS RDS
- Logs sur CloudWatch
- Secrets dans AWS Secrets Manager
- Docker image stockée dans ECR

## Future improvements
- AWS deployment
- CloudWatch logging
- RDS database
- ML anomaly detection
- Terraform infrastructure
- CI/CD pipeline
