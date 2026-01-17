import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for AI generation
});

/**
 * Generate portfolio content from profile data
 */
export const generatePortfolioContent = async (profileData) => {
  const response = await api.post('/generate', profileData);
  return response.data;
};

/**
 * Save profile to database
 */
export const saveProfile = async (profileData) => {
  const response = await api.post('/profiles', profileData);
  return response.data;
};

/**
 * Get all profiles
 */
export const getProfiles = async (params = {}) => {
  const response = await api.get('/profiles', { params });
  return response.data;
};

/**
 * Get specific profile by ID
 */
export const getProfileById = async (id) => {
  const response = await api.get(`/profiles/${id}`);
  return response.data;
};

/**
 * Export content as JSON
 */
export const exportAsJSON = async (content, metadata = {}) => {
  const response = await api.post('/export/json', { content, metadata }, {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Export content as HTML
 */
export const exportAsHTML = async (content) => {
  const response = await api.post('/export/html', { content }, {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Export content as Markdown
 */
export const exportAsMarkdown = async (content) => {
  const response = await api.post('/export/markdown', { content }, {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Health check
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
