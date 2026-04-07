# Zero Trust Cloud - Auth Service

## 🚀 Overview
This project is part of a Zero Trust Cloud architecture.  
It implements a secure authentication service using Spring Boot.

## 🧱 Tech Stack
- Java 24
- Spring Boot
- Spring Security
- PostgreSQL (Docker)
- Maven
- DBeaver
- Postman

## ⚙️ Features (Day 2)
- User registration
- Password hashing (BCrypt)
- PostgreSQL database integration
- Dockerized database
- Clean architecture (Controller / Service / Repository)

## 🔐 Security
- Passwords are never stored in plain text
- BCrypt hashing is used
- Basic security config implemented (will be improved with JWT)

## 🗄️ Database
PostgreSQL running in Docker:

```bash
docker run --name postgres-zero-trust -e POSTGRES_USER=ztc_user -e POSTGRES_PASSWORD=ztc_password -e POSTGRES_DB=zero_trust_cloud -p 5432:5432 -d postgres
```

## 🧪 Testing
### Postman
Test endpoint:
```
POST /auth/register
```

### DBeaver
- Connect to localhost:5432
- Database: zero_trust_cloud
- Check table: users

## 📁 Project Structure
```
controller → API endpoints
service → business logic
repository → database access
model → entity
dto → data transfer
config → security
```

## 📌 Next Steps
- Login endpoint
- JWT authentication
- Secure routes

## 👨‍💻 Author
Zero Trust Cloud Project
