# 🔐 Zero Trust Cloud Security System

## 🚀 Overview

This project is a **Zero Trust Cloud Security System** built with Spring Boot.

The goal is to simulate how modern cloud systems secure access using:

- Authentication (JWT)
- Authorization (protected routes)
- Zero Trust principles (coming next)
- Audit logging (coming next)

---

## 🧠 What is Zero Trust?

> "Never trust, always verify."

Every request must be validated:
- Who are you?
- What are you trying to access?
- Are you allowed?

---

## 🛠️ Technologies Used

### Backend
- Java 17
- Spring Boot
- Spring Security
- JWT (JSON Web Tokens)

### Database
- PostgreSQL (Docker)

### Tools
- Postman → API testing
- DBeaver → database management
- Docker → database container

---

## 🧱 Architecture

Controller → Service → Repository → Database

---

## 📅 Progress (Day by Day)

### ✅ Day 1 — Project Setup
- Created Spring Boot project
- Configured Maven
- Set up project structure (controller, service, repository)

---

### ✅ Day 2 — Database + Register
- Set up PostgreSQL using Docker
- Connected Spring Boot to database
- Created User entity
- Implemented register endpoint
- Password hashing with BCrypt
- Tested endpoints using Postman
- Verified database data using DBeaver

---

### ✅ Day 3 — Login + JWT
- Created login endpoint
- Validated email and password
- Generated JWT tokens
- Implemented JwtService
- Tested authentication flow using Postman

---

### ✅ Day 4 — Security + Protected Routes
- Implemented JWT authentication filter
- Created CustomUserDetailsService
- Configured Spring Security
- Secured endpoints
- Differentiated public and protected routes
- Tested access with and without token

---

## 🔐 Authentication Flow

User → login → receive JWT → send request with token → backend validates → allow/deny

---

## 📡 API Endpoints

### Register
POST /auth/register

### Login
POST /auth/login

### Public Endpoint
GET /test

### Protected Endpoint
GET /test/secure

---

## 🧪 Testing

### Using Postman

Postman is used to test all API endpoints.

Steps:
1. Send HTTP requests (GET, POST)
2. Test register and login endpoints
3. Copy JWT token from login response
4. Add token to request headers:

Authorization: Bearer TOKEN

---

### Using DBeaver

DBeaver is used to manage and visualize the database.

Used for:
- Connecting to PostgreSQL
- Viewing the `users` table
- Checking stored data
- Debugging database issues

---

## 🐳 Database Setup (Docker)

Run PostgreSQL container:

docker run --name postgres-zero-trust -e POSTGRES_USER=ztc_user -e POSTGRES_PASSWORD=ztc_password -e POSTGRES_DB=zero_trust_cloud -p 55432:5432 -d postgres

---

## ⚙️ Application Configuration

application.properties:

spring.datasource.url=jdbc:postgresql://127.0.0.1:55432/zero_trust_cloud  
spring.datasource.username=ztc_user  
spring.datasource.password=ztc_password  

spring.jpa.hibernate.ddl-auto=update  
spring.jpa.show-sql=true  

---

## 🔥 Current Features

- User registration
- Secure password hashing (BCrypt)
- JWT authentication
- Stateless security (no sessions)
- Protected API routes
- Custom authentication filter

---

## 🚧 Next Steps

- Zero Trust Access Engine (ALLOW / DENY)
- Access request validation
- Audit logging system
- Frontend (React + TypeScript)
- Docker Compose setup
- CI/CD pipeline

---

## 💡 Why This Project?

This project demonstrates:

- Backend development with Spring Boot
- Security implementation using JWT
- API design and testing
- Database integration with PostgreSQL
- Cloud-ready architecture

---

## 👨‍💻 Author

Software Engineering student building a Zero Trust Cloud Security system to learn backend, security, and cloud concepts.

---
