import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config(); // .env must be in backend/

import connectDB from "./config/connectDB.js";
import userRouter from "./routes/userRoutes.js";
import subjectRouter from "./routes/subjectRoutes.js";
import fileRouter from "./routes/fileRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

/**
 * 🔥 CORS MUST BE FIRST
 */
app.use(
  cors({
    origin: "https://e-learning-platform-uoj.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * 🔥 THIS HANDLES PREFLIGHT
 */
app.options("*", cors());

app.use(cookieParser());
app.use(express.json());

/**
 * 🔥 CONNECT DB AFTER CORS
 */
connectDB();

/**
 * ROUTES
 */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/files", fileRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
