// API Configuration
// Dynamic environment detection - switches between local and production

const isProduction = window.location.hostname !== 'localhost';

// Use environment variable from build time, fallback to Beanstalk URL
// This is injected by esbuild during build process
const API_HOST = isProduction
  ? (process.env.API_BASE_URL || 'https://threat-mapping-backend-prod.eba-4y2dpfff.us-east-1.elasticbeanstalk.com')
  : 'http://localhost:5000';

// Endpoint URLs
export const API_URLS = {
  auth: `${API_HOST}/auth`,
  awsCreds: `${API_HOST}/awsCreds`,
  roleAttempts: `${API_HOST}/role-attempts`,
  multiAccount: `${API_HOST}/multi-account`,
  email: `${API_HOST}/email`,
  reports: `${API_HOST}/reports`,
};

// Export for debugging
export const getEnvironment = () => ({
  isProduction,
  apiHost: API_HOST,
});
