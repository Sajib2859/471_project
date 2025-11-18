// Seed Database Script using Mongoose
// Student ID: 22201213
// Run with: node seed.js

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/waste_management';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}\n`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Helper function to create simple ObjectIds
const createSimpleId = (number) => {
  const numStr = number.toString().padStart(24, '0');
  return new mongoose.Types.ObjectId(numStr);
};

// Define Schemas (simplified for seeding)
const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  role: String,
  creditBalance: Number,
  cashBalance: Number,
  createdAt: Date
});

const AuctionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  materialType: String,
  quantity: Number,
  unit: String,
  startingBid: Number,
  currentBid: Number,
  minimumCreditRequired: Number,
  minimumCashRequired: Number,
  startTime: Date,
  endTime: Date,
  status: String,
  location: String,
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: Date
});

const BidSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  auctionId: mongoose.Schema.Types.ObjectId,
  bidderId: mongoose.Schema.Types.ObjectId,
  bidAmount: Number,
  bidType: String,
  status: String,
  createdAt: Date
});

const MaterialRequirementSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  companyId: mongoose.Schema.Types.ObjectId,
  materialType: String,
  quantity: Number,
  unit: String,
  description: String,
  maxPrice: Number,
  urgency: String,
  status: String,
  preferredLocations: [String],
  notificationPreferences: {
    auctionMatch: Boolean,
    inventoryMatch: Boolean,
    priceAlert: Boolean
  },
  createdAt: Date,
  updatedAt: Date
});

const NotificationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  recipientId: mongoose.Schema.Types.ObjectId,
  type: String,
  title: String,
  message: String,
  relatedId: mongoose.Schema.Types.ObjectId,
  relatedType: String,
  isRead: Boolean,
  createdAt: Date
});

// Models
const User = mongoose.model('User', UserSchema);
const Auction = mongoose.model('Auction', AuctionSchema);
const Bid = mongoose.model('Bid', BidSchema);
const MaterialRequirement = mongoose.model('MaterialRequirement', MaterialRequirementSchema);
const Notification = mongoose.model('Notification', NotificationSchema);

// Seed Function
const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Auction.deleteMany({});
    await Bid.deleteMany({});
    await MaterialRequirement.deleteMany({});
    await Notification.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Insert Users
    console.log('👥 Inserting users...');
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

    const adminUser = users.find(u => u.email === 'admin@waste.com');
    const companyABC = users.find(u => u.email === 'company@abc.com');
    const greenIndustries = users.find(u => u.email === 'green@industries.com');
    const regularUser = users.find(u => u.email === 'user@test.com');
    
    console.log('✅ 5 users inserted');
    console.log(`   Admin ID: ${adminUser._id}`);
    console.log(`   Company ABC ID: ${companyABC._id}`);
    console.log(`   Green Industries ID: ${greenIndustries._id}\n`);

    // Insert Auctions
    console.log('🔨 Inserting auctions...');
    const auctions = await Auction.insertMany([
      {
        _id: createSimpleId(101),
        title: "Recycled Plastic Bottles Auction",
        description: "High quality PET plastic bottles ready for recycling. Clean and sorted.",
        materialType: "plastic",
        quantity: 500,
        unit: "kg",
        startingBid: 1000,
        currentBid: 1200,
        minimumCreditRequired: 100,
        minimumCashRequired: 500,
        startTime: new Date("2025-11-20T10:00:00Z"),
        endTime: new Date("2025-11-25T18:00:00Z"),
        status: "live",
        location: "Dhaka Hub",
        createdBy: adminUser._id,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(102),
        title: "Glass Bottles Collection",
        description: "Assorted glass bottles from beverage industry. Various colors.",
        materialType: "glass",
        quantity: 200,
        unit: "kg",
        startingBid: 800,
        currentBid: 800,
        minimumCreditRequired: 50,
        minimumCashRequired: 300,
        startTime: new Date("2025-11-22T10:00:00Z"),
        endTime: new Date("2025-11-28T18:00:00Z"),
        status: "scheduled",
        location: "Chittagong Hub",
        createdBy: adminUser._id,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(103),
        title: "Cardboard and Paper Waste",
        description: "Commercial grade cardboard and paper waste. Dry and clean.",
        materialType: "paper",
        quantity: 1000,
        unit: "kg",
        startingBid: 500,
        currentBid: 750,
        minimumCreditRequired: 30,
        minimumCashRequired: 200,
        startTime: new Date("2025-11-18T10:00:00Z"),
        endTime: new Date("2025-11-24T18:00:00Z"),
        status: "live",
        location: "Sylhet Hub",
        createdBy: adminUser._id,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(104),
        title: "Metal Cans and Aluminum",
        description: "Crushed aluminum cans and metal containers. Industrial quality.",
        materialType: "metal",
        quantity: 300,
        unit: "kg",
        startingBid: 2000,
        currentBid: 2000,
        minimumCreditRequired: 200,
        minimumCashRequired: 1000,
        startTime: new Date("2025-11-25T10:00:00Z"),
        endTime: new Date("2025-11-30T18:00:00Z"),
        status: "scheduled",
        location: "Dhaka Hub",
        createdBy: adminUser._id,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(105),
        title: "Electronic Waste Components",
        description: "Sorted e-waste including circuit boards and cables.",
        materialType: "electronic",
        quantity: 100,
        unit: "kg",
        startingBid: 3000,
        currentBid: 3500,
        minimumCreditRequired: 500,
        minimumCashRequired: 2000,
        startTime: new Date("2025-11-15T10:00:00Z"),
        endTime: new Date("2025-11-20T18:00:00Z"),
        status: "live",
        location: "Dhaka Hub",
        createdBy: adminUser._id,
        createdAt: new Date()
      }
    ]);

    const plasticAuction = auctions.find(a => a.materialType === 'plastic');
    const glassAuction = auctions.find(a => a.materialType === 'glass');
    const paperAuction = auctions.find(a => a.materialType === 'paper');

    console.log('✅ 5 auctions inserted');
    console.log(`   Plastic Auction ID: ${plasticAuction._id}`);
    console.log(`   Glass Auction ID: ${glassAuction._id}\n`);

    // Insert Bids
    console.log('💰 Inserting bids...');
    await Bid.insertMany([
      {
        _id: createSimpleId(201),
        auctionId: plasticAuction._id,
        bidderId: companyABC._id,
        bidAmount: 1000,
        bidType: "cash",
        status: "outbid",
        createdAt: new Date("2025-11-17T10:00:00Z")
      },
      {
        _id: createSimpleId(202),
        auctionId: plasticAuction._id,
        bidderId: greenIndustries._id,
        bidAmount: 1200,
        bidType: "cash",
        status: "active",
        createdAt: new Date("2025-11-17T14:00:00Z")
      },
      {
        _id: createSimpleId(203),
        auctionId: paperAuction._id,
        bidderId: companyABC._id,
        bidAmount: 750,
        bidType: "credit",
        status: "active",
        createdAt: new Date("2025-11-16T11:00:00Z")
      }
    ]);
    console.log('✅ 3 bids inserted\n');

    // Insert Material Requirements
    console.log('📋 Inserting material requirements...');
    const requirements = await MaterialRequirement.insertMany([
      {
        _id: createSimpleId(301),
        companyId: companyABC._id,
        materialType: "plastic",
        quantity: 1000,
        unit: "kg",
        description: "Need high-quality PET plastic for bottle manufacturing. Must be clean and sorted.",
        maxPrice: 5000,
        urgency: "high",
        status: "active",
        preferredLocations: ["Dhaka", "Chittagong"],
        notificationPreferences: {
          auctionMatch: true,
          inventoryMatch: true,
          priceAlert: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: createSimpleId(302),
        companyId: greenIndustries._id,
        materialType: "glass",
        quantity: 500,
        unit: "kg",
        description: "Looking for clear and colored glass bottles for recycling into new containers.",
        maxPrice: 3000,
        urgency: "medium",
        status: "active",
        preferredLocations: ["Dhaka", "Sylhet"],
        notificationPreferences: {
          auctionMatch: true,
          inventoryMatch: true,
          priceAlert: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: createSimpleId(303),
        companyId: companyABC._id,
        materialType: "paper",
        quantity: 2000,
        unit: "kg",
        description: "Bulk paper and cardboard waste needed for paper manufacturing.",
        maxPrice: 4000,
        urgency: "low",
        status: "active",
        preferredLocations: ["Dhaka"],
        notificationPreferences: {
          auctionMatch: true,
          inventoryMatch: false,
          priceAlert: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: createSimpleId(304),
        companyId: greenIndustries._id,
        materialType: "metal",
        quantity: 800,
        unit: "kg",
        description: "Industrial grade aluminum and metal waste for smelting operations.",
        maxPrice: 10000,
        urgency: "high",
        status: "active",
        preferredLocations: ["Dhaka", "Chittagong", "Sylhet"],
        notificationPreferences: {
          auctionMatch: true,
          inventoryMatch: true,
          priceAlert: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    const plasticReq = requirements.find(r => r.materialType === 'plastic');
    const glassReq = requirements.find(r => r.materialType === 'glass');

    console.log('✅ 4 material requirements inserted');
    console.log(`   Plastic Requirement ID: ${plasticReq._id}\n`);

    // Insert Notifications
    console.log('🔔 Inserting notifications...');
    await Notification.insertMany([
      {
        _id: createSimpleId(401),
        recipientId: companyABC._id,
        type: "auction_match",
        title: "Matching Auctions Found",
        message: "Found 2 auction(s) matching your requirement for plastic materials.",
        relatedId: plasticReq._id,
        relatedType: "requirement",
        isRead: false,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(402),
        recipientId: greenIndustries._id,
        type: "auction_match",
        title: "New Glass Auction Available",
        message: "A new glass auction matching your requirements is now live.",
        relatedId: glassReq._id,
        relatedType: "requirement",
        isRead: false,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(403),
        recipientId: companyABC._id,
        type: "bid_update",
        title: "You've Been Outbid",
        message: "Another bidder has placed a higher bid on the Plastic Bottles Auction.",
        relatedId: plasticAuction._id,
        relatedType: "auction",
        isRead: false,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(404),
        recipientId: greenIndustries._id,
        type: "bid_update",
        title: "Your Bid is Leading",
        message: "Your bid of 1200 is currently the highest on Plastic Bottles Auction.",
        relatedId: plasticAuction._id,
        relatedType: "auction",
        isRead: true,
        createdAt: new Date()
      },
      {
        _id: createSimpleId(405),
        recipientId: companyABC._id,
        type: "price_alert",
        title: "Price Alert: Paper Auction",
        message: "Paper auction price is within your budget range of 4000.",
        relatedId: paperAuction._id,
        relatedType: "auction",
        isRead: false,
        createdAt: new Date()
      }
    ]);
    console.log('✅ 5 notifications inserted\n');

    // Summary
    const userCount = await User.countDocuments();
    const auctionCount = await Auction.countDocuments();
    const bidCount = await Bid.countDocuments();
    const requirementCount = await MaterialRequirement.countDocuments();
    const notificationCount = await Notification.countDocuments();

    console.log('\n========================================');
    console.log('DATABASE SETUP COMPLETE!');
    console.log('========================================');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${userCount}`);
    console.log(`- Auctions: ${auctionCount}`);
    console.log(`- Bids: ${bidCount}`);
    console.log(`- Material Requirements: ${requirementCount}`);
    console.log(`- Notifications: ${notificationCount}`);

    console.log('\n🔑 Important IDs for Testing:');
    console.log('================================');
    console.log('\n👥 Users:');
    console.log(`Admin: ${adminUser._id}`);
    console.log(`Company ABC: ${companyABC._id}`);
    console.log(`Green Industries: ${greenIndustries._id}`);
    console.log(`Regular User: ${regularUser._id}`);

    console.log('\n🔨 Auctions:');
    console.log(`Plastic Auction: ${plasticAuction._id}`);
    console.log(`Glass Auction: ${glassAuction._id}`);
    console.log(`Paper Auction: ${paperAuction._id}`);

    console.log('\n📋 Material Requirements:');
    console.log(`Plastic Requirement: ${plasticReq._id}`);
    console.log(`Glass Requirement: ${glassReq._id}`);

    console.log('\n✅ You can now start testing the APIs!');
    console.log('Server URL: http://localhost:1213/api');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
connectDB().then(seedDatabase);
