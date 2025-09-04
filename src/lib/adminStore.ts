export interface AdminNotification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error' | 'system' | 'marketing'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  category?: string
  createdAt: string
  read: boolean
  readAt?: string
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
  expiresAt?: string
  sentBy?: string
  isActive?: boolean
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Helper function to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem('makemyknot_token')
}

// Helper function to make authenticated API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

export async function getNotifications(params: {
  page?: number
  limit?: number
  type?: string
  unreadOnly?: boolean
} = {}): Promise<{ notifications: AdminNotification[], pagination: any }> {
  try {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })
    
    const result = await apiCall(`/notifications?${queryParams}`)
    return {
      notifications: result.data.notifications.map((notification: any) => ({
        id: notification._id,
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        category: notification.category,
        createdAt: notification.createdAt,
        read: notification.read,
        readAt: notification.readAt,
        actionUrl: notification.actionUrl,
        actionText: notification.actionText,
        metadata: notification.metadata,
        expiresAt: notification.expiresAt,
        sentBy: notification.sentBy,
        isActive: notification.isActive
      })),
      pagination: result.data.pagination
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    // Fallback to localStorage if API fails
    const localNotifications = JSON.parse(localStorage.getItem('makemyknot_admin_notifications') || '[]')
    return { 
      notifications: localNotifications, 
      pagination: { page: 1, limit: 10, total: localNotifications.length, pages: 1 } 
    }
  }
}

export async function sendNotification(
  userId: string, 
  title: string,
  message: string, 
  type: 'info' | 'warning' | 'success' | 'error' = 'info',
  options: {
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    category?: string
    actionUrl?: string
    actionText?: string
    expiresAt?: string
    metadata?: Record<string, any>
  } = {}
): Promise<AdminNotification> {
  try {
    const result = await apiCall('/notifications', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        title,
        message,
        type,
        ...options
      })
    })
    
    const notification = result.data.notification
    return {
      id: notification._id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      category: notification.category,
      createdAt: notification.createdAt,
      read: notification.read,
      actionUrl: notification.actionUrl,
      actionText: notification.actionText,
      metadata: notification.metadata,
      expiresAt: notification.expiresAt,
      isActive: notification.isActive
    }
  } catch (error) {
    console.error('Error sending notification:', error)
    // Fallback to localStorage if API fails
    const localNotification: AdminNotification = {
      id: Date.now().toString(),
      userId,
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false,
      ...options
    }
    const notifications = JSON.parse(localStorage.getItem('makemyknot_admin_notifications') || '[]')
    notifications.push(localNotification)
    localStorage.setItem('makemyknot_admin_notifications', JSON.stringify(notifications))
    return localNotification
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    await apiCall(`/notifications/${id}/read`, {
      method: 'PATCH'
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    // Fallback to localStorage if API fails
    const notifications = JSON.parse(localStorage.getItem('makemyknot_admin_notifications') || '[]')
    const idx = notifications.findIndex((n: AdminNotification) => n.id === id)
    if (idx >= 0) {
      notifications[idx].read = true
      notifications[idx].readAt = new Date().toISOString()
      localStorage.setItem('makemyknot_admin_notifications', JSON.stringify(notifications))
    }
  }
}

export async function getUserNotifications(userId: string): Promise<AdminNotification[]> {
  try {
    const result = await getNotifications({ limit: 100 })
    return result.notifications.filter(n => n.userId === userId)
  } catch (error) {
    console.error('Error getting user notifications:', error)
    const localNotifications = JSON.parse(localStorage.getItem('makemyknot_admin_notifications') || '[]')
    return localNotifications.filter((n: AdminNotification) => n.userId === userId)
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await apiCall('/notifications/read-all', {
      method: 'PATCH'
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    // Fallback to localStorage if API fails
    const notifications = JSON.parse(localStorage.getItem('makemyknot_admin_notifications') || '[]')
    notifications.forEach((n: AdminNotification) => {
      n.read = true
      n.readAt = new Date().toISOString()
    })
    localStorage.setItem('makemyknot_admin_notifications', JSON.stringify(notifications))
  }
}

// Mock CRM sync functionality
export function syncLeadToCRM(lead: any) {
  // In real app, this would call external CRM API
  console.log('Syncing lead to CRM:', lead.email)
  return { success: true, crmId: `crm_${Date.now()}` }
}

// Mock analytics data
export function getAnalyticsData() {
  const users = JSON.parse(localStorage.getItem('makemyknot_users') || '[]')
  const leads = JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
  const questionnaires = JSON.parse(localStorage.getItem('makemyknot_questionnaires') || '[]')
  
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const newUsersThisWeek = users.filter((u: any) => new Date(u.createdAt) > weekAgo).length
  const newLeadsThisWeek = leads.filter((l: any) => new Date(l.createdAt) > weekAgo).length
  
  return {
    totalUsers: users.length,
    totalLeads: leads.length,
    verifiedLeads: leads.filter((l: any) => l.status === 'verified').length,
    completedQuestionnaires: questionnaires.length,
    newUsersThisWeek,
    newLeadsThisWeek,
    activeSubscriptions: users.filter((u: any) => u.subscription?.plan === 'monthly').length,
    trialUsers: users.filter((u: any) => u.subscription?.plan === 'trial').length
  }
}
