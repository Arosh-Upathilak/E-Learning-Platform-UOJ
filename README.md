# E-Learning Platform UOJ

A full-stack e-learning platform built with React.js frontend and Node.js/Express backend, designed to provide an interactive online learning experience.

## 🚀 Features

- User authentication and authorization
- Course management system
- Interactive learning modules
- Progress tracking
- Responsive design with Tailwind CSS
- Secure API endpoints
- Email notifications

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Testing Library** - Testing utilities

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "E Learning Platform UOJ"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

### Production Build

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

## 📁 Project Structure

```
E Learning Platform UOJ/
├── backend/
│   ├── .env                 # Environment variables
│   ├── package.json         # Backend dependencies
│   └── package-lock.json
├── frontend/
│   ├── public/              # Static assets
│   ├── src/                 # React source code
│   │   ├── assets/          # Images, icons, etc.
│   │   ├── App.js           # Main App component
│   │   ├── App.css          # App styles
│   │   ├── index.js         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind configuration
│   └── README.md
├── .gitignore
└── README.md
```

## 🧪 Testing

Run tests for the frontend:
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📧 Contact

For any questions or support, please contact the development team.

---

**University of Jaffna - E-Learning Platform**