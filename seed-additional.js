// Additional Seed Data for Blog, Campaign, Deposit, WasteReport
// Run with: node seed-additional.js

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

// Define Schemas
const BlogSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  excerpt: String,
  category: String,
  tags: [String],
  author: mongoose.Schema.Types.ObjectId,
  coverImage: String,
  images: [String],
  status: String,
  views: Number,
  likes: [mongoose.Schema.Types.ObjectId],
  comments: [{
    user: mongoose.Schema.Types.ObjectId,
    content: String,
    createdAt: Date
  }],
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
});

const CampaignSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  campaignType: String,
  location: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  startDate: Date,
  endDate: Date,
  status: String,
  maxParticipants: Number,
  participants: [mongoose.Schema.Types.ObjectId],
  followers: [mongoose.Schema.Types.ObjectId],
  volunteers: [mongoose.Schema.Types.ObjectId],
  organizer: mongoose.Schema.Types.ObjectId,
  progress: Number,
  goals: [String],
  achievements: [String],
  images: [String],
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: Date,
  updatedAt: Date
});

const DepositSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  wasteHubId: mongoose.Schema.Types.ObjectId,
  wasteType: String,
  amount: Number,
  description: String,
  photoUrl: String,
  status: String,
  verificationDetails: {
    verifiedBy: mongoose.Schema.Types.ObjectId,
    verifiedAt: Date,
    creditAllocated: Number
  },
  rejectionDetails: {
    rejectedBy: mongoose.Schema.Types.ObjectId,
    rejectedAt: Date,
    reason: String
  },
  estimatedCredits: Number,
  createdAt: Date,
  updatedAt: Date
});

const WasteReportSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  location: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  wasteTypes: [String],
  severity: String,
  estimatedQuantity: Number,
  unit: String,
  photos: [String],
  status: String,
  reportedBy: mongoose.Schema.Types.ObjectId,
  assignedTo: mongoose.Schema.Types.ObjectId,
  verifiedBy: mongoose.Schema.Types.ObjectId,
  verifiedAt: Date,
  resolvedAt: Date,
  notes: [String],
  upvotes: [mongoose.Schema.Types.ObjectId],
  createdAt: Date,
  updatedAt: Date
});

// Create Models
const Blog = mongoose.model('Blog', BlogSchema);
const Campaign = mongoose.model('Campaign', CampaignSchema);
const Deposit = mongoose.model('Deposit', DepositSchema);
const WasteReport = mongoose.model('WasteReport', WasteReportSchema);

// Seed Function
const seedAdditionalData = async () => {
  try {
    console.log('🌱 Starting additional data seeding...\n');

    // Admin ID, User IDs, WasteHub IDs (from original seed)
    const adminId = createSimpleId(1);
    const companyId = createSimpleId(2);
    const userId = createSimpleId(4);
    const johnId = createSimpleId(5);
    const dhakaHubId = createSimpleId(201);
    const chittagongHubId = createSimpleId(202);

    // Insert Blogs
    console.log('📝 Inserting blogs...');
    await Blog.deleteMany({});
    await Blog.insertMany([
      {
        _id: createSimpleId(301),
        title: "10 Best Practices for Waste Management at Home",
        content: "Managing waste at home is crucial for environmental sustainability. Here are 10 proven practices: 1. Separate waste into categories (organic, recyclable, hazardous). 2. Compost kitchen waste. 3. Use reusable bags. 4. Reduce single-use plastics. 5. Donate old items. 6. Buy products with minimal packaging. 7. Use rechargeable batteries. 8. Properly dispose of e-waste. 9. Repair instead of replace. 10. Educate family members about recycling.",
        excerpt: "Learn the top 10 practices for effective waste management in your household.",
        category: "best-practices",
        tags: ["home", "recycling", "sustainability", "waste-reduction"],
        author: adminId,
        coverImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
        images: [],
        status: "published",
        views: 1250,
        likes: [userId, johnId],
        comments: [
          {
            user: userId,
            content: "Very helpful tips! I'm already implementing #3 and #5.",
            createdAt: new Date("2025-11-20T10:30:00Z")
          }
        ],
        publishedAt: new Date("2025-11-15T08:00:00Z"),
        createdAt: new Date("2025-11-15T08:00:00Z"),
        updatedAt: new Date("2025-11-15T08:00:00Z")
      },
      {
        _id: createSimpleId(302),
        title: "The Importance of Plastic Recycling in 2025",
        content: "Plastic pollution has reached critical levels globally. In 2025, recycling plastic is more important than ever. With new technologies and better collection systems, we can make a significant difference. Learn how to properly sort plastics, which types are recyclable, and how the recycling process works.",
        excerpt: "Understanding why plastic recycling matters now more than ever.",
        category: "recycling",
        tags: ["plastic", "recycling", "environment", "pollution"],
        author: adminId,
        coverImage: "https://images.unsplash.com/photo-1526951521990-620dc14c214b",
        images: [],
        status: "published",
        views: 890,
        likes: [userId],
        comments: [],
        publishedAt: new Date("2025-11-18T09:00:00Z"),
        createdAt: new Date("2025-11-18T09:00:00Z"),
        updatedAt: new Date("2025-11-18T09:00:00Z")
      },
      {
        _id: createSimpleId(303),
        title: "Community Cleanup Success Story",
        content: "Last weekend's community cleanup campaign was a huge success! Over 200 volunteers collected 2 tons of waste from local parks and beaches. This blog post highlights the journey, challenges, and rewards of organizing such an event.",
        excerpt: "Read about our recent successful community cleanup campaign.",
        category: "cleanup-news",
        tags: ["community", "cleanup", "volunteers", "success"],
        author: adminId,
        coverImage: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5",
        images: [],
        status: "published",
        views: 654,
        likes: [userId, johnId, companyId],
        comments: [
          {
            user: johnId,
            content: "I was there! It was an amazing experience.",
            createdAt: new Date("2025-11-21T14:00:00Z")
          }
        ],
        publishedAt: new Date("2025-11-21T10:00:00Z"),
        createdAt: new Date("2025-11-21T10:00:00Z"),
        updatedAt: new Date("2025-11-21T10:00:00Z")
      },
      {
        _id: createSimpleId(304),
        title: "How to Start Composting: A Beginner's Guide",
        content: "Composting is one of the easiest ways to reduce household waste while creating nutrient-rich soil. This guide covers everything you need to know: choosing a compost bin, what to compost, what to avoid, maintaining your compost, and troubleshooting common issues.",
        excerpt: "Complete beginner's guide to starting your own compost system.",
        category: "education",
        tags: ["composting", "organic-waste", "gardening", "tutorial"],
        author: adminId,
        coverImage: "https://images.unsplash.com/photo-1591037711046-d1d5bfd4d4e0",
        images: [],
        status: "published",
        views: 432,
        likes: [],
        comments: [],
        publishedAt: new Date("2025-11-22T11:00:00Z"),
        createdAt: new Date("2025-11-22T11:00:00Z"),
        updatedAt: new Date("2025-11-22T11:00:00Z")
      }
    ]);
    console.log('✅ 4 blogs inserted\n');

    // Insert Campaigns
    console.log('🎯 Inserting campaigns...');
    await Campaign.deleteMany({});
    await Campaign.insertMany([
      {
        _id: createSimpleId(401),
        title: "Beach Cleanup Drive - Cox's Bazar",
        description: "Join us for a massive beach cleanup initiative at Cox's Bazar. We aim to collect plastic waste, educate tourists about proper waste disposal, and make our beaches cleaner. Volunteers will receive certificates and eco-credits.",
        campaignType: "cleanup",
        location: "Cox's Bazar Beach",
        coordinates: {
          latitude: 21.4272,
          longitude: 92.0058
        },
        startDate: new Date("2025-12-01T08:00:00Z"),
        endDate: new Date("2025-12-01T16:00:00Z"),
        status: "scheduled",
        maxParticipants: 500,
        participants: [userId, johnId],
        followers: [userId, johnId, companyId],
        volunteers: [userId, johnId],
        organizer: adminId,
        progress: 0,
        goals: [
          "Collect 1 ton of plastic waste",
          "Educate 1000 beachgoers",
          "Install 50 waste bins"
        ],
        achievements: [],
        images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19"],
        createdBy: adminId,
        createdAt: new Date("2025-11-15T10:00:00Z"),
        updatedAt: new Date("2025-11-22T14:30:00Z")
      },
      {
        _id: createSimpleId(402),
        title: "Urban Recycling Awareness Week",
        description: "A week-long campaign to spread awareness about recycling in urban areas. Activities include workshops, school visits, distribution of recycling guides, and setting up collection points.",
        campaignType: "awareness",
        location: "Dhaka City",
        coordinates: {
          latitude: 23.8103,
          longitude: 90.4125
        },
        startDate: new Date("2025-11-25T09:00:00Z"),
        endDate: new Date("2025-12-01T18:00:00Z"),
        status: "ongoing",
        maxParticipants: 200,
        participants: [userId, johnId, companyId],
        followers: [userId, johnId, companyId],
        volunteers: [userId, johnId],
        organizer: companyId,
        progress: 45,
        goals: [
          "Conduct 20 workshops",
          "Visit 30 schools",
          "Distribute 10,000 guides",
          "Setup 100 collection points"
        ],
        achievements: [
          "Completed 9 workshops",
          "Visited 15 schools",
          "Distributed 4,500 guides"
        ],
        images: ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b"],
        createdBy: companyId,
        createdAt: new Date("2025-11-10T09:00:00Z"),
        updatedAt: new Date("2025-11-23T16:00:00Z")
      },
      {
        _id: createSimpleId(403),
        title: "E-Waste Collection Drive",
        description: "Bring your old electronics for safe disposal. We accept computers, phones, batteries, and other electronic waste. All items will be properly recycled.",
        campaignType: "recycling",
        location: "Chittagong Hub",
        coordinates: {
          latitude: 22.3569,
          longitude: 91.7832
        },
        startDate: new Date("2025-11-28T10:00:00Z"),
        endDate: new Date("2025-11-30T17:00:00Z"),
        status: "ongoing",
        maxParticipants: 100,
        participants: [johnId],
        followers: [userId, johnId],
        volunteers: [johnId],
        organizer: adminId,
        progress: 60,
        goals: [
          "Collect 500kg of e-waste",
          "Register 150 participants"
        ],
        achievements: [
          "Collected 300kg so far",
          "75 participants registered"
        ],
        images: ["https://images.unsplash.com/photo-1528821154947-1aa3d1b74941"],
        createdBy: adminId,
        createdAt: new Date("2025-11-20T08:00:00Z"),
        updatedAt: new Date("2025-11-28T12:00:00Z")
      }
    ]);
    console.log('✅ 3 campaigns inserted\n');

    // Insert Deposits
    console.log('📦 Inserting deposits...');
    await Deposit.deleteMany({});
    await Deposit.insertMany([
      {
        _id: createSimpleId(501),
        userId: userId,
        wasteHubId: dhakaHubId,
        wasteType: "plastic",
        amount: 15.5,
        description: "Mixed plastic bottles and containers",
        photoUrl: "https://images.unsplash.com/photo-1621451537084-482c73073a0f",
        status: "verified",
        verificationDetails: {
          verifiedBy: adminId,
          verifiedAt: new Date("2025-11-20T11:30:00Z"),
          creditAllocated: 38.75
        },
        estimatedCredits: 38.75,
        createdAt: new Date("2025-11-20T09:00:00Z"),
        updatedAt: new Date("2025-11-20T11:30:00Z")
      },
      {
        _id: createSimpleId(502),
        userId: johnId,
        wasteHubId: dhakaHubId,
        wasteType: "glass",
        amount: 12.0,
        description: "Glass bottles from household",
        photoUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
        status: "verified",
        verificationDetails: {
          verifiedBy: adminId,
          verifiedAt: new Date("2025-11-21T10:00:00Z"),
          creditAllocated: 36.0
        },
        estimatedCredits: 36.0,
        createdAt: new Date("2025-11-21T08:30:00Z"),
        updatedAt: new Date("2025-11-21T10:00:00Z")
      },
      {
        _id: createSimpleId(503),
        userId: userId,
        wasteHubId: chittagongHubId,
        wasteType: "paper",
        amount: 25.0,
        description: "Newspapers and cardboard boxes",
        photoUrl: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1",
        status: "pending",
        estimatedCredits: 37.5,
        createdAt: new Date("2025-11-22T14:00:00Z"),
        updatedAt: new Date("2025-11-22T14:00:00Z")
      },
      {
        _id: createSimpleId(504),
        userId: johnId,
        wasteHubId: dhakaHubId,
        wasteType: "electronic",
        amount: 8.5,
        description: "Old computer parts and cables",
        photoUrl: "https://images.unsplash.com/photo-1528821154947-1aa3d1b74941",
        status: "pending",
        estimatedCredits: 68.0,
        createdAt: new Date("2025-11-23T10:15:00Z"),
        updatedAt: new Date("2025-11-23T10:15:00Z")
      },
      {
        _id: createSimpleId(505),
        userId: userId,
        wasteHubId: dhakaHubId,
        wasteType: "metal",
        amount: 10.0,
        description: "Aluminum cans",
        photoUrl: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2",
        status: "rejected",
        rejectionDetails: {
          rejectedBy: adminId,
          rejectedAt: new Date("2025-11-19T15:00:00Z"),
          reason: "Items were contaminated with food waste. Please clean items before depositing."
        },
        estimatedCredits: 40.0,
        createdAt: new Date("2025-11-19T13:00:00Z"),
        updatedAt: new Date("2025-11-19T15:00:00Z")
      }
    ]);
    console.log('✅ 5 deposits inserted\n');

    // Insert Waste Reports
    console.log('🚨 Inserting waste reports...');
    await WasteReport.deleteMany({});
    await WasteReport.insertMany([
      {
        _id: createSimpleId(601),
        title: "Illegal Dumping Site Near Gulshan Lake",
        description: "Large amounts of plastic and household waste being dumped illegally near Gulshan Lake. This is polluting the water and affecting local wildlife. Immediate action required.",
        location: "Gulshan Lake, Dhaka",
        coordinates: {
          latitude: 23.7925,
          longitude: 90.4078
        },
        wasteTypes: ["plastic", "organic", "textile"],
        severity: "high",
        estimatedQuantity: 200,
        unit: "kg",
        photos: [
          "https://images.unsplash.com/photo-1621451537084-482c73073a0f",
          "https://images.unsplash.com/photo-1605600659908-0ef719419d41"
        ],
        status: "verified",
        reportedBy: userId,
        verifiedBy: adminId,
        verifiedAt: new Date("2025-11-20T14:00:00Z"),
        notes: [
          "Report verified by admin",
          "Cleanup team has been notified"
        ],
        upvotes: [userId, johnId, companyId],
        createdAt: new Date("2025-11-20T10:00:00Z"),
        updatedAt: new Date("2025-11-20T14:00:00Z")
      },
      {
        _id: createSimpleId(602),
        title: "Overflowing Waste Bin at Dhanmondi 27",
        description: "Public waste bin at Dhanmondi 27 has been overflowing for days. Waste is spilling onto the street creating sanitation issues.",
        location: "Dhanmondi 27, Dhaka",
        coordinates: {
          latitude: 23.7461,
          longitude: 90.3742
        },
        wasteTypes: ["plastic", "organic", "paper"],
        severity: "medium",
        estimatedQuantity: 50,
        unit: "kg",
        photos: ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b"],
        status: "in-progress",
        reportedBy: johnId,
        assignedTo: adminId,
        verifiedBy: adminId,
        verifiedAt: new Date("2025-11-21T09:00:00Z"),
        notes: [
          "Verified and assigned to cleanup crew",
          "Scheduled for cleanup on Nov 23"
        ],
        upvotes: [userId, johnId],
        createdAt: new Date("2025-11-21T08:00:00Z"),
        updatedAt: new Date("2025-11-21T09:30:00Z")
      },
      {
        _id: createSimpleId(603),
        title: "Construction Debris Blocking Road",
        description: "Construction waste and debris blocking main road in Mohammadpur. Causing traffic congestion.",
        location: "Mohammadpur, Dhaka",
        coordinates: {
          latitude: 23.7679,
          longitude: 90.3567
        },
        wasteTypes: ["metal", "hazardous"],
        severity: "critical",
        estimatedQuantity: 500,
        unit: "kg",
        photos: ["https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122"],
        status: "resolved",
        reportedBy: userId,
        assignedTo: adminId,
        verifiedBy: adminId,
        verifiedAt: new Date("2025-11-18T10:00:00Z"),
        resolvedAt: new Date("2025-11-19T16:00:00Z"),
        notes: [
          "Emergency cleanup initiated",
          "Debris removed successfully",
          "Contractor fined for improper disposal"
        ],
        upvotes: [userId, johnId, companyId],
        createdAt: new Date("2025-11-18T08:00:00Z"),
        updatedAt: new Date("2025-11-19T16:00:00Z")
      },
      {
        _id: createSimpleId(604),
        title: "Plastic Bottles Along River Bank",
        description: "Noticed many plastic bottles and bags along the river bank near Ashulia. Needs cleanup.",
        location: "Ashulia River Bank",
        coordinates: {
          latitude: 23.8859,
          longitude: 90.3167
        },
        wasteTypes: ["plastic"],
        severity: "low",
        estimatedQuantity: 30,
        unit: "kg",
        photos: ["https://images.unsplash.com/photo-1621451537084-482c73073a0f"],
        status: "pending",
        reportedBy: johnId,
        notes: [],
        upvotes: [johnId],
        createdAt: new Date("2025-11-23T11:00:00Z"),
        updatedAt: new Date("2025-11-23T11:00:00Z")
      }
    ]);
    console.log('✅ 4 waste reports inserted\n');

    // Summary
    const blogCount = await Blog.countDocuments();
    const campaignCount = await Campaign.countDocuments();
    const depositCount = await Deposit.countDocuments();
    const wasteReportCount = await WasteReport.countDocuments();

    console.log('\n========================================');
    console.log('ADDITIONAL DATA SEEDING COMPLETE!');
    console.log('========================================');
    console.log('\n📊 Summary:');
    console.log(`- Blogs: ${blogCount}`);
    console.log(`- Campaigns: ${campaignCount}`);
    console.log(`- Deposits: ${depositCount}`);
    console.log(`- Waste Reports: ${wasteReportCount}`);

    console.log('\n✅ You can now test all frontend pages!');
    console.log('Frontend URL: http://localhost:3000');
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error seeding additional data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
connectDB().then(seedAdditionalData);
