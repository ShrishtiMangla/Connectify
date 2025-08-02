import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT ;
const app = express();

import { connectDB } from './lib/db.js';

app.use(cors({
    origin: "http://localhost:5173", // Adjust the origin as needed
    credentials: true, // Allow frontend to send cookies
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    });

