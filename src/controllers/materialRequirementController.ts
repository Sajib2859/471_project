import { Request, Response } from 'express';
import MaterialRequirement from '../models/MaterialRequirement';
import User from '../models/User';
import Auction from '../models/Auction';
import Notification from '../models/Notification';

/**
 * POST /api/material-requirements
 * Create a new material requirement (for companies)
 */
export const createMaterialRequirement = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      companyId,
      materialType,
      quantity,
      unit,
      description,
      maxPrice,
      urgency,
      preferredLocations,
      notificationPreferences
    } = req.body;
    
    // Validation
    if (!companyId || !materialType || !quantity || !unit || !description || !maxPrice) {
      res.status(400).json({
        success: false,
        message: 'companyId, materialType, quantity, unit, description, and maxPrice are required'
      });
      return;
    }
    
    // Verify user is a company
    const company = await User.findById(companyId);
    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found'
      });
      return;
    }
    
    if (company.role !== 'company') {
      res.status(403).json({
        success: false,
        message: 'Only companies can create material requirements'
      });
      return;
    }
    
    // Create material requirement
    const materialRequirement = new MaterialRequirement({
      companyId,
      materialType,
      quantity,
      unit,
      description,
      maxPrice,
      urgency: urgency || 'medium',
      preferredLocations: preferredLocations || [],
      notificationPreferences: notificationPreferences || {
        auctionMatch: true,
        inventoryMatch: true,
        priceAlert: true
      }
    });
    
    await materialRequirement.save();
    
    // Check for matching auctions
    await checkMatchingAuctions(materialRequirement._id.toString());
    
    const populatedRequirement = await MaterialRequirement.findById(materialRequirement._id)
      .populate('companyId', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Material requirement created successfully',
      data: populatedRequirement
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating material requirement',
      error: error.message
    });
  }
};

/**
 * GET /api/material-requirements
 * Get all material requirements with optional filters
 */
export const getAllMaterialRequirements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, materialType, urgency, companyId } = req.query;
    
    let filter: any = {};
    
    if (status) filter.status = status;
    if (materialType) filter.materialType = materialType;
    if (urgency) filter.urgency = urgency;
    if (companyId) filter.companyId = companyId;
    
    const requirements = await MaterialRequirement.find(filter)
      .populate('companyId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: requirements.length,
      data: requirements
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching material requirements',
      error: error.message
    });
  }
};

/**
 * GET /api/material-requirements/:id
 * Get single material requirement by ID
 */
export const getMaterialRequirementById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const requirement = await MaterialRequirement.findById(id)
      .populate('companyId', 'name email');
    
    if (!requirement) {
      res.status(404).json({
        success: false,
        message: 'Material requirement not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: requirement
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching material requirement',
      error: error.message
    });
  }
};

/**
 * PUT /api/material-requirements/:id
 * Update material requirement
 */
export const updateMaterialRequirement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const requirement = await MaterialRequirement.findById(id);
    if (!requirement) {
      res.status(404).json({
        success: false,
        message: 'Material requirement not found'
      });
      return;
    }
    
    // Update fields
    updateData.updatedAt = new Date();
    
    const updatedRequirement = await MaterialRequirement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('companyId', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Material requirement updated successfully',
      data: updatedRequirement
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating material requirement',
      error: error.message
    });
  }
};

/**
 * DELETE /api/material-requirements/:id
 * Delete (cancel) material requirement
 */
export const deleteMaterialRequirement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const requirement = await MaterialRequirement.findById(id);
    if (!requirement) {
      res.status(404).json({
        success: false,
        message: 'Material requirement not found'
      });
      return;
    }
    
    requirement.status = 'cancelled';
    requirement.updatedAt = new Date();
    await requirement.save();
    
    res.status(200).json({
      success: true,
      message: 'Material requirement cancelled successfully',
      data: requirement
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting material requirement',
      error: error.message
    });
  }
};

/**
 * GET /api/material-requirements/:id/matches
 * Find matching auctions for a material requirement
 */
export const getMatchingAuctions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const requirement = await MaterialRequirement.findById(id);
    if (!requirement) {
      res.status(404).json({
        success: false,
        message: 'Material requirement not found'
      });
      return;
    }
    
    // Find matching auctions
    const matchingAuctions = await Auction.find({
      materialType: requirement.materialType,
      status: { $in: ['scheduled', 'live'] },
      currentBid: { $lte: requirement.maxPrice }
    }).populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      requirement: {
        id: requirement._id,
        materialType: requirement.materialType,
        quantity: requirement.quantity,
        maxPrice: requirement.maxPrice
      },
      matchCount: matchingAuctions.length,
      data: matchingAuctions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error finding matching auctions',
      error: error.message
    });
  }
};

/**
 * GET /api/companies/:companyId/notifications
 * Get notifications for a company regarding material requirements
 */
export const getCompanyNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;
    const { isRead, type } = req.query;
    
    let filter: any = { recipientId: companyId };
    
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }
    
    if (type) {
      filter.type = type;
    }
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
};

/**
 * Helper function to check for matching auctions and create notifications
 */
async function checkMatchingAuctions(requirementId: string): Promise<void> {
  try {
    const requirement = await MaterialRequirement.findById(requirementId);
    if (!requirement || !requirement.notificationPreferences.auctionMatch) {
      return;
    }
    
    const matchingAuctions = await Auction.find({
      materialType: requirement.materialType,
      status: { $in: ['scheduled', 'live'] },
      currentBid: { $lte: requirement.maxPrice }
    });
    
    if (matchingAuctions.length > 0) {
      const notification = new Notification({
        recipientId: requirement.companyId,
        type: 'auction_match',
        title: 'Matching Auctions Found',
        message: `Found ${matchingAuctions.length} auction(s) matching your requirement for ${requirement.materialType}`,
        relatedId: requirement._id,
        relatedType: 'requirement'
      });
      
      await notification.save();
    }
  } catch (error) {
    console.error('Error checking matching auctions:', error);
  }
}
