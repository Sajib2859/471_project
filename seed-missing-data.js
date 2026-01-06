const mongoose = require('mongoose');

const uri = "mongodb+srv://mostofashahriarsajib_db_user:PK9uFVTDotjsE0YO@cluster0.ajpmqax.mongodb.net/waste_management?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
.then(async () => {
  console.log('✅ Connected to MongoDB Atlas');
  const db = mongoose.connection.db;

  // Seed Announcements
  console.log('\n📢 Seeding Announcements...');
  await db.collection('announcements').insertMany([
    {
      _id: '000000000000000000000a01',
      title: 'New Recycling Program Launch',
      content: 'We are excited to announce a new recycling program starting next month. Join us in making our city cleaner!',
      type: 'announcement',
      priority: 'high',
      targetAudience: 'all',
      isActive: true,
      createdBy: '000000000000000000000001',
      expiresAt: new Date('2026-03-01'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '000000000000000000000a02',
      title: 'Waste Collection Schedule Update',
      content: 'Please note the updated waste collection schedule for January. Collection days have changed for some areas.',
      type: 'notice',
      priority: 'medium',
      targetAudience: 'users',
      isActive: true,
      createdBy: '000000000000000000000001',
      expiresAt: new Date('2026-02-01'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '000000000000000000000a03',
      title: 'Earn More Credits!',
      content: 'Double credit points on electronic waste recycling this month. Bring your old electronics today!',
      type: 'promotion',
      priority: 'medium',
      targetAudience: 'all',
      isActive: true,
      createdBy: '000000000000000000000001',
      expiresAt: new Date('2026-01-31'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  console.log('✅ Added 3 announcements');

  // Seed Campaigns
  console.log('\n🌱 Seeding Campaigns...');
  await db.collection('campaigns').insertMany([
    {
      _id: '000000000000000000000c01',
      title: 'Clean Dhaka Initiative',
      description: 'Join us in cleaning up Dhaka! We aim to collect 1000kg of plastic waste from our streets.',
      goal: 'Collect 1000 kg of plastic waste',
      targetAmount: 1000,
      currentAmount: 350,
      unit: 'kg',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-02-28'),
      location: 'Dhaka',
      createdBy: '000000000000000000000001',
      participants: ['000000000000000000000004', '000000000000000000000005'],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '000000000000000000000c02',
      title: 'E-Waste Collection Drive',
      description: 'Help us collect electronic waste for proper recycling. Bring your old phones, computers, and appliances.',
      goal: 'Collect 500 electronic items',
      targetAmount: 500,
      currentAmount: 120,
      unit: 'items',
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-03-15'),
      location: 'Nationwide',
      createdBy: '000000000000000000000002',
      participants: ['000000000000000000000004'],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '000000000000000000000c03',
      title: 'Paper Recycling Month',
      description: 'Let\'s save trees by recycling paper! Every kilogram counts.',
      goal: 'Collect 2000 kg of paper',
      targetAmount: 2000,
      currentAmount: 850,
      unit: 'kg',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
      location: 'Chittagong',
      createdBy: '000000000000000000000003',
      participants: ['000000000000000000000004', '000000000000000000000005'],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  console.log('✅ Added 3 campaigns');

  // Seed Ratings
  console.log('\n⭐ Seeding Ratings...');
  await db.collection('ratings').insertMany([
    {
      _id: '000000000000000000000r01',
      userId: '000000000000000000000004',
      targetId: '000000000000000000000501',
      targetType: 'wasteHub',
      rating: 5,
      review: 'Excellent facility! Staff is very helpful and the process is quick.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '000000000000000000000r02',
      userId: '000000000000000000000005',
      targetId: '000000000000000000000501',
      targetType: 'wasteHub',
      rating: 4,
      review: 'Good service but can be crowded during peak hours.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '000000000000000000000r03',
      userId: '000000000000000000000004',
      targetId: '000000000000000000000502',
      targetType: 'wasteHub',
      rating: 5,
      review: 'Amazing place! They accept all types of electronic waste.',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  console.log('✅ Added 3 ratings');

  // Seed Waste Reports
  console.log('\n🗑️ Seeding Waste Reports...');
  await db.collection('wastereports').insertMany([
    {
      _id: '676d0000000000000000001',
      title: 'Illegal Dumping Site Near Park',
      description: 'Large amounts of plastic and household waste dumped near Ramna Park. Needs immediate attention.',
      location: 'Ramna Park, Dhaka',
      wasteTypes: ['plastic', 'organic'],
      severity: 'high',
      reportedBy: '000000000000000000000004',
      status: 'pending',
      estimatedQuantity: 200,
      unit: 'kg',
      upvotes: 15,
      upvotedBy: ['000000000000000000000005'],
      comments: [],
      imageUrls: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '676d0000000000000000002',
      title: 'Overflowing Waste Bin',
      description: 'Public waste bin at Gulshan Circle is overflowing for the past 3 days.',
      location: 'Gulshan Circle, Dhaka',
      wasteTypes: ['organic', 'plastic'],
      severity: 'medium',
      reportedBy: '000000000000000000000005',
      status: 'in-progress',
      estimatedQuantity: 50,
      unit: 'kg',
      upvotes: 8,
      upvotedBy: [],
      comments: [],
      imageUrls: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '676d0000000000000000003',
      title: 'Electronic Waste on Street',
      description: 'Old computers and monitors dumped on the street corner.',
      location: 'Mirpur 10, Dhaka',
      wasteTypes: ['electronic', 'hazardous'],
      severity: 'high',
      reportedBy: '000000000000000000000004',
      status: 'resolved',
      estimatedQuantity: 30,
      unit: 'kg',
      upvotes: 12,
      upvotedBy: ['000000000000000000000005'],
      comments: [],
      imageUrls: [],
      resolvedAt: new Date(),
      createdAt: new Date('2026-01-03'),
      updatedAt: new Date()
    }
  ]);
  console.log('✅ Added 3 waste reports');

  // Seed Activity Logs
  console.log('\n📋 Seeding Activity Logs...');
  await db.collection('activitylogs').insertMany([
    {
      _id: '000000000000000000000l01',
      userId: '000000000000000000000001',
      action: 'CREATE_USER',
      targetId: '000000000000000000000004',
      targetType: 'User',
      description: 'Created new user account',
      ipAddress: '192.168.1.100',
      timestamp: new Date()
    },
    {
      _id: '000000000000000000000l02',
      userId: '000000000000000000000001',
      action: 'UPDATE_ROLE',
      targetId: '000000000000000000000003',
      targetType: 'User',
      description: 'Updated user role from user to company',
      ipAddress: '192.168.1.100',
      timestamp: new Date()
    },
    {
      _id: '000000000000000000000l03',
      userId: '000000000000000000000004',
      action: 'CREATE_DEPOSIT',
      targetId: '000000000000000000000d01',
      targetType: 'Deposit',
      description: 'Created new deposit request',
      ipAddress: '192.168.1.105',
      timestamp: new Date()
    },
    {
      _id: '000000000000000000000l04',
      userId: '000000000000000000000001',
      action: 'VERIFY_DEPOSIT',
      targetId: '000000000000000000000d01',
      targetType: 'Deposit',
      description: 'Verified and approved deposit',
      ipAddress: '192.168.1.100',
      timestamp: new Date()
    },
    {
      _id: '000000000000000000000l05',
      userId: '000000000000000000000004',
      action: 'CREATE_REPORT',
      targetId: '000000000000000000000w01',
      targetType: 'WasteReport',
      description: 'Submitted waste report',
      ipAddress: '192.168.1.105',
      timestamp: new Date()
    }
  ]);
  console.log('✅ Added 5 activity logs');

  // Fix auction collection name typo (auctios -> auctions)
  console.log('\n🔧 Fixing auction collection name...');
  const auctiosData = await db.collection('auctios').find({}).toArray();
  if (auctiosData.length > 0) {
    await db.collection('auctions').insertMany(auctiosData);
    console.log(`✅ Copied ${auctiosData.length} auctions from 'auctios' to 'auctions'`);
  }

  console.log('\n✅ All data seeded successfully!');
  console.log('\n📊 Final Collection Counts:');
  
  const collections = ['announcements', 'campaigns', 'ratings', 'wastereports', 'activitylogs', 'auctions'];
  for (const col of collections) {
    const count = await db.collection(col).countDocuments();
    console.log(`  ${col}: ${count} documents`);
  }
  
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});
