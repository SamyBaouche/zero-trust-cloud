# Zero Trust Cloud

**Security-first authentication and access decision platform for cloud applications.**

Zero Trust Cloud is a Spring Boot and PostgreSQL platform that combines authentication, identity context, risk-aware access decisions, and security observability in one backend service. It is designed for teams that want more than simple login: they need verifiable identity, controlled authorization, and auditable decisions.

---

## Product Description

Most auth demos stop at `register` and `login`. Zero Trust Cloud extends the identity layer with a zero-trust mindset:

- JWT-based authentication for stateless API security
- Context-aware access decisions (`ALLOW`, `CHALLENGE`, `DENY`)
- Auditable logs and security alerts
- Policy-driven decision behavior
- User profile context used by the risk engine

The result is a backend that protects both authentication flows and business actions, while staying developer-friendly for local development and frontend integration.

---

## ✨ Key Features

- **Authentication Core**
  - User registration and login with secure password handling
  - JWT issuance for protected endpoint access
- **Zero Trust Access Engine**
  - `POST /access/check` evaluates contextual risk
  - Decisions include `ALLOW`, `CHALLENGE`, and `DENY`
- **Security Observability**
  - Access logs for traceability
  - Security alerts for suspicious behavior patterns
- **Policy Management**
  - Active policy retrieval through API
  - Rule-based control over access decisions
- **Profile & Context Management**
  - Read/update context profile
  - Account deletion flow with password confirmation
- **Email Verification Data Model (Foundation)**
  - Database fields for 6-digit verification codes are in place via migration
  - Delivery/API wiring can be enabled as the next product increment

---

## 🏗️ Architecture & Tech Stack

### Backend
- Java 17
- Spring Boot 4.0.5
- Spring Security
- Spring Data JPA + Hibernate
- JWT (`io.jsonwebtoken`)

### Frontend
- React + TypeScript (`frontend-app/`)

### Database & Runtime
- PostgreSQL
- Docker + Docker Compose
- Maven Wrapper (`mvnw`, `mvnw.cmd`)

### High-Level Architecture

`Frontend` -> `Spring Boot API` -> `Decision/Auth Services` -> `PostgreSQL`

Core backend modules:
- Auth service
- Access decision engine
- Context service
- Policy service
- Logs and alerts services

---

## 🗄️ Database Architecture

The persistence layer is organized around identity, context, and decision telemetry.

### Main domains
- **users**: credentials, account identity, verification metadata
- **access logs**: decision records and context snapshots
- **security alerts**: elevated-risk or suspicious events
- **access policies**: active rule sets used during evaluation

### `users` table highlights

The schema includes support for both core auth and email verification workflows:

- `id`, `email`, `password`
- profile/context attributes (name, org, role, etc.)
- `email_verified`
- `email_verification_code` (6 digits)
- `email_verification_code_expires_at`
- `email_verification_code_sent_at`
- `email_verified_at`

Email verification columns are introduced via migration:
- `src/main/resources/migration/V4__add_email_verification_to_users.sql`

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Java 17+
- Node.js 18+ (for frontend)
- Docker Desktop (recommended)
- PostgreSQL (if not using Docker)

### 1) Clone repository

```bash
git clone <your-repository-url>
cd Zero_Trust_Cloud
```

### 2) Configure backend properties

Edit `src/main/resources/application.properties`:

```properties
spring.application.name=auth-service
server.port=8081

spring.datasource.url=jdbc:postgresql://localhost:5432/zero_trust_cloud
spring.datasource.username=postgres
spring.datasource.password=your_db_password
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# SMTP placeholders (when email delivery is enabled)
spring.mail.host=smtp.your-provider.com
spring.mail.port=587
spring.mail.username=your_smtp_user
spring.mail.password=your_smtp_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 3) Run backend

Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

macOS/Linux:

```bash
./mvnw spring-boot:run
```

### 4) Run frontend

```powershell
Set-Location .\frontend-app
npm install
npm run dev
```

### 5) Run full stack with Docker

```bash
docker compose up --build
```

---

## 🔐 Authentication Flow

### Current flow
1. User registers via `POST /auth/register`
2. User logs in via `POST /auth/login`
3. API returns JWT on successful login
4. Client sends token in `Authorization: Bearer <token>`
5. Protected endpoints validate JWT before processing

### Step-by-step example
1. Create account
2. Authenticate with credentials
3. Receive token
4. Call protected APIs (`/context/*`, `/access/check`, `/logs`, `/alerts`, `/policies`)

---

## 📬 Email Verification System

Zero Trust Cloud includes database-level support for a 6-digit email verification model.

### Verification design
- Generate a 6-digit code per registration or verification request
- Store code + expiration timestamp in `users`
- Send code through SMTP
- Verify code and mark `email_verified = true`

### Status in this repository
- **Implemented:** verification fields in database migration (`V4`)
- **Roadmap:** SMTP sending and dedicated verification endpoint wiring

This keeps the architecture ready for production-grade onboarding while allowing incremental delivery.

---

## 🧪 API Endpoints

### Authentication
- `POST /auth/register`
- `POST /auth/login`

### Access & Risk
- `POST /access/check`

### User Context
- `GET /context/me`
- `GET /context/profile`
- `PUT /context/profile`
- `POST /context/profile` (compatibility fallback)
- `DELETE /context/account`

### Security Data
- `GET /logs`
- `GET /alerts`
- `GET /policies`
- `GET /health`

### Example: Register

```json
{
  "email": "jane@example.com",
  "password": "StrongPassword123!",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

### Example: Login

```json
{
  "email": "jane@example.com",
  "password": "StrongPassword123!"
}
```

Example response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### Example: Verify Email (planned endpoint shape)

```json
{
  "email": "jane@example.com",
  "code": "482917"
}
```

Example response:

```json
{
  "message": "Email verified successfully",
  "emailVerified": true
}
```

---

## 🔒 Security Considerations

- Use BCrypt for password hashing (never store plaintext passwords)
- Keep JWT secrets and DB credentials outside source control
- Enforce HTTPS for production deployments
- Add rate limiting for login and verification endpoints
- Expire and invalidate verification codes quickly
- Limit sensitive data in logs and error messages
- Use least-privilege database credentials in all environments

---

## ⚙️ Tech Decisions

- **Spring Boot** for rapid secure API development and maintainability
- **PostgreSQL** for relational integrity across auth, profile, and policy data
- **JWT** for stateless client-server authentication
- **Docker Compose** for reproducible local environments
- **Migration-driven schema** for controlled database evolution

---

## ☁️ Cloud Deployment (Planned)

A staged AWS deployment path is prepared for future scaling:

- Backend on ECS or EC2
- PostgreSQL on RDS
- Logs/metrics in CloudWatch
- Secrets in AWS Secrets Manager
- Container images in ECR

> Note: local-first Docker setup is the current default workflow.

---

## 🔮 Future Updates

- SMTP integration and fully wired email verification endpoint
- Password reset and account recovery flows
- Refresh token and session management
- MFA support (email/TOTP)
- Enhanced risk scoring signals and adaptive policy rules
- CI/CD pipeline hardening and automated security checks

---

## 👨‍💻 Author

**Your Name**

- GitHub: `https://github.com/your-username`
- LinkedIn: `https://www.linkedin.com/in/your-profile`

---

## Development Checks

Backend tests:

```powershell
.\mvnw.cmd -q test
```

Frontend build:

```powershell
Set-Location .\frontend-app
npm run build
```
