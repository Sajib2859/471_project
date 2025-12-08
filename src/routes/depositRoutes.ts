import { Router } from 'express';
import {
  registerDeposit,
  getAllDeposits,
  getDepositById,
  getUserDeposits,
  getHubDeposits,
  updateDepositStatus,
  deleteDeposit,
  getDepositStatistics
} from '../controllers/depositController';

const router = Router();

/**
 * Module 1 - Member 2: Waste Deposit Registration
 * Routes for users to register waste deposits at hubs
 */

// POST - Register a new waste deposit
router.post('/deposits', registerDeposit);

// GET - Get all deposits with optional filters
router.get('/deposits', getAllDeposits);

// GET - Get deposit statistics
router.get('/deposits/statistics/summary', getDepositStatistics);

// GET - Get single deposit by ID (MUST come after /statistics/summary)
router.get('/deposits/:id', getDepositById);

// GET - Get all deposits for a specific user
router.get('/users/:userId/deposits', getUserDeposits);

// GET - Get all deposits for a specific waste hub
router.get('/waste-hubs/:hubId/deposits', getHubDeposits);

// PUT - Update deposit status (admin function)
router.put('/deposits/:id', updateDepositStatus);

// DELETE - Delete a deposit (only if pending)
router.delete('/deposits/:id', deleteDeposit);

export default router;
