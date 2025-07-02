import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config();
const PORT = process.env.PORT ;
const app = express();

import { connectDB } from './lib/db.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    });

