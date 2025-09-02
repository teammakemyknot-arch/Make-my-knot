export interface AdminNotification {
  id: string
  userId: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  createdAt: string
  read: boolean
}

const NOTIFICATIONS_KEY = 'makemyknot_admin_notifications'

export function getNotifications(): AdminNotification[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]')
  } catch {
    return []
  }
}

export function sendNotification(userId: string, message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') {
  const notifications = getNotifications()
  const notification: AdminNotification = {
    id: Date.now().toString(),
    userId,
    message,
    type,
    createdAt: new Date().toISOString(),
    read: false
  }
  notifications.push(notification)
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
}

export function markNotificationAsRead(id: string) {
  const notifications = getNotifications()
  const idx = notifications.findIndex(n => n.id === id)
  if (idx >= 0) {
    notifications[idx].read = true
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
  }
}

export function getUserNotifications(userId: string): AdminNotification[] {
  return getNotifications().filter(n => n.userId === userId)
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
