const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  // Documents
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Queries
  submitQuery: async (query) => {
    const response = await fetch(`${API_BASE_URL}/queries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return response.json();
  },

  // Analytics
  getAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics`);
    return response.json();
  },
};

export default api;
