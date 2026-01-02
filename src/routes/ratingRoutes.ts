import express from 'express';
import {
  createRating,
  getRatingsByTarget,
  getRatingsByUser,
  updateRating,
  deleteRating,
  getRatingSummary
} from '../controllers/ratingController';

const router = express.Router();

// Create a new rating
router.post('/ratings', createRating);

// Get ratings for a specific target (waste hub or company)
router.get('/ratings/:targetType/:targetId', getRatingsByTarget);

// Get rating summary with distribution
router.get('/ratings/:targetType/:targetId/summary', getRatingSummary);

// Get all ratings by a user
router.get('/users/:userId/ratings', getRatingsByUser);

// Update a rating
router.put('/ratings/:ratingId', updateRating);

// Delete a rating
router.delete('/ratings/:ratingId', deleteRating);

export default router;
