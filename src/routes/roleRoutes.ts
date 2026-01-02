import express from 'express';
import {
  getAllUsersWithRoles,
  updateUserRole,
  getUserPermissions,
  bulkUpdateRoles,
  getRoleChangeHistory,
  deleteUser,
  getRoleStatistics
} from '../controllers/roleController';

const router = express.Router();

// Role management routes
router.get('/roles/users', getAllUsersWithRoles);
router.get('/roles/statistics', getRoleStatistics);
router.get('/roles/history', getRoleChangeHistory);
router.get('/roles/users/:userId/permissions', getUserPermissions);
router.put('/roles/users/:userId', updateUserRole);
router.post('/roles/bulk-update', bulkUpdateRoles);
router.delete('/roles/users/:userId', deleteUser);

export default router;
