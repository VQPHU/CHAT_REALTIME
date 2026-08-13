import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRouter from './routes/authRoure.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());

// public routes 
app.use('/api/auth', authRouter);
app.use(cookieParser());

// private routes

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
