# TaskFlow — Task Management System

A modern, Mantis-inspired SaaS task management dashboard built with React + Vite, Redux Toolkit, React Bootstrap, Formik + Yup, Recharts, and @hello-pangea/dnd (React Beautiful DnD successor).

## Quick Start
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Demo Accounts
You can register fresh or use:
- Manager: `manager@demo.com` / `Password1`
- Employee: `employee@demo.com` / `Password1`

## Tech
- React 18 + Vite
- Redux Toolkit (auth, users, projects, tasks, notifications, theme)
- React Router DOM v6 (role-based protected routes)
- React Bootstrap + Bootstrap Icons
- Formik + Yup
- Recharts (analytics)
- @hello-pangea/dnd (Kanban)
- LocalStorage persistence

## Routes
- `/login`, `/register`
- Manager: `/manager/dashboard`, `/projects`, `/tasks`, `/team`, `/analytics`, `/calendar`, `/settings`
- Employee: `/employee/dashboard`, `/employee/tasks`, `/employee/kanban`, `/employee/calendar`, `/employee/settings`
