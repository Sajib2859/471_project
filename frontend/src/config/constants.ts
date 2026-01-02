// Frontend Configuration Constants
// Centralized configuration to avoid hardcoded values

export const FRONTEND_CONFIG = {
  // Map Configuration (Dhaka, Bangladesh coordinates)
  MAP: {
    DEFAULT_CENTER: {
      lat: 23.8103,
      lng: 90.4125,
      label: 'Dhaka, Bangladesh'
    },
    DEFAULT_ZOOM: 12,
    TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  
  // Theme Configuration
  THEME: {
    STORAGE_KEY: 'theme',
    DEFAULT: 'light' as 'light' | 'dark',
    OPTIONS: ['light', 'dark'] as const
  },
  
  // Rating Configuration
  RATING: {
    MIN: 1,
    MAX: 5,
    SIZES: {
      small: '1rem',
      medium: '1.5rem',
      large: '2rem'
    },
    COLORS: {
      filled: '#FFB800',
      empty: '#E0E0E0'
    }
  },
  
  // File Upload Configuration
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif']
  },
  
  // Chart Configuration
  CHART: {
    MAX_DATA_POINTS: 10, // Number of transactions to show in chart
    COLORS: {
      primary: '#A4DD00',
      secondary: 'rgba(164, 221, 0, 0.1)'
    }
  },
  
  // Announcement Configuration
  ANNOUNCEMENT: {
    STORAGE_KEY: 'dismissedAnnouncements',
    TYPES: {
      info: { icon: 'ℹ️', bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' },
      warning: { icon: '⚠️', bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
      success: { icon: '✅', bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' },
      error: { icon: '❌', bg: '#FFEBEE', border: '#F44336', text: '#C62828' }
    }
  },
  
  // UI Configuration
  UI: {
    TOGGLE_BUTTON: {
      size: '60px',
      position: { bottom: '2rem', right: '2rem' },
      zIndex: 999
    },
    GRADIENTS: {
      lightTheme: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      darkTheme: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
  }
};

export default FRONTEND_CONFIG;
