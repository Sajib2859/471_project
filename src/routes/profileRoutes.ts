import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import User from '../models/User';
import CONFIG from '../config/constants';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = CONFIG.UPLOAD.PROFILE_DIR;
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: CONFIG.UPLOAD.MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = CONFIG.UPLOAD.ALLOWED_IMAGE_TYPES;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
  }
});

// Upload profile photo
router.post('/users/:userId/profile-photo', upload.single('photo'), async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photoUrl = `/${CONFIG.UPLOAD.PROFILE_DIR}/${req.file.filename}`;

    // Update user with photo URL
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: photoUrl },
      { new: true }
    );

    if (!user) {
      // Delete uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      photoUrl: photoUrl,
      user
    });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ message: 'Error uploading profile photo' });
  }
});

// Get user profile with statistics
router.get('/users/:userId/profile', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user statistics (you can expand this)
    const stats = {
      creditBalance: user.creditBalance || 0,
      cashBalance: user.cashBalance || 0,
      // Add more stats as needed from other collections
    };

    res.json({
      success: true,
      user,
      stats
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/users/:userId/profile', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, bio, phone, address } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router;
