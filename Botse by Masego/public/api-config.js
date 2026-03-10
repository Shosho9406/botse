// API Configuration
// This file dynamically sets the API base URL based on environment

const API_BASE_URL = (() => {
  // Production: Use relative URLs for Vercel serverless functions
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return ''; // Use relative URLs for Vercel
  }
  // Development: Use local backend
  return 'http://localhost:3000';
})();

// Helper function to build API URLs
function apiUrl(endpoint) {
  return `${API_BASE_URL}${endpoint}`;
}
