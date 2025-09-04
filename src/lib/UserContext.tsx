import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from './api'

export interface User {
  id: string
  email: string
  name: string
  age: number
  phone: string
  location: string
  education: string
  profession: string
  bio: string
  interests: string[]
  values: string
  partnerPreferences: string
  communicationStyle: 'chat' | 'call'
  profileComplete: boolean
  questionnaireComplete: boolean
  isVerified?: boolean
  subscription?: {
    plan: 'trial' | 'monthly' | null
    trialStartedAt?: string
    trialEndsAt?: string
    startedAt?: string
  }
  createdAt: string
}

export interface QuestionnaireResponse {
  userId: string
  responses: Record<string, any>
  compatibilityProfile: {
    values: number[]
    lifestyle: number[]
    interests: number[]
    personality: number[]
  }
  completedAt: string
}

interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  saveQuestionnaireResponse: (response: QuestionnaireResponse) => Promise<void>
  getUserQuestionnaireResponse: () => Promise<QuestionnaireResponse | null>
  getCompatibilityMatches: (minCompatibility?: number, limit?: number) => Promise<any[]>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const initializeAuth = async () => {
      const token = localStorage.getItem('makemyknot_token')
      const savedUser = localStorage.getItem('makemyknot_user')
      
      if (token && savedUser) {
        try {
          // Verify token is still valid by fetching current user
          const response = await apiService.getMe()
          if (response.status === 'success' && response.user) {
            setUser(response.user)
            localStorage.setItem('makemyknot_user', JSON.stringify(response.user))
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('makemyknot_token')
            localStorage.removeItem('makemyknot_user')
          }
        } catch (error) {
          console.error('Error validating session:', error)
          localStorage.removeItem('makemyknot_token')
          localStorage.removeItem('makemyknot_user')
        }
      }
      setIsLoading(false)
    }
    
    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await apiService.login({ email, password })
      
      if (response.status === 'success' && response.user) {
        setUser(response.user)
        console.log('Login successful for:', response.user.email)
        return true
      }
      
      console.log('Login failed:', response.message)
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Convert user data to match API expectations
      const apiUserData = {
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ').slice(1).join(' ') || '',
        email: userData.email || '',
        password: userData.password,
        confirmPassword: userData.password,
        dateOfBirth: new Date(Date.now() - (userData.age || 25) * 365.25 * 24 * 60 * 60 * 1000).toISOString(),
        phoneNumber: userData.phone,
        agreeToTerms: true
      }
      
      const response = await apiService.register(apiUserData)
      
      if (response.status === 'success' && response.user) {
        // Convert API user back to our User interface
        const convertedUser: User = {
          id: response.user._id || response.user.id,
          email: response.user.email,
          name: `${response.user.firstName} ${response.user.lastName}`,
          age: response.user.age || 0,
          phone: response.user.phoneNumber || '',
          location: response.user.location?.city || '',
          education: response.user.preferences?.education || '',
          profession: response.user.preferences?.occupation || '',
          bio: response.user.bio || '',
          interests: response.user.preferences?.interests || [],
          values: userData.values || '',
          partnerPreferences: userData.partnerPreferences || '',
          communicationStyle: 'chat',
          profileComplete: false,
          questionnaireComplete: false,
          isVerified: response.user.verification?.isEmailVerified || false,
          subscription: { plan: null },
          createdAt: response.user.createdAt || new Date().toISOString()
        }
        
        setUser(convertedUser)
        console.log('Signup successful for:', convertedUser.email)
        return true
      }
      
      console.log('Signup failed:', response.message)
      return false
    } catch (error) {
      console.error('Signup error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        const response = await apiService.updateProfile(updates)
        if (response.status === 'success' && response.user) {
          const updatedUser = { ...user, ...updates }
          setUser(updatedUser)
          localStorage.setItem('makemyknot_user', JSON.stringify(updatedUser))
        }
      } catch (error) {
        console.error('Update user error:', error)
        // Still update locally on error for better UX
        const updatedUser = { ...user, ...updates }
        setUser(updatedUser)
        localStorage.setItem('makemyknot_user', JSON.stringify(updatedUser))
      }
    }
  }

  const saveQuestionnaireResponse = async (response: QuestionnaireResponse) => {
    if (!user) return
    
    try {
      const apiResponse = await apiService.saveQuestionnaireResponse({
        responses: response.responses,
        compatibilityProfile: response.compatibilityProfile,
        completionTime: response.completionTime || 0,
        questionnaire: {
          type: 'basic',
          version: '1.0',
          language: 'en'
        }
      })
      
      if (apiResponse.status === 'success') {
        // Mark questionnaire as complete
        updateUser({ questionnaireComplete: true })
      }
    } catch (error) {
      console.error('Error saving questionnaire response:', error)
      // Fallback to localStorage if API fails
      const responses = JSON.parse(localStorage.getItem('makemyknot_questionnaires') || '[]')
      const existingIndex = responses.findIndex((r: any) => r.userId === response.userId)
      
      if (existingIndex !== -1) {
        responses[existingIndex] = response
      } else {
        responses.push(response)
      }
      
      localStorage.setItem('makemyknot_questionnaires', JSON.stringify(responses))
      updateUser({ questionnaireComplete: true })
    }
  }

  const getUserQuestionnaireResponse = async (): Promise<QuestionnaireResponse | null> => {
    if (!user) return null
    
    try {
      const response = await apiService.getUserQuestionnaireResponse()
      if (response.status === 'success' && response.data.response) {
        const questionnaire = response.data.response
        return {
          userId: user.id,
          responses: questionnaire.responses,
          compatibilityProfile: questionnaire.compatibilityProfile,
          completedAt: questionnaire.createdAt,
          completionTime: questionnaire.completionTime
        }
      }
    } catch (error) {
      console.error('Error fetching questionnaire response:', error)
      // Fallback to localStorage
      const responses = JSON.parse(localStorage.getItem('makemyknot_questionnaires') || '[]')
      return responses.find((r: any) => r.userId === user.id) || null
    }
    
    return null
  }
  
  const getCompatibilityMatches = async (minCompatibility = 70, limit = 10): Promise<any[]> => {
    if (!user) return []
    
    try {
      const response = await apiService.getCompatibilityMatches(minCompatibility, limit)
      if (response.status === 'success') {
        return response.data.matches || []
      }
    } catch (error) {
      console.error('Error fetching compatibility matches:', error)
    }
    
    return []
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    saveQuestionnaireResponse,
    getUserQuestionnaireResponse,
    getCompatibilityMatches
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
