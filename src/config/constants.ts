// Backend Configuration Constants
// Centralized configuration to avoid hardcoded values

export const CONFIG = {
  // Server Configuration
  PORT: parseInt(process.env.PORT || '9371', 10),
  
  // File Upload Configuration
  UPLOAD: {
    BASE_DIR: 'uploads',
    PROFILE_DIR: 'uploads/profiles',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
    ALLOWED_IMAGE_TYPES: /jpeg|jpg|png|gif/,
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  },
  
  // Rating System Configuration
  RATING: {
    MIN_VALUE: 1,
    MAX_VALUE: 5,
    MAX_REVIEW_LENGTH: 500
  },
  
  // Announcement Configuration
  ANNOUNCEMENT: {
    TYPES: ['info', 'warning', 'success', 'error'] as const,
    TARGET_AUDIENCES: ['all', 'user', 'company', 'admin'] as const
  },
  
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/waste_management',
  
  // CORS Configuration
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
};

export default CONFIG;
