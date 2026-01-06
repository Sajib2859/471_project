const mongoose = require('mongoose');

const uri = "mongodb+srv://mostofashahriarsajib_db_user:PK9uFVTDotjsE0YO@cluster0.ajpmqax.mongodb.net/waste_management?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
.then(async () => {
  console.log('✅ Connected to MongoDB Atlas');
  const db = mongoose.connection.db;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const in3Days = new Date(now);
  in3Days.setDate(in3Days.getDate() + 3);
  const in5Days = new Date(now);
  in5Days.setDate(in5Days.getDate() + 5);
  const in7Days = new Date(now);
  in7Days.setDate(in7Days.getDate() + 7);

  // Update all auctions to have current/future dates and live status
  const updates = [
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000101'),
      startTime: now,
      endTime: in5Days,
      status: 'live'
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000102'),
      startTime: now,
      endTime: in7Days,
      status: 'live'
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000103'),
      startTime: now,
      endTime: in3Days,
      status: 'live'
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000104'),
      startTime: now,
      endTime: in7Days,
      status: 'live'
    },
    {
      _id: new mongoose.Types.ObjectId('000000000000000000000105'),
      startTime: now,
      endTime: in5Days,
      status: 'live'
    }
  ];

  for (const update of updates) {
    await db.collection('auctions').updateOne(
      { _id: update._id },
      { $set: { startTime: update.startTime, endTime: update.endTime, status: update.status } }
    );
  }
  
  console.log('✅ Updated 5 auctions with current dates and live status');
  
  const auctions = await db.collection('auctions').find({}).toArray();
  console.log('\nAuctions:');
  auctions.forEach(a => {
    console.log(`  ${a.title}: ${a.status}, ends ${a.endTime}`);
  });
  
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});
