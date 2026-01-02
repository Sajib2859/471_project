import { Request, Response } from 'express';
import Announcement from '../models/Announcement';

// Create a new announcement
export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, message, type, targetAudience, expiresAt, createdBy, createdByName } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      type: type || 'info',
      targetAudience: targetAudience || 'all',
      createdBy,
      createdByName,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Error creating announcement' });
  }
};

// Get active announcements
export const getActiveAnnouncements = async (req: Request, res: Response) => {
  try {
    const { userRole = 'all' } = req.query;

    const now = new Date();

    const announcements = await Announcement.find({
      isActive: true,
      $and: [
        {
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: now } }
          ]
        },
        {
          $or: [
            { targetAudience: 'all' },
            { targetAudience: userRole }
          ]
        }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      count: announcements.length,
      announcements
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Error fetching announcements' });
  }
};

// Get all announcements (admin only)
export const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    const { limit = 20, page = 1 } = req.query;

    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Announcement.countDocuments();

    res.json({
      success: true,
      announcements,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Error fetching all announcements:', error);
    res.status(500).json({ message: 'Error fetching announcements' });
  }
};

// Update announcement
export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const { announcementId } = req.params;
    const updateData = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      announcementId,
      updateData,
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ message: 'Error updating announcement' });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findByIdAndDelete(announcementId);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Error deleting announcement' });
  }
};

// Toggle announcement active status
export const toggleAnnouncementStatus = async (req: Request, res: Response) => {
  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findById(announcementId);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    announcement.isActive = !announcement.isActive;
    await announcement.save();

    res.json({
      success: true,
      message: `Announcement ${announcement.isActive ? 'activated' : 'deactivated'}`,
      data: announcement
    });
  } catch (error) {
    console.error('Error toggling announcement status:', error);
    res.status(500).json({ message: 'Error updating announcement status' });
  }
};
