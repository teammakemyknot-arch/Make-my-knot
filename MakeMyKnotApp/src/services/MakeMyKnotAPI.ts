import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api'
  : 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      // Navigate to login screen if needed
    }
    return Promise.reject(error);
  }
);

export const makeMyKnotAPI = {
  // Authentication
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store auth data
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, token, user };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  },
  
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    phoneNumber?: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  },
  
  verifyEmail: async (token: string) => {
    try {
      const response = await api.post('/auth/verify-email', { token });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Verification failed' };
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Request failed' };
    }
  },
  
  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Reset failed' };
    }
  },
  
  // Users
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return { success: true, user: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to get profile' };
    }
  },
  
  updateProfile: async (profileData: any) => {
    try {
      const response = await api.patch('/users/profile', profileData);
      return { success: true, user: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to update profile' };
    }
  },
  
  uploadProfilePicture: async (imageUri: string) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);
      
      const response = await api.post('/users/upload-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Upload failed' };
    }
  },
  
  updateLocation: async (location: {
    coordinates: [number, number]; // [longitude, latitude]
    city: string;
    state: string;
    country: string;
  }) => {
    try {
      const response = await api.patch('/users/location', { location });
      return { success: true, user: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to update location' };
    }
  },
  
  updatePreferences: async (preferences: any) => {
    try {
      const response = await api.patch('/users/preferences', { preferences });
      return { success: true, user: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to update preferences' };
    }
  },
  
  // Matches
  getPotentialMatches: async () => {
    try {
      const response = await api.get('/matches/potential');
      return { success: true, matches: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to get matches' };
    }
  },
  
  likeUser: async (userId: string) => {
    try {
      const response = await api.post('/matches/like', { userId });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to like user' };
    }
  },
  
  passUser: async (userId: string) => {
    try {
      const response = await api.post('/matches/pass', { userId });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to pass user' };
    }
  },
  
  getMatches: async () => {
    try {
      const response = await api.get('/matches');
      return { success: true, matches: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to get matches' };
    }
  },
  
  // Chats
  getConversations: async () => {
    try {
      const response = await api.get('/chats/conversations');
      return { success: true, conversations: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to get conversations' };
    }
  },
  
  getMessages: async (conversationId: string) => {
    try {
      const response = await api.get(`/chats/conversations/${conversationId}/messages`);
      return { success: true, messages: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to get messages' };
    }
  },
  
  sendMessage: async (conversationId: string, message: string) => {
    try {
      const response = await api.post(`/chats/conversations/${conversationId}/messages`, { message });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to send message' };
    }
  },
  
  // Questionnaire
  submitQuestionnaire: async (responses: any) => {
    try {
      const response = await api.post('/users/questionnaire', responses);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to submit questionnaire' };
    }
  },
  
  // Subscription
  startFreeTrial: async () => {
    try {
      const response = await api.post('/users/subscription/trial');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to start trial' };
    }
  },
  
  subscribeToPremium: async (plan: 'monthly' | 'yearly') => {
    try {
      const response = await api.post('/users/subscription/premium', { plan });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to subscribe' };
    }
  },
  
  // Utility
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    return { success: true };
  },
  
  getCurrentUser: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },
  
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  },
  
  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: 'Server unavailable' };
    }
  }
};
