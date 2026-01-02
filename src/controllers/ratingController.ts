import { Request, Response } from 'express';
import Rating from '../models/Rating';
import WasteHub from '../models/WasteHub';
import User from '../models/User';
import mongoose from 'mongoose';
import CONFIG from '../config/constants';

// Create a new rating
export const createRating = async (req: Request, res: Response) => {
  try {
    const { userId, userName, targetType, targetId, targetName, rating, review } = req.body;

    // Validate rating value
    if (rating < CONFIG.RATING.MIN_VALUE || rating > CONFIG.RATING.MAX_VALUE) {
      return res.status(400).json({ message: `Rating must be between ${CONFIG.RATING.MIN_VALUE} and ${CONFIG.RATING.MAX_VALUE}` });
    }

    // Check if user already rated this target
    const existingRating = await Rating.findOne({ userId, targetType, targetId });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this' });
    }

    const newRating = await Rating.create({
      userId,
      userName,
      targetType,
      targetId,
      targetName,
      rating,
      review
    });

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: newRating
    });
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ message: 'Error creating rating' });
  }
};

// Get ratings for a specific target (waste hub or company)
export const getRatingsByTarget = async (req: Request, res: Response) => {
  try {
    const { targetType, targetId } = req.params;
    const { limit = 20, page = 1 } = req.query;

    const ratings = await Rating.find({ targetType, targetId })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const totalRatings = await Rating.countDocuments({ targetType, targetId });

    // Calculate average rating
    const avgResult = await Rating.aggregate([
      { $match: { targetType, targetId: new mongoose.Types.ObjectId(targetId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalCount: { $sum: 1 }
        }
      }
    ]);

    const averageRating = avgResult.length > 0 ? avgResult[0].averageRating : 0;
    const ratingCount = avgResult.length > 0 ? avgResult[0].totalCount : 0;

    res.json({
      success: true,
      ratings,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      ratingCount,
      total: totalRatings,
      page: Number(page),
      pages: Math.ceil(totalRatings / Number(limit))
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings' });
  }
};

// Get ratings by a specific user
export const getRatingsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const ratings = await Rating.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: ratings.length,
      ratings
    });
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({ message: 'Error fetching user ratings' });
  }
};

// Update a rating
export const updateRating = async (req: Request, res: Response) => {
  try {
    const { ratingId } = req.params;
    const { rating, review } = req.body;

    if (rating && (rating < CONFIG.RATING.MIN_VALUE || rating > CONFIG.RATING.MAX_VALUE)) {
      return res.status(400).json({ message: `Rating must be between ${CONFIG.RATING.MIN_VALUE} and ${CONFIG.RATING.MAX_VALUE}` });
    }

    const updatedRating = await Rating.findByIdAndUpdate(
      ratingId,
      { rating, review },
      { new: true }
    );

    if (!updatedRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json({
      success: true,
      message: 'Rating updated successfully',
      data: updatedRating
    });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Error updating rating' });
  }
};

// Delete a rating
export const deleteRating = async (req: Request, res: Response) => {
  try {
    const { ratingId } = req.params;

    const deletedRating = await Rating.findByIdAndDelete(ratingId);

    if (!deletedRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ message: 'Error deleting rating' });
  }
};

// Get rating summary (distribution of 1-5 stars)
export const getRatingSummary = async (req: Request, res: Response) => {
  try {
    const { targetType, targetId } = req.params;

    const summary = await Rating.aggregate([
      { $match: { targetType, targetId: new mongoose.Types.ObjectId(targetId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Create distribution object with all ratings (1-5)
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    summary.forEach(item => {
      distribution[item._id as keyof typeof distribution] = item.count;
    });

    const totalRatings = summary.reduce((sum, item) => sum + item.count, 0);
    const avgRating = summary.reduce((sum, item) => sum + (item._id * item.count), 0) / (totalRatings || 1);

    res.json({
      success: true,
      averageRating: Math.round(avgRating * 10) / 10,
      totalRatings,
      distribution
    });
  } catch (error) {
    console.error('Error fetching rating summary:', error);
    res.status(500).json({ message: 'Error fetching rating summary' });
  }
};
