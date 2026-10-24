# 🎓 Backend for Beginners — A to Z Guide (शुरुआती डेवलपर्स के लिए आसान गाइड)

अगर आप **Backend Development** में बिल्कुल नए हैं, तो यह गाइड खास आपके लिए है!  
यहाँ बिल्कुल आसान भाषा (Hinglish) में समझाया गया है कि:
1. बैकएंड असल में काम कैसे करता है?
2. एक-एक फाइल और फोल्डर का क्या काम है?
3. फ्रंटएंड से डेटा आने पर वह किस फाइल से होकर डेटाबेस में सेव होता है?
4. अगर आपको भविष्य में कोई नया फीचर जोड़ना हो या कोई बदलाव करना हो, तो किस फाइल को छूना है?

---

## 🍽️ 1. Real-Life Analogy: एक रेस्टोरेंट का उदाहरण

बैकएंड को समझना बहुत आसान है अगर आप इसे एक **रेस्टोरेंट** की तरह सोचें:

| रेस्टोरेंट में कौन क्या करता है? | हमारे प्रोजेक्ट में वह कौन सी फाइल है? | काम क्या है? |
|---|---|---|
| **ग्राहक (Customer)** | **Frontend (React UI)** | स्क्रीन पर बटन दबाता है (जैसे "Add Employee")। |
| **वेटर (Waiter)** | **Routes (`*.routes.js`)** | ग्राहक से ऑर्डर (Request) लेता है और सही काउंटर पर ले जाता है। |
| **गार्ड / चेकर (Security)** | **Validation (`*.validation.js`)** | चेक करता है कि ऑर्डर सही है या नहीं (जैसे नाम खाली तो नहीं है?)। |
| **काउंटर मैनेजर (Manager)** | **Controller (`*.controller.js`)** | रिक्वेस्ट को स्वीकार करता है, काम सौंपता है और अंत में ग्राहक को खाना (Response) सौंपता है। |
| **मुख्य शेफ (Chef)** | **Service (`*.service.js`)** | असली नियम लागू करता है (जैसे ऑटोमैटिक EMP कोड बनाना, सैलरी कैलकुलेट करना)। |
| **स्टोरकीपर (Storekeeper)** | **Model (`*.model.js`)** | सीधे स्टोररूम से सामान लाता या रखता है (SQL क्वेरी चलाता है)। |
| **स्टोररूम (Warehouse)** | **MySQL Database** | जहाँ सारा डेटा हमेशा के लिए सुरक्षित सेव रहता है। |

---

## 🔄 2. Request Lifecycle: जब कोई बटन दबता है तो क्या होता है?

मान लीजिए आपने फ्रंटएंड पर **"Save Employee"** बटन दबाया। बैकएंड के अंदर डेटा का सफर कुछ ऐसा होता है:

```
[React Frontend] (यूजर ने फॉर्म भरकर सबमिट किया)
       │
       ▼
1. [src/server.js] (दरवाजा खुला - पोर्ट 5000 पर रिक्वेस्ट आई)
       │
       ▼
2. [src/app.js] (सिक्योरिटी चेक - CORS चेक हुआ, JSON डेटा पार्स हुआ)
       │
       ▼
3. [src/routes/api.routes.js] (दिशा-निर्देश - रिक्वेस्ट /api/v1/employees पर गई)
       │
       ▼
4. [src/modules/employee/employee.routes.js] (पहचाना कि यह POST मेथड है)
       │
       ▼
5. [src/modules/employee/employee.controller.js] (रिक्वेस्ट डेटा req.body से निकाला)
       │
       ▼
6. [src/modules/employee/employee.service.js] (चेक किया कि नाम/ईमेल सही है, अगला कोड EMP-1013 जनरेट किया)
       │
       ▼
7. [src/modules/employee/employee.model.js] (MySQL में 'INSERT INTO employees ...' क्वेरी चलाई)
       │
       ▼
8. [MySQL Database] (डेटाबेस में नई पंक्ति सेव हो गई ✅)
       │
       ▼
9. [src/utils/apiResponse.js] (वापस सुंदर JSON { success: true, message: "Added" } बनाया)
       │
       ▼
[React Frontend] (स्क्रीन पर हरा Toast नोटिफिकेशन दिखा: "Added Successfully!")
```

---

## 📂 3. हर एक फोल्डर और फाइल का काम (Complete Folder & File Breakdown)

यहाँ प्रोजेक्ट के प्रत्येक फोल्डर और फाइल का सटीक उद्देश्य दिया गया है:

### 🏠 Root Level Files (मुख्य फाइलें)

#### 1. `.env` (Environment Configuration)
- **काम**: इसमें आपके कंप्यूटर और डेटाबेस की सीक्रेट सेटिंग्स होती हैं (जैसे MySQL का पासवर्ड, पोर्ट नंबर)।
- **क्यों जरूरी है?**: कोड में कभी पासवर्ड नहीं लिखा जाता। पासवर्ड हमेशा `.env` में रहता है।

#### 2. `package.json` (प्रोजेक्ट की कुंडली)
- **काम**: इसमें प्रोजेक्ट का नाम, कौन-कौन सी लाइब्रेरियां (express, mysql2, cors) इस्तेमाल हो रही हैं, और रन करने वाले कमांड्स (`npm run dev`) लिखे होते हैं।

#### 3. `src/server.js` (स्टार्ट बटन / Main Engine)
- **काम**: यह आपके बैकएंड का स्टार्टर है। जब आप `npm run dev` चलाते हैं, तो सबसे पहले यही फाइल चलती है। यह पोर्ट 5000 पर सर्वर चालू करती है और MySQL डेटाबेस से कनेक्शन चेक करती है।

#### 4. `src/app.js` (Express की मुख्य असेंबली)
- **काम**: यह एक्सप्रेस एप्लिकेशन का केंद्र है। यहाँ CORS (ताकि React कनेक्ट हो सके), बॉडी पार्सर (ताकि JSON डेटा पढ़ा जा सके), लॉगर, और सारे रूट्स लोड होते हैं।

---

### ⚙️ `src/config/` (कॉन्फ़िगरेशन फोल्डर)

#### `src/config/env.config.js`
- **काम**: `.env` फाइल से सेटिंग्स को पढ़कर पूरे प्रोजेक्ट के लिए आसान जावास्क्रिप्ट ऑब्जेक्ट `ENV.DB.HOST`, `ENV.PORT` में बदलता है।

#### `src/config/db.config.js`
- **काम**: **MySQL Connection Pool** बनाता है। 
- **Pool क्या होता है?**: बार-बार नया कनेक्शन खोलने और बंद करने की बजाय 10 कनेक्शन हमेशा तैयार रखता है, जिससे डेटाबेस बहुत तेज़ चलता है।

---

### 🗄️ `src/database/` (डेटाबेस और टेबल्स)

#### `src/database/schema.sql`
- **काम**: यह शुद्ध SQL फाइल है। इसमें सारी 8 टेबल्स (`employees`, `departments`, `leave_requests`, आदि) को बनाने के लिए `CREATE TABLE` कमांड्स लिखे हैं।

#### `src/database/initDb.js`
- **काम**: यह एक जादुई स्क्रिप्ट है! जब आप `npm run db:init` चलाते हैं, तो यह फाइल MySQL से जुड़ती है, अपने आप `nexushr_db` डेटाबेस बनाती है, और `schema.sql` को रन करके सारी टेबल्स बना देती है। आपको MySQL में जाकर हाथ से टेबल नहीं बनानी पड़ती।

#### `src/database/seed.js`
- **काम**: जब आप `npm run db:seed` चलाते हैं, तो यह फाइल डेटाबेस में 12 डमी एम्प्लॉई, 7 डिपार्टमेंट्स और डमी लीव रिक्वेस्ट्स भर देती है ताकि टेस्टिंग के लिए डेटा तैयार रहे।

---

### 🛡️ `src/middlewares/` (बीच में पहरा देने वाले)

#### `src/middlewares/errorHandler.middleware.js`
- **काम**: अगर कभी कोड में कोई एरर आ जाए (जैसे गलत SQL क्वेरी या डुप्लीकेट ईमेल), तो सर्वर क्रैश होने के बजाय यह फाइल उस एरर को पकड़ती है और फ्रंटएंड को साफ-सुथरा एरर मैसेज भेजती है।

---

### 🧰 `src/utils/` (हेल्पर टूल्स)

#### `src/utils/apiResponse.js`
- **काम**: फ्रंटएंड को जाने वाला हर रिस्पॉन्स हमेशा एक जैसा फॉर्मेट रखता है:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "काम पूरा हुआ",
    "data": { ... }
  }
  ```

---

### 🧭 `src/routes/` (दिशा-निर्देश)

#### `src/routes/api.routes.js`
- **काम**: यह मुख्य ट्रैफिक पुलिस है। यह तय करता है कि:
  - `/api/v1/employees` पर जाने वाली रिक्वेस्ट `employee.routes.js` के पास जाए।
  - `/api/v1/leaves` पर जाने वाली रिक्वेस्ट `leave.routes.js` के पास जाए।
  - `/api/v1/departments` पर जाने वाली रिक्वेस्ट `department.routes.js` के पास जाए।

---

## 🌟 4. Modules Explained: असली फीचर्स (Domain Modules)

इस प्रोजेक्ट का सबसे महत्वपूर्ण हिस्सा `src/modules/` है। यहाँ हर फीचर का अपना अलग कमरा (फ़ोल्डर) है:

```
src/modules/
├── employee/      (कर्मचारी का पूरा काम)
├── department/    (विभागों का पूरा काम)
├── leave/         (छुट्टियों का पूरा काम - Future HRMS)
├── attendance/    (हाजिरी का पूरा काम)
└── payroll/       (सैलरी और पेरोल का पूरा काम)
```

### हर मॉड्यूल के अंदर 4 से 5 फाइलें क्यों होती हैं?

आइए `employee` मॉड्यूल का उदाहरण लेकर समझते हैं:

| फाइल का नाम | इसका रोल क्या है? | अंदर क्या कोड लिखा है? |
|---|---|---|
| **`employee.routes.js`** | **URL और HTTP Method** | यह बताता है कि किस URL पर कौन सा फंक्शन चलना चाहिए (उदा: `router.get('/', EmployeeController.getAll)`). |
| **`employee.controller.js`** | **मैनेजर (Request/Response)** | यह यूजर से आने वाला डेटा `req.body` या `req.params` से निकालता है, सर्विस को सौंपता है, और फिर `ApiResponse.success(res, data)` से जवाब देता है। |
| **`employee.service.js`** | **बिजनेस लॉजिक** | यह असली दिमाग है! यह चेक करता है कि डेटा सही है या नहीं। अगर एम्प्लॉई का नया कोड नहीं आया, तो यह ऑटोमैटिक `EMP-1013` जनरेट करता है। |
| **`employee.model.js`** | **डेटाबेस क्वेरी (SQL)** | यह केवल MySQL से बात करता है। इसमें `SELECT * FROM employees`, `INSERT INTO`, `UPDATE`, `DELETE` जैसी SQL क्वेरीज़ लिखी होती हैं। |
| **`employee.validation.js`** | **फॉर्म चेकर** | यह चेक करता है कि यूजर ने नाम खाली तो नहीं छोड़ा, ईमेल सही फॉर्मेट में है या नहीं, सैलरी 0 से ज्यादा है या नहीं। |

---

## 🛠️ 5. Practical Cheat-Sheet: अगर मुझे बदलाव करना हो, तो किस फाइल में जाना है?

| मुझे यह काम करना है... | मुझे किस फाइल में बदलाव करना होगा? |
|---|---|
| **MySQL का पासवर्ड बदलना है** | [Backend/.env](file:///c:/Users/shilp/Desktop/DVT/Backend/.env) फाइल खोलें और `DB_PASSWORD=नया_पासवर्ड` लिखें। |
| **नया API एंडपॉइंट जोड़ना है (जैसे एम्प्लॉई को प्रमोट करना)** | 1. [employee.routes.js](file:///c:/Users/shilp/Desktop/DVT/Backend/src/modules/employee/employee.routes.js) में नया रूट जोड़ें: `router.patch('/:id/promote', EmployeeController.promote)`<br>2. [employee.controller.js](file:///c:/Users/shilp/Desktop/DVT/Backend/src/modules/employee/employee.controller.js) में `promote` फंक्शन लिखें। |
| **डेटाबेस में नया कॉलम जोड़ना है (जैसे Date of Birth / dob)** | 1. [schema.sql](file:///c:/Users/shilp/Desktop/DVT/Backend/src/database/schema.sql) में `dob DATE NULL` जोड़ें。<br>2. [employee.model.js](file:///c:/Users/shilp/Desktop/DVT/Backend/src/modules/employee/employee.model.js) की INSERT और SELECT क्वेरी में `dob` शामिल करें। |
| **कोई नया वैलिडेशन नियम लगाना है (जैसे फोन नंबर 10 अंकों का हो)** | [employee.validation.js](file:///c:/Users/shilp/Desktop/DVT/Backend/src/modules/employee/employee.validation.js) में जाकर चेक कंडीशन जोड़ें। |
| **भविष्य में नया HRMS मॉड्यूल जोड़ना है (जैसे Performance Review)** | 1. `src/modules/performance/` नाम का फोल्डर बनाएं।<br>2. उसके अंदर `routes`, `controller`, `model` बनाएं।<br>3. [src/routes/api.routes.js](file:///c:/Users/shilp/Desktop/DVT/Backend/src/routes/api.routes.js) में `router.use('/performance', performanceRoutes)` लिख दें। |

---

## ⚡ 6. Quick Commands to Remember (ज़रूरी कमांड्स)

| कमांड | इसका क्या मतलब है? |
|---|---|
| `npm run dev` | बैकएंड सर्वर को डेवलपमेंट मोड में चालू करता है (कोड बदलने पर खुद रीलोड होगा)। |
| `npm run db:init` | डेटाबेस और सारी 8 टेबल्स को एक क्लिक में बना देता है। |
| `npm run db:seed` | डमी डेटा लोड करता है। |
| `http://localhost:5000/api/v1/health` | ब्राउज़र में खोलकर चेक करें कि सर्वर चालू है या नहीं। |
| `http://localhost:5000/api/v1/employees` | ब्राउज़र में सारे एम्प्लॉई की JSON लिस्ट देखने के लिए। |
