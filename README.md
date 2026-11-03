# The Balanced Bowl 🥗🥣

> An intelligent, full-stack clinical nutrition management and dietician tele-consultation platform built with Node.js, Express, MongoDB, and modern responsive web technologies.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JavaScript-blue.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Overview

**The Balanced Bowl** bridges the gap between clinical nutrition advice and real-world dietary adherence. It empowers certified dieticians to create tailored meal programs and track patient progress, while offering patients an intuitive, interactive space to log daily meals, track biometrics, avoid medical allergens, and book one-on-one consultations.

---

## ✨ Key Features

### 🛡️ Clinical Safety & Allergy Shield
* **Contraindication Engine**: Cross-references patient health profiles (e.g., Diabetes, Hypertension, Renal concerns) against meal items to flag clinical risks.
* **Allergen Detection**: Automated detection for common allergens (Gluten, Lactose, Peanuts, Soy, Shellfish) with immediate severity alerts.

### 🔄 Intelligent Substitution Engine
* Suggests healthy, context-aware ingredient alternatives based on user dietary preferences (Vegan, Keto, Low-GI) and medical restrictions.

### 📊 Health & Meal Adherence Logging
* Daily meal tracking with real-time adherence scoring.
* Visual health logging for weight, calories, blood sugar, and biometric milestones.
* Automated dynamic grocery checklist generation for active meal plans.

### 📅 Consultation & Appointment Management
* Multi-slot appointment scheduling between patients and verified dieticians.
* Integrated payment checkout workflows (Razorpay integration).
* Automated email confirmations and status tracking.

### 👥 Role-Based Access Control (RBAC)
* **Patients**: Explore dietician profiles, book consultations, access meal plans, and log health metrics.
* **Dieticians**: Manage clients, build customized diet plans, and view compliance metrics.
* **Admin**: Verify dietician certifications, manage platform users, and review platform feedback.

---

## 🛠️ Tech Stack

* **Frontend**: HTML5, CSS3, Modern Responsive UI, JavaScript (ES6+), EJS Templates
* **Backend**: Node.js, Express.js (MVC Architecture)
* **Database**: MongoDB with Mongoose ODM (Session store via connect-mongo)
* **Authentication & Security**: BCrypt password hashing, Cookie/Session-based authentication, RBAC middleware
* **Integrations**: Razorpay API (Payments), Nodemailer (Transactional Emails), Multer (Certificate Uploads)

---

## 📁 Project Structure

```text
BB/
├── app.js                   # Application entry point & middleware configuration
├── package.json             # Dependencies and scripts
├── .env.example             # Template for environment variables
├── src/
│   ├── config/              # Database connection & seed data
│   ├── controllers/         # Business logic for auth, dieticians, users, admin
│   ├── middleware/          # Authentication & role-authorization guards
│   ├── models/              # Mongoose schemas (User, Dietician, Appointment, DietPlan, etc.)
│   ├── routes/              # Express routing definitions
│   ├── utils/               # Clinical engines (Allergy Shield, Adherence, Substitutions)
│   ├── public/              # Static assets (CSS stylesheets, client JS, SVG icons)
│   └── views/               # Dynamic responsive view templates & partials
└── uploads/                 # Local media storage (ignored in version control)
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SweathaAngappan/BB.git
   cd BB
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   MONGO_URI=mongodb://localhost:27017/balancedb
   PORT=3000
   ```

4. **Seed Sample Data (Optional):**
   ```bash
   npm run seed
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
