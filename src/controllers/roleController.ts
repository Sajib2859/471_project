import { Request, Response } from 'express';
import User from '../models/User';
import ActivityLog from '../models/ActivityLog';
import mongoose from 'mongoose';

// Helper function to log role change activity
const logRoleChange = async (
  adminId: string,
  adminName: string,
  targetUserId: string,
  targetUserName: string,
  oldRole: string,
  newRole: string
) => {
  try {
    await ActivityLog.create({
      userId: new mongoose.Types.ObjectId(adminId),
      userName: adminName,
      userRole: 'admin',
      action: `Changed user role from ${oldRole} to ${newRole}`,
      actionType: 'update',
      resourceType: 'role',
      resourceId: new mongoose.Types.ObjectId(targetUserId),
      details: `Admin ${adminName} changed ${targetUserName}'s role from ${oldRole} to ${newRole}`,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error logging role change:', error);
  }
};

// Get all users with role information
export const getAllUsersWithRoles = async (req: Request, res: Response) => {
  try {
    const { role, search, limit = 50, skip = 0 } = req.query;

    const query: any = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('name email role creditBalance cashBalance createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string));

    const total = await User.countDocuments(query);

    // Get role distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: users,
      total,
      roleDistribution
    });
  } catch (error) {
    console.error('Error fetching users with roles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users with roles',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { newRole, adminId, adminName } = req.body;

    if (!newRole || !['user', 'company', 'admin'].includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role is required (user, company, or admin)'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldRole = user.role;

    // Update user role
    user.role = newRole;
    await user.save();

    // Log the role change
    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required for role changes' });
    }
    
    await logRoleChange(
      adminId,
      adminName || 'Admin',
      userId,
      user.name,
      oldRole,
      newRole
    );

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get user permissions based on role
export const getUserPermissions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Define permissions based on role
    const permissions: Record<string, string[]> = {
      admin: [
        'manage_users',
        'manage_roles',
        'view_analytics',
        'export_data',
        'manage_campaigns',
        'manage_auctions',
        'manage_deposits',
        'validate_deposits',
        'manage_waste_hubs',
        'view_activity_logs',
        'send_notifications'
      ],
      company: [
        'view_auctions',
        'place_bids',
        'view_materials',
        'view_own_analytics',
        'manage_requirements',
        'view_notifications'
      ],
      user: [
        'deposit_waste',
        'view_campaigns',
        'participate_campaigns',
        'view_credits',
        'redeem_credits',
        'view_waste_hubs',
        'view_notifications'
      ]
    };

    res.json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: permissions[user.role] || []
      }
    });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user permissions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Bulk role update
export const bulkUpdateRoles = async (req: Request, res: Response) => {
  try {
    const { updates, adminId, adminName } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates array is required'
      });
    }

    const results = [];

    for (const update of updates) {
      try {
        const user = await User.findById(update.userId);
        
        if (user && ['user', 'company', 'admin'].includes(update.newRole)) {
          const oldRole = user.role;
          user.role = update.newRole;
          await user.save();

          if (adminId) {
            await logRoleChange(
              adminId,
              adminName || 'Admin',
              update.userId,
              user.name,
              oldRole,
              update.newRole
            );
          }

          results.push({
            userId: update.userId,
            success: true,
            message: 'Role updated successfully'
          });
        } else {
          results.push({
            userId: update.userId,
            success: false,
            message: 'User not found or invalid role'
          });
        }
      } catch (error) {
        results.push({
          userId: update.userId,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    res.json({
      success: true,
      message: 'Bulk role update completed',
      results
    });
  } catch (error) {
    console.error('Error in bulk role update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk role update',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get role change history
export const getRoleChangeHistory = async (req: Request, res: Response) => {
  try {
    const { userId, limit = 50, skip = 0 } = req.query;

    const query: any = {
      resourceType: 'role',
      actionType: 'update'
    };

    if (userId) {
      query.resourceId = new mongoose.Types.ObjectId(userId as string);
    }

    const history = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      data: history,
      total
    });
  } catch (error) {
    console.error('Error fetching role change history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role change history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { adminId, adminName } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await User.findByIdAndDelete(userId);

    // Log the deletion
    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required for user deletion' });
    }
    
    await ActivityLog.create({
      userId: new mongoose.Types.ObjectId(adminId),
      userName: adminName || 'Admin',
      userRole: 'admin',
      action: `Deleted user: ${user.name}`,
      actionType: 'delete',
      resourceType: 'user',
      resourceId: new mongoose.Types.ObjectId(userId),
      details: `Admin ${adminName || 'Admin'} deleted user ${user.name} (${user.email})`,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get role statistics
export const getRoleStatistics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent role changes
    const recentChanges = await ActivityLog.find({
      resourceType: 'role',
      actionType: 'update'
    })
      .sort({ timestamp: -1 })
      .limit(10);

    // New users in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        roleDistribution,
        recentChanges,
        newUsersLast30Days: newUsers
      }
    });
  } catch (error) {
    console.error('Error fetching role statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
