# FlowSphere AI - Premium Task Management SaaS

FlowSphere AI is a production-grade, AI-inspired task management platform built with the modern stack (**Next.js 14, Node.js, MongoDB**). It features a high-fidelity UI, drag-and-drop Kanban boards, and role-based access control.

---

## 🌐 Live Application
**[View Live Demo →](YOUR_RAILWAY_FRONTEND_URL_HERE)**

---

## ⚡ Quick Start for Recruiters

To run this project locally with a single command:

1. **Clone the repository** and navigate to the root:
   ```bash
   git clone https://github.com/YOUR_USERNAME/FlowSphere-AI.git
   cd FlowSphere-AI
   ```

2. **Setup Environment Variables:**
   - In `backend/`, copy `.env.example` to `.env` and add your **MongoDB URI**.
   - In `frontend/`, copy `.env.example` to `.env.local`.

3. **Install and Run Everything:**
   ```bash
   # Install all dependencies
   npm run install-all

   # Seed the database with demo data (Recruiter Favorite!)
   npm run seed-db

   # Start both servers concurrently
   npm run dev
   ```

4. **Access & Login:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Role-Based Demo:** Use the **Instant Role Selector** on the login page to switch between Admin and Member views instantly.

---

## 🚀 Key Features

### 💎 Engineering Highlights
- **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for Workspace Admins and Team Members.
- **Interactive Project Management:** All users can create and manage their own projects and tasks.
- **Premium Settings Suite:** Functional notification toggles, real-time logo uploads with previews, and secure password management.
- **Dynamic Kanban Board:** Drag-and-drop task management with real-time status updates.
- **Visual Analytics:** Productivity tracking and project health metrics powered by custom charts.

### 🛠 Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT.
- **UI Architecture:** Glassmorphism design system, smooth transitions, and responsive mobile-first layouts.

---

## 📂 Project Structure

```text
FlowSphere-AI/
├── frontend/          # Next.js Application
├── backend/           # Express API
├── package.json       # Root scripts for monorepo management
└── README.md          # Project documentation
```

---

## 📞 Contact
Designed and Developed by **Priyanshi Rana**.
- **LinkedIn:** [Priyanshi Rana](https://www.linkedin.com/in/priyanshi-rana/)
