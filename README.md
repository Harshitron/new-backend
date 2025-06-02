# 📦 Backend - Xeno Assignment

This is the backend server for the Xeno Campaign Management system. It powers APIs for campaign creation, customer management, communication tracking, and AI integration (Gemini).

---

## 🚀 Live URL

- Backend: [https://new-backend-vwpp.onrender.com](https://new-backend-vwpp.onrender.com)

---

## 📂 Repository

- GitHub: [https://github.com/Harshitron/new-backend](https://github.com/Harshitron/new-backend)

---

## ⚙️ Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + Mongoose
- **JWT Authentication**
- **Google OAuth**
- **Gemini AI API**
- **UUID** for unique ID generation
- **dotenv** for environment variable management
- **CORS** for frontend-backend communication

---

## 🔑 Features

- 📬 Create and send campaigns.
- 🧑‍💼 Add and manage customer records.
- 📊 Log campaign delivery statuses.
- 🔄 Simulate email delivery success/failure (85–90% success range).
- 🧠 Use Gemini API to generate personalized content.
- 🧾 Add customer orders and associate with campaigns.
- 🔐 JWT-secured private routes and Google OAuth support.

---

## 🏁 Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/Harshitron/new-backend.git
   cd new-backend
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run locally**  
   ```bash
   npm run dev
   ```

---

## 🛡️ Environment Variables

| Key                | Description                    |
|--------------------|--------------------------------|
| `MONGO_URI`        | MongoDB connection URI         |
| `JWT_SECRET`       | JWT token signing secret       |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID         |
| `GEMINI_API_KEY`   | API key for Gemini integration |
