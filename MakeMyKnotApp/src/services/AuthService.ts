import ApiService from './ApiService';
import { LoginCredentials, RegisterData, AuthResponse, User, ResetPasswordData } from '../types/auth';

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>('/auth/login', credentials);
      
      if (response.token) {
        await ApiService.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>('/auth/register', userData);
      
      if (response.token) {
        await ApiService.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await ApiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server logout fails
    } finally {
      await ApiService.removeAuthToken();
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await ApiService.get<User>('/auth/me');
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Refresh auth token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>('/auth/refresh');
      
      if (response.token) {
        await ApiService.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.post<{ message: string }>('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  // Reset password with token
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await ApiService.post<{ message: string }>('/auth/reset-password', data);
      return response;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.post<{ message: string }>('/auth/verify-email', { token });
      return response;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.post<{ message: string }>('/auth/resend-verification', { email });
      return response;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  // Social login (Google)
  async googleLogin(googleToken: string): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>('/auth/google', { 
        token: googleToken 
      });
      
      if (response.token) {
        await ApiService.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  // Social login (Facebook)
  async facebookLogin(facebookToken: string): Promise<AuthResponse> {
    try {
      const response = await ApiService.post<AuthResponse>('/auth/facebook', { 
        token: facebookToken 
      });
      
      if (response.token) {
        await ApiService.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Facebook login error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await ApiService.put<User>('/auth/profile', userData);
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Upload profile picture
  async uploadProfilePicture(imageUri: string, onProgress?: (progress: number) => void): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await ApiService.uploadFile<{ imageUrl: string }>(
        '/auth/upload-profile-picture',
        formData,
        onProgress
      );
      
      return response;
    } catch (error) {
      console.error('Profile picture upload error:', error);
      throw error;
    }
  }

  // Delete account
  async deleteAccount(password: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.delete('/auth/account');
      await ApiService.removeAuthToken();
      return response;
    } catch (error) {
      console.error('Account deletion error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await ApiService.post<{ message: string }>('/auth/change-password', {
        oldPassword,
        newPassword
      });
      return response;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await ApiService.getAuthToken();
      if (!token) return false;

      // Verify token is still valid
      await this.getCurrentUser();
      return true;
    } catch (error) {
      // Token is invalid or expired
      await ApiService.removeAuthToken();
      return false;
    }
  }
}

export default new AuthService();
