const mongoose = require('mongoose');

const uri = "mongodb+srv://mostofashahriarsajib_db_user:PK9uFVTDotjsE0YO@cluster0.ajpmqax.mongodb.net/waste_management?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
})
.then(async () => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
  console.log('Database:', mongoose.connection.name);
  
  // Check wastehubs specifically
  const wastehubs = await mongoose.connection.db.collection('wastehubs').find({}).limit(5).toArray();
  console.log('\nWaste Hubs:', JSON.stringify(wastehubs, null, 2));
  
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});
