<<<<<<< HEAD
# ZidioProject1
Excel Analytics Platform
=======
# 📊 Excel Analytics Platform

A full-stack MERN application that allows users to upload Excel files, choose columns for analysis, generate dynamic 2D/3D charts, download them, and view their analysis history. Admins can manage users and data, and optionally, the platform supports AI-generated summaries using OpenAI.

---

## 🚀 Key Features

- ✅ User & Admin Authentication (JWT based)
- 📂 Upload Excel (.xls/.xlsx) files
- 📊 Dynamic 2D/3D Chart Generation with Chart.js & Three.js
- 🔄 Select X and Y axes from uploaded Excel data
- 💾 Save and view upload & analysis history
- 🧠 Optional integration with OpenAI for AI-generated insights
- 📥 Download charts as PNG or PDF
- 🛠️ Admin panel to manage users and uploads
- 🧑‍💻 Modern, responsive UI with Tailwind CSS

---

## 🧰 Tech Stack

### Frontend (`/frontend`)
- React.js
- Redux Toolkit
- Tailwind CSS
- Chart.js
- Three.js

### Backend (`/backend`)
- Node.js
- Express.js
- MongoDB & Mongoose
- Multer (file uploads)
- SheetJS (`xlsx`)
- JWT (authentication)

### Tools & Services
- Postman (API testing)
- Git & GitHub
- Cloudinary (optional for storing files/images)
- OpenAI API (optional for summaries)
- Netlify (frontend deployment)
- Render (backend deployment)

---

## 🗓️ Project Timeline

| Week | Tasks                                                                 |
|------|-----------------------------------------------------------------------|
| 1    | Setup project, authentication system, dashboard layout                |
| 2    | Implement Excel file upload & parsing logic using Multer + SheetJS   |
| 3    | Build 2D/3D chart rendering UI with Chart.js & Three.js               |
| 4    | Add download functionality, analysis history, and optional AI tools   |
| 5    | Finalize admin panel, testing, and deploy frontend + backend          |

---

## 📦 Getting Started

### ✅ Prerequisites
Make sure you have the following installed:
- Node.js
- MongoDB
- Git

---

### 🔄 Clone the Repository

```bash
git clone https://github.com/yourusername/excel-analytics-platform.git
cd excel-analytics-platform
>>>>>>> 68e9fd8 (Add frontend, backend, and README.md)
>>>>>>> master
