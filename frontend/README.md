# PulseCare AI – Enterprise Healthcare SaaS (Frontend)

PulseCare AI is a production-grade, enterprise Remote Patient Monitoring (RPM) and Clinical Intelligence platform built using **React 19**, **Vite**, **Tailwind CSS v4**, **TanStack React Query**, **Zustand**, and **Recharts**.

---

## 🛠️ Tech Stack & Architecture

- **UI & Logic**: React 19, Vite, React Router v6
- **Styling**: Tailwind CSS v4, Framer Motion, Lucide React
- **State Management**: Zustand (Auth, Global State)
- **Data Fetching & Cache**: TanStack React Query (Automatic Caching, Invalidation, & Optimistic Updates)
- **HTTP Client**: Axios (Automatic JWT Authorization Interceptor)
- **Charts & Visualizations**: Recharts

---

## 📁 Feature Folder Structure

```
frontend/src/
├── features/
│   ├── admin-dashboard/       # Phase 4.1 Admin Executive Dashboard & KPIs
│   ├── appointments/          # Appointment Scheduling, Booking & Calendar Views
│   ├── doctor-notes/          # Clinical Notes & Patient Observations
│   ├── health-summary/        # Phase 3.9 AI Health Assessment & Physiological Risk Scoring
│   ├── notifications/         # Real-Time Notifications Center & Socket Integration
│   ├── prescriptions/         # e-Prescription Generation, Dosage Tables, & Printing
│   ├── reports/               # Phase 4.3 Executive Analytical Reports, CSV & PDF Export
│   ├── settings/              # Phase 4.4 Profile, Account, Security Sessions, Theme & Audit Logs
│   ├── user-management/       # Phase 4.2 Admin User Directory, Doctor Approvals, & Role Escalation
│   └── vitals/                # Vital Telemetry, Radial Gauges, & Historical Trends
├── components/
│   ├── common/                # Shared Buttons, Inputs, Modals, ErrorBoundary, & Loading Skeletons
│   ├── dashboard/             # App Sidebar, Header Bar, & Profile Dropdowns
│   └── system/                # Toast Providers & System Guards
├── routes/
│   ├── AppRoutes.jsx          # Root Router & Error Routes (/404, /403, /500, /offline)
│   ├── DashboardRoutes.jsx    # Protected Role-Based Dashboard Routes
│   └── ProtectedRoute.jsx     # Role-Based Access Control (RBAC Guard)
├── services/
│   └── api/axios.js           # Centralized Axios Interceptor for Auth Tokens & Error Retries
└── stores/
    └── auth.store.js          # Zustand Authentication Store
```

---

## 🚀 Getting Started & Local Development

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Environment Variables (.env)
Create a `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:5173`.

---

## 📦 Production Build & Deployment

### 1. Build Production Bundle
```bash
npm run build
```

### 2. Local Production Preview
```bash
npm run preview
```

---

## 🔒 Security & RBAC Enforcement

- **Protected Routes**: Controlled via `ProtectedRoute.jsx` with strict role checks (`ROLES.ADMIN`, `ROLES.DOCTOR`, `ROLES.PATIENT`).
- **Token Handling**: Authorization JWT tokens dynamically attached via Axios request interceptors.
- **Error Boundaries**: Root rendering errors caught by `ErrorBoundary.jsx` preventing application crash loops.

---

## 🛠️ Troubleshooting

- **API 401 Unauthorized**: Ensure the backend express server is running on port 5000 and valid user credentials are used.
- **Vite Dynamic Import Warning**: Normal Rollup chunk optimization notice for dynamic Zustand store access in Axios interceptors.
