import { Request, Response } from "express";
import { Types } from "mongoose";
import Auction from "../models/Auction";
import Bid from "../models/Bid";
import User from "../models/User";
import Notification from "../models/Notification";

/**
 * POST /api/auctions
 * Create a new auction
 */
export const createAuction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      auctionName,
      wasteType,
      startDate,
      endDate,
      startingPrice,
      description,
      quantity,
      unit,
      location,
      minimumCreditRequired,
      minimumCashRequired,
      createdBy,
    } = req.body;

    // Validation
    if (
      !auctionName ||
      !wasteType ||
      !startDate ||
      !endDate ||
      !startingPrice
    ) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: auctionName, wasteType, startDate, endDate, startingPrice",
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

    if (startingPrice <= 0) {
      res.status(400).json({
        success: false,
        message: "Starting price must be greater than 0",
      });
      return;
    }

    // Use provided createdBy or generate a mock admin ID
    const adminUserId = createdBy || new Types.ObjectId().toString();

    // Create new auction
    const newAuction = new Auction({
      title: auctionName,
      description: description || `${wasteType} waste auction`,
      materialType: wasteType,
      quantity: quantity || 100,
      unit: unit || "kg",
      startingBid: startingPrice,
      currentBid: startingPrice,
      minimumCreditRequired: minimumCreditRequired || 0,
      minimumCashRequired: minimumCashRequired || 0,
      startTime: start,
      endTime: end,
      status: "scheduled",
      location: location || "TBD",
      createdBy: adminUserId,
      createdAt: new Date(),
    });

    await newAuction.save();

    res.status(201).json({
      success: true,
      message: "Auction created successfully",
      data: newAuction,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating auction",
      error: error.message,
    });
  }
};

/**
 * GET /api/auctions
 * Get all available auctions with optional filters
 */
export const getAllAuctions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, materialType, minPrice, maxPrice } = req.query;

    let filter: any = {};

    if (status) filter.status = status;
    if (materialType) filter.materialType = materialType;
    if (minPrice || maxPrice) {
      filter.currentBid = {};
      if (minPrice) filter.currentBid.$gte = Number(minPrice);
      if (maxPrice) filter.currentBid.$lte = Number(maxPrice);
    }

    const auctions = await Auction.find(filter)
      .populate("createdBy", "name email role")
      .populate("winnerId", "name email")
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: auctions.length,
      data: auctions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching auctions",
      error: error.message,
    });
  }
};

/**
 * GET /api/auctions/:id
 * Get single auction by ID with all bids
 */
export const getAuctionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const auction = await Auction.findById(id)
      .populate("createdBy", "name email role")
      .populate("winnerId", "name email");

    if (!auction) {
      res.status(404).json({
        success: false,
        message: "Auction not found",
      });
      return;
    }

    const bids = await Bid.find({ auctionId: id })
      .populate("bidderId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        auction,
        bids,
        totalBids: bids.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching auction",
      error: error.message,
    });
  }
};

/**
 * POST /api/auctions/:id/check-eligibility
 * Check if user/company meets eligibility requirements for auction
 */
export const checkEligibility = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "userId is required",
      });
      return;
    }

    const auction = await Auction.findById(id);
    if (!auction) {
      res.status(404).json({
        success: false,
        message: "Auction not found",
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const isEligible =
      user.creditBalance >= auction.minimumCreditRequired &&
      user.cashBalance >= auction.minimumCashRequired;

    const reasons: string[] = [];
    if (user.creditBalance < auction.minimumCreditRequired) {
      reasons.push(
        `Insufficient credits. Required: ${auction.minimumCreditRequired}, Current: ${user.creditBalance}`
      );
    }
    if (user.cashBalance < auction.minimumCashRequired) {
      reasons.push(
        `Insufficient cash. Required: ${auction.minimumCashRequired}, Current: ${user.cashBalance}`
      );
    }

    res.status(200).json({
      success: true,
      data: {
        eligible: isEligible,
        user: {
          id: user._id,
          name: user.name,
          creditBalance: user.creditBalance,
          cashBalance: user.cashBalance,
        },
        requirements: {
          minimumCredit: auction.minimumCreditRequired,
          minimumCash: auction.minimumCashRequired,
        },
        reasons: isEligible ? [] : reasons,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error checking eligibility",
      error: error.message,
    });
  }
};

/**
 * POST /api/auctions/:id/bid
 * Place a bid on an auction
 */
export const placeBid = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { bidderId, bidAmount, bidType } = req.body;

    // Validation
    if (!bidderId || !bidAmount || !bidType) {
      res.status(400).json({
        success: false,
        message: "bidderId, bidAmount, and bidType are required",
      });
      return;
    }

    if (!["credit", "cash"].includes(bidType)) {
      res.status(400).json({
        success: false,
        message: 'bidType must be either "credit" or "cash"',
      });
      return;
    }

    const auction = await Auction.findById(id);
    if (!auction) {
      res.status(404).json({
        success: false,
        message: "Auction not found",
      });
      return;
    }

    // Check auction status
    if (auction.status !== "live") {
      res.status(400).json({
        success: false,
        message: `Auction is not live. Current status: ${auction.status}`,
      });
      return;
    }

    const user = await User.findById(bidderId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check eligibility
    if (
      user.creditBalance < auction.minimumCreditRequired ||
      user.cashBalance < auction.minimumCashRequired
    ) {
      res.status(403).json({
        success: false,
        message: "User does not meet minimum eligibility requirements",
      });
      return;
    }

    // Check bid amount
    if (bidAmount <= auction.currentBid) {
      res.status(400).json({
        success: false,
        message: `Bid amount must be higher than current bid of ${auction.currentBid}`,
      });
      return;
    }

    // Check user balance
    if (bidType === "credit" && user.creditBalance < bidAmount) {
      res.status(400).json({
        success: false,
        message: "Insufficient credit balance",
      });
      return;
    }

    if (bidType === "cash" && user.cashBalance < bidAmount) {
      res.status(400).json({
        success: false,
        message: "Insufficient cash balance",
      });
      return;
    }

    // Mark previous bids as outbid
    await Bid.updateMany(
      { auctionId: id, status: "active" },
      { status: "outbid" }
    );

    // Create new bid
    const newBid = new Bid({
      auctionId: id,
      bidderId,
      bidAmount,
      bidType,
      status: "active",
    });

    await newBid.save();

    // Update auction current bid
    auction.currentBid = bidAmount;
    await auction.save();

    // Populate bid details
    const populatedBid = await Bid.findById(newBid._id)
      .populate("bidderId", "name email role")
      .populate("auctionId", "title materialType");

    res.status(201).json({
      success: true,
      message: "Bid placed successfully",
      data: populatedBid,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error placing bid",
      error: error.message,
    });
  }
};

/**
 * GET /api/users/:userId/bids
 * Get all bids for a specific user
 */
export const getUserBids = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    let filter: any = { bidderId: userId };
    if (status) filter.status = status;

    const bids = await Bid.find(filter)
      .populate(
        "auctionId",
        "title materialType quantity currentBid status endTime"
      )
      .populate("bidderId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching user bids",
      error: error.message,
    });
  }
};

/**
 * GET /api/auctions/:id/bids
 * Get all bids for a specific auction
 */
export const getAuctionBids = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const auction = await Auction.findById(id);
    if (!auction) {
      res.status(404).json({
        success: false,
        message: "Auction not found",
      });
      return;
    }

    const bids = await Bid.find({ auctionId: id })
      .populate("bidderId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      auction: {
        id: auction._id,
        title: auction.title,
        currentBid: auction.currentBid,
        status: auction.status,
      },
      count: bids.length,
      data: bids,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching auction bids",
      error: error.message,
    });
  }
};

/**
 * PUT /api/auctions/:id
 * Update an auction
 */
export const updateAuction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      auctionName,
      wasteType,
      startDate,
      endDate,
      startingPrice,
      description,
      quantity,
      unit,
      location,
    } = req.body;

    const update: any = {};
    if (auctionName) update.title = auctionName;
    if (wasteType) update.materialType = wasteType;
    if (description) update.description = description;
    if (quantity !== undefined) update.quantity = quantity;
    if (unit) update.unit = unit;
    if (location) update.location = location;
    if (startingPrice !== undefined) {
      update.startingBid = startingPrice;
      // if currentBid is lower than new starting, bump it
      update.currentBid = startingPrice;
    }
    if (startDate) update.startTime = new Date(startDate);
    if (endDate) update.endTime = new Date(endDate);

    const updated = await Auction.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updated) {
      res.status(404).json({ success: false, message: "Auction not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Auction updated", data: updated });
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating auction",
        error: error.message,
      });
  }
};

/**
 * DELETE /api/auctions/:id
 * Delete an auction and associated bids
 */
export const deleteAuction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const auction = await Auction.findByIdAndDelete(id);
    if (!auction) {
      res.status(404).json({ success: false, message: "Auction not found" });
      return;
    }

    // delete related bids
    await Bid.deleteMany({ auctionId: id });

    res.status(200).json({ success: true, message: "Auction deleted" });
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting auction",
        error: error.message,
      });
  }
};
