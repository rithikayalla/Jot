// API Service for Backend Integration
// Replace the mock implementations with actual API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// Authentication API
export const authAPI = {
  signup: async (name: string, email: string, password: string) => {
    const data = await fetchWithAuth('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    // Store token
    localStorage.setItem('authToken', data.token);
    return data.user;
  },

  login: async (email: string, password: string) => {
    const data = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token
    localStorage.setItem('authToken', data.token);
    return data.user;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  getCurrentUser: async () => {
    const data = await fetchWithAuth('/auth/me');
    return data.user;
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

// Entries API
export const entriesAPI = {
  getAll: async (filters?: { category?: string; startDate?: Date; endDate?: Date }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
    
    const queryString = params.toString();
    const url = `/entries${queryString ? `?${queryString}` : ''}`;
    
    const data = await fetchWithAuth(url);
    return data.entries;
  },

  getById: async (id: string) => {
    const data = await fetchWithAuth(`/entries/${id}`);
    return data.entry;
  },

  create: async (content: string, category: string) => {
    const data = await fetchWithAuth('/entries', {
      method: 'POST',
      body: JSON.stringify({ content, category }),
    });
    return data.entry;
  },

  update: async (id: string, content: string) => {
    const data = await fetchWithAuth(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
    return data.entry;
  },

  delete: async (id: string) => {
    const data = await fetchWithAuth(`/entries/${id}`, {
      method: 'DELETE',
    });
    return data.success;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const data = await fetchWithAuth('/categories');
    return data.categories;
  },

  create: async (name: string, color: string) => {
    const data = await fetchWithAuth('/categories', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });
    return data.category;
  },

  update: async (id: string, updates: { name?: string; color?: string }) => {
    const data = await fetchWithAuth(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.category;
  },

  delete: async (id: string) => {
    const data = await fetchWithAuth(`/categories/${id}`, {
      method: 'DELETE',
    });
    return data.success;
  },
};

// Analytics API
export const analyticsAPI = {
  getWeeklySummary: async () => {
    const data = await fetchWithAuth('/analytics/weekly');
    return data;
  },
};

// AI API (Optional)
export const aiAPI = {
  getSuggestions: async (content: string) => {
    const data = await fetchWithAuth('/ai/suggestions', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return data.suggestions;
  },

  getGuidanceQuestions: async (content?: string) => {
    const params = content ? `?content=${encodeURIComponent(content)}` : '';
    const data = await fetchWithAuth(`/ai/questions${params}`);
    return data.questions;
  },
};
