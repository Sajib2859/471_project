import { Router } from "express";
import {
  createWasteReport,
  getAllWasteReports,
  getWasteReportById,
  updateWasteReport,
  deleteWasteReport,
  verifyWasteReport,
  assignWasteReport,
  resolveWasteReport,
  upvoteWasteReport,
  getUserWasteReports,
  getWasteReportStats,
} from "../controllers/wasteReportController";

const router = Router();

// Waste report CRUD routes
router.post("/waste-reports", createWasteReport);
router.get("/waste-reports", getAllWasteReports);
router.get("/waste-reports/stats", getWasteReportStats);
router.get("/waste-reports/:id", getWasteReportById);
router.put("/waste-reports/:id", updateWasteReport);
router.delete("/waste-reports/:id", deleteWasteReport);

// Waste report actions
router.post("/waste-reports/:id/verify", verifyWasteReport);
router.post("/waste-reports/:id/assign", assignWasteReport);
router.post("/waste-reports/:id/resolve", resolveWasteReport);
router.post("/waste-reports/:id/upvote", upvoteWasteReport);

// User waste reports
router.get("/users/:userId/waste-reports", getUserWasteReports);

export default router;
