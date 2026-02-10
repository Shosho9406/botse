// API Configuration
// This file dynamically sets the API base URL based on environment

const API_BASE_URL = (() => {
  // Production: Use environment variable or AWS backend
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return window.API_BASE_URL || 'https://your-aws-backend-url.com';
  }
  // Development: Use local backend
  return 'http://localhost:3000';
})();

// Helper function to build API URLs
function apiUrl(endpoint) {
  return `${API_BASE_URL}${endpoint}`;
}
