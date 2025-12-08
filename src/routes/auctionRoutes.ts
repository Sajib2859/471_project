import express from "express";
import {
  createAuction,
  getAllAuctions,
  getAuctionById,
  checkEligibility,
  placeBid,
  getUserBids,
  getAuctionBids,
  updateAuction,
  deleteAuction,
} from "../controllers/auctionController";

const router = express.Router();

// Auction routes
router.post("/auctions", createAuction);
router.get("/auctions", getAllAuctions);
router.get("/auctions/:id", getAuctionById);
router.put("/auctions/:id", updateAuction);
router.delete("/auctions/:id", deleteAuction);
router.post("/auctions/:id/check-eligibility", checkEligibility);
router.post("/auctions/:id/bid", placeBid);
router.get("/auctions/:id/bids", getAuctionBids);

// User bid history
router.get("/users/:userId/bids", getUserBids);

export default router;
