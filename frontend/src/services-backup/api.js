const API_BASE_URL =
  process.env.REACT_APP_API_URL ?? 'http://localhost:5002/api';

console.log('🔗 API_BASE_URL:', API_BASE_URL);

export const api = {
  // --------------------
  // Documents
  // --------------------
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Document upload failed');
    }

    return response.json();
  },

  // --------------------
  // Queries
  // --------------------
  submitQuery: async (query) => {
    const response = await fetch(`${API_BASE_URL}/queries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Query request failed');
    }

    return response.json();
  },

  // --------------------
  // Analytics
  // --------------------
  getAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics`);

    if (!response.ok) {
      throw new Error('Analytics request failed');
    }

    return response.json();
  },
};

export default api;
