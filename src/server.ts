import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import auctionRoutes from './routes/auctionRoutes';
import materialRequirementRoutes from './routes/materialRequirementRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = parseInt(process.env.PORT || '1213', 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Waste Management API Server',
    studentId: '22201213',
    port: PORT,
    endpoints: {
      auctions: '/api/auctions',
      materialRequirements: '/api/material-requirements',
      documentation: '/api/docs'
    }
  });
});

// API Routes
app.use('/api', auctionRoutes);
app.use('/api', materialRequirementRoutes);

// API Documentation route
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    success: true,
    studentId: '22201213',
    module: 'Module 2: Credit, Auctions, & Marketplace',
    features: [
      {
        feature: 'Module 2 - Member 2',
        description: 'Users and companies can participate in live online auctions',
        endpoints: [
          'GET /api/auctions - View all auctions',
          'GET /api/auctions/:id - View single auction',
          'POST /api/auctions/:id/check-eligibility - Check eligibility',
          'POST /api/auctions/:id/bid - Place a bid',
          'GET /api/auctions/:id/bids - View all bids for auction',
          'GET /api/users/:userId/bids - View user bid history'
        ]
      },
      {
        feature: 'Module 2 - Member 3',
        description: 'Companies can post material requirements and receive notifications',
        endpoints: [
          'POST /api/material-requirements - Create requirement',
          'GET /api/material-requirements - View all requirements',
          'GET /api/material-requirements/:id - View single requirement',
          'PUT /api/material-requirements/:id - Update requirement',
          'DELETE /api/material-requirements/:id - Cancel requirement',
          'GET /api/material-requirements/:id/matches - Find matching auctions',
          'GET /api/companies/:companyId/notifications - View notifications',
          'PUT /api/notifications/:id/read - Mark notification as read'
        ]
      }
    ]
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server with database connection
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Then start the server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('═══════════════════════════════════════════════════');
      console.log('🚀 Waste Management API Server Started');
      console.log('═══════════════════════════════════════════════════');
      console.log(`📍 Server running on: http://localhost:${PORT}`);
      console.log(`👤 Student ID: 22201213`);
      console.log(`📝 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('═══════════════════════════════════════════════════');
      console.log('✅ Server is listening and ready to accept connections');
    });

    server.on('error', (error: any) => {
      console.error('❌ Server Error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
