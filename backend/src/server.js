import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRouter from './routes/authRoure.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoure.js';
import { protectedRoute } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParser());

// public routes 
app.use('/api/auth', authRouter);

// private routes
app.use(protectedRoute); // middleware xác minh user
app.use('/api/users', userRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
