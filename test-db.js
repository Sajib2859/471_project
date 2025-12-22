const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/waste_management');
    console.log('✅ Connected to MongoDB');
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Collections in database:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Check deposits
    const Deposit = mongoose.connection.collection('deposits');
    const depositCount = await Deposit.countDocuments();
    console.log(`\n📦 Total deposits: ${depositCount}`);
    
    // Sample a deposit to check structure
    const sampleDeposit = await Deposit.findOne({});
    if (sampleDeposit) {
      console.log('\n🔍 Sample deposit:');
      console.log(JSON.stringify(sampleDeposit, null, 2));
    }
    
    // Check waste hubs
    const WasteHub = mongoose.connection.collection('wastehubs');
    const hubCount = await WasteHub.countDocuments();
    console.log(`\n🏢 Total waste hubs: ${hubCount}`);
    
    // Check users
    const User = mongoose.connection.collection('users');
    const userCount = await User.countDocuments();
    console.log(`\n👥 Total users: ${userCount}`);
    
    mongoose.connection.close();
    console.log('\n✅ Database check complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testConnection();
