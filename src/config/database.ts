import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Cached connection for serverless
let cachedConnection: typeof mongoose | null = null;

const connectDB = async (): Promise<typeof mongoose> => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/waste_management';
    
    console.log('Connecting to MongoDB...');
    console.log('URI format check:', mongoURI.substring(0, 20) + '...');
    console.log('Current connection state:', mongoose.connection.readyState);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
    });
    
    cachedConnection = conn;
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log('Connection state after connect:', mongoose.connection.readyState);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    console.error('⚠️  Please check MONGODB_URI environment variable');
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

export default connectDB;
