// Vercel serverless function entry point
import { Request, Response, NextFunction } from 'express';
import app from '../src/server';
import connectDB from '../src/config/database';

// Connection state
let isConnected = false;

// Middleware to ensure DB connection before each request
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error('DB connection error:', error);
    }
  }
  next();
});

export default app;
