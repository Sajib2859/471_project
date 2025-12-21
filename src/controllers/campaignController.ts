import { Request, Response } from "express";
import { Types } from "mongoose";
import Campaign from "../models/Campaign";
import User from "../models/User";
import Notification from "../models/Notification";

/**
 * POST /api/campaigns
 * Create a new campaign (Admin only)
 */
export const createCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      campaignType,
      location,
      coordinates,
      startDate,
      endDate,
      maxParticipants,
      goals,
      images,
      createdBy,
    } = req.body;

    // Validation
    if (!title || !description || !campaignType || !location || !startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, campaignType, location, startDate, endDate",
      });
      return;
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
      return;
    }

    // Use provided createdBy or generate a mock admin ID
    const adminUserId = createdBy || new Types.ObjectId().toString();

    // Create new campaign
    const newCampaign = new Campaign({
      title,
      description,
      campaignType,
      location,
      coordinates: coordinates || undefined,
      startDate: start,
      endDate: end,
      status: "scheduled",
      maxParticipants: maxParticipants || undefined,
      participants: [],
      followers: [],
      volunteers: [],
      organizer: adminUserId,
      progress: 0,
      goals: goals || [],
      achievements: [],
      images: images || [],
      createdBy: adminUserId,
    });

    await newCampaign.save();

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: newCampaign,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating campaign",
      error: error.message,
    });
  }
};

/**
 * GET /api/campaigns
 * Get all campaigns with optional filters
 */
export const getAllCampaigns = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, campaignType, location } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (campaignType) filter.campaignType = campaignType;
    if (location) filter.location = new RegExp(location as string, "i");

    const campaigns = await Campaign.find(filter)
      .populate("organizer", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching campaigns",
      error: error.message,
    });
  }
};

/**
 * GET /api/campaigns/:id
 * Get single campaign by ID
 */
export const getCampaignById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid campaign ID",
      });
      return;
    }

    const campaign = await Campaign.findById(id)
      .populate("organizer", "name email")
      .populate("createdBy", "name email")
      .populate("participants", "name email")
      .populate("followers", "name email")
      .populate("volunteers", "name email");

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching campaign",
      error: error.message,
    });
  }
};

/**
 * PUT /api/campaigns/:id
 * Update campaign (Admin only)
 */
export const updateCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid campaign ID",
      });
      return;
    }

    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data: campaign,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating campaign",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/campaigns/:id
 * Delete campaign (Admin only)
 */
export const deleteCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid campaign ID",
      });
      return;
    }

    const campaign = await Campaign.findByIdAndDelete(id);

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting campaign",
      error: error.message,
    });
  }
};

/**
 * POST /api/campaigns/:id/volunteer
 * Volunteer for a campaign
 */
export const volunteerForCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid campaign ID",
      });
      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
      return;
    }

    // Check if user already volunteered
    const userObjectId = new Types.ObjectId(userId);
    if (campaign.volunteers.some(v => v.equals(userObjectId))) {
      res.status(400).json({
        success: false,
        message: "You have already volunteered for this campaign",
      });
      return;
    }

    // Check max participants
    if (campaign.maxParticipants && campaign.volunteers.length >= campaign.maxParticipants) {
      res.status(400).json({
        success: false,
        message: "Campaign has reached maximum participants",
      });
      return;
    }

    campaign.volunteers.push(userObjectId);
    if (!campaign.participants.some(p => p.equals(userObjectId))) {
      campaign.participants.push(userObjectId);
    }
    await campaign.save();

    // Create notification
    try {
      await Notification.create({
        userId: userObjectId,
        type: "campaign",
        title: "Campaign Volunteer Confirmed",
        message: `You have successfully volunteered for "${campaign.title}"`,
        relatedId: campaign._id,
        read: false,
      });
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
    }

    res.status(200).json({
      success: true,
      message: "Successfully volunteered for campaign",
      data: campaign,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error volunteering for campaign",
      error: error.message,
    });
  }
};

/**
 * POST /api/campaigns/:id/follow
 * Follow a campaign
 */
export const followCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid campaign ID",
      });
      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    if (campaign.followers.some(f => f.equals(userObjectId))) {
      res.status(400).json({
        success: false,
        message: "You are already following this campaign",
      });
      return;
    }

    campaign.followers.push(userObjectId);
    await campaign.save();

    res.status(200).json({
      success: true,
      message: "Successfully following campaign",
      data: campaign,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error following campaign",
      error: error.message,
    });
  }
};

/**
 * POST /api/campaigns/:id/unfollow
 * Unfollow a campaign
 */
export const unfollowCampaign = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid campaign ID",
      });
      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    campaign.followers = campaign.followers.filter(f => !f.equals(userObjectId));
    await campaign.save();

    res.status(200).json({
      success: true,
      message: "Successfully unfollowed campaign",
      data: campaign,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error unfollowing campaign",
      error: error.message,
    });
  }
};

/**
 * PUT /api/campaigns/:id/progress
 * Update campaign progress (Admin only)
 */
export const updateCampaignProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { progress, achievement } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid campaign ID",
      });
      return;
    }

    if (progress === undefined || progress < 0 || progress > 100) {
      res.status(400).json({
        success: false,
        message: "Progress must be between 0 and 100",
      });
      return;
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
      return;
    }

    campaign.progress = progress;
    if (achievement) {
      campaign.achievements.push(achievement);
    }

    if (progress === 100 && campaign.status !== 'completed') {
      campaign.status = 'completed';
    }

    await campaign.save();

    // Notify all followers and volunteers
    const userIds = [...new Set([...campaign.followers, ...campaign.volunteers])];
    for (const userId of userIds) {
      try {
        await Notification.create({
          userId,
          type: "campaign",
          title: "Campaign Progress Update",
          message: `"${campaign.title}" is now ${progress}% complete${achievement ? ': ' + achievement : ''}`,
          relatedId: campaign._id,
          read: false,
        });
      } catch (notifError) {
        console.error("Error creating notification:", notifError);
      }
    }

    res.status(200).json({
      success: true,
      message: "Campaign progress updated successfully",
      data: campaign,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating campaign progress",
      error: error.message,
    });
  }
};

/**
 * GET /api/campaigns/:id/participants
 * Get campaign participants list
 */
export const getCampaignParticipants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid campaign ID",
      });
      return;
    }

    const campaign = await Campaign.findById(id)
      .populate("participants", "name email role")
      .populate("volunteers", "name email role")
      .populate("followers", "name email role");

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        participants: campaign.participants,
        volunteers: campaign.volunteers,
        followers: campaign.followers,
        stats: {
          totalParticipants: campaign.participants.length,
          totalVolunteers: campaign.volunteers.length,
          totalFollowers: campaign.followers.length,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching campaign participants",
      error: error.message,
    });
  }
};

/**
 * GET /api/users/:userId/campaigns
 * Get user's campaigns (volunteered/following)
 */
export const getUserCampaigns = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const userObjectId = new Types.ObjectId(userId);

    const volunteeredCampaigns = await Campaign.find({
      volunteers: userObjectId,
    }).sort({ createdAt: -1 });

    const followedCampaigns = await Campaign.find({
      followers: userObjectId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        volunteered: volunteeredCampaigns,
        following: followedCampaigns,
        stats: {
          volunteeredCount: volunteeredCampaigns.length,
          followingCount: followedCampaigns.length,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching user campaigns",
      error: error.message,
    });
  }
};
