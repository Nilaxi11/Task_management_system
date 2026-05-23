# Task Management System

A modern Task Management System built using React, Redux Toolkit, Vite, React Router, and Bootstrap.

This application helps managers and employees collaborate efficiently by managing tasks, projects, teams, and workflow progress.

---

# Features

## Authentication

* Login system
* Role-based access
* Manager and Employee dashboards
* Protected routes

## Task Management

* Create tasks
* Update task status
* Assign tasks to employees
* Task priority handling
* Task comments
* Task filtering and searching

## Project Management

* Create and manage projects
* Track project tasks
* Project-wise task organization

## Team Management

* View team members
* Department filtering
* Employee task statistics
* Add/remove employees

## Employee Dashboard

* View assigned tasks
* Update task progress
* Add comments
* Task status workflow

## Additional Features

* Toast notifications
* Light/Dark theme support
* Redux state persistence using localStorage
* Responsive UI
* Reusable components

---

# Tech Stack

| Technology       | Purpose            |
| ---------------- | ------------------ |
| React            | Frontend Framework |
| Redux Toolkit    | State Management   |
| React Router DOM | Routing            |
| Bootstrap        | UI Styling         |
| Vite             | Build Tool         |
| LocalStorage     | Data Persistence   |

---

# Project Structure

```bash
src/
│
├── components/
│   ├── common/
│
├── data/
│
├── hooks/
│
├── layouts/
│
├── pages/
│   ├── auth/
│   ├── manager/
│   └── employee/
│
├── redux/
│   └── slices/
│
├── routes/
│
├── styles/
│
├── utils/
│
├── validations/
│
├── App.jsx
└── main.jsx
```

---

# Redux Flow

```text
Component
   ↓ dispatch(action)
Redux Slice
   ↓
Store Updates
   ↓
UI Re-renders Automatically
```

---

# Main Redux Slices

| Slice             | Purpose                      |
| ----------------- | ---------------------------- |
| authSlice         | Authentication handling      |
| userSlice         | Team/user management         |
| taskSlice         | Task CRUD and status updates |
| projectSlice      | Project management           |
| notificationSlice | Toast notifications          |
| themeSlice        | Theme switching              |

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/task-management-system.git
```

## Move Into Project

```bash
cd task-management-system
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

---

# Build For Production

```bash
npm run build
```

---

# Demo Accounts

## Manager

```text
Email: manager@demo.com
Password: Password1
```

## Employee

```text
Email: employee@demo.com
Password: Password1
```

---

# Core Concepts Used

* React Functional Components
* React Hooks
* Redux Toolkit
* useSelector & useDispatch
* React Router
* Custom Hooks
* Component Reusability
* State Persistence
* Responsive Design

---

# Future Improvements

* Backend Integration
* Real Database
* JWT Authentication
* API Integration
* Drag & Drop Kanban
* Real-time Notifications
* File Attachments
* Email Notifications

---

# Author

Developed as a React + Redux Task Management System project.
