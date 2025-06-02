# 🧠 Mini CRM Platform – Xeno SDE Internship Assignment 2025

## 👋 Introduction

Thank you, Xeno team, for the opportunity!  
This project is my submission for the SDE Internship assignment, designed to build a **Mini CRM Platform** that enables customer segmentation, personalized campaign delivery, and AI-powered insights.  
Despite time constraints due to ongoing end-semester exams, I’ve aimed to implement all key functionalities end-to-end.

---

## 🔗 Live Deployment

- 🌐 **Frontend (Vercel):** [https://frontend-alpha-cyan-94.vercel.app](https://frontend-alpha-cyan-94.vercel.app)
- ⚙️ **Backend (Render):** [https://new-backend-vwpp.onrender.com](https://new-backend-vwpp.onrender.com)

---

## 📁 Repositories

- 📂 Frontend: [https://github.com/Harshitron/frontend](https://github.com/Harshitron/frontend)
- 📂 Backend: [https://github.com/Harshitron/new-backend](https://github.com/Harshitron/new-backend)

---

## ✅ Features

- 🧑‍💼 Add and manage customers
- 🛍️ Create and manage customer orders
- 📢 Campaign Creation & Delivery Logs
- 🎯 Dynamic Segment Rule Builder (AND/OR logic)
- 📊 Campaign history view with success/failure stats
- 🔒 Google OAuth 2.0 authentication
- 📬 Simulated message delivery (85–90% success range)
- 🤖 AI-Powered Rule Generator (via Google Gemini API)

---

## 🧠 AI Tools Used

| Feature | Tool | Description |
|--------|------|-------------|
| Segment Rule Generator | Google Gemini API | Converts plain English to structured targeting rules |

---

## ⚙️ Tech Stack

### Frontend
- React 19 (Vite)
- Tailwind CSS 4
- Radix UI Components
- Zustand for global state
- Axios + React Router
- React Hook Form + Zod
- Google OAuth via `@react-oauth/google`

### Backend
- Node.js + Express
- MongoDB with Mongoose
- Google Gemini API
- JWT Auth + OAuth Verification
- Communication Logs via MongoDB
- dotenv, CORS, UUID

---

## 🏗️ Architecture Diagram

```txt
               +----------------------------+
               |     Google OAuth Login     |
               +----------------------------+
                            ↓
      +---------------------------------------------+
      |        React Frontend (Vercel + Tailwind)    |
      +---------------------------------------------+
                            ↓
      +---------------------------------------------+
      |       Node.js Backend (Render + MongoDB)     |
      +---------------------------------------------+
          ↓                             ↓
 +-------------------+       +--------------------------+
 | Customer, Order DB|       | Communication Logs & AI  |
 +-------------------+       +--------------------------+
```

---

## 🧪 Local Setup Instructions

### Backend

```bash
git clone https://github.com/Harshitron/new-backend.git
cd new-backend
npm install
```
Create a `.env` file:

```env
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_key
```

Run the backend:
```bash
npm run dev
```

### Frontend

```bash
git clone https://github.com/Harshitron/frontend.git
cd frontend
npm install
```
Create a `.env` file:

```env
VITE_BACKEND_URL=https://new-backend-vwpp.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run the frontend:
```bash
npm run dev
```

---

## ⚠️ Known Limitations / Assumptions

| Area | Status | Notes |
|------|--------|-------|
| Pub/Sub Queue | Not implemented | Code is structured to easily plug in Kafka or Redis Streams |
| Smart Scheduling | Not implemented | Currently immediate send; can add timing-based scheduler |
| AI Suggestions for Messages | Not done | Rule-to-Segment AI done; message generation left for future |

---

## 🧾 Environment Variables

### Backend `.env`
- `MONGO_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GEMINI_API_KEY`

### Frontend `.env`
- `VITE_BACKEND_URL`
- `VITE_GOOGLE_CLIENT_ID`

---

## 🙌 Final Note

Thanks again, Xeno team, for this challenge! This was a great experience that helped me implement clean, scalable architecture, and integrate AI meaningfully into real-world problems.

> — Harshit Sachdeva
