import { Request, Response } from 'express';
import Notification from '../models/Notification';
import ActivityLog from '../models/ActivityLog';
import mongoose from 'mongoose';

// Helper function to log activity
const logActivity = async (
  userId: string,
  userName: string,
  userRole: string,
  action: string,
  actionType: string,
  resourceType: string,
  resourceId?: string,
  details?: string
) => {
  try {
    await ActivityLog.create({
      userId: new mongoose.Types.ObjectId(userId),
      userName,
      userRole,
      action,
      actionType,
      resourceType,
      resourceId: resourceId ? new mongoose.Types.ObjectId(resourceId) : undefined,
      details,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Create notification
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { recipientId, type, title, message, relatedId, relatedType, priority, metadata } = req.body;

    if (!recipientId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID, type, title, and message are required'
      });
    }

    const notification = await Notification.create({
      recipientId: new mongoose.Types.ObjectId(recipientId),
      type,
      title,
      message,
      relatedId: relatedId ? new mongoose.Types.ObjectId(relatedId) : undefined,
      relatedType,
      priority: priority || 'medium',
      metadata,
      isRead: false,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get user notifications
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { unreadOnly, limit = 50, skip = 0 } = req.query;

    const query: any = { recipientId: new mongoose.Types.ObjectId(userId) };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string));

    const unreadCount = await Notification.countDocuments({
      recipientId: new mongoose.Types.ObjectId(userId),
      isRead: false
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
      total: await Notification.countDocuments(query)
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Mark all user notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await Notification.updateMany(
      { recipientId: new mongoose.Types.ObjectId(userId), isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete all user notifications
export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await Notification.deleteMany({
      recipientId: new mongoose.Types.ObjectId(userId)
    });

    res.json({
      success: true,
      message: 'All notifications deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all notifications',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get notification statistics
export const getNotificationStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const total = await Notification.countDocuments({
      recipientId: new mongoose.Types.ObjectId(userId)
    });

    const unread = await Notification.countDocuments({
      recipientId: new mongoose.Types.ObjectId(userId),
      isRead: false
    });

    const byType = await Notification.aggregate([
      { $match: { recipientId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        unread,
        read: total - unread,
        byType
      }
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Utility function to send notification (can be called from other controllers)
export const sendNotification = async (
  recipientId: string,
  type: string,
  title: string,
  message: string,
  relatedId?: string,
  relatedType?: string,
  priority?: string,
  metadata?: any
) => {
  try {
    await Notification.create({
      recipientId: new mongoose.Types.ObjectId(recipientId),
      type,
      title,
      message,
      relatedId: relatedId ? new mongoose.Types.ObjectId(relatedId) : undefined,
      relatedType,
      priority: priority || 'medium',
      metadata,
      isRead: false,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
