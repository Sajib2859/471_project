import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

// GET /api/db-test - Test database connection
router.get('/db-test', async (req: Request, res: Response) => {
  try {
    const status = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    res.json({
      success: true,
      mongooseState: states[status],
      mongooseStateCode: status,
      connected: status === 1,
      dbName: mongoose.connection.name,
      host: mongoose.connection.host,
      envVarSet: !!process.env.MONGODB_URI,
      envVarLength: process.env.MONGODB_URI?.length || 0
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
