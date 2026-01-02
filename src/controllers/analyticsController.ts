import { Request, Response } from 'express';
import ActivityLog from '../models/ActivityLog';
import User from '../models/User';
import Deposit from '../models/Deposit';
import Campaign from '../models/Campaign';
import Auction from '../models/Auction';
import WasteReport from '../models/WasteReport';
import mongoose from 'mongoose';

// Get platform usage analytics
export const getPlatformUsage = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter: any = {};
    
    if (startDate) {
      dateFilter.$gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate as string);
    }

    const matchStage = Object.keys(dateFilter).length > 0 
      ? { timestamp: dateFilter } 
      : {};

    // User activity by action type
    const activityByType = await ActivityLog.aggregate([
      { $match: matchStage },
      { $group: { _id: '$actionType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // User activity by role
    const activityByRole = await ActivityLog.aggregate([
      { $match: matchStage },
      { $group: { _id: '$userRole', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Daily activity trend
    const dailyActivity = await ActivityLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Total users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Active users (users who have performed actions)
    const activeUsersCount = await ActivityLog.distinct('userId', matchStage).then(ids => ids.length);

    res.json({
      success: true,
      data: {
        activityByType,
        activityByRole,
        dailyActivity,
        usersByRole,
        activeUsersCount,
        totalUsers: await User.countDocuments()
      }
    });
  } catch (error) {
    console.error('Error fetching platform usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform usage analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get waste deposited analytics
export const getWasteAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter: any = {};
    
    if (startDate) {
      dateFilter.$gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate as string);
    }

    const matchStage = Object.keys(dateFilter).length > 0 
      ? { depositDate: dateFilter } 
      : {};

    // Total waste by type
    const wasteByType = await Deposit.aggregate([
      { $match: matchStage },
      { $group: { _id: '$wasteType', totalQuantity: { $sum: '$quantity' }, count: { $sum: 1 } } },
      { $sort: { totalQuantity: -1 } }
    ]);

    // Total waste by status
    const wasteByStatus = await Deposit.aggregate([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 }, totalQuantity: { $sum: '$quantity' } } },
      { $sort: { count: -1 } }
    ]);

    // Recyclable vs non-recyclable
    const recyclableStats = await Deposit.aggregate([
      { $match: matchStage },
      { 
        $group: { 
          _id: '$isRecyclable', 
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 }
        } 
      }
    ]);

    // Daily waste deposits
    const dailyDeposits = await Deposit.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$depositDate' } }
          },
          quantity: { $sum: '$quantity' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Credits earned
    const totalCreditsEarned = await Deposit.aggregate([
      { $match: matchStage },
      { $group: { _id: null, total: { $sum: '$creditsEarned' } } }
    ]);

    // Top contributors
    const topContributors = await Deposit.aggregate([
      { $match: matchStage },
      { 
        $group: { 
          _id: '$userId', 
          totalQuantity: { $sum: '$quantity' },
          totalCredits: { $sum: '$creditsEarned' },
          depositCount: { $sum: 1 }
        } 
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          totalQuantity: 1,
          totalCredits: 1,
          depositCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        wasteByType,
        wasteByStatus,
        recyclableStats,
        dailyDeposits,
        totalCreditsEarned: totalCreditsEarned[0]?.total || 0,
        topContributors,
        totalDeposits: await Deposit.countDocuments(matchStage)
      }
    });
  } catch (error) {
    console.error('Error fetching waste analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch waste analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get campaign success analytics
export const getCampaignAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter: any = {};
    
    if (startDate) {
      dateFilter.$gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate as string);
    }

    const matchStage = Object.keys(dateFilter).length > 0 
      ? { startDate: dateFilter } 
      : {};

    // Campaign by status
    const campaignsByStatus = await Campaign.aggregate([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Total participants
    const totalParticipants = await Campaign.aggregate([
      { $match: matchStage },
      { $group: { _id: null, total: { $sum: '$participantCount' } } }
    ]);

    // Campaign by type
    const campaignsByType = await Campaign.aggregate([
      { $match: matchStage },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Most successful campaigns
    const topCampaigns = await Campaign.find(matchStage)
      .sort({ participantCount: -1 })
      .limit(10)
      .select('title description participantCount status startDate endDate');

    // Campaign participation trend
    const campaignTrend = await Campaign.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$startDate' } }
          },
          count: { $sum: 1 },
          participants: { $sum: '$participantCount' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        campaignsByStatus,
        campaignsByType,
        totalParticipants: totalParticipants[0]?.total || 0,
        topCampaigns,
        campaignTrend,
        totalCampaigns: await Campaign.countDocuments(matchStage)
      }
    });
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaign analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get user engagement analytics
export const getUserEngagement = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter: any = {};
    
    if (startDate) {
      dateFilter.$gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate as string);
    }

    const matchStage = Object.keys(dateFilter).length > 0 
      ? { timestamp: dateFilter } 
      : {};

    // Most active users
    const mostActiveUsers = await ActivityLog.aggregate([
      { $match: matchStage },
      { 
        $group: { 
          _id: '$userId', 
          userName: { $first: '$userName' },
          activityCount: { $sum: 1 },
          lastActivity: { $max: '$timestamp' }
        } 
      },
      { $sort: { activityCount: -1 } },
      { $limit: 10 }
    ]);

    // User activity by resource type
    const activityByResource = await ActivityLog.aggregate([
      { $match: matchStage },
      { $group: { _id: '$resourceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Login activity
    const loginActivity = await ActivityLog.aggregate([
      { $match: { ...matchStage, actionType: 'login' } },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // New user registrations (assuming create action on user resource)
    const newUsers = await ActivityLog.aggregate([
      { $match: { ...matchStage, resourceType: 'user', actionType: 'create' } },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        mostActiveUsers,
        activityByResource,
        loginActivity,
        newUsers
      }
    });
  } catch (error) {
    console.error('Error fetching user engagement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user engagement analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get company analytics (for Member-4)
export const getCompanyAnalytics = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const { startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate as string);
    }

    // Auctions won by company
    const auctionsWon = await Auction.aggregate([
      { 
        $match: { 
          winnerId: new mongoose.Types.ObjectId(companyId),
          status: 'closed',
          ...(Object.keys(dateFilter).length > 0 && { endTime: dateFilter })
        } 
      },
      {
        $group: {
          _id: '$materialType',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalAmount: { $sum: '$currentBid' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Materials acquired details
    const materialsAcquired = await Auction.find({
      winnerId: new mongoose.Types.ObjectId(companyId),
      status: 'closed',
      ...(Object.keys(dateFilter).length > 0 && { endTime: dateFilter })
    }).select('title materialType quantity unit currentBid endTime');

    // Transaction history
    const transactionHistory = await ActivityLog.find({
      userId: new mongoose.Types.ObjectId(companyId),
      resourceType: { $in: ['auction', 'credit'] },
      ...(Object.keys(dateFilter).length > 0 && { timestamp: dateFilter })
    })
      .sort({ timestamp: -1 })
      .limit(50);

    // Spending trend
    const spendingTrend = await Auction.aggregate([
      { 
        $match: { 
          winnerId: new mongoose.Types.ObjectId(companyId),
          status: 'closed',
          ...(Object.keys(dateFilter).length > 0 && { endTime: dateFilter })
        } 
      },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$endTime' } }
          },
          totalSpent: { $sum: '$currentBid' },
          auctionCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Total statistics
    const totalStats = await Auction.aggregate([
      { 
        $match: { 
          winnerId: new mongoose.Types.ObjectId(companyId),
          status: 'closed',
          ...(Object.keys(dateFilter).length > 0 && { endTime: dateFilter })
        } 
      },
      {
        $group: {
          _id: null,
          totalAuctions: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalSpent: { $sum: '$currentBid' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        auctionsWon,
        materialsAcquired,
        transactionHistory,
        spendingTrend,
        totalStats: totalStats[0] || { totalAuctions: 0, totalQuantity: 0, totalSpent: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching company analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all activity logs (for admin)
export const getActivityLogs = async (req: Request, res: Response) => {
  try {
    const { userId, userRole, actionType, resourceType, startDate, endDate, limit = 100, skip = 0 } = req.query;

    const query: any = {};
    
    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId as string);
    }
    if (userRole) {
      query.userRole = userRole;
    }
    if (actionType) {
      query.actionType = actionType;
    }
    if (resourceType) {
      query.resourceType = resourceType;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate as string);
      }
    }

    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      total,
      limit: parseInt(limit as string),
      skip: parseInt(skip as string)
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity logs',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Export analytics data as CSV
export const exportAnalytics = async (req: Request, res: Response) => {
  try {
    const { type, startDate, endDate } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Export type is required'
      });
    }

    let data: any[] = [];
    let filename = '';
    let csvContent = '';

    const dateFilter: any = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate as string);
    }

    switch (type) {
      case 'deposits':
        const deposits = await Deposit.find(
          Object.keys(dateFilter).length > 0 ? { depositDate: dateFilter } : {}
        ).populate('userId', 'name email').populate('hubId', 'name');
        
        csvContent = 'Date,User,Hub,Waste Type,Quantity,Unit,Recyclable,Status,Credits Earned\n';
        deposits.forEach((d: any) => {
          csvContent += `${new Date(d.depositDate).toLocaleDateString()},${d.userId?.name || 'Unknown'},${d.hubId?.name || 'Unknown'},${d.wasteType},${d.quantity},${d.unit},${d.isRecyclable ? 'Yes' : 'No'},${d.status},${d.creditsEarned}\n`;
        });
        filename = `deposits_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'campaigns':
        const campaigns = await Campaign.find(
          Object.keys(dateFilter).length > 0 ? { startDate: dateFilter } : {}
        );
        
        csvContent = 'Title,Type,Status,Participants,Start Date,End Date,Location\n';
        campaigns.forEach((c: any) => {
          csvContent += `"${c.title}",${c.type},${c.status},${c.participantCount},${new Date(c.startDate).toLocaleDateString()},${new Date(c.endDate).toLocaleDateString()},"${c.location}"\n`;
        });
        filename = `campaigns_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'auctions':
        const auctions = await Auction.find(
          Object.keys(dateFilter).length > 0 ? { startTime: dateFilter } : {}
        ).populate('winnerId', 'name');
        
        csvContent = 'Title,Material Type,Quantity,Starting Bid,Current Bid,Winner,Status,End Time\n';
        auctions.forEach((a: any) => {
          csvContent += `"${a.title}",${a.materialType},${a.quantity} ${a.unit},${a.startingBid},${a.currentBid},${a.winnerId?.name || 'N/A'},${a.status},${new Date(a.endTime).toLocaleDateString()}\n`;
        });
        filename = `auctions_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'activity-logs':
        const logs = await ActivityLog.find(
          Object.keys(dateFilter).length > 0 ? { timestamp: dateFilter } : {}
        ).limit(1000);
        
        csvContent = 'Timestamp,User,Role,Action,Action Type,Resource Type,Details\n';
        logs.forEach((l: any) => {
          csvContent += `${new Date(l.timestamp).toLocaleString()},${l.userName},${l.userRole},${l.action},${l.actionType},${l.resourceType},"${l.details || ''}"\n`;
        });
        filename = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
