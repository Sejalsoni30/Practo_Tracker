# 🏥 Practo Tracker

A modern, comprehensive clinic management and patient tracking system designed to streamline healthcare operations. Originally built with the MERN stack, the backend has been seamlessly migrated to **Supabase (PostgreSQL)** for robust, scalable data management.

## 🚀 Project Overview

Practo Tracker provides clinic administrators and staff with a centralized dashboard to handle daily operations. From booking patient appointments to tracking overdue follow-ups, managing staff directories, and handling patient complaints—Practo Tracker brings it all into one sleek, dark-themed, glassmorphic UI.

## ✨ Main Features

- **Advanced Analytics Dashboard**: Real-time overview of clinic metrics (total appointments, overdue follow-ups, unresolved complaints, etc.).
- **Appointment Management**: Book, schedule, and track patient appointments. Automatically flag missed appointments.
- **Follow-up Tracker**: Identify patients needing urgent follow-ups based on due dates and priorities.
- **Doctor Directory**: Maintain a database of clinic doctors, their specialties, and availability.
- **Patient Records**: Securely manage patient demographics and diagnostic history.
- **Ticketing & Complaints System**: Track and resolve internal clinic tickets and external patient complaints.
- **Secure Authentication**: Custom JWT-based authentication ensuring only authorized staff can access the dashboard.
- **Modern UI/UX**: Built with a custom dark-mode aesthetic featuring interactive canvas backgrounds and smooth micro-animations.

## 🛠 Tech Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- Vanilla CSS (Custom Design System)

**Backend:**
- Node.js & Express.js
- JSON Web Tokens (JWT) & bcryptjs for Authentication
- `@supabase/supabase-js` (Supabase Client)

**Database:**
- Supabase (PostgreSQL)

## 🏗 Project Structure

```text
Practo_Tracker/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Sidebar, Layout)
│   │   ├── context/        # React Context (AuthContext)
│   │   ├── pages/          # Full page views (Dashboard, Appointments, etc.)
│   │   ├── services/       # API wrapper functions
│   │   └── styles/         # Global CSS and tokens
│   └── package.json
└── server/                 # Express Backend
    ├── src/
    │   ├── config/         # Database connection logic
    │   ├── controllers/    # Request handlers for all routes
    │   ├── middleware/     # JWT protection & Error handlers
    │   ├── routes/         # Express API route definitions
    │   ├── utils/          # Schedulers and helper scripts
    │   ├── seedDoctors.js  # Database seeder script
    │   └── server.js       # App entry point
    └── package.json
```

## ⚙️ Installation and Setup

### Prerequisites
- Node.js installed (v16+)
- A Supabase Project

### 1. Clone the repository
```bash
git clone https://github.com/Sejalsoni30/Practo_Tracker.git
cd Practo_Tracker
```

### 2. Setup the Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

*(Optional)* Seed the database with demo doctors:
```bash
node src/seedDoctors.js
```

Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The application will open at `http://localhost:8080`.

## 🗄️ Supabase Integration

The application relies on Supabase (PostgreSQL) for all data persistence. The backend directly interfaces with the following tables via the Supabase JS client:
- `users` (For staff authentication)
- `doctors`
- `patients`
- `appointments`
- `follow_ups`
- `complaints`
- `tickets`
- `contact_messages`

## 🔌 API Endpoints

The Express server exposes the following RESTful endpoints:
- `POST /api/auth/register` & `POST /api/auth/login`
- `GET /api/analytics` (Dashboard metrics)
- `GET/POST /api/doctors`
- `GET/POST /api/patients`
- `GET/POST/PUT /api/appointments`
- `GET/POST /api/follow-ups`
- `GET/POST/PUT /api/complaints`
- `GET/POST/PUT /api/tickets`
- `POST /api/contact`

*(Most endpoints are protected and require a Bearer token)*

## 🔮 Future Improvements

- **Multi-user Roles**: Implement RBAC (Role-Based Access Control) to distinguish between Doctors, Receptionists, and Admins.
- **Reporting & Exports**: Add robust CSV/PDF exporting for clinic analytics.
- **Automated SMS Reminders**: Integrate Twilio to send automated texts for patient follow-ups.

## 👨‍💻 Author

**Sejalsoni30**
- GitHub: [@Sejalsoni30](https://github.com/Sejalsoni30)

---
*If you find this project helpful, please consider giving it a ⭐ on GitHub!*