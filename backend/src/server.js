import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT ;
const app = express();

import authRoutes from './routes/auth.route.js';
app.use("/api/auth", authRoutes);

import { connectDB } from './lib/db.js';

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    });

