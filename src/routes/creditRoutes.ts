import { Router } from 'express';
import {
  getCreditBalance,
  getTransactionHistory,
  redeemCredits,
  getRedemptionHistory,
  getRedemptionById,
  getCreditSummary,
  addCredits
} from '../controllers/creditController';

const router = Router();

/**
 * Module 2 - Member 1: Credit, Auctions, & Marketplace
 * Routes for credit management and redemption
 */

// Get current credit balance for a user
router.get('/users/:userId/credits/balance', getCreditBalance);

// Get transaction history for a user
router.get('/users/:userId/credits/transactions', getTransactionHistory);

// Redeem credits for cash
router.post('/users/:userId/credits/redeem', redeemCredits);

// Get redemption history for a user
router.get('/users/:userId/credits/redemptions', getRedemptionHistory);

// Get credit summary/analytics for a user
router.get('/users/:userId/credits/summary', getCreditSummary);

// Add credits to user account
router.post('/users/:userId/credits/add', addCredits);

// Get single redemption details
router.get('/users/:userId/credits/redemptions/:redemptionId', getRedemptionById);

export default router;
