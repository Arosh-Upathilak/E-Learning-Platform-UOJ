import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/connectDB.js';
import userRouter from './routes/userRoutes.js';
import subjectRouter from './routes/subjectRoutes.js';
import fileRouter from './routes/fileRoutes.js';

const app = express();
const port = process.env.PORT || 5000;
const frontend_url = process.env.FRONTEND_URL ;

//middleware
app.use(cors({
    origin:frontend_url,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
