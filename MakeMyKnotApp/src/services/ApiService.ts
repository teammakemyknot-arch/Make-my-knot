import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://192.168.29.180:3002/api'  // Development - use your machine's IP
    : 'https://makemyknot-api.vercel.app/api', // Production
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Token management
const TOKEN_KEY = '@makemyknot_token';

class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.HEADERS;
  }

  // Token management
  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      this.defaultHeaders.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        this.defaultHeaders.Authorization = `Bearer ${token}`;
      }
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      delete this.defaultHeaders.Authorization;
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // Generic HTTP request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      timeout: API_CONFIG.TIMEOUT,
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData
        );
      }

      const data = await response.json();
      console.log(`API Response: ${config.method || 'GET'} ${url} - Success`);
      
      return data;
    } catch (error) {
      console.error(`API Error: ${config.method || 'GET'} ${url}`, error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(0, 'Network error. Please check your connection.', error);
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload method
  async uploadFile<T>(
    endpoint: string, 
    file: FormData | File, 
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new ApiError(xhr.status, 'Invalid JSON response', error));
          }
        } else {
          reject(new ApiError(xhr.status, `HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new ApiError(0, 'Network error during file upload'));
      });
      
      xhr.open('POST', url);
      
      // Set auth header if available
      if (this.defaultHeaders.Authorization) {
        xhr.setRequestHeader('Authorization', this.defaultHeaders.Authorization);
      }
      
      xhr.send(file);
    });
  }

  // Initialize auth token on app start
  async initialize(): Promise<void> {
    await this.getAuthToken();
  }
}

// Custom error class for API errors
export class ApiError extends Error {
  public status: number;
  public data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  get isValidationError(): boolean {
    return this.status === 400 || this.status === 422;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

// Dating App Specific API Methods
export class MakeMyKnotApi {
  constructor(private apiService: ApiService) {}

  // Authentication
  async login(email: string, password: string) {
    const response = await this.apiService.post('/auth/login', { email, password });
    if (response.token) {
      await this.apiService.setAuthToken(response.token);
    }
    return response;
  }

  async signup(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    dateOfBirth: string;
  }) {
    const response = await this.apiService.post('/auth/signup', userData);
    if (response.token) {
      await this.apiService.setAuthToken(response.token);
    }
    return response;
  }

  async logout() {
    try {
      await this.apiService.post('/auth/logout');
    } finally {
      await this.apiService.removeAuthToken();
    }
  }

  // User Profile
  async getCurrentUser() {
    return this.apiService.get('/users/me');
  }

  async updateProfile(updates: any) {
    return this.apiService.put('/users/me', updates);
  }

  async uploadPhoto(photoUri: string, isMain: boolean = false) {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'profile_photo.jpg',
    } as any);
    formData.append('isMain', isMain.toString());

    return this.apiService.uploadFile('/users/photos', formData);
  }

  // Discovery & Matching
  async getDiscoveryUsers(filters?: {
    ageMin?: number;
    ageMax?: number;
    maxDistance?: number;
    interests?: string[];
  }) {
    return this.apiService.get('/discovery/users', filters);
  }

  async swipeUser(targetUserId: string, action: 'like' | 'pass' | 'super_like') {
    return this.apiService.post('/matches/swipe', { targetUserId, action });
  }

  async getMatches() {
    return this.apiService.get('/matches');
  }

  async getLikes() {
    return this.apiService.get('/likes');
  }

  // Chat
  async getConversations() {
    return this.apiService.get('/chat/conversations');
  }

  async getMessages(conversationId: string, page: number = 1, limit: number = 50) {
    return this.apiService.get(`/chat/conversations/${conversationId}/messages`, { page, limit });
  }

  async sendMessage(conversationId: string, content: string, type: 'text' | 'image' = 'text') {
    return this.apiService.post(`/chat/conversations/${conversationId}/messages`, { content, type });
  }

  async markMessageAsRead(messageId: string) {
    return this.apiService.put(`/chat/messages/${messageId}/read`);
  }

  // Safety
  async reportUser(userId: string, reason: string, description?: string) {
    return this.apiService.post('/safety/report', { userId, reason, description });
  }

  async blockUser(userId: string) {
    return this.apiService.post('/safety/block', { userId });
  }

  async unblockUser(userId: string) {
    return this.apiService.post('/safety/unblock', { userId });
  }

  // Premium
  async getPremiumPlans() {
    return this.apiService.get('/premium/plans');
  }

  async purchasePremium(planId: string, paymentToken: string) {
    return this.apiService.post('/premium/purchase', { planId, paymentToken });
  }
}

// Export singleton instances
const apiService = new ApiService();
export const makeMyKnotApi = new MakeMyKnotApi(apiService);
export default apiService;
