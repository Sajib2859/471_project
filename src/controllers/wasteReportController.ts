import { Request, Response } from "express";
import { Types } from "mongoose";
import WasteReport from "../models/WasteReport";
import User from "../models/User";
import Notification from "../models/Notification";

/**
 * POST /api/waste-reports
 * Create a new waste report
 */
export const createWasteReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      location,
      coordinates,
      wasteTypes,
      severity,
      estimatedQuantity,
      unit,
      photos,
      reportedBy,
    } = req.body;

    // Validation
    if (!title || !description || !location || !wasteTypes || wasteTypes.length === 0) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, location, wasteTypes",
      });
      return;
    }

    if (!reportedBy) {
      res.status(400).json({
        success: false,
        message: "Reporter user ID is required",
      });
      return;
    }

    // Create new waste report
    const newReport = new WasteReport({
      title,
      description,
      location,
      coordinates: coordinates || undefined,
      wasteTypes: Array.isArray(wasteTypes) ? wasteTypes : [wasteTypes],
      severity: severity || 'medium',
      estimatedQuantity: estimatedQuantity || undefined,
      unit: unit || 'kg',
      photos: photos || [],
      status: 'pending',
      reportedBy,
      notes: [],
      upvotes: [],
    });

    await newReport.save();

    res.status(201).json({
      success: true,
      message: "Waste report created successfully",
      data: newReport,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating waste report",
      error: error.message,
    });
  }
};

/**
 * GET /api/waste-reports
 * Get all waste reports with optional filters
 */
export const getAllWasteReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, severity, location, wasteType } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (location) filter.location = new RegExp(location as string, "i");
    if (wasteType) filter.wasteTypes = { $in: [wasteType] };

    const reports = await WasteReport.find(filter)
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name email")
      .populate("verifiedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching waste reports",
      error: error.message,
    });
  }
};

/**
 * GET /api/waste-reports/:id
 * Get single waste report by ID
 */
export const getWasteReportById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid waste report ID",
      });
      return;
    }

    const report = await WasteReport.findById(id)
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name email")
      .populate("verifiedBy", "name email")
      .populate("upvotes", "name email");

    if (!report) {
      res.status(404).json({
        success: false,
        message: "Waste report not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching waste report",
      error: error.message,
    });
  }
};

/**
 * PUT /api/waste-reports/:id
 * Update waste report
 */
export const updateWasteReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid waste report ID",
      });
      return;
    }

    const report = await WasteReport.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!report) {
      res.status(404).json({
        success: false,
        message: "Waste report not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Waste report updated successfully",
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating waste report",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/waste-reports/:id
 * Delete waste report
 */
export const deleteWasteReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid waste report ID",
      });
      return;
    }

    const report = await WasteReport.findByIdAndDelete(id);

    if (!report) {
      res.status(404).json({
        success: false,
        message: "Waste report not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Waste report deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting waste report",
      error: error.message,
    });
  }
};

/**
 * POST /api/waste-reports/:id/verify
 * Verify a waste report (Admin only)
 */
export const verifyWasteReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { verifiedBy, note } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid waste report ID",
      });
      return;
    }

    if (!verifiedBy) {
      res.status(400).json({
        success: false,
        message: "Verifier user ID is required",
      });
      return;
    }

    const report = await WasteReport.findById(id);

    if (!report) {
      res.status(404).json({
        success: false,
        message: "Waste report not found",
      });
      return;
    }

    report.status = 'verified';
    report.verifiedBy = new Types.ObjectId(verifiedBy);
    report.verifiedAt = new Date();
    if (note) {
      report.notes.push(note);
    }

    await report.save();

    // Notify reporter
    try {
      await Notification.create({
        userId: report.reportedBy,
        type: "waste-report",
        title: "Waste Report Verified",
        message: `Your waste report "${report.title}" has been verified by admin`,
        relatedId: report._id,
        read: false,
      });
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
    }

    res.status(200).json({
      success: true,
      message: "Waste report verified successfully",
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error verifying waste report",
      error: error.message,
    });
  }
};

/**
 * POST /api/waste-reports/:id/assign
 * Assign waste report to cleanup team (Admin only)
 */
export const assignWasteReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { assignedTo, note } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid waste report ID",
      });
      return;
    }

    if (!assignedTo) {
      res.status(400).json({
        success: false,
        message: "Assigned user ID is required",
      });
      return;
    }

    const report = await WasteReport.findById(id);

    if (!report) {
      res.status(404).json({
        success: false,
        message: "Waste report not found",
      });
      return;
    }

    report.assignedTo = new Types.ObjectId(assignedTo);
    report.status = 'in-progress';
    if (note) {
      report.notes.push(note);
    }

    await report.save();

    // Notify assigned team
    try {
      await Notification.create({
        userId: assignedTo,
        type: "waste-report",
        title: "Waste Report Assigned",
        message: `You have been assigned to handle "${report.title}"`,
        relatedId: report._id,
        read: false,
      });
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
    }

    res.status(200).json({
      success: true,
      message: "Waste report assigned successfully",
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error assigning waste report",
      error: error.message,
    });
  }
};

/**
 * POST /api/waste-reports/:id/resolve
 * Mark waste report as resolved (Admin only)
 */
export const resolveWasteReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid waste report ID",
      });
      return;
    }

    const report = await WasteReport.findById(id);

    if (!report) {
      res.status(404).json({
        success: false,
        message: "Waste report not found",
      });
      return;
    }

    report.status = 'resolved';
    report.resolvedAt = new Date();
    if (note) {
      report.notes.push(note);
    }

    await report.save();

    // Notify reporter
    try {
      await Notification.create({
        userId: report.reportedBy,
        type: "waste-report",
        title: "Waste Report Resolved",
        message: `Your waste report "${report.title}" has been resolved`,
        relatedId: report._id,
        read: false,
      });
    } catch (notifError) {
      console.error("Error creating notification:", notifError);
    }

    res.status(200).json({
      success: true,
      message: "Waste report resolved successfully",
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error resolving waste report",
      error: error.message,
    });
  }
};

/**
 * POST /api/waste-reports/:id/upvote
 * Upvote a waste report
 */
export const upvoteWasteReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid waste report ID",
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

    const report = await WasteReport.findById(id);

    if (!report) {
      res.status(404).json({
        success: false,
        message: "Waste report not found",
      });
      return;
    }

    const userObjectId = new Types.ObjectId(userId);
    if (report.upvotes.some(u => u.equals(userObjectId))) {
      res.status(400).json({
        success: false,
        message: "You have already upvoted this report",
      });
      return;
    }

    report.upvotes.push(userObjectId);
    await report.save();

    res.status(200).json({
      success: true,
      message: "Waste report upvoted successfully",
      data: report,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error upvoting waste report",
      error: error.message,
    });
  }
};

/**
 * GET /api/users/:userId/waste-reports
 * Get user's waste reports
 */
export const getUserWasteReports = async (
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

    const reports = await WasteReport.find({ reportedBy: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching user waste reports",
      error: error.message,
    });
  }
};

/**
 * GET /api/waste-reports/stats
 * Get waste report statistics
 */
export const getWasteReportStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalReports = await WasteReport.countDocuments();
    const pendingReports = await WasteReport.countDocuments({ status: 'pending' });
    const verifiedReports = await WasteReport.countDocuments({ status: 'verified' });
    const inProgressReports = await WasteReport.countDocuments({ status: 'in-progress' });
    const resolvedReports = await WasteReport.countDocuments({ status: 'resolved' });

    const reportsBySeverity = await WasteReport.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalReports,
        byStatus: {
          pending: pendingReports,
          verified: verifiedReports,
          inProgress: inProgressReports,
          resolved: resolvedReports,
        },
        bySeverity: reportsBySeverity,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching waste report statistics",
      error: error.message,
    });
  }
};
