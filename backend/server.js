import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';
import ExpressError from './utils/ExpressError.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

app.use(postRoutes);
app.use(userRoutes);

// MongoDB connection
const start = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    
}

start();

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong!" } = err;
    res.status(statusCode).json({ message });
});