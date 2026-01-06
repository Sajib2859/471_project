const mongoose = require('mongoose');

const uri = "mongodb+srv://mostofashahriarsajib_db_user:PK9uFVTDotjsE0YO@cluster0.ajpmqax.mongodb.net/waste_management?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
.then(async () => {
  console.log('✅ Connected to MongoDB Atlas');
  const db = mongoose.connection.db;

  // Update Company ABC user with sufficient balance
  const result = await db.collection('users').updateOne(
    { _id: new mongoose.Types.ObjectId('000000000000000000000002') },
    { 
      $set: { 
        creditBalance: 1000,
        cashBalance: 5000
      } 
    }
  );
  
  console.log('✅ Updated company balance:', result);
  
  // Check the user
  const user = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId('000000000000000000000002') });
  console.log('User:', user);
  
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
});
