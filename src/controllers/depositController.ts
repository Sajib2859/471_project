import { Request, Response } from "express";
import mongoose from "mongoose";
import Deposit from "../models/Deposit";
import User from "../models/User";
import CreditTransaction from "../models/CreditTransaction";
import WasteHub from "../models/WasteHub";
import { sendNotification } from "./notificationController";

/**
 * Module 1 - Member 3: Waste Hubs & Deposit Management
 * Admins verify registered deposits, reject with reasons, and allocate credits to users
 */



// Credit calculation constants (credits per kg by waste type)
const CREDIT_RATES: Record<string, number> = {
  plastic: 2.5,
  glass: 3.0,
  paper: 1.5,
  metal: 4.0,
  organic: 0.5,
  electronic: 8.0,
  textile: 2.0,
  hazardous: 5.0,
};

// Calculate credits based on waste type and amount
const calculateCredits = (wasteType: string, amount: number): number => {
  const rate = CREDIT_RATES[wasteType] || 1;
  return Math.round(rate * amount * 100) / 100; // Round to 2 decimals
};

// POST /api/deposits - User registers a new deposit
export const registerDeposit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, wasteHubId, wasteType, amount, description, photoUrl } =
      req.body;

    // Validate input
    if (!userId || !wasteHubId || !wasteType || !amount) {
      res.status(400).json({
        success: false,
        message: "userId, wasteHubId, wasteType, and amount are required",
      });
      return;
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Verify waste hub exists
    const hub = await WasteHub.findById(wasteHubId);
    if (!hub) {
      res.status(404).json({
        success: false,
        message: "Waste hub not found",
      });
      return;
    }

    // Calculate estimated credits
    const estimatedCredits = calculateCredits(wasteType, amount);

    // Create deposit record
    const deposit = new Deposit({
      userId,
      wasteHubId,
      wasteType,
      amount,
      description,
      photoUrl,
      status: "pending",
      estimatedCredits,
    });

    await deposit.save();

    res.status(201).json({
      success: true,
      message: "Deposit registered successfully. Awaiting admin verification.",
      data: {
        depositId: deposit._id,
        status: deposit.status,
        estimatedCredits: deposit.estimatedCredits,
        amount: deposit.amount,
        wasteType: deposit.wasteType,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error registering deposit",
      error: error.message,
    });
  }
};

// GET /api/deposits/pending - Admin view all pending deposits for verification
export const getPendingDeposits = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { adminId } = req.query;
    const { limit = "20", page = "1" } = req.query;

    // Verify admin role
    if (adminId) {
      const admin = await User.findById(adminId);
      if (!admin || admin.role !== "admin") {
        res.status(403).json({
          success: false,
          message: "Only admins can view pending deposits",
        });
        return;
      }
    }

    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;

    const deposits = await Deposit.find({ status: "pending" })
      .populate("userId", "name email")
      .populate("wasteHubId", "name location")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Deposit.countDocuments({ status: "pending" });

    res.status(200).json({
      success: true,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      data: deposits,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending deposits",
      error: error.message,
    });
  }
};

// GET /api/deposits/:depositId - Get single deposit details
export const getDepositDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { depositId } = req.params;

    const deposit = await Deposit.findById(depositId)
      .populate("userId", "name email creditBalance")
      .populate("wasteHubId", "name location acceptedMaterials");

    if (!deposit) {
      res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: deposit,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching deposit details",
      error: error.message,
    });
  }
};

// POST /api/deposits/:depositId/verify - Admin verifies a deposit and allocates credits
export const verifyDeposit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { depositId } = req.params;
    const { adminId, creditsToAllocate } = req.body;

    // Validate admin
    if (!adminId) {
      res.status(400).json({
        success: false,
        message: "adminId is required",
      });
      return;
    }

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admins can verify deposits",
      });
      return;
    }

    // Find deposit
    const deposit = await Deposit.findById(depositId);
    if (!deposit) {
      res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
      return;
    }

    if (deposit.status !== "pending") {
      res.status(400).json({
        success: false,
        message: `Deposit cannot be verified. Current status: ${deposit.status}`,
      });
      return;
    }

    // Use provided credits or estimated credits
    const finalCredits = creditsToAllocate || deposit.estimatedCredits;

    // Update user credit balance
    const user = await User.findById(deposit.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const previousBalance = user.creditBalance;
    user.creditBalance += finalCredits;
    await user.save();

    // Update deposit verification details
    deposit.status = "verified";
    deposit.verificationDetails = {
      verifiedBy: new mongoose.Types.ObjectId(adminId),
      verifiedAt: new Date(),
      creditAllocated: finalCredits,
    };
    await deposit.save();

    // Record credit transaction
    const transaction = new CreditTransaction({
      userId: deposit.userId,
      type: "earned",
      amount: finalCredits,
      description: `Credits for waste deposit (${deposit.wasteType}) at waste hub`,
      referenceId: depositId,
      referenceType: "deposit",
      balanceAfter: user.creditBalance,
    });
    await transaction.save();

    // Send notification to user
    await sendNotification(
      deposit.userId.toString(),
      'deposit_validation',
      'Deposit Verified! 🎉',
      `Your ${deposit.wasteType} deposit has been verified and you earned ${finalCredits} credits!`,
      depositId,
      'deposit',
      'high',
      { creditsAllocated: finalCredits, wasteType: deposit.wasteType }
    );

    res.status(200).json({
      success: true,
      message: "Deposit verified and credits allocated successfully",
      data: {
        depositId: deposit._id,
        status: deposit.status,
        creditsAllocated: finalCredits,
        previousBalance,
        newBalance: user.creditBalance,
        userName: user.name,
        verifiedAt: deposit.verificationDetails?.verifiedAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error verifying deposit",
      error: error.message,
    });
  }
};

// POST /api/deposits/:depositId/reject - Admin rejects a deposit with reason
export const rejectDeposit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { depositId } = req.params;
    const { adminId, reason } = req.body;

    // Validate input
    if (!adminId || !reason) {
      res.status(400).json({
        success: false,
        message: "adminId and reason are required",
      });
      return;
    }

    // Verify admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Only admins can reject deposits",
      });
      return;
    }

    // Find and update deposit
    const deposit = await Deposit.findById(depositId);
    if (!deposit) {
      res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
      return;
    }

    if (deposit.status !== "pending") {
      res.status(400).json({
        success: false,
        message: `Deposit cannot be rejected. Current status: ${deposit.status}`,
      });
      return;
    }

    deposit.status = "rejected";
    deposit.rejectionDetails = {
      rejectedBy: new mongoose.Types.ObjectId(adminId),
      rejectedAt: new Date(),
      reason,
    };
    await deposit.save();

    // Send notification to user about rejection
    await sendNotification(
      deposit.userId.toString(),
      'deposit_validation',
      'Deposit Rejected',
      `Your ${deposit.wasteType} deposit was rejected. Reason: ${reason}`,
      depositId,
      'deposit',
      'medium',
      { reason, wasteType: deposit.wasteType }
    );

    res.status(200).json({
      success: true,
      message: "Deposit rejected successfully",
      data: {
        depositId: deposit._id,
        status: deposit.status,
        rejectionReason: reason,
        rejectedAt: deposit.rejectionDetails?.rejectedAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error rejecting deposit",
      error: error.message,
    });
  }
};

// GET /api/users/:userId/deposits - User view their deposit history
export const getUserDeposits = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status, limit = "20", page = "1" } = req.query;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }

    const deposits = await Deposit.find(filter)
      .populate("wasteHubId", "name location")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Deposit.countDocuments(filter);

    // Calculate summary
    const summary = await Deposit.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalCredits: { $sum: "$estimatedCredits" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      summary,
      data: deposits,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching user deposits",
      error: error.message,
    });
  }
};

// GET /api/deposits/admin/summary - Admin dashboard summary of all deposits
export const getDepositsSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { adminId } = req.query;

    // Verify admin
    if (adminId) {
      const admin = await User.findById(adminId);
      if (!admin || admin.role !== "admin") {
        res.status(403).json({
          success: false,
          message: "Only admins can view deposit summary",
        });
        return;
      }
    }

    // Get count statistics
    const pendingCount = await Deposit.countDocuments({ status: "pending" });
    const verifiedCount = await Deposit.countDocuments({ status: "verified" });
    const rejectedCount = await Deposit.countDocuments({ status: "rejected" });

    // Get detailed stats
    const detailedStats = await Deposit.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalCreditsAllocated: {
            $sum: "$verificationDetails.creditAllocated",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      summary: {
        pending: pendingCount,
        verified: verifiedCount,
        rejected: rejectedCount,
        total: pendingCount + verifiedCount + rejectedCount,
      },
      stats: detailedStats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching deposits summary",
      error: error.message,
    });
  }
};
