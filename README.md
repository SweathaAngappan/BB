# The Balanced Bowl 🥗🥣 (MERN Stack Edition)

> An intelligent, full-stack clinical nutrition management and dietician tele-consultation platform built with the **MERN Stack (MongoDB, Express.js, React.js, Node.js)** and **Material UI**.

[![React.js](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Material%20UI-007FFF.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20(Mongoose)-brightgreen.svg)](https://www.mongodb.com/)
[![HTML5 & CSS3](https://img.shields.io/badge/UI-HTML5%20%7C%20CSS3%20%7C%20Responsive-orange.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Overview

**The Balanced Bowl** bridges the gap between clinical nutrition advice and real-world dietary adherence. It empowers certified dieticians to create tailored meal protocols and monitor patient compliance, while offering patients an interactive, responsive portal to log daily meals, track biometrics, avoid medical allergens, and book tele-consultations.

Built from the ground up to showcase **modern component-driven web engineering**, **MERN stack architecture**, and **clinical decision engines**.

---

## ✨ Key Technical Highlights (Citi Evaluated Core Stack)

### ⚛️ Frontend: React 18 with Responsive Design & Material UI (MUI)
* **Modular Component Architecture**: Reusable UI cards, custom theme providers, and dynamic modals.
* **Responsive Layouts**: Engineered using Material UI's Grid, Container, and `useMediaQuery` breakpoints for flawless mobile, tablet, and desktop experiences.
* **State Management & Routing**: Stateful consultation booking dialogs, reactive metric trackers, and client-side page routing via `react-router-dom`.

### 🛡️ Clinical Intelligence & Safety Shields
* **Allergen & Contraindication Shield**: Algorithmic cross-referencing between patient health profiles (e.g., Diabetes, Hypertension, Renal concerns) and meals to prevent adverse dietary reactions.
* **Intelligent Ingredient Substitution Engine**: Automated recommendation of nutrient-dense alternatives for dairy-free, low-GI, keto, or gluten-free restrictions.

### 🍃 Database: MongoDB & Mongoose
* **Flexible Document Modeling**: Structured schemas for `User`, `DietPlan`, `HealthLog`, `MealLog`, and `Appointment`.
* **Sub-second RESTful APIs**: Asynchronous query optimizations and aggregation pipelines.

### 🚀 Backend: Node.js & Express.js
* RESTful API architecture with CORS security, session authentication, and clean separation between controller business logic and clinical utility engines.

---

## 📁 Project Structure

```text
BB/
├── client/                  # ⚛️ React 18 + Material UI Frontend Application
│   ├── src/
│   │   ├── components/      # Responsive Navbar, Footer, UI components
│   │   ├── pages/           # Home, Dietitians Directory, Dashboard, Allergy Shield
│   │   ├── theme.js         # Custom Material UI theme (Healthcare palette)
│   │   ├── App.jsx          # Route declarations & theme wrapper
│   │   └── main.jsx         # React DOM root entry
│   ├── index.html           # HTML5 entry with Google Font typography
│   └── package.json         # Client dependencies (@mui/material, react-router-dom, axios)
│
├── src/                     # 🚀 Express & MongoDB Backend
│   ├── config/              # MongoDB connection & database seeds
│   ├── controllers/         # Business logic for auth, dieticians, appointments, users
│   ├── models/              # Mongoose schemas (User, Dietician, Appointment, DietPlan, etc.)
│   ├── routes/              # Express REST API routes (/api/*)
│   ├── utils/               # Clinical engines (Allergy Shield, Adherence, Substitution)
│   └── views/               # EJS templates (Server-Side Rendered backup)
├── app.js                   # Express application entry & CORS middleware
└── package.json             # Root scripts and server dependencies
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### Quick Start (Running Backend & React Client)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SweathaAngappan/BB.git
   cd BB
   ```

2. **Install Root & Server Dependencies:**
   ```bash
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure Environment:**
   Create `.env` in the root folder:
   ```env
   MONGO_URI=mongodb://localhost:27017/balancedb
   PORT=3000
   ```

5. **Start Express Backend Server (Port 3000):**
   ```bash
   npm run dev
   # or
   npm start
   ```

6. **Start React Frontend Client (Port 5173 with API Proxy):**
   ```bash
   npm run client
   ```
   Open `http://localhost:5173` in your browser.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
