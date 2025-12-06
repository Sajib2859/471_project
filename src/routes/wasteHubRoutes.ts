import { Router } from 'express';
import {
  getAllWasteHubs,
  getWasteHubById,
  getNearbyWasteHubs,
  filterHubsByWasteType,
  getHubsByStatus,
  getAcceptedMaterials
} from '../controllers/wasteHubController';

const router = Router();

/**
 * Module 1 - Member 1: Waste Hubs & Deposit Management
 * Routes for finding and filtering waste disposal hubs
 */

// Get all waste hubs with optional filters (wasteType, city, status)
router.get('/waste-hubs', getAllWasteHubs);

// Find nearby waste hubs (requires latitude, longitude) - MUST come before /:id
router.get('/waste-hubs/nearby', getNearbyWasteHubs);

// Filter hubs by specific waste type - MUST come before /:id
router.get('/waste-hubs/filter', filterHubsByWasteType);

// Get hubs by status (open/closed/maintenance) - MUST come before /:id
router.get('/waste-hubs/status', getHubsByStatus);

// Get single waste hub by ID
router.get('/waste-hubs/:id', getWasteHubById);

// Get accepted materials and pricing for a hub
router.get('/waste-hubs/:id/materials', getAcceptedMaterials);

export default router;
