# 🚀 NexusHR — Backend API (Node.js + Express + MySQL)

Yeh NexusHR ka **Backend REST API** hai, jo **Node.js (Express.js)** aur **MySQL** database par bana hai. Is project ko **Modular Monolithic Architecture** me design kiya gaya hai taaki aap aage chal kar **Leave Module**, **Attendance**, **Payroll** aur naye HRMS features bina kisi dikkat ke aasani se add kar sakein.

> 🌐 **[Free Deployment Guide: Render + TiDB Cloud (100% Free Live Setup)](file:///c:/Users/shilp/Desktop/DVT/Backend/FREE_DEPLOYMENT_GUIDE.md)**
>
> 👶 **[Beginner's Guide: Har File & Folder Ka Use-Case (Simple Explanation)](file:///c:/Users/shilp/Desktop/DVT/Backend/BEGINNER_BACKEND_GUIDE.md)**

---

## 📑 Table of Contents (Is Guide Me Kya Hai)

1. [Modular Monolith Architecture Kya Hai?](#1-modular-monolith-architecture-kya-hai)
2. [Folder aur Files Ka Kaam (Complete Breakdown)](#2-folder-aur-files-ka-kaam)
3. [Step-by-Step Setup Guide (Backend Kaise Chalayein)](#3-step-by-step-setup-guide)
4. [Database Tables aur Schema](#4-database-tables-aur-schema)
5. [Saari APIs Ki List (Endpoints Guide)](#5-saari-apis-ki-list)
6. [Future Me Naya Module Kaise Banayein?](#6-future-me-naya-module-kaise-banayein)
7. [Common Errors aur Unka Solution (FAQs)](#7-common-errors-aur-unka-solution)

---

## 1. Modular Monolith Architecture Kya Hai?

### Simple Words Me Samajhte Hain:
Normal projects me log saare controllers ek folder me daal dete hain, saare models dusre folder me. Jab project bada hota hai, toh code dhoondhna mushkil ho jata hai.

Lekin **Modular Monolith** me hum har feature ka ek alag independent folder (Module) banate hain:
- `src/modules/employee/` ➡️ Employee ka poora kaam (CRUD, Search, Filter) isi folder ke andar hai.
- `src/modules/department/` ➡️ Department aur budgets ka kaam yahan hai.
- `src/modules/leave/` ➡️ Leave requests, leave balance aur approval ka kaam yahan hai.
- `src/modules/attendance/` ➡️ Daily attendance aur clock-in logs yahan hain.
- `src/modules/payroll/` ➡️ Salary aur compensation ka kaam yahan hai.

### Iska Aapko Kya Benefit Hoga?
Aapne bola tha ki **"future me leave module aur related HRMS modules banaunga"** — Is architecture ka sabse bada fayda yeh hai ki:
1. Aapko purana code touch karne ki zarurat nahi padegi.
2. Bas `src/modules/` ke andar apna naya folder banayein (jaise `performance/` ya `recruitment/`) aur use `api.routes.js` me connect kar dein.
3. Agar future me kabhi Microservices me convert karna ho, toh yeh folders directly alag-alag service ban sakte hain!

---

## 2. Folder aur Files Ka Kaam

Pura folder structure aur har file ka use-case:

```
Backend/
├── .env.example                         # Environment variables ka sample template
├── .env                                 # Aapka secret config (MySQL password, Port number)
├── package.json                         # Dependencies aur npm scripts
├── README.md                            # Yeh documentation file
└── src/
    ├── app.js                           # Express application setup (CORS, Body-parser, Logger)
    ├── server.js                        # Main Entry Point (Server start karta hai aur DB check karta hai)
    │
    ├── config/                          # Configuration files
    │   ├── db.config.js                 # MySQL Connection Pool (Fast database queries ke liye)
    │   └── env.config.js                # .env file se values read karne wala loader
    │
    ├── database/                        # Database setup & migrations
    │   ├── schema.sql                   # Sabhi 8 tables ka SQL code (CREATE TABLE)
    │   ├── initDb.js                    # Auto-script jo database aur tables apne aap bana deta hai
    │   └── seed.js                      # 12 demo employees aur sample data insert karne ka script
    │
    ├── middlewares/                     # Safety & Helpers
    │   └── errorHandler.middleware.js   # Global error handler (Server ko crash hone se bachata hai)
    │
    ├── utils/                           # Reusable tools
    │   └── apiResponse.js               # Har API ka clean JSON response format banata hai
    │
    ├── routes/                          # Main Routing
    │   └── api.routes.js                # Sabhi modules ko /api/v1 par mount karta hai
    │
    └── modules/                         # 🌟 Core Feature Modules
        ├── employee/                    # 👥 Employee Module
        │   ├── employee.model.js        # MySQL SQL queries (SELECT, INSERT, UPDATE, DELETE)
        │   ├── employee.service.js      # Business logic & auto code generation (EMP-1013)
        │   ├── employee.controller.js   # HTTP Request handle karna aur Response bhejna
        │   ├── employee.routes.js       # URL paths define karna (/api/v1/employees)
        │   └── employee.validation.js   # Form check karna (Name, Email, Salary empty toh nahi)
        │
        ├── department/                  # 🏢 Department Module
        │   ├── department.model.js      # Department database queries
        │   ├── department.controller.js # Department request handler
        │   └── department.routes.js     # Department URLs
        │
        ├── leave/                       # 📅 Leave & PTO Module (Future HRMS)
        │   ├── leave.model.js           # Leave balances, Apply & Approve logic in DB
        │   ├── leave.controller.js      # Leave request handlers
        │   └── leave.routes.js          # Leave URLs (/api/v1/leaves)
        │
        ├── attendance/                  # ⏰ Attendance Module (HRMS)
        │   ├── attendance.model.js      # Daily roster & clock-in logs
        │   ├── attendance.controller.js
        │   └── attendance.routes.js
        │
        └── payroll/                     # 💰 Payroll & Compensation Module (HRMS)
            ├── payroll.model.js         # Salary tiers & monthly payout calculations
            ├── payroll.controller.js
            └── payroll.routes.js
```

---

## 3. Step-by-Step Setup Guide

Backend ko apne computer par chalane ke liye bas yeh 5 steps follow karein:

### Step 1: Terminal Me Backend Folder Me Jayein
```powershell
cd c:\Users\shilp\Desktop\DVT\Backend
```

### Step 2: Dependencies Install Karein
```powershell
npm install
```

### Step 3: `.env` File Check Karein
[Backend/.env](file:///c:/Users/shilp/Desktop/DVT/Backend/.env) file kholein aur apna MySQL password check karein:
```env
PORT=5000
NODE_ENV=development

# MySQL Database Settings
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nexushr_db
DB_PORT=3306

# Frontend React App URL (CORS ke liye)
CLIENT_URL=http://localhost:5173
```
> **Tip:** Agar aap **XAMPP** use kar rahe hain, toh default password blank hota hai (`DB_PASSWORD=`). Agar aapne MySQL ka koi password rakha hai (jaise `root` ya `admin123`), toh woh yahan type karein.

### Step 4: Database aur Tables Auto-Create Karein
Aapko manually MySQL me jakar table banane ki bilkul zarurat nahi hai! Bas yeh command chalayein:
```powershell
npm run db:init
```
Yeh command apne aap:
1. `nexushr_db` naam ka database create karega.
2. Saari 8 tables (`employees`, `departments`, `leave_requests`, etc.) create karega.
3. Default leave types (`Annual Vacation`, `Sick Leave`, etc.) insert karega.

### Step 5: (Optional) Sample Data Load Karein
Agar aap chahte hain ki testing ke liye 12 employees, 7 departments aur leave requests pehle se database me aa jayein:
```powershell
npm run db:seed
```

### Step 6: Server Start Karein
```powershell
npm run dev
```

Server chalte hi terminal me yeh dikhega:
```
=======================================================
🚀 NexusHR Modular Monolith API Server Running
📡 URL: http://localhost:5000
🔗 API Base: http://localhost:5000/api/v1
=======================================================
[Database] Successfully connected to MySQL database: nexushr_db
```

Browser me open karke test karein:
👉 `http://localhost:5000/api/v1/health`

---

## 4. Database Tables aur Schema

MySQL me total **8 tables** banayi gayi hain:

| Table Ka Naam | Isme Kya Save Hota Hai? |
|---|---|
| `departments` | Department ka naam, code, budget aur lead head |
| `employees` | Employee ki full profile (Name, Email, Role, Salary, Status, Emergency contact) |
| `employee_skills` | Employee ke skills (React, Node, SQL) - Foreign key linked |
| `leave_types` | Leave ki categories (Annual Vacation, Sick Leave, Casual Leave) |
| `leave_balances` | Har employee ki total leaves, used leaves aur remaining balance |
| `leave_requests` | Leave applications, dates, reason aur status (`Pending`, `Approved`, `Rejected`) |
| `attendance_logs` | Daily attendance, check-in time, check-out time aur status |
| `payroll_records` | Monthly salary calculation, bonus aur payment status |

---

## 5. Saari APIs Ki List

Base URL: `http://localhost:5000/api/v1`

### 1️⃣ Employee Module (`/api/v1/employees`)
- `GET /api/v1/employees` ➡️ Sabhi employees ki list (Search & Filter ke sath).
  - Search: `?search=alex`
  - Department filter: `?department=Engineering`
  - Status filter: `?status=Active`
  - Sorting: `?sortBy=salary&sortOrder=DESC`
- `GET /api/v1/employees/:id` ➡️ Kisi ek employee ki details (ID ya `EMP-1001` pass karein).
- `POST /api/v1/employees` ➡️ Naya employee add karna (Body me JSON bhejein).
- `PUT /api/v1/employees/:id` ➡️ Employee ka data update karna.
- `DELETE /api/v1/employees/:id` ➡️ Employee ko delete karna.
- `POST /api/v1/employees/bulk-delete` ➡️ Ek sath multiple employees delete karna:
  ```json
  { "ids": ["EMP-1001", "EMP-1002"] }
  ```
- `GET /api/v1/employees/stats` ➡️ Live workforce statistics (Total staff, Active, Payroll).
- `GET /api/v1/employees/next-code` ➡️ Agla employee code generate karna (Jaise `EMP-1013`).

### 2️⃣ Department Module (`/api/v1/departments`)
- `GET /api/v1/departments` ➡️ Sabhi departments ki list + unme kitne employees hain aur kitna budget hai.
- `GET /api/v1/departments/:id` ➡️ Single department details.
- `POST /api/v1/departments` ➡️ Naya department banana.
- `PUT /api/v1/departments/:id` ➡️ Department update karna.
- `DELETE /api/v1/departments/:id` ➡️ Department delete karna.

### 3️⃣ Leave Module (`/api/v1/leaves`) — HRMS Feature
- `GET /api/v1/leaves/types` ➡️ Saare leave types dekhna (`Annual Vacation`, `Sick Leave`, etc.).
- `GET /api/v1/leaves/balance/:employeeId` ➡️ Employee ka remaining leave balance check karna.
- `GET /api/v1/leaves/requests` ➡️ Saari leave applications dekhna (`?status=Pending` filter kar sakte hain).
- `POST /api/v1/leaves/requests` ➡️ Nayi leave apply karna:
  ```json
  {
    "employeeId": "EMP-1001",
    "leaveType": "Annual Vacation",
    "startDate": "2026-11-10",
    "endDate": "2026-11-15",
    "totalDays": 5,
    "reason": "Family vacation"
  }
  ```
- `PATCH /api/v1/leaves/requests/:id/approve` ➡️ Leave approve karna (Approve hote hi balance minus ho jayega aur employee ka status `'On Leave'` ho jayega).
- `PATCH /api/v1/leaves/requests/:id/reject` ➡️ Leave reject karna.

### 4️⃣ Attendance Module (`/api/v1/attendance`) — HRMS Feature
- `GET /api/v1/attendance/roster?date=YYYY-MM-DD` ➡️ Kisi bhi date ka daily attendance roster dekhna.
- `POST /api/v1/attendance/log` ➡️ Check-in ya attendance mark karna:
  ```json
  {
    "employeeId": "EMP-1001",
    "status": "Present",
    "checkIn": "09:30:00",
    "notes": "Office working"
  }
  ```

### 5️⃣ Payroll Module (`/api/v1/payroll`) — HRMS Feature
- `GET /api/v1/payroll/summary` ➡️ Monthly & Annual salary run + salary tiers distribution.
- `GET /api/v1/payroll/ledger` ➡️ Sabhi employees ka complete salary ledger with 10% bonus estimate.

---

## 6. Future Me Naya Module Kaise Banayein?

Agar aapko kal ko koi naya feature (jaise **Performance Evaluation** ya **Training Module**) add karna ho, toh bas yeh **3 steps** follow karein:

### Step 1: `src/modules/` ke andar naya folder banayein
Jaise: `src/modules/performance/`

### Step 2: Us folder me 4 files banayein
1. `performance.model.js` ➡️ MySQL queries likhne ke liye.
2. `performance.service.js` ➡️ Business rules likhne ke liye.
3. `performance.controller.js` ➡️ Request lene aur response dene ke liye.
4. `performance.routes.js` ➡️ URLs define karne ke liye.

### Step 3: `src/routes/api.routes.js` me import karke mount karein
```javascript
import performanceRoutes from '../modules/performance/performance.routes.js';

// Niche mount karein:
router.use('/performance', performanceRoutes);
```

Bas! Aapka naya feature turant `http://localhost:5000/api/v1/performance` par live ho jayega.

---

## 7. Common Errors aur Unka Solution (FAQs)

### Q1: `Access denied for user 'root'@'localhost'` error aa raha hai?
- **Kyun aata hai?**: MySQL ka password galat hai ya `.env` me password set nahi kiya.
- **Solution**: `.env` file kholein aur `DB_PASSWORD=apka_mysql_password` likhein. Agar XAMPP hai, toh `DB_PASSWORD=` khali chhod dein.

### Q2: `ECONNREFUSED 127.0.0.1:3306` error aa raha hai?
- **Kyun aata hai?**: Aapke computer me MySQL server start nahi hai.
- **Solution**: XAMPP Control Panel kholein aur **MySQL Start** karein, ya Windows Services me jakar `MySQL` start karein.

### Q3: Kya frontend se yeh connect ho sakta hai?
- **Haan bilkul!**: Front-end ke liye [Frontend/src/services/api.js](file:///c:/Users/shilp/Desktop/DVT/Frontend/src/services/api.js) file ready hai. Backend me CORS enable hai taaki `http://localhost:5173` bina kisi error ke data exchange kar sake.

---

## 💡 Summary (Quick Recap)
- **Runtime**: Node.js v24 (ES Modules - `import/export`)
- **Framework**: Express.js
- **Database**: MySQL via `mysql2/promise` (Connection Pooling)
- **Pattern**: Modular Monolith (Clean, Organized, Highly Scalable)
- **Status**: Production Ready & Fully Documented.
