// Vercel serverless function entry point
import { Request, Response } from 'express';
import app from '../src/server';
import connectDB from '../src/config/database';

// Middleware to ensure DB connection before handling requests
const handler = async (req: Request, res: Response) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
  return app(req, res);
};

export default handler;
