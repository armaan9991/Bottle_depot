# BottleDepot — Recycling Depot Management System

Full-stack web application for managing bottle recycling depot operations, including transactions, shipments, employee management, and reporting.

**Primary Developer:** Armaan Singh Gill
**Contributors:** Harjas Singh Anand, Muhammad Hasham

---

## Live Demo

* **Frontend:** https://your-app.vercel.app
* **Backend API:** https://your-api.onrender.com

> Note: Backend may take ~30 seconds to wake up due to free hosting.

---

##  Tech Stack

* Frontend: React (Vite), Axios, React Router
* Backend: ASP.NET Core (.NET), C#
* Database: MySQL (raw SQL, stored procedures)
* Auth: JWT (role-based access control)

---

## ✨ Features

### Admin

* Dashboard with daily statistics
* Manage employees and schedules
* Process transactions
* Create and manage shipments
* Close daily records
* Generate reports

### Employee

* Create transactions
* View work history
* View schedule

---

## Security

* JWT authentication (8-hour expiry)
* Role-based authorization
* Protected frontend routes

---

## System Design

* 11-table normalized relational database
* Stored procedures for transactional consistency
* Clean REST API architecture using DTOs
* Strong referential integrity constraints

---

## Project Structure

```
Backend: ASP.NET Core API
Frontend: React (Vite)
Database: SQL scripts (schema + procedures + seed data)
```

---

##  Local Setup

### Prerequisites

* .NET SDK
* Node.js
* MySQL

### Run

```bash
git clone https://github.com/yourusername/Bottle_depot.git

# Backend
cd BottleDepot
dotnet run

# Frontend
cd frontend
npm install
npm run dev
```

---

##  Demo Credentials

| Role     | ID | Password |
| -------- | -- | -------- |
| Admin    | 1  | admin123 |
| Employee | 2  | emp123   |

---

## 📈 Key Contributions

* Designed and implemented full database schema
* Built backend architecture and authentication system
* Developed core APIs (Employee, Schedule, Auth)
* Integrated frontend with backend services

---

## Limitations

* Passwords stored in plain text (academic scope; would use hashing in production)
* No pagination on large datasets
* Limited UI optimization

---

##  Future Improvements

* Add bcrypt password hashing
* Improve UI/UX
* Add file uploads for labels
* Deploy scalable production version

---


