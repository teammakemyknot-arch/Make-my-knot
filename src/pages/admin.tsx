import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Shield, Trash2, CheckCircle2, Mail, Phone, User as UserIcon, Lock, LogIn, Users, BarChart3, MessageSquare, CreditCard, Eye, EyeOff, Settings, Zap, AlertTriangle, DollarSign, TrendingUp, Activity } from 'lucide-react'
import { getLeads, deleteLead, verifyLead, Lead, saveLead } from '@/lib/leadStore'
import { sendNotification, getAnalyticsData, syncLeadToCRM } from '@/lib/adminStore'

// Simple admin auth using a sessionStorage token (demo only)
const ADMIN_TOKEN_KEY = 'makemyknot_admin_token'
const ADMIN_PASSWORD = 'admin123' // demo only; replace with secure backend in production

type AdminTab = 'dashboard' | 'users' | 'leads' | 'matchmaking' | 'moderation' | 'payments' | 'analytics' | 'communication'

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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-gray-800" />
            <h1 className="ml-2 text-xl font-semibold">Admin Login</h1>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Password</label>
              <div className="flex">
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent" placeholder="Enter admin password" />
                <button type="submit" className="px-4 bg-primary-600 text-white rounded-r-lg flex items-center"><LogIn className="h-4 w-4 mr-1"/>Login</button>
              </div>
            </div>
            <p className="text-xs text-gray-500">Demo password: admin123 (Replace with secure auth in production)</p>
          </form>
        </div>
      </main>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'leads', label: 'CRM & Leads', icon: Mail },
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
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-gray-800" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button onClick={() => {
              sessionStorage.removeItem(ADMIN_TOKEN_KEY)
              setAuthed(false)
            }} className="text-sm text-gray-600 hover:text-gray-800">Logout</button>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AdminTab)}
                    className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'users' && <UserManagementTab />}
          {activeTab === 'leads' && <CRMLeadsTab />}
          {activeTab === 'matchmaking' && <MatchmakingTab />}
          {activeTab === 'moderation' && <ModerationTab />}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'communication' && <CommunicationTab />}
        </div>
      </main>
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
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-600" />
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </div>
        <div className="text-xs text-green-600 mt-2">+{analytics.newUsersThisWeek} this week</div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center">
          <Mail className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900">{analytics.totalLeads}</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </div>
        </div>
        <div className="text-xs text-green-600 mt-2">+{analytics.newLeadsThisWeek} this week</div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-gold-600" />
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900">{analytics.activeSubscriptions}</div>
            <div className="text-sm text-gray-600">Active Subscriptions</div>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-2">{analytics.trialUsers} on trial</div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center">
          <Activity className="h-8 w-8 text-purple-600" />
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900">{analytics.completedQuestionnaires}</div>
            <div className="text-sm text-gray-600">Questionnaires</div>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-2">Completed assessments</div>
      </div>
    </div>
  )
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
                  <UserIcon className="h-4 w-4 text-gray-500"/>
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
  const [users, setUsers] = useState<any[]>([])
  
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem('makemyknot_users')||'[]')
    const sanitized = raw.map((u:any)=>{ const {password, ...rest} = u; return rest })
    setUsers(sanitized.filter(u => u.questionnaireComplete))
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
