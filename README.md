# StayEase — Luxury Hospitality & Hotel Booking Platform 🏨✨

A production-ready full-stack hotel booking application with modern teal luxury UI, native authentication, AI concierge assistance, and PostgreSQL persistence.

---

## 🌟 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, React Router v6, TanStack React Query, Lucide Icons |
| **Backend** | Java 17 / 21, Spring Boot 3.2.5, Spring Security, Spring Data JPA |
| **Database** | PostgreSQL 14+ with Flyway automated migrations |
| **AI Concierge** | Groq Cloud API (Llama 3.3 70B Versatile) |
| **DevOps & Containers** | Docker, Docker Compose, Multi-stage builds, Vercel SPA routing |

---

## 💎 Features

- 🏨 **Curated Luxury Destinations** — Discover iconic Indian palaces, heritage retreats, and international resorts.
- 🔍 **Interactive Hotel & Room Search** — Real-time filter by city, guest occupancy, price, and star ratings.
- 📅 **Seamless Booking Engine** — Date range conflict detection with automated availability management.
- 💳 **Simulated Instant Payment Flow** — Supports Card, UPI, and Net Banking checkouts without third-party vendor lock-in.
- 🤖 **StayEase AI Concierge** — Powered by Groq LLaMA 3.3 70B for real-time travel recommendations, room details, and guest inquiries.
- 🔐 **Native Spring Security JWT Auth** — Out-of-the-box user registration, role-based access (GUEST / ADMIN), and password encryption with BCrypt.
- 👑 **Admin Portal** — Analytics overview, hotel & room CRUD operations, and reservation management.
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop viewports.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Java**: JDK 17 or JDK 21
- **Node.js**: v18+ or v20+
- **PostgreSQL**: Running on port `5432` with database `hospitality_db`

### 2. Configure Environment Variables
Copy `.env.example` in both folders:

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend (configured via application.properties or environment variables)
```

Default credentials out-of-the-box:
- **Admin**: `admin@stayease.in` / `Admin@123`
- **Guest**: `guest@stayease.in` / `Guest@123`

### 3. Run Backend
```bash
# Using the root launcher:
.\start-backend.bat

# Or manually:
cd backend
.\mvnw.cmd spring-boot:run
```
Backend API will be accessible at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 4. Run Frontend
```bash
# Using the root launcher:
.\start-frontend.bat

# Or manually:
cd frontend
npm install
npm run dev
```
Frontend will be accessible at: `http://localhost:5173`

---

## ☁️ Deployment Guide (Online Hosting)

### 1. Database (Neon / Supabase)
1. Create a free PostgreSQL database at [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the JDBC connection URL:
   ```
   jdbc:postgresql://<host>:5432/<dbname>?sslmode=require
   ```

### 2. Backend (Render / Railway)
1. Link your GitHub repository.
2. Root directory: `backend`
3. Build Command: `mvn clean package -DskipTests`
4. Start Command: `java -jar target/hospitality-backend-1.0.0.jar`
5. Set Environment Variables:
   - `DB_URL`: Your PostgreSQL connection string
   - `DB_USERNAME`: Your DB user
   - `DB_PASSWORD`: Your DB password
   - `FRONTEND_URL`: Your production frontend URL (e.g., `https://your-site.vercel.app`)
   - `JWT_SECRET`: A secure 256-bit random secret
   - `GROQ_API_KEY`: Your Groq Cloud API key (free at console.groq.com)

### 3. Frontend (Vercel)
1. Import repository in [Vercel](https://vercel.com).
2. Root directory: `frontend`
3. Framework Preset: `Vite`
4. Set Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com`
5. Deploy! Vercel handles SPA rewrites via `frontend/vercel.json`.

---

## 🛡️ Security Best Practices
- All `.env` and sensitive credentials are listed in `.gitignore` and never committed to version control.
- API keys (like Groq) are passed securely via system environment variables on the backend.
- Passwords are encrypted with BCrypt before storage.
- CORS policies restrict backend requests strictly to authorized frontend origins.
