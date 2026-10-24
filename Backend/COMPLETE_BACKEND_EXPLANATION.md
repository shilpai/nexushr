# 📘 NexusHR Backend: Zero to Hero Complete Guide (Pure Hinglish)

> **Target Audience**: Beginners jinke liye Backend bilkul naya concept hai.  
> **Repository**: [shilpai/nexushr](https://github.com/shilpai/nexushr.git)  
> **Live API URL**: `https://nexushr-sandy.vercel.app/api/v1`  
> **Live Database**: TiDB Cloud Serverless MySQL (AWS Tokyo Gateway)

---

## 📑 Table of Contents (Index)
1. [Backend Kya Hota Hai? (Restaurant Example Se Samjhein)](#1-backend-kya-hota-hai-restaurant-example-se-samjhein)
2. [Modular Monolith Architecture Kya Hai Aur Kyun Chuna?](#2-modular-monolith-architecture-kya-hai-aur-kyun-chuna)
3. [Folder Structure — Ek-Ek File Aur Folder Ka Use Case](#3-folder-structure--ek-ek-file-aur-folder-ka-use-case)
4. [Ek API Request Ka Poora Safar (Request-Response Lifecycle)](#4-ek-api-request-ka-poora-safar-request-response-lifecycle)
5. [Database Setup: TiDB Cloud Serverless MySQL](#5-database-setup-tidb-cloud-serverless-mysql)
6. [Free Cloud Deployment: Vercel Serverless Setup](#6-free-cloud-deployment-vercel-serverless-setup)
7. [Debugging & Real Errors Solved (Jo-Jo Problems Aayi Aur Kaise Solve Hui)](#7-debugging--real-errors-solved-jo-jo-problems-aayi-aur-kaise-solve-hui)
8. [API Endpoints Reference List](#8-api-endpoints-reference-list)

---

## 1. Backend Kya Hota Hai? (Restaurant Example Se Samjhein)

Agar aapne abhi tak sirf Frontend (HTML, CSS, React) banaya hai, toh Backend ko ek **Restaurant** ke example se samjhein:

| Restaurant Ka Part | Web Development Me Equivalent | Iska Asli Kaam Kya Hai? |
| :--- | :--- | :--- |
| **Dining Table & Menu Card** | **Frontend (React)** | Jo customer ko aankhon ke saamne dikhta hai — buttons, styling, table, cards, form inputs. |
| **Waiter** | **API (HTTP Request / Response)** | Customer ke table se order note karke kitchen tak le jaana aur wahan se khana laana. |
| **Kitchen & Chef** | **Backend (Node.js + Express)** | Business logic — order valid hai ya nahi? Khana kaise pakana hai? Kitchen ke rules follow ho rahe hain ya nahi. |
| **Store Room (Godown)** | **Database (TiDB Cloud MySQL)** | Jahan sara kacha ration (Users, Passwords, Employees data) permanently safe rakha hota hai. |

### Sabse Zaroori Rule:
Frontend kabhi bhi **directly Database se connect nahi karta**.  
Kyun? Kyunki agar React seedhe MySQL se connect karega, toh database ka password har user ko Inspect Element (DevTools) me dikh jayega! Isiliye beech me **Backend** ek security guard aur brain banke baithta hai.

---

## 2. Modular Monolith Architecture Kya Hai Aur Kyun Chuna?

Humne NexusHR ke Backend ke liye **Modular Monolith** pattern chuna hai. Iska matlab kya hai?

1. **Simple Monolith**:
   - Sabhi features ka code ek hi folder me khichdi ban jata hai. 1-2 mahine baad agar koi naya feature jodna ho, toh pura code tootne ka dar rehta hai.
2. **Microservices**:
   - Har feature ke liye alag server aur alag database banao (jaise Employee ke liye alag server, Leaves ke liye alag server). Yeh beginners ke liye bohot complex aur bohot mehenga hota hai.
3. **Modular Monolith (Hamara Choice)**:
   - Server **ek hi** hota hai (isiliye deploy karna super easy aur 100% free hai).
   - Lekin backend ke andar ka code alag-alag **Modules** me perfectly organized hota hai:
     - `employee/`
     - `department/`
     - `leave/`
     - `attendance/`
     - `payroll/`
   - **Fayda**: Kal ko agar aapko naya module (jaise `recruitment` ya `training`) jodna ho, toh purane code ko bina chhede sirf ek naya folder banakar plug kar sakte hain!

---

## 3. Folder Structure — Ek-Ek File Aur Folder Ka Use Case

Aapke `Backend/` folder ka poora structure neeche diya gaya hai:

```text
Backend/
├── api/
│   └── index.js                 <-- Vercel Serverless Function entry point
├── src/
│   ├── app.js                   <-- Express App config (Middlewares, CORS, routes mount)
│   ├── server.js                <-- Local dev runner (port 5000 pe app.listen)
│   ├── config/
│   │   ├── db.config.js         <-- Database connection pool + SSL settings
│   │   └── env.config.js        <-- Environment variables (.env) validation
│   ├── database/
│   │   ├── schema.sql           <-- 8 MySQL tables banane ki DDL queries
│   │   ├── initDb.js            <-- Script jo Cloud DB me saare tables banati hai
│   │   └── seed.js              <-- Script jo initial dummy demo data insert karti hai
│   ├── middlewares/
│   │   └── errorHandler.middleware.js <-- Central error handling aur 404 router
│   ├── routes/
│   │   └── api.routes.js        <-- Master Router (saare modules ke routes yahan jodte hain)
│   ├── utils/
│   │   └── apiResponse.js       <-- Standard JSON response helper (success/error)
│   └── modules/
│       ├── employee/            <-- Employee Core Module
│       │   ├── employee.routes.js     <-- URLs define karta hai (/employees)
│       │   ├── employee.controller.js <-- Request/Response handle karta hai
│       │   ├── employee.service.js    <-- Business logic aur validation check karta hai
│       │   ├── employee.model.js      <-- Database queries (SQL) run karta hai
│       │   └── employee.validation.js <-- Form data check karta hai (name, email)
│       ├── department/          <-- Department Module
│       ├── leave/               <-- Leaves & HRMS Module
│       ├── attendance/          <-- Attendance Tracking Module
│       └── payroll/             <-- Payroll & Salary Ledger Module
├── .env                         <-- Secret database keys aur passwords (Git me ignore rehta hai)
├── .env.example                 <-- Dusre developers ke liye dummy template
├── package.json                 <-- Project dependencies aur npm run scripts
└── vercel.json                  <-- Vercel deployment routing configuration
```

---

### 📂 Har Ek File Ka Deep Explanation

#### 1. `src/server.js` vs `api/index.js`
- **`src/server.js`**: Jab aap apne laptop/PC par `npm run dev` chalate hain, toh yeh file `app.listen(5000)` execute karti hai aur port 5000 par local server chalu rakhti hai.
- **`api/index.js`**: Vercel par traditional 24/7 chalne wala continuous server nahi hota. Vercel **Serverless Architecture** use karta hai. Jab bhi koi internet se request aati hai, Vercel turant `api/index.js` ko wake up karta hai, request process karta hai, aur response bhejte hi band ho jata hai. Isse hamara server **zero cost** par chalta hai!

#### 2. `src/app.js` (Express Ka Main Hub)
Is file me Express application banayi jaati hai aur global middlewares lagaye jaate hain:
- **`cors()`**: Cross-Origin Resource Sharing allow karta hai taaki hamari React frontend website backend se data maang sake.
- **`express.json()`**: Frontend jo JSON data bhejta hai, use JavaScript object me convert karta hai (`req.body`).
- **`morgan('dev')`**: Terminal me har aane wali HTTP request ka status (200, 404, 500) print karta hai.
- **`app.use('/api/v1', apiRoutes)`**: Master Router ko `/api/v1` path par attach karta hai.

#### 3. `src/config/db.config.js` (Database Se Connection)
- Yahan humne **MySQL Connection Pool (`mysql2/promise`)** use kiya hai.
- **Connection Pool kya hota hai?** Har request ke liye naya connection banana aur close karna bohot slow hota hai. Pool ek sath 10 connections ready rakhta hai. Jo bhi request aati hai, pool se ek connection leti hai, query chalati hai, aur connection wapas pool me daal deti hai.
- **SSL Support (`rejectUnauthorized: true`)**: TiDB Cloud AWS Tokyo data center me hai, isiliye connection ko encrypt rakhne ke liye SSL zaroori hota hai.

#### 4. `src/modules/employee/` (Layered Architecture Pattern)
Ek clean professional backend me code 4 layers me divide hota hai:

1. **`employee.routes.js` (Raasta)**:
   - Yeh file define karti hai ki kaun se URL par kaun sa function chalega:
     - `router.get('/', EmployeeController.getAll);`
     - `router.post('/', EmployeeController.create);`
     - `router.delete('/:id', EmployeeController.delete);`
2. **`employee.controller.js` (Manager)**:
   - Yeh request aur response ke traffic ko sambhalta hai. Request se data nikalta hai (`req.body`, `req.params`), Service ko deta hai, aur wahan se jo result aaye use `ApiResponse.success(res, data)` ke through client ko bhej deta hai.
3. **`employee.service.js` (Dimag / Business Logic)**:
   - Yeh real business decisions leta hai:
     - Kya data sahi format me hai?
     - Agar employee code missing hai toh auto-generate karo (`EMP-1013`).
     - Agar sab sahi hai, toh Model ko call karo data save karne ke liye.
4. **`employee.model.js` (Database Ka Worker)**:
   - Yahan raw SQL queries likhi jaati hain (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
   - Database se jo raw rows aati hain, unhe clean frontend format me transform karta hai (`formatEmployeeRecord`).
5. **`employee.validation.js` (Checking Guard)**:
   - Form submit hote hi check karta hai:
     - Name empty toh nahi hai?
     - Email valid hai ya nahi?
     - Salary negative toh nahi hai?

---

## 4. Ek API Request Ka Poora Safar (Request-Response Lifecycle)

Maan lijiye user ne React UI me **"Add Employee"** form bhar kar **Save** dabaya. Pura process step-by-step kaise hota hai:

```text
[Step 1] React Frontend (Browser)
   │
   ▼ POST request bhejta hai: https://nexushr-sandy.vercel.app/api/v1/employees
[Step 2] Vercel Serverless Function (api/index.js)
   │
   ▼ Request ko Express application (app.js) me forward karta hai
[Step 3] Express App (src/app.js)
   │
   ▼ URL match hota hai -> Master Router (src/routes/api.routes.js)
[Step 4] Employee Routes (src/modules/employee/employee.routes.js)
   │
   ▼ Route match hota hai: POST '/' -> EmployeeController.create
[Step 5] Employee Controller (src/modules/employee/employee.controller.js)
   │
   ▼ req.body nikaal kar deta hai: EmployeeService.createEmployee(req.body)
[Step 6] Employee Service (src/modules/employee/employee.service.js)
   │
   ▼ Validation check karta hai -> EmployeeModel.create(payload)
[Step 7] Employee Model (src/modules/employee/employee.model.js)
   │
   ▼ SQL Query execute karta hai TiDB Cloud MySQL database par
[Step 8] TiDB Cloud Database (AWS Tokyo Serverless MySQL)
   │
   ▼ Naya record save karta hai aur Insert ID (e.g. 13) return karta hai
[Step 9] Wapas Safar: Model -> Service -> Controller
   │
   ▼ Controller ApiResponse.created(res, newEmployee) bhejta hai
[Step 10] React Frontend par HTTP 201 Response receive hota hai
   │
   ▼ UI me naya card turant add ho jata hai aur Toast notification dikhta hai!
```

---

## 5. Database Setup: TiDB Cloud Serverless MySQL

Humne local MySQL ki jagah **TiDB Cloud Serverless MySQL** kyun chuna?

1. **100% Free Forever**:
   - 5 GB free storage milta hai jo portfolio ya production app ke liye kafi bada hai.
2. **Zero Credit Card Required**:
   - Account banane ke liye debit ya credit card ki bilkul zaroorat nahi padti.
3. **Pure MySQL Compatibility**:
   - Standard MySQL driver (`mysql2`) se seamlessly connect hota hai.
4. **Cloud Managed**:
   - Aapka laptop band ho jaye tab bhi database 24/7 cloud par chalu rehta hai.

### Hamare Database Me 8 Tables Banaye Gaye:
1. **`departments`**: Company ke saare departments (Engineering, HR, Sales, Design).
2. **`employees`**: Employees ka master record (name, email, role, salary, avatar, phone).
3. **`employee_skills`**: Har employee ke technical skills (React, Node.js, Python, SQL).
4. **`leave_types`**: Leave categories (Paid Leave, Sick Leave, Casual Leave).
5. **`leave_balances`**: Har saal ka leave balance (Total: 24, Taken: 2, Remaining: 22).
6. **`leave_requests`**: Employees ki leave applications (Pending, Approved, Rejected).
7. **`attendance_logs`**: Rozana ki attendance (Present, Remote, Late, Absent).
8. **`payroll_records`**: Monthly salary payout, bonus, aur net pay calculations.

---

## 6. Free Cloud Deployment: Vercel Serverless Setup

Render aur dusre platforms verification ke liye credit card maang rahe the. Isiliye humne Backend ko **Vercel Serverless** par deploy kiya.

### Is Setup Ka Formula:
1. **`api/index.js` banaya**:
   ```javascript
   import app from '../src/app.js';
   export default app;
   ```
   Express app ko Vercel ke serverless handler me convert karta hai.
2. **`vercel.json` banaya**:
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "api/index.js", "use": "@vercel/node" }
     ],
     "routes": [
       { "src": "/(.*)", "dest": "api/index.js" }
     ]
   }
   ```
   Iska matlab: Vercel par jo bhi request aaye (`/*`), use seedhe hamare Express app (`api/index.js`) par bhej do!
3. **Vercel Environment Variables**:
   Vercel ke Settings panel me `DATABASE_URL` add kiya, jisse database password public nahi hota aur cloud par securely store rehta hai.

---

## 7. Debugging & Real Errors Solved (Jo-Jo Problems Aayi Aur Kaise Solve Hui)

Real development me galtiyan aana normal hai. Humne ye 5 major issues face kiye aur step-by-step resolve kiye:

### ⚠️ Problem 1: Git me 200,000 `node_modules` files track ho gayi thi
- **Problem**: Root folder me `.gitignore` nahi tha. Jab `git add .` kiya, toh hajaron files stage ho gayi aur git freeze hone laga.
- **Solution**: 
  1. Root me `.gitignore` file banayi aur usme `node_modules/` likha.
  2. `git rm -r --cached Backend/node_modules` command run karke git cache se saari unnecessary files hatayi aur fresh commit kiya.

### ⚠️ Problem 2: TiDB Cloud Username Case-Sensitivity Error
- **Problem**: Database connection fail ho raha tha: `Access denied for user ... check user-name-prefix`.
- **Reason**: TiDB cluster username prefix me capital letter tha (`4Ya4LvB5LStkKV2.root`), lekin humne typo me small `b` (`4Ya4Lvb5LStkKV2.root`) likh diya tha. TiDB username case-sensitive hota hai!
- **Solution**: Screenshot se exact connection string check ki, capital `B` lagaya, aur connection turant successful ho gaya.

### ⚠️ Problem 3: MySQL 8 Strict Mode (`ONLY_FULL_GROUP_BY`) Error
- **Problem**: `/api/v1/employees` call karne par 500 error aaya: `Expression #11 of SELECT list is not in GROUP BY clause and contains nonaggregated column`.
- **Reason**: MySQL 8 me agar aap `GROUP BY e.id` use karte hain, toh JOIN ki gayi dusri table (`leave_balances`) ke non-grouped columns ko direct select nahi kar sakte bina aggregate function ke.
- **Solution**: SQL query ko update karke `MAX(COALESCE(...))` lagaya:
  ```sql
  MAX(COALESCE(lb.total_allowance, 24)) as totalLeaves,
  MAX(COALESCE(lb.used_days, 0)) as leavesTaken
  ```
  Isse MySQL strict mode satisfy ho gaya aur query chal gayi.

### ⚠️ Problem 4: Local Server `EADDRINUSE: :::5000` Error
- **Problem**: `npm run dev` chalane par port 5000 busy bata raha tha.
- **Reason**: Pichla Node.js process background me port 5000 ko hold karke baitha tha.
- **Solution**: Process ko terminate kiya aur fresh process start kiya.

### ⚠️ Problem 5: CORS Blockage Error
- **Problem**: Browser alag domain se request accept nahi karta (security feature).
- **Solution**: `Backend/src/app.js` me dynamic origin allow kiya:
  ```javascript
  app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true
  }));
  ```
  Isse localhost, Vercel frontend, ya koi bhi client bina CORS error ke API call kar sakta hai.

---

## 8. API Endpoints Reference List

Yeh saare endpoints aapke live server par active hain:  
Base URL: `https://nexushr-sandy.vercel.app/api/v1`

| HTTP Method | Endpoint URL | Kaam Kya Hai? |
| :--- | :--- | :--- |
| **GET** | `/health` | Server aur database ka health status check karna |
| **GET** | `/employees` | Saare employees ki list lana (search, filter, pagination ke sath) |
| **GET** | `/employees/:id` | Kisi ek employee ka poora detail profile fetch karna |
| **POST** | `/employees` | Naya employee database me register karna |
| **PUT** | `/employees/:id` | Existing employee ki information update karna |
| **DELETE**| `/employees/:id` | Employee ko database se permanently delete karna |
| **POST** | `/employees/bulk-delete` | Multiple selected employees ko ek sath delete karna |
| **GET** | `/departments` | Saare departments aur unke budget stats lana |
| **GET** | `/leaves/requests` | HRMS leave applications ki list lana |
| **PATCH**| `/leaves/requests/:id/approve` | Employee ki leave application approve karna |
| **PATCH**| `/leaves/requests/:id/reject` | Employee ki leave application reject karna |
| **GET** | `/attendance/roster` | Aaj ki live staff attendance dekhna |
| **GET** | `/payroll/summary` | Company ka total salary payout aur average salary stats lana |

---

## 🎯 Final Takeaway (Ab Aapko Backend Me Kya-Kya Aata Hai):
1. **Node.js & Express**: Professional structured server banana.
2. **Layered Code Architecture**: Route -> Controller -> Service -> Model pattern samajhna.
3. **Cloud Database (MySQL / TiDB)**: Cloud database tables banana, queries likhna, aur SSL connection karna.
4. **Serverless Deployment**: Vercel par bina credit card ke 100% free me backend live karna.
5. **Fullstack Integration**: React Frontend ko live backend API se connect karke real-time CRUD chalana.
