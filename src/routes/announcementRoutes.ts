import express from 'express';
import {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus
} from '../controllers/announcementController';

const router = express.Router();

// Get active announcements (for all users)
router.get('/announcements/active', getActiveAnnouncements);

// Get all announcements (admin only)
router.get('/announcements', getAllAnnouncements);

// Create announcement (admin only)
router.post('/announcements', createAnnouncement);

// Update announcement (admin only)
router.put('/announcements/:announcementId', updateAnnouncement);

// Delete announcement (admin only)
router.delete('/announcements/:announcementId', deleteAnnouncement);

// Toggle announcement status (admin only)
router.patch('/announcements/:announcementId/toggle', toggleAnnouncementStatus);

export default router;
