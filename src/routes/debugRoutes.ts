import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/db-status', async (req, res) => {
  try {
    const collections = await mongoose.connection.db?.listCollections().toArray();
    const wasteHubs = await mongoose.connection.db?.collection('wastehubs').countDocuments();
    
    res.json({
      connected: mongoose.connection.readyState === 1,
      database: mongoose.connection.name,
      collections: collections?.map(c => c.name),
      wasteHubsCount: wasteHubs,
      env: process.env.MONGODB_URI ? 'SET' : 'NOT SET'
    });
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

export default router;
