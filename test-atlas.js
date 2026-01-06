const mongoose = require('mongoose');

const uri = "mongodb+srv://mostofashahriarsajib_db_user:PK9uFVTDotjsE0YO@cluster0.ajpmqax.mongodb.net/waste_management?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,
})
.then(async () => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
  console.log('Database:', mongoose.connection.name);
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('\nCollections:');
  
  for (const col of collections) {
    const count = await mongoose.connection.db.collection(col.name).countDocuments();
    console.log(`  ${col.name}: ${count} documents`);
  }
  
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});
