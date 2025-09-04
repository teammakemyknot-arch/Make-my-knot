'use client';

export default function EnhancedAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'messages' | 'offers' | 'webinars' | 'analytics' | 'roles'>('overview')
  const [users, setUsers] = useState<UserProfile[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [userFilter, setUserFilter] = useState('all')
  const [offers, setOffers] = useState<Offer[]>(mockOffers)
  const [newMessage, setNewMessage] = useState('')
  const [selectedUserForMessage, setSelectedUserForMessage] = useState<string | null>(null)
  const [currentAdminRole, setCurrentAdminRole] = useState('super')
  const router = useRouter()

  useEffect(() => {
    // Mock authentication check
    setIsAuthenticated(true)
  }, [])

  const hasPermission = (permission: string): boolean => {
    const role = adminRoles.find(r => r.id === currentAdminRole)
    if (!role) return false
    return role.permissions.includes('*') || role.permissions.includes(permission)
  }

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' as const }
        : user
    ))
  }

  const handleCancelSubscription = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            subscription: { 
              ...user.subscription, 
              status: 'cancelled' as const 
            }
          }
        : user
    ))
  }

  const handleStartTrial = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            subscription: { 
              plan: 'trial' as const,
              status: 'active' as const,
              startedAt: new Date().toISOString(),
              endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          }
        : user
    ))
  }

  const handleSendMessage = (userId: string, content: string, type: 'support' | 'notification' | 'offer' = 'support') => {
    const newMsg: Message = {
      id: Date.now().toString(),
      fromAdmin: true,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      type
    }
    
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, messages: [...user.messages, newMsg] }
        : user
    ))
    setNewMessage('')
    setSelectedUserForMessage(null)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    const matchesFilter = userFilter === 'all' ||
                         (userFilter === 'active' && user.status === 'active') ||
                         (userFilter === 'suspended' && user.status === 'suspended') ||
                         (userFilter === 'trial' && user.subscription.plan === 'trial') ||
                         (userFilter === 'premium' && ['monthly', 'annual'].includes(user.subscription.plan))
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string, type: 'user' | 'subscription' = 'user') => {
    const colors = {
      user: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        suspended: 'bg-red-100 text-red-800',
        banned: 'bg-red-200 text-red-900'
      },
      subscription: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        suspended: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800'
      }
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${(colors as any)[type]?.[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent" />
      </div>
    )
  }

  // ✅ No stray return here anymore
  return (
    <>
      <Head>
        <title>Enhanced Admin Dashboard - Make My Knot</title>
        <meta name="description" content="Complete administrative dashboard for Make My Knot" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-slate-50">
        {/* ... rest of your dashboard JSX stays exactly the same ... */}
      </main>
    </>
  )
}
