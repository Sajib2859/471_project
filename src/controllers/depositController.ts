import { Request, Response } from 'express';
import Deposit from '../models/Deposit';
import WasteHub from '../models/WasteHub';
import User from '../models/User';

/**
 * Module 1 - Member 2: Waste Deposit Registration
 * Users can register deposits of recyclable or non-recyclable waste at selected hubs
 */

// POST /api/deposits - Register a new waste deposit
export const registerDeposit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, hubId, wasteType, quantity, unit, isRecyclable, description } = req.body;

    // Validate required fields
    if (!userId || !hubId || !wasteType || !quantity) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, hubId, wasteType, quantity'
      });
      return;
    }

    // Validate quantity
    if (quantity <= 0) {
      res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
      return;
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Verify waste hub exists
    const hub = await WasteHub.findById(hubId);
    if (!hub) {
      res.status(404).json({
        success: false,
        message: 'Waste hub not found'
      });
      return;
    }

    // Verify hub accepts this waste type
    if (!hub.wasteTypes.includes(wasteType)) {
      res.status(400).json({
        success: false,
        message: `This hub does not accept ${wasteType} waste`
      });
      return;
    }

    // Calculate credits earned (based on quantity and recyclability)
    // Formula: Base credit = quantity * 10
    // Recyclable: 100%, Non-recyclable: 50%
    const baseCredit = quantity * 10;
    const creditsEarned = isRecyclable ? baseCredit : baseCredit * 0.5;

    // Create new deposit
    const newDeposit = new Deposit({
      userId,
      hubId,
      wasteType,
      quantity,
      unit: unit || 'kg',
      isRecyclable,
      description: description || '',
      creditsEarned: Math.round(creditsEarned),
      status: 'pending',
      depositDate: new Date()
    });

    // Save deposit to database
    await newDeposit.save();

    res.status(201).json({
      success: true,
      message: 'Deposit registered successfully',
      data: newDeposit,
      creditsEarned: Math.round(creditsEarned)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error registering deposit',
      error: error.message
    });
  }
};

// GET /api/deposits - Get all deposits with optional filters
export const getAllDeposits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, hubId, status, wasteType } = req.query;

    const filter: any = {};

    if (userId) {
      filter.userId = userId;
    }

    if (hubId) {
      filter.hubId = hubId;
    }

    if (status) {
      filter.status = status;
    }

    if (wasteType) {
      filter.wasteType = wasteType;
    }

    const deposits = await Deposit.find(filter)
      .populate('userId', 'name email')
      .populate('hubId', 'name location')
      .sort({ depositDate: -1 });

    res.status(200).json({
      success: true,
      count: deposits.length,
      data: deposits
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching deposits',
      error: error.message
    });
  }
};

// GET /api/deposits/:id - Get single deposit by ID
export const getDepositById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deposit = await Deposit.findById(id)
      .populate('userId', 'name email')
      .populate('hubId', 'name location');

    if (!deposit) {
      res.status(404).json({
        success: false,
        message: 'Deposit not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: deposit
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching deposit',
      error: error.message
    });
  }
};

// GET /api/users/:userId/deposits - Get all deposits for a specific user
export const getUserDeposits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const deposits = await Deposit.find({ userId })
      .populate('hubId', 'name location city contactNumber')
      .sort({ depositDate: -1 });

    // Calculate total credits earned
    const totalCredits = deposits.reduce((sum, deposit) => sum + deposit.creditsEarned, 0);

    res.status(200).json({
      success: true,
      count: deposits.length,
      totalCredits,
      data: deposits
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user deposits',
      error: error.message
    });
  }
};

// GET /api/waste-hubs/:hubId/deposits - Get all deposits for a specific hub
export const getHubDeposits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hubId } = req.params;

    // Verify hub exists
    const hub = await WasteHub.findById(hubId);
    if (!hub) {
      res.status(404).json({
        success: false,
        message: 'Waste hub not found'
      });
      return;
    }

    const deposits = await Deposit.find({ hubId })
      .populate('userId', 'name email')
      .sort({ depositDate: -1 });

    // Calculate statistics
    const totalDeposits = deposits.length;
    const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
    const acceptedDeposits = deposits.filter(d => d.status === 'accepted').length;
    const totalQuantity = deposits.reduce((sum, deposit) => sum + deposit.quantity, 0);

    res.status(200).json({
      success: true,
      count: totalDeposits,
      stats: {
        total: totalDeposits,
        pending: pendingDeposits,
        accepted: acceptedDeposits,
        totalQuantity
      },
      data: deposits
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hub deposits',
      error: error.message
    });
  }
};

// PUT /api/deposits/:id - Update deposit status (admin function)
export const updateDepositStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, accepted, or rejected'
      });
      return;
    }

    const deposit = await Deposit.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!deposit) {
      res.status(404).json({
        success: false,
        message: 'Deposit not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Deposit status updated successfully',
      data: deposit
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating deposit status',
      error: error.message
    });
  }
};

// DELETE /api/deposits/:id - Delete a deposit (only if pending)
export const deleteDeposit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deposit = await Deposit.findById(id);

    if (!deposit) {
      res.status(404).json({
        success: false,
        message: 'Deposit not found'
      });
      return;
    }

    if (deposit.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: 'Can only delete deposits with pending status'
      });
      return;
    }

    await Deposit.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Deposit deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting deposit',
      error: error.message
    });
  }
};

// GET /api/deposits/statistics/summary - Get deposit statistics
export const getDepositStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalDeposits = await Deposit.countDocuments();
    const pendingDeposits = await Deposit.countDocuments({ status: 'pending' });
    const acceptedDeposits = await Deposit.countDocuments({ status: 'accepted' });
    const rejectedDeposits = await Deposit.countDocuments({ status: 'rejected' });

    const recyclableDeposits = await Deposit.countDocuments({ isRecyclable: true });
    const nonRecyclableDeposits = await Deposit.countDocuments({ isRecyclable: false });

    const totalQuantity = await Deposit.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    const totalCredits = await Deposit.aggregate([
      {
        $group: {
          _id: null,
          totalCredits: { $sum: '$creditsEarned' }
        }
      }
    ]);

    const byWasteType = await Deposit.aggregate([
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDeposits,
        byStatus: {
          pending: pendingDeposits,
          accepted: acceptedDeposits,
          rejected: rejectedDeposits
        },
        byRecyclability: {
          recyclable: recyclableDeposits,
          nonRecyclable: nonRecyclableDeposits
        },
        totalQuantity: totalQuantity[0]?.totalQuantity || 0,
        totalCredits: totalCredits[0]?.totalCredits || 0,
        byWasteType
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching deposit statistics',
      error: error.message
    });
  }
};
