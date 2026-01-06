const mongoose = require('mongoose');

const uri = "mongodb+srv://mostofashahriarsajib_db_user:PK9uFVTDotjsE0YO@cluster0.ajpmqax.mongodb.net/waste_management?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
.then(async () => {
  console.log('✅ Connected to MongoDB Atlas');
  const db = mongoose.connection.db;

  // Delete old waste reports
  await db.collection('wastereports').deleteMany({});
  console.log('🗑️ Deleted old waste reports');

  // Seed Waste Reports with valid ObjectIds
  await db.collection('wastereports').insertMany([
    {
      _id: new mongoose.Types.ObjectId('676d00000000000000000001'),
      title: 'Illegal Dumping Site Near Park',
      description: 'Large amounts of plastic and household waste dumped near Ramna Park. Needs immediate attention.',
      location: 'Ramna Park, Dhaka',
      wasteTypes: ['plastic', 'organic'],
      severity: 'high',
      reportedBy: new mongoose.Types.ObjectId('000000000000000000000004'),
      status: 'pending',
      estimatedQuantity: 200,
      unit: 'kg',
      upvotes: [new mongoose.Types.ObjectId('000000000000000000000005')],
      comments: [],
      imageUrls: [],
      photos: [],
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId('676d00000000000000000002'),
      title: 'Overflowing Waste Bin',
      description: 'Public waste bin at Gulshan Circle is overflowing for the past 3 days.',
      location: 'Gulshan Circle, Dhaka',
      wasteTypes: ['organic', 'plastic'],
      severity: 'medium',
      reportedBy: new mongoose.Types.ObjectId('000000000000000000000005'),
      status: 'in-progress',
      estimatedQuantity: 50,
      unit: 'kg',
      upvotes: [],
      comments: [],
      imageUrls: [],
      photos: [],
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: new mongoose.Types.ObjectId('676d00000000000000000003'),
      title: 'Electronic Waste on Street',
      description: 'Old computers and monitors dumped on the street corner.',
      location: 'Mirpur 10, Dhaka',
      wasteTypes: ['electronic', 'hazardous'],
      severity: 'high',
      reportedBy: new mongoose.Types.ObjectId('000000000000000000000004'),
      status: 'resolved',
      estimatedQuantity: 30,
      unit: 'kg',
      upvotes: [new mongoose.Types.ObjectId('000000000000000000000005')],
      comments: [],
      imageUrls: [],
      photos: [],
      notes: [],
      resolvedAt: new Date(),
      createdAt: new Date('2026-01-03'),
      updatedAt: new Date()
    }
  ]);
  
  console.log('✅ Added 3 waste reports with valid ObjectIds');
  
  const count = await db.collection('wastereports').countDocuments();
  console.log(`📊 Total waste reports: ${count}`);
  
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});
