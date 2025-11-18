import express from 'express';
import {
  createMaterialRequirement,
  getAllMaterialRequirements,
  getMaterialRequirementById,
  updateMaterialRequirement,
  deleteMaterialRequirement,
  getMatchingAuctions,
  getCompanyNotifications,
  markNotificationAsRead
} from '../controllers/materialRequirementController';

const router = express.Router();

// Material requirement routes
router.post('/material-requirements', createMaterialRequirement);
router.get('/material-requirements', getAllMaterialRequirements);
router.get('/material-requirements/:id', getMaterialRequirementById);
router.put('/material-requirements/:id', updateMaterialRequirement);
router.delete('/material-requirements/:id', deleteMaterialRequirement);
router.get('/material-requirements/:id/matches', getMatchingAuctions);

// Notification routes
router.get('/companies/:companyId/notifications', getCompanyNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);

export default router;
