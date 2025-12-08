import { Router } from "express";
import {
  registerDeposit,
  getPendingDeposits,
  getDepositDetails,
  verifyDeposit,
  rejectDeposit,
  getUserDeposits,
  getDepositsSummary,
} from "../controllers/depositController";

const router = Router();

/**
 * Module 1 - Member 3: Waste Hubs & Deposit Management
 * Routes for deposit verification, rejection, and credit allocation
 */

// User routes
// POST /api/deposits - Register a new waste deposit
router.post("/deposits", registerDeposit);

// GET /api/users/:userId/deposits - Get user's deposit history
router.get("/users/:userId/deposits", getUserDeposits);

// Admin routes
// GET /api/deposits/pending - Get all pending deposits for verification (admin only)
router.get("/deposits/pending", getPendingDeposits);

// GET /api/deposits/admin/summary - Get admin dashboard summary (admin only)
router.get("/deposits/admin/summary", getDepositsSummary);

// GET /api/deposits/:depositId - Get single deposit details
router.get("/deposits/:depositId", getDepositDetails);

// POST /api/deposits/:depositId/verify - Verify deposit and allocate credits (admin only)
router.post("/deposits/:depositId/verify", verifyDeposit);

// POST /api/deposits/:depositId/reject - Reject deposit with reason (admin only)
router.post("/deposits/:depositId/reject", rejectDeposit);

export default router;
