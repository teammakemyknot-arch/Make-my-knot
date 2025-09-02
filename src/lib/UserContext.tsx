import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
  saveQuestionnaireResponse: (response: QuestionnaireResponse) => void
  getUserQuestionnaireResponse: () => QuestionnaireResponse | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('makemyknot_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('makemyknot_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('makemyknot_users') || '[]')
      const existingUser = users.find((u: any) => u.email === email && u.password === password)
      
      if (existingUser) {
        const { password: _, ...userWithoutPassword } = existingUser
        setUser(userWithoutPassword)
        localStorage.setItem('makemyknot_user', JSON.stringify(userWithoutPassword))
        return true
      }
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const users = JSON.parse(localStorage.getItem('makemyknot_users') || '[]')
      
      // Check if user already exists
      if (users.some((u: any) => u.email === userData.email)) {
        return false
      }

      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email || '',
        name: userData.name || '',
        age: userData.age || 0,
        phone: userData.phone || '',
        location: userData.location || '',
        education: userData.education || '',
        profession: userData.profession || '',
        bio: userData.bio || '',
        interests: userData.interests || [],
        values: userData.values || '',
        partnerPreferences: userData.partnerPreferences || '',
        communicationStyle: userData.communicationStyle || 'chat',
        profileComplete: false,
        questionnaireComplete: false,
        createdAt: new Date().toISOString()
      }

      // Save user with password for login
      const userWithPassword = { ...newUser, password: userData.password }
      users.push(userWithPassword)
      localStorage.setItem('makemyknot_users', JSON.stringify(users))
      
      // Set current user (without password)
      setUser(newUser)
      localStorage.setItem('makemyknot_user', JSON.stringify(newUser))
      
      return true
    } catch (error) {
      console.error('Signup error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('makemyknot_user')
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('makemyknot_user', JSON.stringify(updatedUser))
      
      // Also update in the users array
      const users = JSON.parse(localStorage.getItem('makemyknot_users') || '[]')
      const userIndex = users.findIndex((u: any) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates }
        localStorage.setItem('makemyknot_users', JSON.stringify(users))
      }
    }
  }

  const saveQuestionnaireResponse = (response: QuestionnaireResponse) => {
    const responses = JSON.parse(localStorage.getItem('makemyknot_questionnaires') || '[]')
    const existingIndex = responses.findIndex((r: any) => r.userId === response.userId)
    
    if (existingIndex !== -1) {
      responses[existingIndex] = response
    } else {
      responses.push(response)
    }
    
    localStorage.setItem('makemyknot_questionnaires', JSON.stringify(responses))
    
    // Mark questionnaire as complete
    updateUser({ questionnaireComplete: true })
  }

  const getUserQuestionnaireResponse = (): QuestionnaireResponse | null => {
    if (!user) return null
    
    const responses = JSON.parse(localStorage.getItem('makemyknot_questionnaires') || '[]')
    return responses.find((r: any) => r.userId === user.id) || null
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
    getUserQuestionnaireResponse
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
