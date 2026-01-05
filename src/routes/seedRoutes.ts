import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Auction from '../models/Auction';
import Bid from '../models/Bid';
import MaterialRequirement from '../models/MaterialRequirement';
import Notification from '../models/Notification';
import WasteHub from '../models/WasteHub';
import CreditTransaction from '../models/CreditTransaction';
import CreditRedemption from '../models/CreditRedemption';

const router = Router();

// Helper function to create simple ObjectIds
const createSimpleId = (number: number) => {
  const numStr = number.toString().padStart(24, '0');
  return new mongoose.Types.ObjectId(numStr);
};

// POST /api/seed-database - Seed the database (use with caution!)
router.post('/seed-database', async (req: Request, res: Response) => {
  try {
    // Security check - require a secret key
    const secretKey = req.body.secretKey || req.headers['x-seed-key'];
    if (secretKey !== 'CSE471-SEED-2026') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Secret key required.'
      });
    }

    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Auction.deleteMany({});
    await Bid.deleteMany({});
    await MaterialRequirement.deleteMany({});
    await Notification.deleteMany({});
    await WasteHub.deleteMany({});
    await CreditTransaction.deleteMany({});
    await CreditRedemption.deleteMany({});

    // Insert Users
    const users = await User.insertMany([
      {
        _id: createSimpleId(1),
        name: "Admin User",
        email: "admin@waste.com",
        role: "admin",
        creditBalance: 0,
        cashBalance: 0,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(2),
        name: "Company ABC Ltd",
        email: "company@abc.com",
        role: "company",
        creditBalance: 1000,
        cashBalance: 50000,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(3),
        name: "Green Industries",
        email: "green@industries.com",
        role: "company",
        creditBalance: 2000,
        cashBalance: 100000,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(4),
        name: "Regular User",
        email: "user@test.com",
        role: "user",
        creditBalance: 500,
        cashBalance: 10000,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(5),
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        creditBalance: 300,
        cashBalance: 5000,
        createdAt: new Date()
      }
    ]);

    // Insert Waste Hubs
    const wasteHubs = await WasteHub.insertMany([
      {
        _id: createSimpleId(501),
        name: "Dhaka Central Recycling Hub",
        location: {
          address: "Mirpur-10, Dhaka",
          city: "Dhaka",
          coordinates: { latitude: 23.8103, longitude: 90.4125 }
        },
        wasteTypes: ["plastic", "glass", "paper", "metal"],
        status: "active",
        operatingHours: { open: "08:00", close: "18:00" },
        acceptedMaterials: [
          { type: "plastic", pricePerKg: 15 },
          { type: "glass", pricePerKg: 8 },
          { type: "paper", pricePerKg: 5 },
          { type: "metal", pricePerKg: 25 }
        ],
        capacity: { current: 500, maximum: 2000 },
        contactNumber: "+880-1700-000001",
        createdAt: new Date()
      },
      {
        _id: createSimpleId(502),
        name: "Chittagong Waste Collection Center",
        location: {
          address: "Agrabad, Chittagong",
          city: "Chittagong",
          coordinates: { latitude: 22.3569, longitude: 91.7832 }
        },
        wasteTypes: ["plastic", "electronic", "metal"],
        status: "active",
        operatingHours: { open: "09:00", close: "17:00" },
        acceptedMaterials: [
          { type: "plastic", pricePerKg: 14 },
          { type: "electronic", pricePerKg: 50 },
          { type: "metal", pricePerKg: 24 }
        ],
        capacity: { current: 300, maximum: 1500 },
        contactNumber: "+880-1700-000002",
        createdAt: new Date()
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: users.length,
        wasteHubs: wasteHubs.length
      }
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message
    });
  }
});

export default router;
