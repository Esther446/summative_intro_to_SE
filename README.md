# 🎓 InternLink — Full-Stack Internship Platform

A modern full-stack internship platform connecting **students** with **employers** through a secure, role-based system.
Students discover opportunities. Employers post openings. Everything runs on a JWT-secured API.

---

# 🚀 Features

### 👩‍🎓 Students

* Register & login
* Browse internships
* View internship details
* Apply to opportunities
* Personalized dashboard

### 🏢 Employers

* Register & login
* Post internships
* Edit internships
* Delete internships
* Manage opportunities from dashboard

### 🔐 Authentication

* JWT-based authentication
* Role-based authorization
* Protected routes
* Token persistence (localStorage)

### 🎨 UI/UX

* TailwindCSS modern interface
* Responsive layout
* Dark mode toggle
* Smooth animations
* Clean dashboard experience

---

# 🏗️ Tech Stack

### Frontend

* HTML
* TailwindCSS
* Vanilla JavaScript
* Vite (dev server)

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt password hashing

---

# 📁 Project Structure

```
project-root/
│
├── client/                 # Frontend (Vite)
│   ├── index.html
│   ├── register.html
│   ├── internships.html
│   ├── post-opportunity.html
│   ├── student-dashboard.html
│   ├── employer-dashboard.html
│   └── scripts/
│
├── src/                    # Backend
│   ├── controllers/
│   │   ├── studentController.js
│   │   ├── employerController.js
│   │   └── internshipController.js
│   │
│   ├── models/
│   │   ├── Student.js
│   │   ├── Employer.js
│   │   └── Internship.js
│   │
│   ├── routes/
│   │   ├── studentRoutes.js
│   │   ├── employerRoutes.js
│   │   └── internshipRoutes.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/internlink
JWT_SECRET=your_super_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

---

# 🛠️ Installation

### 1. Clone repository

```
git clone <repo-url>
cd internlink
```

### 2. Install dependencies

```
npm install
```

### 3. Start backend

```
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

### 4. Start frontend (Vite)

```
cd client
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔌 API Endpoints

### Students

```
POST /api/students/register
POST /api/students/login
```

### Employers

```
POST /api/employers/register
POST /api/employers/login
```

### Internships

```
GET    /api/internships
GET    /api/internships/:id
POST   /api/internships        (Employer only)
PUT    /api/internships/:id    (Owner only)
DELETE /api/internships/:id    (Owner only)
```

---

# 🔐 Authentication

Protected routes require:

```
Authorization: Bearer <token>
```

Token stored in:

```
localStorage
```

---

# 🧪 Testing With Postman

### Employer Register

```
POST /api/employers/register
Content-Type: application/json

{
  "companyName": "Acme Inc",
  "email": "hr@acme.com",
  "password": "secret123"
}
```

### Student Register

```
POST /api/students/register
{
  "name": "John Doe",
  "email": "john@email.com",
  "password": "secret123"
}
```

---

# 🔄 User Flow

### Student

Landing → Register → Dashboard → Browse Internships → Apply

### Employer

Landing → Register → Dashboard → Post Opportunity → Manage Listings

---

# 🌙 UI Features

* Dark mode toggle
* Smooth fade animations
* Responsive layout
* Clean dashboard cards
* Tailwind-based styling

---

# 🚀 Deployment

### Backend

Deploy to:

* Render
* Railway
* VPS
* AWS

### Frontend

Deploy to:

* Vercel
* Netlify
* GitHub Pages

### Production Environment Variables

```
NODE_ENV=production
MONGO_URI=<Atlas URI>
JWT_SECRET=<strong-secret>
CORS_ORIGIN=<frontend-url>
```

---

# 📸 Screenshots

Add screenshots here after UI polish:

```
/screenshots/landing.png
/screenshots/dashboard.png
```

---

# 🔮 Future Improvements

* Internship applications system
* Resume upload
* Email notifications
* Search & filtering
* Saved internships
* Admin panel

---

# 👩‍💻 Author

Built with ❤️ to connect students with real opportunities.

---

# 📄 License

MIT License
