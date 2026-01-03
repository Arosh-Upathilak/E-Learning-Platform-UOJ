import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config(); 

import connectDB from "./config/connectDB.js";
import userRouter from "./routes/userRoutes.js";
import subjectRouter from "./routes/subjectRoutes.js";
import fileRouter from "./routes/fileRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "https://e-learning-platform-uoj.netlify.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/files", fileRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
