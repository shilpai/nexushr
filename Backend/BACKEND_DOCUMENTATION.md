# 📘 NexusHR Backend — Complete Technical & Setup Guide (English & हिन्दी)

NexusHR का Backend **Node.js (Express.js)** और **MySQL** डेटाबेस पर बना हुआ है, जिसे **Modular Monolithic Architecture** में डिज़ाइन किया गया है ताकि भविष्य में **Leave Management**, **Attendance**, **Payroll** और अन्य HRMS मॉड्यूल्स को आसानी से बढ़ाया जा सके।

---

## 📑 Table of Contents (विषय सूची)

1. [Architecture Overview (आर्किटेक्चर की जानकारी)](#1-architecture-overview-आर्किटेक्चर-की-जानकारी)
2. [Prerequisites (ज़रूरी सॉफ़्टवेयर)](#2-prerequisites-ज़रूरी-सॉफ़्टवेयर)
3. [Step-by-Step Setup & Installation (सेटअप और इंस्टॉलेशन निर्देश)](#3-step-by-step-setup--installation-सेटअप-और-इंस्टॉलेशन-निर्देश)
4. [Environment Variables - `.env` Guide (.env फाइल की सेटिंग्स)](#4-environment-variables---env-guide-env-फाइल-की-सेटिंग्स)
5. [Database Schema & Tables (डेटाबेस टेबल्स और संरचना)](#5-database-schema--tables-डेटाबेस-टेबल्स-और-संरचना)
6. [Folder & Module Structure (फ़ोल्डर और मॉड्यूल संरचना)](#6-folder--module-structure-फ़ोल्डर-और-मॉड्यूल-संरचना)
7. [API Endpoints Documentation (सारे API एंडपॉइंट्स की सूची)](#7-api-endpoints-documentation-सारे-api-एंडपॉइंट्स-की-सूची)
8. [How to Add a New HRMS Module in Future (भविष्य में नया मॉड्यूल कैसे बनाएं)](#8-how-to-add-a-new-hrms-module-in-future-भविष्य-में-नया-मॉड्यूल-कैसे-बनाएं)
9. [Troubleshooting & FAQs (समस्या निवारण / सामान्य गलतियां)](#9-troubleshooting--faqs-समस्या-निवारण--सामान्य-गलतियां)

---

## 1. Architecture Overview (आर्किटेक्चर की जानकारी)

### English:
This backend is structured as a **Modular Monolith**. Rather than separating the codebase solely by technical roles (e.g. putting all controllers in one generic folder and all models in another), code is organized into **self-contained domain modules** (`employee`, `department`, `leave`, `attendance`, `payroll`). Each module encapsulates its own routes, controller, business logic (service), and database queries (model).

### हिन्दी (Hindi):
यह बैकएंड **Modular Monolithic (मॉड्यूलर मोनोलिथिक)** पैटर्न पर आधारित है। सामान्य प्रोजेक्ट्स में सभी फाइल्स अलग-अलग लेयर्स में बिखरी होती हैं, जिससे प्रोजेक्ट बड़ा होने पर मैनेज करना मुश्किल हो जाता है। लेकिन मॉड्यूलर मोनोलिथ में प्रत्येक फीचर को एक स्वतंत्र मॉड्यूल (Folder) में रखा जाता है:
- `employee` मॉड्यूल अपना सारा काम (CRUD, सर्च, फ़िल्टर) खुद संभालता है।
- `leave` मॉड्यूल छुट्टियां (Leave requests, balances, approval) संभालता है।
- `payroll` मॉड्यूल वेतन और भत्ते संभालता है।
- **फायदा**: भविष्य में अगर आपको नया फीचर (जैसे Performance Review या Recruitment) जोड़ना हो, तो बिना पुराने कोड को छेड़े नया मॉड्यूल जोड़ा जा सकता है।

---

## 2. Prerequisites (ज़रूरी सॉफ़्टवेयर)

सुनिश्चित करें कि आपके कंप्यूटर में नीचे दिए गए सॉफ़्टवेयर इंस्टॉल हैं:
1. **Node.js**: v18 या उससे अधिक (जांचने के लिए: `node -v`)
2. **NPM**: Node के साथ आता है (जांचने के लिए: `npm -v`)
3. **MySQL Server**: (XAMPP / WAMP / MySQL Workbench / Docker) चालू होना चाहिए (पोर्ट 3306 पर)।

---

## 3. Step-by-Step Setup & Installation (सेटअप और इंस्टॉलेशन निर्देश)

### Step 1: Open Terminal in Backend folder (टर्मिनल खोलें)
```powershell
cd c:\Users\shilp\Desktop\DVT\Backend
```

### Step 2: Install Dependencies (पैकेजेस इंस्टॉल करें)
```powershell
npm install
```

### Step 3: Configure `.env` File (.env फाइल में पासवर्ड सेट करें)
`Backend/.env` फाइल खोलें और अपने MySQL का पासवर्ड दर्ज करें:
```env
PORT=5000
NODE_ENV=development

# MySQL Database Details
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=nexushr_db
DB_PORT=3306

# Frontend CORS Origin
CLIENT_URL=http://localhost:5173
```
> **नोट (Note)**: अगर आप **XAMPP** उपयोग कर रहे हैं, तो डिफ़ॉल्ट रूप से `DB_PASSWORD` खाली (`DB_PASSWORD=`) रहता है। अगर आपने MySQL इंस्टॉल करते समय पासवर्ड सेट किया था (जैसे `root` या `admin123`), तो वह पासवर्ड यहाँ लिखें।

### Step 4: Run Database Migration & Auto-Create Tables (डेटाबेस टेबल्स बनाएं)
यह कमांड अपने-आप `nexushr_db` डेटाबेस और सारी 8 टेबल्स बना देगा:
```powershell
npm run db:init
```

### Step 5: (Optional) Seed Sample Data (डेमो डेटा लोड करें)
अगर आप चाहते हैं कि शुरुआत में ही 12 कर्मचारियों और विभागों का डेटा डेटाबेस में भर जाए:
```powershell
npm run db:seed
```

### Step 6: Start Server (सर्वर चालू करें)
- **डेवलपमेंट मोड (Auto-reload on code change)**:
  ```powershell
  npm run dev
  ```
- **प्रोडक्शन मोड**:
  ```powershell
  npm start
  ```

सर्वर चालू होने पर टर्मिनल में यह दिखेगा:
```
=======================================================
🚀 NexusHR Modular Monolith API Server Running
📡 URL: http://localhost:5000
🔗 API Base: http://localhost:5000/api/v1
=======================================================
[Database] Successfully connected to MySQL database: nexushr_db
```

---

## 4. Environment Variables - `.env` Guide (.env फाइल की सेटिंग्स)

| Variable | Description (विवरण) | Default |
|---|---|---|
| `PORT` | बैकएंड सर्वर किस पोर्ट पर चलेगा | `5000` |
| `NODE_ENV` | वातावरण (`development` या `production`) | `development` |
| `DB_HOST` | MySQL होस्ट का पता | `localhost` |
| `DB_USER` | MySQL यूजरनेम | `root` |
| `DB_PASSWORD`| MySQL का पासवर्ड | (खाली या आपका पासवर्ड) |
| `DB_NAME` | डेटाबेस का नाम | `nexushr_db` |
| `DB_PORT` | MySQL पोर्ट | `3306` |
| `CLIENT_URL` | फ्रंटएंड React ऐप का URL (CORS सुरक्षा के लिए) | `http://localhost:5173` |

---

## 5. Database Schema & Tables (डेटाबेस टेबल्स और संरचना)

यह प्रोजेक्ट MySQL में 8 मुख्य टेबल्स का उपयोग करता है (InnoDB Engine, UTF-8 character set):

```
                        ┌──────────────────┐
                        │   departments    │
                        └────────┬─────────┘
                                 │ 1:N
                                 ▼
┌───────────────────────┐  ┌─────────────┐  ┌─────────────────────┐
│    employee_skills    │◄─┤  employees  ├─►│   leave_balances    │
└───────────────────────┘  └──────┬──────┘  └─────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │ 1:N                    │ 1:N                    │ 1:N
         ▼                        ▼                        ▼
┌──────────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  leave_requests  │     │ attendance_logs │     │ payroll_records  │
└──────────────────┘     └─────────────────┘     └──────────────────┘
```

1. **`departments`**: विभागों के नाम, कोड, बजट और डिपार्टमेंट हेड।
2. **`employees`**: कर्मचारियों की पूरी प्रोफाइल, सैलरी, पद, स्टेटस, फोन, ईमेल और इमरजेंसी कांटेक्ट।
3. **`employee_skills`**: कर्मचारी के स्किल्स (जैसे React, Node.js, TypeScript)।
4. **`leave_types`**: छुट्टियों के प्रकार (Annual Vacation, Sick Leave, Casual Leave, आदि)।
5. **`leave_balances`**: प्रत्येक कर्मचारी की सालाना छुट्टी का कोटा (Used vs Remaining days)।
6. **`leave_requests`**: छुट्टियों की अर्जी, स्टेटस (`Pending`, `Approved`, `Rejected`) और तारीखें।
7. **`attendance_logs`**: प्रतिदिन की हाजिरी (Present, On Leave, Late, Check-in/out समय)।
8. **`payroll_records`**: मासिक वेतन गणना, बोनस और भुगतान की स्थिति।

---

## 6. Folder & Module Structure (फ़ोल्डर और मॉड्यूल संरचना)

```
Backend/src/
│
├── config/                  # कॉन्फ़िगरेशन फाइल्स
│   ├── db.config.js         # MySQL Connection Pool और टेस्ट कनेक्शन
│   └── env.config.js        # Environment variables लोडर
│
├── database/                # डेटाबेस ऑपरेशन्स
│   ├── schema.sql           # पूरी SQL टेबल डेफिनिशन्स
│   ├── initDb.js            # ऑटो डेटाबेस और टेबल क्रिएटर
│   └── seed.js              # शुरुआती डमी डेटा इंसर्ट करने वाला स्क्रिप्ट
│
├── middlewares/             # एक्सप्रेस मिडलवेयर्स
│   └── errorHandler.middleware.js # सेंट्रल एरर और 404 हैंडलर
│
├── utils/                   # हेल्पर्स
│   └── apiResponse.js       # एक समान JSON रिस्पॉन्स देने वाला हेल्पर
│
├── routes/                  # मास्टर रूटिंग
│   └── api.routes.js        # सारे मॉड्यूल्स को /api/v1 पर कनेक्ट करता है
│
└── modules/                 # 🌟 Domain Modules (मॉड्यूलर आर्किटेक्चर)
    ├── employee/            # 👥 कर्मचारी मॉड्यूल (CRUD, सर्च, फ़िल्टर, स्टेट्स)
    │   ├── employee.model.js
    │   ├── employee.service.js
    │   ├── employee.controller.js
    │   ├── employee.routes.js
    │   └── employee.validation.js
    │
    ├── department/          # 🏢 विभाग मॉड्यूल (Department Roster, Budgets)
    │   ├── department.model.js
    │   ├── department.controller.js
    │   └── department.routes.js
    │
    ├── leave/               # 📅 लीव मॉड्यूल (Apply, Approve, Reject, Balances)
    │   ├── leave.model.js
    │   ├── leave.controller.js
    │   └── leave.routes.js
    │
    ├── attendance/          # ⏰ अटेंडेंस मॉड्यूल (Daily Roster, Clock-in)
    │   ├── attendance.model.js
    │   ├── attendance.controller.js
    │   └── attendance.routes.js
    │
    └── payroll/             # 💰 पेरोल मॉड्यूल (Salary Tiers, Bonus, Ledger)
        ├── payroll.model.js
        ├── payroll.controller.js
        └── payroll.routes.js
```

---

## 7. API Endpoints Documentation (सारे API एंडपॉइंट्स की सूची)

सभी API कॉल्स का बेस URL: `http://localhost:5000/api/v1`

### 1️⃣ Employee Module (कर्मचारी API)

#### `GET /api/v1/employees`
कर्मचारियों की सूची प्राप्त करें (सर्च, फ़िल्टर और सॉर्टिंग के साथ)।
- **Query Parameters**:
  - `search`: नाम, ईमेल, रोल या लोकेशन से खोजें (`?search=alex`)
  - `department`: विभाग अनुसार (`?department=Engineering`)
  - `status`: स्थिति अनुसार (`?status=Active` या `On Leave`)
  - `type`: जॉब का प्रकार (`?type=Remote` या `Full-time`)
  - `sortBy`: `name`, `salary`, `rating`, `date`
  - `sortOrder`: `ASC` या `DESC`
- **Response Example**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Employees retrieved successfully",
  "data": [
    {
      "id": "EMP-1001",
      "name": "Alexandria Rivera",
      "email": "alexandria.r@nexushr.io",
      "role": "Staff Software Engineer",
      "department": "Engineering",
      "status": "Active",
      "salary": 165000,
      "skills": ["React", "TypeScript", "Node.js"]
    }
  ],
  "meta": { "count": 1 }
}
```

#### `GET /api/v1/employees/:id`
किसी एक कर्मचारी की पूरी जानकारी निकालें (ID या `EMP-1001` पास करें)।

#### `POST /api/v1/employees`
नया कर्मचारी जोड़ें।
- **Request Body Example**:
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh.k@nexushr.io",
  "phone": "+91 98765 43210",
  "role": "Senior Backend Developer",
  "department": "Engineering",
  "type": "Full-time",
  "status": "Active",
  "location": "Bengaluru, India",
  "salary": 140000,
  "skills": ["Node.js", "MySQL", "Express", "Docker"],
  "emergencyContact": {
    "name": "Sunita Kumar",
    "relation": "Spouse",
    "phone": "+91 98765 00000"
  }
}
```

#### `PUT /api/v1/employees/:id`
कर्मचारी की जानकारी अपडेट करें।

#### `DELETE /api/v1/employees/:id`
कर्मचारी का रिकॉर्ड डिलीट करें।

#### `POST /api/v1/employees/bulk-delete`
एक साथ कई कर्मचारियों को डिलीट करें।
- **Request Body**:
```json
{
  "ids": ["EMP-1005", "EMP-1006"]
}
```

#### `GET /api/v1/employees/stats`
वर्कफोर्स के लाइव आंकड़े (कुल कर्मचारी, एक्टिव, लीव पर, कुल पेरोल)।

#### `GET /api/v1/employees/next-code`
अगला ऑटोमैटिक कर्मचारी कोड प्राप्त करें (जैसे `EMP-1013`)।

---

### 2️⃣ Department Module (विभाग API)

#### `GET /api/v1/departments`
सभी विभागों की सूची, उनके कर्मचारी संख्या और बजट के साथ।

#### `POST /api/v1/departments`
नया विभाग बनाएं:
```json
{
  "name": "DevOps & Cloud",
  "code": "CLD",
  "description": "Cloud infrastructure and SRE team",
  "budget": 450000.00,
  "lead_name": "Liam O'Connor"
}
```

---

### 3️⃣ Leave Module (छुट्टी प्रबंधन API)

#### `GET /api/v1/leaves/types`
छुट्टी के सभी प्रकार देखें (`Annual Vacation`, `Sick Leave`, आदि)।

#### `GET /api/v1/leaves/balance/:employeeId`
किसी कर्मचारी की बची हुई छुट्टियां देखें (Used vs Remaining)।

#### `GET /api/v1/leaves/requests`
छुट्टियों के आवेदन देखें (`?status=Pending` फ़िल्टर कर सकते हैं)।

#### `POST /api/v1/leaves/requests`
छुट्टी के लिए आवेदन दें:
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

#### `PATCH /api/v1/leaves/requests/:id/approve`
छुट्टी स्वीकृत (Approve) करें।
- **ऑटोमेशन**: छुट्टी अप्रूव होते ही कर्मचारी के बैलेंस में से दिन कट जाएंगे और उसका स्टेटस `'On Leave'` हो जाएगा।

#### `PATCH /api/v1/leaves/requests/:id/reject`
छुट्टी अस्वीकृत (Reject) करें।

---

### 4️⃣ Attendance Module (हाजिरी API)

#### `GET /api/v1/attendance/roster?date=2026-10-23`
किसी भी तारीख का दैनिक हाजिरी रोस्टर देखें।

#### `POST /api/v1/attendance/log`
चेक-इन या हाजिरी रिकॉर्ड करें:
```json
{
  "employeeId": "EMP-1001",
  "status": "Present",
  "checkIn": "09:30:00",
  "checkOut": "18:30:00",
  "notes": "Worked from office"
}
```

---

### 5️⃣ Payroll Module (वेतन और पेरोल API)

#### `GET /api/v1/payroll/summary`
मासिक और वार्षिक पेरोल का कुल विवरण और सैलरी ब्रैकेट्स (<$100k, $100k-$150k, आदि)।

#### `GET /api/v1/payroll/ledger`
सभी कर्मचारियों की विस्तृत सैलरी लिस्ट, मासिक ग्रॉस और अनुमानित बोनस के साथ।

---

## 8. How to Add a New HRMS Module in Future (भविष्य में नया मॉड्यूल कैसे बनाएं)

अगर आप भविष्य में कोई नया मॉड्यूल (जैसे `recruitment` या `performance`) जोड़ना चाहते हैं, तो यह बहुत आसान है:

### चरण 1: `src/modules/` में नया फ़ोल्डर बनाएं
उदाहरण के लिए: `src/modules/performance/`

### चरण 2: 4 फाइल्स बनाएं
1. `performance.model.js` (MySQL क्वेरीज़)
2. `performance.service.js` (बिज़नेस लॉजिक)
3. `performance.controller.js` (रिक्वेस्ट/रिस्पॉन्स)
4. `performance.routes.js` (एक्सप्रेस रूट्स)

### चरण 3: मास्टर रूट में रजिस्टर करें
`src/routes/api.routes.js` खोलें और 2 लाइनें जोड़ें:
```javascript
import performanceRoutes from '../modules/performance/performance.routes.js';

// नीचे माउंट करें:
router.use('/performance', performanceRoutes);
```
बस! आपका नया मॉड्यूल `http://localhost:5000/api/v1/performance` पर चालू हो जाएगा।

---

## 9. Troubleshooting & FAQs (समस्या निवारण / सामान्य गलतियां)

### Q1: `Access denied for user 'root'@'localhost'` एरर आ रहा है?
- **कारण**: MySQL का पासवर्ड गलत है या खाली नहीं है।
- **समाधान**: `.env` फाइल खोलें और `DB_PASSWORD=आपका_पासवर्ड` लिखें। अगर XAMPP है, तो `DB_PASSWORD=` खाली छोड़ दें।

### Q2: `ECONNREFUSED 127.0.0.1:3306` एरर आ रहा है?
- **कारण**: आपके कंप्यूटर पर MySQL सर्वर चालू नहीं है।
- **समाधान**: XAMPP कंट्रोल पैनल से MySQL चालू करें या Windows Services में जाकर `MySQL` सर्विस को **Start** करें।

### Q3: क्या डेटाबेस और टेबल्स मुझे खुद MySQL में बनानी पड़ेंगी?
- **नहीं**: आपको सिर्फ `npm run db:init` चलाना है। यह कोड खुद MySQL से कनेक्ट होकर `CREATE DATABASE IF NOT EXISTS nexushr_db` और सभी 8 टेबल्स अपने आप बना देता है।

### Q4: क्या फ्रंटएंड सीधे इस बैकएंड से बात कर सकता है?
- **हाँ**: फ्रंटएंड के लिए [Frontend/src/services/api.js](file:///c:/Users/shilp/Desktop/DVT/Frontend/src/services/api.js) फाइल पहले से तैयार कर दी गई है। बैकएंड में CORS सेटअप है ताकि `http://localhost:5173` बिना किसी रोक-टोक के डेटा फेच और अपडेट कर सके।

---

## 🎯 Summary (निष्कर्ष)
- **Framework**: Node.js v24 + Express.js v4 (ES Modules)
- **Database**: MySQL 8+ / MariaDB via `mysql2/promise`
- **Architecture**: Domain-Driven Modular Monolith
- **Ready for**: Leave, Attendance, Payroll, Performance, and HRMS extensions.
