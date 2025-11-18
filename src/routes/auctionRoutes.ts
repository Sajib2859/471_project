import express from 'express';
import {
  getAllAuctions,
  getAuctionById,
  checkEligibility,
  placeBid,
  getUserBids,
  getAuctionBids
} from '../controllers/auctionController';

const router = express.Router();

// Auction routes
router.get('/auctions', getAllAuctions);
router.get('/auctions/:id', getAuctionById);
router.post('/auctions/:id/check-eligibility', checkEligibility);
router.post('/auctions/:id/bid', placeBid);
router.get('/auctions/:id/bids', getAuctionBids);

// User bid history
router.get('/users/:userId/bids', getUserBids);

export default router;
