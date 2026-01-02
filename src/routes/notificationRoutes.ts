import express from 'express';
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats
} from '../controllers/notificationController';

const router = express.Router();

// Notification routes
router.post('/notifications', createNotification);
router.get('/users/:userId/notifications', getUserNotifications);
router.get('/users/:userId/notifications/stats', getNotificationStats);
router.put('/notifications/:notificationId/read', markAsRead);
router.put('/users/:userId/notifications/read-all', markAllAsRead);
router.delete('/notifications/:notificationId', deleteNotification);
router.delete('/users/:userId/notifications', deleteAllNotifications);

export default router;
