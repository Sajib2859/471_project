// API Configuration
// This allows easy switching between development and production environments

const getApiUrl = (): string => {
  // Check if we're in production (you can customize this logic)
  if (process.env.NODE_ENV === 'production') {
    // In production, use the environment variable or fallback to relative path
    return process.env.REACT_APP_API_URL || '/api';
  }
  
  // In development, use localhost with the configured port
  return process.env.REACT_APP_API_URL || 'http://localhost:9371/api';
};

export const API_BASE_URL = getApiUrl();

// Helper function to get the full API URL
export const getApiEndpoint = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

export default API_BASE_URL;
