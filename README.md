# E-Learning Platform UOJ

A comprehensive full-stack e-learning platform built with React.js frontend and Node.js/Express backend, designed to provide an interactive online learning experience for the University of Jaffna.

## 🚀 Features

- **User Authentication & Authorization** - Secure login/registration with JWT
- **Subject Management** - Create, update, delete, and manage subjects
- **File Management** - Upload, preview, and download course materials
- **Dark/Light Theme** - Toggle between themes with persistent preferences
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Email Notifications** - OTP verification and password reset
- **Admin Dashboard** - Comprehensive management interface
- **Real-time Updates** - Dynamic content management

## 🛠️ Tech Stack

### Frontend
- **React.js 19.2.0** - Modern UI library with hooks
- **React Router DOM 7.9.6** - Client-side routing
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls
- **Sonner** - Toast notifications
- **Supabase** - Backend-as-a-Service integration

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing and encryption
- **Nodemailer** - Email service integration
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - HTTP cookie parsing

### DevOps & Deployment
- **Docker** - Containerization for both frontend and backend
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD workflow automation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud)
- Docker (optional, for containerized deployment)

## 🔧 Installation

### Method 1: Manual Setup

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
   
   **Backend `.env` file:**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   NODE_ENV=development
   ```
   
   **Frontend `.env` file:**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Method 2: Docker Setup

1. **Using Docker Compose**
   ```bash
   docker-compose up --build
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Application runs on `http://localhost:3000`

### Production Build

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

## 📁 Project Structure

```
E Learning Platform UOJ/
├── .github/
│   └── workflows/
│       └── workflow.yml     # CI/CD pipeline
├── backend/
│   ├── config/
│   │   ├── connectDB.js     # Database connection
│   │   └── sendEmail.js     # Email configuration
│   ├── controllers/         # Business logic
│   │   ├── userControllers.js
│   │   ├── subjectControllers.js
│   │   └── fileControllers.js
│   ├── middlewares/
│   │   └── authMiddleware.js # Authentication middleware
│   ├── models/              # Database schemas
│   │   ├── userModel.js
│   │   ├── subjectModel.js
│   │   └── fileModel.js
│   ├── routes/              # API endpoints
│   │   ├── userRoutes.js
│   │   ├── subjectRoutes.js
│   │   └── fileRoutes.js
│   ├── utils/
│   │   └── nodeMailer.js    # Email utilities
│   ├── .env                 # Environment variables
│   ├── Dockerfile           # Backend container config
│   ├── index.js             # Server entry point
│   └── package.json         # Backend dependencies
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # Images, icons, etc.
│   │   ├── components/      # Reusable components
│   │   │   ├── login/
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   └── filePreview/
│   │   ├── context/         # React context providers
│   │   │   └── AppContext.jsx
│   │   ├── pages/           # Page components
│   │   │   └── admin/
│   │   ├── util/            # Utility functions
│   │   ├── App.js           # Main App component
│   │   ├── index.js         # Entry point
│   │   └── index.css        # Global styles
│   ├── .env                 # Frontend environment variables
│   ├── Dockerfile           # Frontend container config
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json         # Frontend dependencies
├── docker-compose.yml       # Development containers
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/send-otp` - Send OTP for verification
- `POST /api/users/verify-otp` - Verify OTP

### Subject Management
- `GET /api/subjects/listAllSubjects` - Get all subjects
- `GET /api/subjects/listSubjects` - Get user subjects
- `POST /api/subjects/createSubject` - Create new subject
- `PUT /api/subjects/updateSubject/:id` - Update subject
- `DELETE /api/subjects/deleteSubject/:id` - Delete subject
- `GET /api/subjects/getSubject/:id` - Get single subject

### File Management
- `POST /api/files/upload` - Upload file
- `GET /api/files/list` - List files
- `DELETE /api/files/delete/:id` - Delete file

## 🧪 Testing

**Frontend Tests:**
```bash
cd frontend
npm test
```

**Backend Tests:**
```bash
cd backend
npm test
```

## 🐳 Docker Commands

**Development:**
```bash
docker-compose up --build
docker-compose down
```

**Production:**
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Team

- **Frontend Development** - React.js, Tailwind CSS, Responsive Design
- **Backend Development** - Node.js, Express.js, MongoDB
- **DevOps** - Docker, CI/CD, Deployment

## 📧 Support

For technical support or questions:
- Create an issue on GitHub
- Contact the development team
- Email: support@uoj.ac.lk

---

**University of Jaffna - E-Learning Platform**  
*Empowering Education Through Technology*