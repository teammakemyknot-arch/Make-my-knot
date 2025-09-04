// Authentication related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  preferences?: UserPreferences;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  ageRange: [number, number];
  location: string;
  interests: string[];
  lookingFor: 'serious' | 'casual' | 'friendship';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber?: string;
  agreeToTerms: boolean;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
