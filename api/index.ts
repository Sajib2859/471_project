// Vercel serverless function entry point
import { Request, Response } from 'express';
import app from '../src/server';
import connectDB from '../src/config/database';

// Wrapper to ensure DB connection before handling requests
export default async (req: Request, res: Response) => {
  await connectDB();
  return app(req, res);
};
