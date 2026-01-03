import express from 'express';
//import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config({ path: "./backend/.env" });
import connectDB from './config/connectDB.js';
import userRouter from './routes/userRoutes.js';
import subjectRouter from './routes/subjectRoutes.js';
import fileRouter from './routes/fileRoutes.js';

const app = express();
const port = process.env.PORT || 5000;
const frontend_url = process.env.FRONTEND_URL_DEVELOPMENT_URL ;

//middleware
/*
app.use(cors({
    origin:frontend_url,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));*/

//for the deployement
const allowedOrigins = [
  "https://e-learning-platform-uoj.netlify.app",
  "http://localhost:3000",
];


app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(cookieParser());
app.use(express.json());

//connect Database
connectDB();

//routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/users', userRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/files', fileRouter);

app.listen(port,  "0.0.0.0",() => {
    console.log(`Server is running on port ${port}`);
});
