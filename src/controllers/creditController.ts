import { Request, Response } from 'express';
import User from '../models/User';
import CreditTransaction from '../models/CreditTransaction';
import CreditRedemption from '../models/CreditRedemption';

/**
 * Module 2 - Member 1: Credit, Auctions, & Marketplace
 * Users can view credit balance, transaction history, and redeem credits for cash
 */

// GET /api/users/:userId/credits/balance - View current credit balance
export const getCreditBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId, 'name email creditBalance cashBalance');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        creditBalance: user.creditBalance,
        cashBalance: user.cashBalance
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching credit balance',
      error: error.message
    });
  }
};

// GET /api/users/:userId/credits/transactions - View transaction history
export const getTransactionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { type, limit = '50', page = '1' } = req.query;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Build filter
    const filter: any = { userId };
    if (type) {
      filter.type = type;
    }

    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;

    const transactions = await CreditTransaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await CreditTransaction.countDocuments(filter);

    // Calculate summary statistics
    const stats = await CreditTransaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      summary: stats,
      data: transactions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction history',
      error: error.message
    });
  }
};

// POST /api/users/:userId/credits/redeem - Redeem credits for cash
export const redeemCredits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { creditsToRedeem, paymentMethod, paymentDetails } = req.body;

    // Validation
    if (!creditsToRedeem || creditsToRedeem <= 0) {
      res.status(400).json({
        success: false,
        message: 'Valid credit amount is required'
      });
      return;
    }

    if (!paymentMethod || !['bank_transfer', 'mobile_banking', 'cash'].includes(paymentMethod)) {
      res.status(400).json({
        success: false,
        message: 'Valid payment method is required (bank_transfer, mobile_banking, cash)'
      });
      return;
    }

    // Check user balance
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    if (user.creditBalance < creditsToRedeem) {
      res.status(400).json({
        success: false,
        message: 'Insufficient credit balance',
        currentBalance: user.creditBalance,
        requested: creditsToRedeem
      });
      return;
    }

    const conversionRate = 1; // 1 credit = 1 currency unit
    const cashAmount = creditsToRedeem * conversionRate;

    // Create redemption request
    const redemption = await CreditRedemption.create({
      userId,
      creditsRedeemed: creditsToRedeem,
      cashAmount,
      conversionRate,
      paymentMethod,
      paymentDetails,
      status: 'pending'
    });

    // Deduct credits from user balance
    user.creditBalance -= creditsToRedeem;
    await user.save();

    // Create transaction record
    await CreditTransaction.create({
      userId,
      type: 'redeemed',
      amount: -creditsToRedeem,
      description: `Credit redemption request #${redemption._id}`,
      referenceId: redemption._id,
      referenceType: 'redemption',
      balanceAfter: user.creditBalance
    });

    res.status(201).json({
      success: true,
      message: 'Redemption request created successfully',
      data: {
        redemptionId: redemption._id,
        creditsRedeemed: creditsToRedeem,
        cashAmount,
        status: redemption.status,
        remainingBalance: user.creditBalance
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error processing redemption',
      error: error.message
    });
  }
};

// GET /api/users/:userId/credits/redemptions - View redemption history
export const getRedemptionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }

    const redemptions = await CreditRedemption.find(filter)
      .sort({ createdAt: -1 })
      .populate('processedBy', 'name email');

    res.status(200).json({
      success: true,
      count: redemptions.length,
      data: redemptions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching redemption history',
      error: error.message
    });
  }
};

// GET /api/users/:userId/credits/redemptions/:redemptionId - Get single redemption details
export const getRedemptionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, redemptionId } = req.params;

    const redemption = await CreditRedemption.findOne({
      _id: redemptionId,
      userId
    }).populate('processedBy', 'name email');

    if (!redemption) {
      res.status(404).json({
        success: false,
        message: 'Redemption request not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: redemption
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching redemption details',
      error: error.message
    });
  }
};

// GET /api/users/:userId/credits/summary - Get user credit statistics and analytics
export const getCreditSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Get transaction statistics grouped by type
    const transactionStats = await CreditTransaction.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get redemption statistics
    const redemptionStats = await CreditRedemption.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$status',
          totalCredits: { $sum: '$creditsRedeemed' },
          totalCash: { $sum: '$cashAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate totals
    const totalEarned = transactionStats
      .filter(stat => ['earned', 'bonus', 'refund'].includes(stat._id))
      .reduce((sum, stat) => sum + stat.total, 0);

    const totalSpent = Math.abs(transactionStats
      .filter(stat => ['redeemed', 'spent'].includes(stat._id))
      .reduce((sum, stat) => sum + stat.total, 0));

    res.status(200).json({
      success: true,
      data: {
        currentBalance: user.creditBalance,
        cashBalance: user.cashBalance,
        totalEarned,
        totalSpent,
        transactionStats,
        redemptionStats
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching credit summary',
      error: error.message
    });
  }
};

// POST /api/users/:userId/credits/add - Add credits to user account (for waste disposal, etc.)
export const addCredits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { amount, description, source } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      res.status(400).json({
        success: false,
        message: 'Valid credit amount is required'
      });
      return;
    }

    if (!source) {
      res.status(400).json({
        success: false,
        message: 'Credit source is required (e.g., waste_disposal, bonus, refund)'
      });
      return;
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Add credits to user balance
    user.creditBalance += amount;
    await user.save();

    // Create transaction record
    const transaction = await CreditTransaction.create({
      userId,
      type: 'earned',
      amount,
      description: description || `Credits earned from ${source}`,
      referenceType: source,
      balanceAfter: user.creditBalance
    });

    res.status(201).json({
      success: true,
      message: 'Credits added successfully',
      data: {
        transactionId: transaction._id,
        creditsAdded: amount,
        newBalance: user.creditBalance,
        source
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error adding credits',
      error: error.message
    });
  }
};
