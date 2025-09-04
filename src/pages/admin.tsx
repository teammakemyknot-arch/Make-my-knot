import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { 
  Shield, Trash2, CheckCircle2, Mail, Phone, User, Lock, LogOut, Users, BarChart3, MessageSquare, CreditCard, Eye, EyeOff, Settings, Zap, AlertTriangle, DollarSign, TrendingUp, Activity, UserPlus, Video, Calendar, Gift, Edit, XCircle, MapPin, Briefcase, GraduationCap, Search, Wifi, MessageCircle
} from 'lucide-react'
import { useOnlineStatus } from '@/lib/OnlineStatusContext'
import { OnlineUsersList, OnlineStatusBadge, OnlineStatusIndicator } from '@/components/OnlineStatusIndicator'

// Enhanced interfaces for admin management
interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  age: number
  location: string
  profession: string
  education: string
  joinedAt: string
  isVerified: boolean
  subscription: {
    plan: 'none' | 'trial' | 'monthly' | 'annual'
    status: 'active' | 'inactive' | 'suspended' | 'cancelled'
    startedAt?: string
    endsAt?: string
  }
  questionnaire: {
    completed: boolean
    completedAt?: string
    responses?: QuestionnaireResponse[]
  }
  lastActive: string
  status: 'active' | 'inactive' | 'suspended' | 'banned'
  preferences?: UserPreferences
  matches?: number
  profileCompleteness: number
  totalSpent: number
  messages: Message[]
}

interface QuestionnaireResponse {
  questionId: string
  question: string
  answer: string
  category: string
}

interface UserPreferences {
  ageRange: [number, number]
  location: string[]
  education: string[]
  profession: string[]
  religion?: string
  interests: string[]
}

interface Message {
  id: string
  fromUserId?: string
  fromAdmin: boolean
  content: string
  timestamp: string
  read: boolean
  type: 'support' | 'notification' | 'offer'
}

interface AdminRole {
  id: string
  name: string
  permissions: string[]
}

// Simple admin auth constants
const ADMIN_TOKEN_KEY = 'makemyknot_admin_token'
const ADMIN_PASSWORD = 'admin123'

// Mock analytics data
function getAnalyticsData() {
  return {
    totalUsers: 1247,
    newUsersThisWeek: 23,
    totalLeads: 342,
    newLeadsThisWeek: 15,
    activeSubscriptions: 89,
    trialUsers: 156,
    completedQuestionnaires: 892,
    verifiedLeads: 287
  }
}

// Mock notification system
function sendNotification(userId: string, message: string, type: string) {
  console.log(`Sending ${type} notification to ${userId}: ${message}`)
}

// Mock types for compatibility
interface Lead {
  id: string
  name: string
  email: string
  phone: string
  status: 'new' | 'verified'
  syncedAt?: string
}

// Mock lead management functions
function getLeads(): Lead[] {
  return JSON.parse(localStorage.getItem('makemyknot_leads') || '[]')
}

function deleteLead(id: string) {
  const leads = getLeads()
  const filtered = leads.filter(l => l.id !== id)
  localStorage.setItem('makemyknot_leads', JSON.stringify(filtered))
}

function verifyLead(id: string) {
  const leads = getLeads()
  const updated = leads.map(l => l.id === id ? {...l, status: 'verified' as const} : l)
  localStorage.setItem('makemyknot_leads', JSON.stringify(updated))
}

function saveLead(lead: Lead) {
  const leads = getLeads()
  const updated = leads.map(l => l.id === lead.id ? lead : l)
  localStorage.setItem('makemyknot_leads', JSON.stringify(updated))
}

function syncLeadToCRM(lead: Lead) {
  console.log('Syncing lead to CRM:', lead)
  return { success: true }
}

// Import LogIn icon
import { LogIn } from 'lucide-react'

type AdminTab = 'dashboard' | 'users' | 'leads' | 'webinars' | 'matchmaking' | 'moderation' | 'payments' | 'analytics' | 'communication' | 'offers' | 'online-status'

// Enhanced webinar interface
interface Webinar {
  id: string
  title: string
  description: string
  speaker: string
  date: string
  time: string
  duration: number // in minutes
  maxParticipants: number
  registeredCount: number
  price: number
  currency: string
  image: string
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  tags: string[]
  createdAt: string
  updatedAt: string
}

// Offer interface
interface Offer {
  id: string
  title: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  validFrom: string
  validUntil: string
  targetUsers: string[]
  isActive: boolean
  maxUses?: number
  currentUses: number
  createdAt: string
  updatedAt: string
}

// Mock webinar data
const mockWebinars: Webinar[] = [
  {
    id: '1',
    title: 'Building Stronger Marriages: Communication Workshop',
    description: 'Learn effective communication techniques that strengthen relationships and build lasting marriages.',
    speaker: 'Dr. Priya Sharma',
    date: '2024-03-25',
    time: '19:00',
    duration: 90,
    maxParticipants: 200,
    registeredCount: 180,
    price: 0,
    currency: 'INR',
    image: '/api/placeholder/300/200',
    status: 'published',
    tags: ['communication', 'marriage', 'relationships'],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Pre-Marriage Counseling Session',
    description: 'Essential guidance for couples preparing for marriage. Understand expectations, resolve conflicts, and build a strong foundation.',
    speaker: 'Dr. Rajesh Mehta',
    date: '2024-03-28',
    time: '20:00',
    duration: 120,
    maxParticipants: 150,
    registeredCount: 95,
    price: 299,
    currency: 'INR',
    image: '/api/placeholder/300/200',
    status: 'published',
    tags: ['counseling', 'pre-marriage', 'guidance'],
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z'
  },
  {
    id: '3',
    title: 'Love Languages Workshop',
    description: 'Discover your love language and learn how to express and receive love effectively in relationships.',
    speaker: 'Dr. Kavita Patel',
    date: '2024-04-02',
    time: '19:30',
    duration: 75,
    maxParticipants: 180,
    registeredCount: 120,
    price: 199,
    currency: 'INR',
    image: '/api/placeholder/300/200',
    status: 'draft',
    tags: ['love languages', 'workshop', 'relationships'],
    createdAt: '2024-03-18T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z'
  }
]

// Mock offers data
const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Valentine\'s Day Special',
    description: 'Get 50% off on Premium subscription - Limited time offer for new users!',
    discountType: 'percentage',
    discountValue: 50,
    validFrom: '2024-02-01',
    validUntil: '2024-02-14',
    targetUsers: ['trial', 'free'],
    isActive: true,
    maxUses: 100,
    currentUses: 45,
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Loyalty Reward',
    description: '₹500 off for existing premium users on annual upgrade',
    discountType: 'fixed',
    discountValue: 500,
    validFrom: '2024-03-01',
    validUntil: '2024-03-31',
    targetUsers: ['monthly'],
    isActive: true,
    currentUses: 12,
    createdAt: '2024-02-25T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  }
]

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
    if (token === 'ok') {
      setAuthed(true)
    }
  }, [])

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, 'ok')
      setAuthed(true)
    } else {
      alert('Invalid admin password')
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-xl bg-blue-500 mr-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          </div>
          <form onSubmit={login} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter Admin Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e)=>setPassword(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500" 
                  placeholder="Enter admin password" 
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-1"/>
                  Login
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">Demo password: admin123</p>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">🔒 Secure admin access for Make My Knot management</p>
            </div>
          </form>
        </div>
      </main>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'online-status', label: 'Online Status', icon: Wifi },
    { id: 'leads', label: 'CRM & Leads', icon: Mail },
    { id: 'webinars', label: 'Webinars', icon: Video },
    { id: 'offers', label: 'Offers', icon: Gift },
    { id: 'matchmaking', label: 'Matchmaking', icon: Shield },
    { id: 'moderation', label: 'Moderation', icon: Eye },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
  ]

  return (
    <>
      <Head>
        <title>Admin Dashboard - Make My Knot</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center px-6 py-5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-600 mr-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Make My Knot</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AdminTab)}
                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                )
              })}
            </div>
          </nav>

          {/* User Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <button 
                onClick={() => {
                  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
                  setAuthed(false)
                }} 
                className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pl-64">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Welcome back! Here's what's happening with Make My Knot today.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">System Online</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Quick Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Active Matches</p>
                      <p className="text-2xl font-bold text-gray-900">342</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+8%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₹2.1L</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+23%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">91%</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+2%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
              </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'users' && <UserManagementTab />}
          {activeTab === 'online-status' && <OnlineStatusTab />}
          {activeTab === 'leads' && <CRMLeadsTab />}
          {activeTab === 'webinars' && <WebinarsTab />}
          {activeTab === 'offers' && <OffersTab />}
          {activeTab === 'matchmaking' && <MatchmakingTab />}
          {activeTab === 'moderation' && <ModerationTab />}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'communication' && <CommunicationTab />}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

// Dashboard Overview Tab
function DashboardTab() {
  const [analytics, setAnalytics] = useState<any>(null)
  
  useEffect(() => {
    setAnalytics(getAnalyticsData())
  }, [])

  if (!analytics) return <div>Loading...</div>

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <div className="card hover-lift border-gradient-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl gradient-bg mr-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">{analytics.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-success-600 font-medium">+{analytics.newUsersThisWeek} this week</div>
          <div className="text-xs text-gray-500">📈 Growing</div>
        </div>
      </div>
      
      <div className="card hover-lift border-gradient-accent">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl gradient-bg-accent mr-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text-accent">{analytics.totalLeads}</div>
              <div className="text-sm text-gray-600">Total Leads</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-success-600 font-medium">+{analytics.newLeadsThisWeek} this week</div>
          <div className="text-xs text-gray-500">💼 Active</div>
        </div>
      </div>
      
      <div className="card hover-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl gradient-bg-sunset mr-4">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text-gold">{analytics.activeSubscriptions}</div>
              <div className="text-sm text-gray-600">Active Subscriptions</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-warning-600 font-medium">{analytics.trialUsers} on trial</div>
          <div className="text-xs text-gray-500">💰 Revenue</div>
        </div>
      </div>
      
      <div className="card hover-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-xl gradient-bg-secondary mr-4">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">{analytics.completedQuestionnaires}</div>
              <div className="text-sm text-gray-600">Questionnaires</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-primary-600 font-medium">Completed assessments</div>
          <div className="text-xs text-gray-500">📊 Insights</div>
        </div>
      </div>
    </div>
  )
}

// Online Status Monitoring Tab
function OnlineStatusTab() {
  const { 
    getTotalOnlineUsers, 
    getOnlineUsersList, 
    onlineUsers, 
    getUserStatus, 
    getLastSeenText 
  } = useOnlineStatus();
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'away' | 'offline'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'lastSeen'>('lastSeen');

  // Get all users with their status
  const allUserStatuses = Array.from(onlineUsers.values());
  
  // Filter users based on status
  const filteredUsers = allUserStatuses.filter(userStatus => {
    if (statusFilter === 'all') return true;
    return userStatus.status === statusFilter;
  });

  // Sort users
  const sortedUsers = filteredUsers.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.userId.localeCompare(b.userId);
      case 'status':
        const statusOrder = { online: 0, away: 1, offline: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'lastSeen':
        return b.lastSeen.getTime() - a.lastSeen.getTime();
      default:
        return 0;
    }
  });

  const onlineCount = allUserStatuses.filter(u => u.status === 'online').length;
  const awayCount = allUserStatuses.filter(u => u.status === 'away').length;
  const offlineCount = allUserStatuses.filter(u => u.status === 'offline').length;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Wifi className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{onlineCount}</div>
              <div className="text-sm text-gray-600">Online Now</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-green-600">Active users</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{awayCount}</div>
              <div className="text-sm text-gray-600">Away</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-yellow-600">Inactive users</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{offlineCount}</div>
              <div className="text-sm text-gray-600">Offline</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-500">Offline users</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{allUserStatuses.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm text-gray-600">
              {Math.round((onlineCount / allUserStatuses.length) * 100)}% online
            </div>
          </div>
        </div>
      </div>

      {/* User Status Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">User Status Monitor</h2>
              <p className="text-sm text-gray-600">Real-time monitoring of user online status and activity</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="away">Away</option>
                <option value="offline">Offline</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="lastSeen">Sort by Last Seen</option>
                <option value="status">Sort by Status</option>
                <option value="name">Sort by Name</option>
              </select>
              <OnlineStatusBadge />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table-enhanced">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Seen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((userStatus) => (
                <tr key={userStatus.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-700">
                            {userStatus.userId.slice(-2).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          User {userStatus.userId.slice(-6)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {userStatus.userId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OnlineStatusIndicator 
                      userId={userStatus.userId} 
                      showText={true}
                      size="md"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getLastSeenText(userStatus.userId)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {userStatus.lastSeen.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {userStatus.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        {userStatus.location === 'Mobile' ? (
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        ) : (
                          <Activity className="h-4 w-4 mr-2 text-gray-400" />
                        )}
                        {userStatus.location}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {userStatus.isTyping && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Typing...
                        </span>
                      )}
                      {userStatus.status === 'online' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedUsers.length === 0 && (
          <div className="text-center py-12">
            <Wifi className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-sm text-gray-500">
              No users match the current filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Currently Online</h4>
            <OnlineUsersList maxUsers={8} showAvatars={true} className="" />
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">System Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Real-time updates</span>
                <span className="text-sm font-medium text-green-600 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last refresh</span>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Peak online today</span>
                <span className="text-sm text-gray-900 font-medium">
                  {Math.max(onlineCount, Math.floor(Math.random() * 20) + onlineCount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Management Tab
function UserManagementTab() {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  
  useEffect(() => {
    const refresh = () => {
      try {
        const raw = JSON.parse(localStorage.getItem('makemyknot_users')||'[]')
        const sanitized = raw.map((u:any)=>{ const {password, ...rest} = u; return rest })
        setUsers(sanitized)
      } catch { setUsers([]) }
    }
    refresh()
  }, [])

  const handleVerifyUser = (userId: string) => {
    const allUsers = JSON.parse(localStorage.getItem('makemyknot_users') || '[]')
    const idx = allUsers.findIndex((u: any) => u.id === userId)
    if (idx >= 0) {
      allUsers[idx].isVerified = true
      localStorage.setItem('makemyknot_users', JSON.stringify(allUsers))
      sendNotification(userId, 'Your account has been verified! Welcome to Make My Knot.', 'success')
      setUsers(prev => prev.map(u => u.id === userId ? {...u, isVerified: true} : u))
    }
  }

  const handleSuspendUser = (userId: string) => {
    if (confirm('Suspend this user?')) {
      sendNotification(userId, 'Your account has been temporarily suspended. Contact support for assistance.', 'warning')
      alert('User suspended (demo - no actual suspension logic)')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Verified</th>
              <th className="py-2 pr-4">Subscription</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u)=> (
              <tr key={u.id} className="border-b last:border-0">
                <td className="py-3 pr-4">{u.name || '—'}</td>
                <td className="py-3 pr-4">{u.email}</td>
                <td className="py-3 pr-4">{u.phone || '—'}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    u.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {u.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="py-3 pr-4">{u.subscription?.plan || '—'}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-2">
                    {!u.isVerified && (
                      <button onClick={() => handleVerifyUser(u.id)} className="px-3 py-1 bg-green-600 text-white text-xs rounded flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />Verify
                      </button>
                    )}
                    <button onClick={() => handleSuspendUser(u.id)} className="px-3 py-1 bg-red-600 text-white text-xs rounded flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />Suspend
                    </button>
                    <button onClick={() => setSelectedUser(u)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded flex items-center gap-1">
                      <Eye className="h-3 w-3" />View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Location:</strong> {selectedUser.location || '—'}</p>
              <p><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => setSelectedUser(null)} className="mt-4 btn-secondary">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

// CRM & Leads Tab
function CRMLeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState('all')
  
  useEffect(() => {
    setLeads(getLeads())
  }, [])

  const refresh = () => setLeads(getLeads())

  const handleDelete = (id: string) => {
    if (confirm('Delete this lead?')) {
      deleteLead(id)
      refresh()
    }
  }

  const handleVerify = (id: string) => {
    verifyLead(id)
    refresh()
  }

  const handleSyncToCRM = (lead: Lead) => {
    const result = syncLeadToCRM(lead)
    if (result.success) {
      const updatedLead = { ...lead, syncedAt: new Date().toISOString() }
      saveLead(updatedLead)
      refresh()
      alert('Lead synced to CRM successfully!')
    }
  }

  const filteredLeads = leads.filter(l => filter==='all' ? true : l.status === filter)

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">CRM & Lead Management</h2>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="verified">Verified</option>
          </select>
          <button onClick={refresh} className="text-sm px-3 py-2 border rounded-lg">Refresh</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Contact</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">CRM Sync</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.id} className="border-b last:border-0">
                <td className="py-3 pr-4 font-medium text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500"/>
                  {lead.name}
                </td>
                <td className="py-3 pr-4 text-gray-700">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400"/>{lead.email}</div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400"/>{lead.phone}</div>
                </td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 rounded text-xs ${lead.status==='verified'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-800'}`}>{lead.status}</span>
                </td>
                <td className="py-3 pr-4">
                  {lead.syncedAt ? (
                    <span className="text-xs text-green-600">Synced {new Date(lead.syncedAt).toLocaleDateString()}</span>
                  ) : (
                    <span className="text-xs text-gray-500">Not synced</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    {!lead.syncedAt && (
                      <button onClick={() => handleSyncToCRM(lead)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded flex items-center gap-1">
                        <Zap className="h-3 w-3" />Sync CRM
                      </button>
                    )}
                    {lead.status !== 'verified' && (
                      <button onClick={()=>handleVerify(lead.id)} className="px-3 py-1 rounded bg-green-600 text-white text-xs flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/>Verify</button>
                    )}
                    <button onClick={()=>handleDelete(lead.id)} className="px-3 py-1 rounded bg-red-600 text-white text-xs flex items-center gap-1"><Trash2 className="h-3 w-3"/>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Matchmaking Control Tab
function MatchmakingTab() {
  const [users, setUsers] = useState<UserProfile[]>([])

  useEffect(() => {
  const raw = JSON.parse(localStorage.getItem('makemyknot_users') || '[]')
  const sanitized = raw.map((u: any) => {
    const { password, ...rest } = u
    return rest
  })
  setUsers(sanitized.filter((u: any) => u.questionnaire?.completed))
}, [])


  const handleManualMatch = (userId: string, targetUserId: string) => {
    sendNotification(userId, `We found a special match for you! Check your matches tab.`, 'success')
    sendNotification(targetUserId, `We found a special match for you! Check your matches tab.`, 'success')
    alert('Manual match created!')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Matchmaking Control</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Algorithm Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Compatibility threshold</span>
              <input type="range" min="70" max="95" defaultValue="85" className="w-24" />
              <span className="text-sm text-gray-600">85%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Max matches per week</span>
              <select className="px-2 py-1 border rounded text-sm">
                <option>3</option>
                <option>5</option>
                <option>7</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Geographic radius (miles)</span>
              <input type="number" defaultValue="50" className="px-2 py-1 border rounded text-sm w-16" />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Manual Matching</h3>
          <p className="text-sm text-gray-600 mb-3">Create custom matches between users</p>
          <div className="space-y-2">
            <select className="w-full px-3 py-2 border rounded">
              <option>Select first user...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
            <select className="w-full px-3 py-2 border rounded">
              <option>Select second user...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
            <button className="btn-primary w-full text-sm">Create Match</button>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-800 mb-3">Recent Matches</h3>
        <div className="text-sm text-gray-500">No manual matches created yet.</div>
      </div>
    </div>
  )
}

// Content Moderation Tab
function ModerationTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Moderation</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Flagged Content</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Photo</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Flagged</span>
              </div>
              <p className="text-sm text-gray-600">User: john@example.com</p>
              <p className="text-sm text-gray-600">Reason: Inappropriate content</p>
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1 bg-green-600 text-white text-xs rounded">Approve</button>
                <button className="px-3 py-1 bg-red-600 text-white text-xs rounded">Remove</button>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 text-center py-4">
              No other flagged content
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Moderation Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Auto-moderate photos</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Profanity filter</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Require manual review</span>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Payments & Subscription Tab
function PaymentsTab() {
  const [users, setUsers] = useState<any[]>([])
  
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('makemyknot_users')||'[]')
    const sanitized = raw.map((u:any)=>{ const {password, ...rest} = u; return rest })
    setUsers(sanitized)
  }, [])

  const subscribedUsers = users.filter(u => u.subscription?.plan === 'monthly')
  const trialUsers = users.filter(u => u.subscription?.plan === 'trial')
  const revenue = subscribedUsers.length * 29.99 // Assuming $29.99/month

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">${revenue.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{subscribedUsers.length}</div>
              <div className="text-sm text-gray-600">Active Subscriptions</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{trialUsers.length}</div>
              <div className="text-sm text-gray-600">Trial Users</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Plan</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Started</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.subscription?.plan).map(u => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-3 pr-4">{u.name} ({u.email})</td>
                  <td className="py-3 pr-4 capitalize">{u.subscription?.plan}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.subscription?.plan === 'monthly' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.subscription?.plan === 'monthly' ? 'Active' : 'Trial'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{new Date(u.subscription?.trialStartedAt || u.subscription?.startedAt || u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 pr-4">
                    <button className="px-3 py-1 bg-red-600 text-white text-xs rounded">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Analytics Tab
function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<any>(null)
  
  useEffect(() => {
    setAnalytics(getAnalyticsData())
  }, [])

  if (!analytics) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-xs text-green-600 mt-2">+{analytics.newUsersThisWeek} this week</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalLeads}</div>
              <div className="text-sm text-gray-600">Total Leads</div>
            </div>
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-xs text-green-600 mt-2">+{analytics.newLeadsThisWeek} this week</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{((analytics.completedQuestionnaires / analytics.totalUsers) * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-xs text-gray-600 mt-2">Questionnaire completion</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{((analytics.verifiedLeads / analytics.totalLeads) * 100).toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Lead Quality</div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-xs text-gray-600 mt-2">Verified leads</div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <div className="text-gray-500">Analytics Chart Placeholder</div>
            <div className="text-sm text-gray-400">Connect to analytics service for detailed charts</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Communication Tools Tab
function CommunicationTab() {
  const [users, setUsers] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'success' | 'error'>('info')
  
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('makemyknot_users')||'[]')
    const sanitized = raw.map((u:any)=>{ const {password, ...rest} = u; return rest })
    setUsers(sanitized)
  }, [])

  const handleSendMessage = () => {
    if (!message || selectedUsers.length === 0) {
      alert('Please select users and enter a message')
      return
    }
    
    selectedUsers.forEach(userId => {
      sendNotification(userId, message, messageType)
    })
    
    alert(`Message sent to ${selectedUsers.length} user(s)!`)
    setMessage('')
    setSelectedUsers([])
  }

  const handleSelectAll = () => {
    setSelectedUsers(users.map(u => u.id))
  }

  const handleDeselectAll = () => {
    setSelectedUsers([])
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Communication Tools</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Select Recipients</h3>
          <div className="flex gap-2 mb-3">
            <button onClick={handleSelectAll} className="px-3 py-1 bg-blue-600 text-white text-xs rounded">Select All</button>
            <button onClick={handleDeselectAll} className="px-3 py-1 bg-gray-600 text-white text-xs rounded">Deselect All</button>
          </div>
          
          <div className="max-h-64 overflow-y-auto border rounded-lg p-3">
            {users.map(u => (
              <div key={u.id} className="flex items-center mb-2">
                <input 
                  type="checkbox" 
                  checked={selectedUsers.includes(u.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, u.id])
                    } else {
                      setSelectedUsers(selectedUsers.filter(id => id !== u.id))
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{u.name} ({u.email})</span>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-gray-600 mt-2">
            {selectedUsers.length} user(s) selected
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Compose Message</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Message Type</label>
              <select 
                value={messageType} 
                onChange={(e) => setMessageType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg h-32"
                placeholder="Enter your message here..."
              />
            </div>
            
            <button 
              onClick={handleSendMessage}
              className="btn-primary w-full"
            >
              Send Message
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Quick Templates</h4>
            <div className="space-y-2">
              <button 
                onClick={() => setMessage('Welcome to Make My Knot! Complete your profile to start receiving matches.')}
                className="text-xs text-blue-600 hover:underline block"
              >
                Welcome message
              </button>
              <button 
                onClick={() => setMessage('Don\'t forget to complete your compatibility questionnaire for better matches!')}
                className="text-xs text-blue-600 hover:underline block"
              >
                Questionnaire reminder
              </button>
              <button 
                onClick={() => setMessage('New matches are available! Check your dashboard to view them.')}
                className="text-xs text-blue-600 hover:underline block"
              >
                New matches notification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Webinars Management Tab
function WebinarsTab() {
  const [webinars, setWebinars] = useState<Webinar[]>(mockWebinars)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [newWebinar, setNewWebinar] = useState<Partial<Webinar>>({
    title: '',
    description: '',
    speaker: '',
    date: '',
    time: '',
    duration: 60,
    maxParticipants: 100,
    price: 0,
    currency: 'INR',
    image: '',
    status: 'draft',
    tags: []
  })

  const filteredWebinars = webinars.filter(w => filterStatus === 'all' || w.status === filterStatus)

  const handleCreateWebinar = () => {
    const webinar: Webinar = {
      ...newWebinar as Webinar,
      id: Date.now().toString(),
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setWebinars([...webinars, webinar])
    setShowCreateModal(false)
    setNewWebinar({
      title: '',
      description: '',
      speaker: '',
      date: '',
      time: '',
      duration: 60,
      maxParticipants: 100,
      price: 0,
      currency: 'INR',
      image: '',
      status: 'draft',
      tags: []
    })
    alert('Webinar created successfully!')
  }

  const handleEditWebinar = () => {
    if (!selectedWebinar) return
    setWebinars(webinars.map(w => w.id === selectedWebinar.id ? {
      ...selectedWebinar,
      updatedAt: new Date().toISOString()
    } : w))
    setShowEditModal(false)
    setSelectedWebinar(null)
    alert('Webinar updated successfully!')
  }

  const handleDeleteWebinar = (id: string) => {
    if (confirm('Are you sure you want to delete this webinar?')) {
      setWebinars(webinars.filter(w => w.id !== id))
      alert('Webinar deleted successfully!')
    }
  }

  const handleStatusChange = (id: string, newStatus: Webinar['status']) => {
    setWebinars(webinars.map(w => w.id === id ? {
      ...w,
      status: newStatus,
      updatedAt: new Date().toISOString()
    } : w))
    alert(`Webinar ${newStatus} successfully!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Webinar Management</h2>
            <p className="text-sm text-gray-600">Create, edit, and manage webinar events with pricing and scheduling</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Video className="h-4 w-4" />
            Create Webinar
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Webinars Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebinars.map((webinar) => (
          <div key={webinar.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Webinar Image */}
            <div className="h-48 bg-gray-200 relative">
              <img 
                src={webinar.image} 
                alt={webinar.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3Mjg0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPldlYmluYXIgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
                }}
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  webinar.status === 'published' ? 'bg-green-100 text-green-800' :
                  webinar.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  webinar.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {webinar.status.charAt(0).toUpperCase() + webinar.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Webinar Details */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{webinar.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{webinar.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{webinar.speaker}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(webinar.date).toLocaleDateString()} at {webinar.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{webinar.registeredCount}/{webinar.maxParticipants} registered</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">
                    {webinar.price === 0 ? 'Free' : `${webinar.currency} ${webinar.price}`}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {webinar.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedWebinar(webinar)
                    setShowEditModal(true)
                  }}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteWebinar(webinar.id)}
                  className="px-3 py-2 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                {webinar.status === 'draft' && (
                  <button
                    onClick={() => handleStatusChange(webinar.id, 'published')}
                    className="px-3 py-2 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200 transition-colors"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Webinar Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Create New Webinar</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newWebinar.title}
                    onChange={(e) => setNewWebinar({...newWebinar, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Webinar title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                  <input
                    type="text"
                    value={newWebinar.speaker}
                    onChange={(e) => setNewWebinar({...newWebinar, speaker: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dr. Speaker Name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newWebinar.description}
                  onChange={(e) => setNewWebinar({...newWebinar, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Webinar description"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newWebinar.date}
                    onChange={(e) => setNewWebinar({...newWebinar, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newWebinar.time}
                    onChange={(e) => setNewWebinar({...newWebinar, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                  <input
                    type="number"
                    value={newWebinar.duration}
                    onChange={(e) => setNewWebinar({...newWebinar, duration: parseInt(e.target.value) || 60})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={newWebinar.maxParticipants}
                    onChange={(e) => setNewWebinar({...newWebinar, maxParticipants: parseInt(e.target.value) || 100})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={newWebinar.price}
                    onChange={(e) => setNewWebinar({...newWebinar, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 for free"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={newWebinar.currency}
                    onChange={(e) => setNewWebinar({...newWebinar, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={newWebinar.image}
                  onChange={(e) => setNewWebinar({...newWebinar, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newWebinar.tags?.join(', ')}
                  onChange={(e) => setNewWebinar({...newWebinar, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="relationships, communication, marriage"
                />
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWebinar}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Webinar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Webinar Modal */}
      {showEditModal && selectedWebinar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Edit Webinar</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={selectedWebinar.title}
                    onChange={(e) => setSelectedWebinar({...selectedWebinar, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                  <input
                    type="text"
                    value={selectedWebinar.speaker}
                    onChange={(e) => setSelectedWebinar({...selectedWebinar, speaker: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={selectedWebinar.description}
                  onChange={(e) => setSelectedWebinar({...selectedWebinar, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={selectedWebinar.price}
                    onChange={(e) => setSelectedWebinar({...selectedWebinar, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedWebinar.status}
                    onChange={(e) => setSelectedWebinar({...selectedWebinar, status: e.target.value as Webinar['status']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditWebinar}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Webinar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Offers Management Tab
function OffersTab() {
  const [offers, setOffers] = useState<Offer[]>(mockOffers)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [filterActive, setFilterActive] = useState('all')
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    validFrom: '',
    validUntil: '',
    targetUsers: [],
    isActive: true,
    maxUses: undefined,
    currentUses: 0
  })

  const filteredOffers = offers.filter(o => 
    filterActive === 'all' || 
    (filterActive === 'active' && o.isActive) || 
    (filterActive === 'inactive' && !o.isActive)
  )

  const handleCreateOffer = () => {
    const offer: Offer = {
      ...newOffer as Offer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setOffers([...offers, offer])
    setShowCreateModal(false)
    setNewOffer({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      validFrom: '',
      validUntil: '',
      targetUsers: [],
      isActive: true,
      maxUses: undefined,
      currentUses: 0
    })
    alert('Offer created successfully!')
  }

  const handleEditOffer = () => {
    if (!selectedOffer) return
    setOffers(offers.map(o => o.id === selectedOffer.id ? {
      ...selectedOffer,
      updatedAt: new Date().toISOString()
    } : o))
    setShowEditModal(false)
    setSelectedOffer(null)
    alert('Offer updated successfully!')
  }

  const handleDeleteOffer = (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(o => o.id !== id))
      alert('Offer deleted successfully!')
    }
  }

  const handleToggleActive = (id: string) => {
    setOffers(offers.map(o => o.id === id ? {
      ...o,
      isActive: !o.isActive,
      updatedAt: new Date().toISOString()
    } : o))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Offers Management</h2>
            <p className="text-sm text-gray-600">Create and manage special offers, discounts, and promotions for users</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Gift className="h-4 w-4" />
            Create Offer
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Offers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{offer.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Target: {offer.targetUsers.join(', ') || 'All users'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {offer.discountType === 'percentage' ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validUntil).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {offer.currentUses}{offer.maxUses ? `/${offer.maxUses}` : ''} uses
                    </div>
                    {offer.maxUses && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((offer.currentUses / offer.maxUses) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      offer.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedOffer(offer)
                          setShowEditModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(offer.id)}
                        className={`transition-colors p-1 ${
                          offer.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                        }`}
                        title={offer.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Offer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Create New Offer</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Offer Title</label>
                <input
                  type="text"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Valentine's Day Special"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Special discount for premium subscription..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select
                    value={newOffer.discountType}
                    onChange={(e) => setNewOffer({...newOffer, discountType: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                  <input
                    type="number"
                    value={newOffer.discountValue}
                    onChange={(e) => setNewOffer({...newOffer, discountValue: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={newOffer.discountType === 'percentage' ? '50' : '500'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
                  <input
                    type="date"
                    value={newOffer.validFrom}
                    onChange={(e) => setNewOffer({...newOffer, validFrom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                  <input
                    type="date"
                    value={newOffer.validUntil}
                    onChange={(e) => setNewOffer({...newOffer, validUntil: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Users</label>
                <div className="space-y-2">
                  {['free', 'trial', 'monthly', 'annual'].map(userType => (
                    <label key={userType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newOffer.targetUsers?.includes(userType) || false}
                        onChange={(e) => {
                          const current = newOffer.targetUsers || []
                          if (e.target.checked) {
                            setNewOffer({...newOffer, targetUsers: [...current, userType]})
                          } else {
                            setNewOffer({...newOffer, targetUsers: current.filter(t => t !== userType)})
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{userType} Users</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Uses (optional)</label>
                <input
                  type="number"
                  value={newOffer.maxUses || ''}
                  onChange={(e) => setNewOffer({...newOffer, maxUses: parseInt(e.target.value) || undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOffer}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Offer Modal */}
      {showEditModal && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Edit Offer</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Offer Title</label>
                <input
                  type="text"
                  value={selectedOffer.title}
                  onChange={(e) => setSelectedOffer({...selectedOffer, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={selectedOffer.description}
                  onChange={(e) => setSelectedOffer({...selectedOffer, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                  <input
                    type="number"
                    value={selectedOffer.discountValue}
                    onChange={(e) => setSelectedOffer({...selectedOffer, discountValue: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedOffer.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setSelectedOffer({...selectedOffer, isActive: e.target.value === 'active'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditOffer}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Update Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
