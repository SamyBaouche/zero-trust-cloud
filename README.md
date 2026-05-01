# 🔐 ZeroTrustCloud

**Security-first Zero Trust platform for cloud applications**

ZeroTrustCloud is a full-stack cloud security platform that simulates **Zero Trust access control decisions** using contextual risk scoring, authentication, and security observability.

---

## 🚀 Overview

Most authentication systems stop at login.  
ZeroTrustCloud goes further by implementing a **Zero Trust architecture**:

- Identity-aware access control  
- Risk-based decision engine  
- Full observability (logs + alerts)  
- Policy-driven authorization  

---

## ✨ Key Features

🔑 Authentication  
- JWT-based secure authentication  
- User registration & login  

🧠 Zero Trust Engine  
- Context-aware access decisions  
- ALLOW / CHALLENGE / DENY logic  
- Dynamic risk scoring  

📊 Security Monitoring  
- Audit logs  
- Security alerts  
- Active policy tracking  

👤 User Context System  
- Profile-based risk evaluation  
- Editable user metadata  

⚙️ System Architecture  
- Dockerized backend  
- PostgreSQL database  
- Scalable AWS-ready design  

---

## 🛠️ Tech Stack

Backend  
- Spring Boot  
- Java  
- JWT  
- PostgreSQL  

Frontend  
- React  
- TypeScript  

DevOps & Infrastructure  
- Docker  
- Vercel (Frontend deployment)  
- Render (Backend deployment)  
- AWS RDS (Database)  

---

## 🏗️ Architecture

Frontend (Vercel)  
↓  
Backend API (Render / AWS)  
↓  
PostgreSQL (AWS RDS)  

---

## 📸 Demo & Screenshots

👉 Add your demo links/screenshots here:

- 🏠 Landing Page: ADD_LINK_HERE  
- 🔐 Login Page: ADD_LINK_HERE  
- 📝 Register Page: ADD_LINK_HERE  
- 📊 Dashboard: ADD_LINK_HERE  
- ⚡ Access Check: ADD_LINK_HERE  
- 📜 Logs Page: ADD_LINK_HERE  
- 🚨 Alerts Page: ADD_LINK_HERE  
- 🛡️ Policies Page: ADD_LINK_HERE  

---

## ⚙️ Run Locally

Backend  
./mvnw spring-boot:run  

Frontend  
cd frontend-app  
npm install  
npm run dev  

Docker  
docker compose up --build  

---

## 🔌 API Endpoints

POST /auth/register  
POST /auth/login  
POST /access/check  
GET /logs  
GET /alerts  
GET /policies  
GET /context/profile  
PUT /context/profile  
DELETE /context/account  
GET /health  

---

## ☁️ Deployment

Frontend: Vercel  
Backend: Render / AWS (EC2 / ECS)  
Database: AWS RDS (PostgreSQL)  
Logs: CloudWatch (planned)  
Secrets: AWS Secrets Manager (planned)  

---

## 🔮 Future Updates

📧 Email verification system (end-to-end)  
🌙 Light / Dark mode toggle  
🌍 Multi-language support (EN / FR)  
🔐 Multi-factor authentication (MFA / 2FA)  
🤖 ML-based anomaly detection  
⚡ CI/CD pipeline  
☁️ Full AWS production deployment  
📊 Advanced dashboard analytics  
🛠️ Additional platform features  
🐛 Bug fixes and performance improvements  

---

## 🧪 Development Checks

./mvnw -q test  
cd frontend-app && npm run build  

---

## 👨‍💻 Author

Samy Baouche  

GitHub: ADD_GITHUB_LINK  
LinkedIn: ADD_LINKEDIN_LINK  
