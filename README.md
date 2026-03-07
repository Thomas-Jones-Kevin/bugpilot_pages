# 🐛 BugTracker — Frontend

> React Frontend Setup & Integration Guide  
> For connecting with Spring Boot + Flask (ML) Backend

---

## Table of Contents

1. [Quick Start — Run the Frontend](#1-quick-start--run-the-frontend)
2. [Backend Integration Guide](#2-backend-integration-guide)
3. [Frontend File Structure](#3-frontend-file-structure)
4. [Switching from Mock to Real Backend](#4-switching-from-mock-to-real-backend)
5. [Backend Developer Checklist](#5-backend-developer-checklist)

---

## 1. Quick Start — Run the Frontend

### Prerequisites
Make sure you have these installed before starting:
- **Node.js v18+** — download from [nodejs.org](https://nodejs.org)
- **npm v9+** — comes with Node.js
- **Git** — to clone the repository

### Step 1 — Clone and Install
```bash
git clone https://github.com/YOUR_USERNAME/bugtracker.git
cd bugtracker
npm install
```

> ⚠️ This installs all dependencies including React, axios, react-router-dom, react-toastify.

### Step 2 — Run the App
```bash
npm start
```
The app will open automatically at **http://localhost:3000**

### Step 3 — Test Login (Mock Mode)
Before connecting the backend, use these mock credentials to test all pages:

| Name       | Email             | Password | Role      |
|------------|-------------------|----------|-----------|
| Admin User | admin@test.com    | 123      | Admin     |
| Dev User   | dev@test.com      | 123      | Developer |
| QA Tester  | qa@test.com       | 123      | QA        |

### Step 4 — Pages to Check

| Page        | URL                                  | Login As        |
|-------------|--------------------------------------|-----------------|
| Landing     | http://localhost:3000/               | No login needed |
| Login       | http://localhost:3000/login          | No login needed |
| Register    | http://localhost:3000/register       | No login needed |
| Dashboard   | http://localhost:3000/dashboard      | Any role        |
| Bug List    | http://localhost:3000/bugs           | Any role        |
| Bug Details | http://localhost:3000/bugs/1         | Any role        |
| Create Bug  | http://localhost:3000/bugs/new       | QA or Admin only|
| Task Board  | http://localhost:3000/board          | Any role        |
| Admin Panel | http://localhost:3000/admin          | Admin only      |
| Profile     | http://localhost:3000/profile/1      | Any role        |

---

## 2. Backend Integration Guide

Everything below is what the **backend developer** needs to do to connect the React frontend with Spring Boot and Flask.

### 2.1 Project Architecture

| Service     | Port | Purpose             |
|-------------|------|---------------------|
| React       | 3000 | Frontend UI         |
| Spring Boot | 8080 | Main API Backend    |
| Flask       | 8000 | AI ML Prediction    |

---

### 2.2 Step 1 — Set the Backend URL in React

Open `package.json` in the root of the React project. Find this line near the bottom and change the port to match your Spring Boot port:

```json
"proxy": "http://localhost:8080"
```

> ⚠️ If Spring Boot runs on a different port, change `8080` to that port number. Save the file and restart `npm start`.

---

### 2.3 Step 2 — Replace Mock Auth with Real Auth

Currently the app uses mock login. Once the backend is ready, replace `src/context/AuthContext.js` with the real version that calls Spring Boot.

The real `AuthContext` should:
- `POST` to `/api/auth/login` with `{ email, password }` and receive `{ token, user }`
- `POST` to `/api/auth/register` with `{ name, email, password, role }`
- `GET` `/api/auth/me` using the JWT token to restore session on page refresh
- Store the JWT token in `localStorage` and attach it to all axios requests as `Authorization: Bearer <token>`

---

### 2.4 Step 3 — Spring Boot API Endpoints Required

The React frontend calls these exact API routes. Spring Boot must implement all of them:

#### Auth Endpoints

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| POST   | /api/auth/login      | Login — returns `{ token, user }`  |
| POST   | /api/auth/register   | Register new user                  |
| GET    | /api/auth/me         | Get logged in user from token      |

#### Bug Endpoints

| Method | Endpoint                  | Description                                                        |
|--------|---------------------------|--------------------------------------------------------------------|
| GET    | /api/bugs                 | List all bugs — supports `?status=` `?severity=` `?priority=` `?search=` |
| GET    | /api/bugs/:id             | Get single bug by ID                                               |
| POST   | /api/bugs                 | Create new bug — QA/Admin only                                     |
| PATCH  | /api/bugs/:id/status      | Update bug status                                                  |
| PATCH  | /api/bugs/:id/assign      | Assign bug to a developer                                          |
| POST   | /api/bugs/:id/comments    | Add a comment to a bug                                             |

#### User Endpoints

| Method | Endpoint                  | Description                                    |
|--------|---------------------------|------------------------------------------------|
| GET    | /api/users                | List all users — Admin only                    |
| GET    | /api/users/:id/profile    | Get user profile + assigned bugs + workload    |
| PATCH  | /api/users/:id/role       | Change user role — Admin only                  |
| PATCH  | /api/users/:id/skills     | Update developer skills                        |
| DELETE | /api/users/:id            | Delete user — Admin only                       |

#### AI Prediction Endpoint

| Method | Endpoint      | Description                                                              |
|--------|---------------|--------------------------------------------------------------------------|
| POST   | /api/predict  | Receives `{ description }` — calls Flask and returns `{ severity }`      |

> ⚠️ Spring Boot should forward `/api/predict` requests to Flask at `http://localhost:8000/predict`

---

### 2.5 Step 4 — Flask ML Service

The Flask service (`predict_service.py`) is already built. To run it:

```bash
pip install flask torch transformers scikit-learn
python predict_service.py
```

Flask will run on **port 8000**. Spring Boot calls it internally — the React frontend never talks to Flask directly.

Make sure the saved model folder `bug_severity_final/` is in the same directory as `predict_service.py`. It must contain:
- `config.json`
- `pytorch_model.bin` (or `model.safetensors`)
- tokenizer files
- `label_encoder.pkl`

---

### 2.6 Step 5 — CORS Configuration in Spring Boot

Since React runs on port 3000 and Spring Boot on 8080, you must allow cross-origin requests.

Add this to your controller:
```java
@CrossOrigin(origins = "http://localhost:3000")
```

Or globally in a config class:
```java
registry.addMapping("/api/**").allowedOrigins("http://localhost:3000");
```

> ⚠️ Without CORS configured, every API call from React will be blocked by the browser.

---

### 2.7 Step 6 — JWT Token Format

The Spring Boot login response must match **exactly** this format so the React frontend can read it:

```json
{
  "token": "eyJhbGci...",
  "user": {
    "_id": "1",
    "name": "John",
    "email": "john@test.com",
    "role": "developer"
  }
}
```

> ⚠️ The `role` field must be one of: `admin`, `developer`, `qa` — **lowercase exactly** as shown.

---

### 2.8 Step 7 — File Uploads

When a QA user submits a bug with screenshots, the frontend sends a `multipart/form-data` POST to `/api/bugs`. Spring Boot must:
- Accept multipart file uploads with the field name `screenshots`
- Save the files to a static directory
- Return the file paths so the frontend can display them

---

## 3. Frontend File Structure

| File                              | Purpose                                          |
|-----------------------------------|--------------------------------------------------|
| `src/App.js`                      | Main routing + role-based protected routes       |
| `src/index.css`                   | All global styles, badges, buttons, cards        |
| `src/context/AuthContext.js`      | Login, register, logout, user session state      |
| `src/context/BugContext.js`       | Shared bug state across all pages                |
| `src/components/Navbar.js`        | Top navigation bar with role-based links         |
| `src/pages/Landing.js`            | Public homepage with features section            |
| `src/pages/Login.js`              | Login form                                       |
| `src/pages/Register.js`           | Register form with confirm password validation   |
| `src/pages/Dashboard.js`          | Role-based dashboard with stats                  |
| `src/pages/BugList.js`            | Bug table with search and filters                |
| `src/pages/BugDetails.js`         | Bug detail, AI severity, comments, assign        |
| `src/pages/CreateBug.js`          | Create bug form with AI predict button           |
| `src/pages/TaskBoard.js`          | Kanban board with moveable cards                 |
| `src/pages/AdminPanel.js`         | Manage users, roles, developer workload          |
| `src/pages/Profile.js`            | User profile, skills, assigned bugs              |

---

## 4. Switching from Mock to Real Backend

Currently the app runs with hardcoded mock data. Here are the exact files to change when the backend is ready:

### 4.1 AuthContext.js — Most Important

Replace the `login` function body with real axios calls:

```js
const { data } = await axios.post('/api/auth/login', { email, password });
localStorage.setItem('token', data.token);
axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
setUser(data.user);
return data.user;
```

Also add a `useEffect` to restore session on page refresh:

```js
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get('/api/auth/me').then(r => setUser(r.data)).catch(() => logout());
  }
}, []);
```

### 4.2 BugContext.js — Bug Data

Replace the `INITIAL_BUGS` array and all mock functions with real axios calls:

| Mock Function     | Replace With                          |
|-------------------|---------------------------------------|
| `addBug`          | `POST /api/bugs`                      |
| `updateBugStatus` | `PATCH /api/bugs/:id/status`          |
| `assignBug`       | `PATCH /api/bugs/:id/assign`          |
| `addComment`      | `POST /api/bugs/:id/comments`         |
| Load on mount     | `GET /api/bugs`                       |

### 4.3 CreateBug.js — AI Prediction

Replace the `mockPredict()` function with a real call to Spring Boot:

```js
const { data } = await axios.post('/api/predict', { description: form.description });
setAiSeverity(data.severity);
setForm(prev => ({ ...prev, severity: data.severity }));
```

---

## 5. Backend Developer Checklist

Use this checklist to make sure everything is connected before the demo:

- [ ] Spring Boot running on port 8080
- [ ] Flask ML service running on port 8000
- [ ] CORS enabled for `http://localhost:3000` in Spring Boot
- [ ] `proxy` in React `package.json` set to `http://localhost:8080`
- [ ] All API endpoints listed in Section 2.4 implemented
- [ ] JWT login response returns `{ token, user }` format with lowercase role
- [ ] `AuthContext.js` replaced with real axios calls
- [ ] `BugContext.js` replaced with real axios calls
- [ ] `CreateBug.js` AI predict button calls `/api/predict`
- [ ] File uploads working for bug screenshots

---

*BugTracker FYP Project — React + Spring Boot + Flask (DistilBERT)*
