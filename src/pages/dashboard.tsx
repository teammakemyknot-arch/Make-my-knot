import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Heart, Users, MessageCircle, Settings, Star, ArrowRight, User, MapPin, LogOut, Loader } from 'lucide-react'
import { useUser } from '@/lib/UserContext'
import MatchCard from '@/components/MatchCard'

// Mock match data that will be generated based on compatibility
const generateMatches = (userProfile: any) => [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 28,
    location: 'Mumbai, India',
    education: 'MBA from IIM Bangalore',
    profession: 'Product Manager at Tech Startup',
    bio: 'Family-oriented person who loves travel, cooking, and spending time with loved ones. I believe in building a partnership based on mutual respect and shared values.',
    interests: ['Travel', 'Cooking', 'Yoga', 'Reading', 'Photography'],
    compatibilityScore: 94,
    photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop']
  },
  {
    id: '2',
    name: 'Arjun Patel',
    age: 31,
    location: 'Delhi, India',
    education: 'B.Tech from IIT Delhi, MS from Stanford',
    profession: 'Software Engineer at Google',
    bio: 'Looking for a life partner who shares my passion for technology and values family traditions. I enjoy hiking, playing cricket, and exploring new cuisines.',
    interests: ['Technology', 'Cricket', 'Hiking', 'Music', 'Food'],
    compatibilityScore: 89,
    photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop']
  },
  {
    id: '3',
    name: 'Kavya Reddy',
    age: 26,
    location: 'Bangalore, India',
    education: 'MBBS from AIIMS',
    profession: 'Doctor at Apollo Hospital',
    bio: 'Compassionate doctor who believes in work-life balance. I love dancing, spending time in nature, and building meaningful relationships with people.',
    interests: ['Medicine', 'Dance', 'Nature', 'Volunteering', 'Art'],
    compatibilityScore: 92,
    photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop']
  }
]

export default function Dashboard() {
  const { user, isAuthenticated, logout, getUserQuestionnaireResponse, isLoading } = useUser()
  const [matches, setMatches] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'conversations' | 'profile'>('overview')
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      // Generate matches based on user profile
      const userMatches = generateMatches(user)
      setMatches(userMatches)
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleLike = (matchId: string) => {
    console.log('Liked match:', matchId)
    // In a real app, this would send to backend
  }

  const handlePass = (matchId: string) => {
    console.log('Passed match:', matchId)
    // In a real app, this would send to backend
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const questionnaireResponse = getUserQuestionnaireResponse()
  const needsQuestionnaire = !user.questionnaireComplete

  return (
    <>
      <Head>
        <title>Dashboard - Make My Knot</title>
        <meta name="description" content="Your personal dashboard for finding your perfect life partner." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Make My Knot</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}!</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Questionnaire Notice */}
        {needsQuestionnaire && (
          <div className="bg-gold-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-6 w-6 mr-3" />
                  <div>
                    <h3 className="font-semibold">Complete your compatibility assessment</h3>
                    <p className="text-sm text-gold-100">Get better matches by completing our questionnaire</p>
                  </div>
                </div>
                <Link href="/questionnaire" className="btn-secondary text-sm bg-white text-gold-600 hover:bg-gray-50">
                  Start Questionnaire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="flex space-x-0 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Heart },
                { id: 'matches', label: 'Matches', icon: Users },
                { id: 'conversations', label: 'Conversations', icon: MessageCircle },
                { id: 'profile', label: 'Profile', icon: User },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
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
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{needsQuestionnaire ? '0' : '3'}</div>
                  <div className="text-sm text-gray-600">New Matches</div>
                </div>
                
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-gold-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-gold-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
                  <div className="text-sm text-gray-600">Active Chats</div>
                </div>
                
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{needsQuestionnaire ? 'N/A' : '92%'}</div>
                  <div className="text-sm text-gray-600">Avg Compatibility</div>
                </div>
                
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
                  <div className="text-sm text-gray-600">Mutual Interests</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
                  <div className="space-y-3">
                    {needsQuestionnaire ? (
                      <Link href="/questionnaire" className="flex items-center justify-between p-3 bg-gold-50 rounded-lg hover:bg-gold-100 transition-colors">
                        <div>
                          <div className="font-medium text-gray-900">Complete Compatibility Assessment</div>
                          <div className="text-sm text-gray-600">Get personalized matches</div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gold-600" />
                      </Link>
                    ) : (
                      <Link href="/matches" className="flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                        <div>
                          <div className="font-medium text-gray-900">View Your Matches</div>
                          <div className="text-sm text-gray-600">3 new compatible matches</div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-primary-600" />
                      </Link>
                    )}
                    
                    <Link href="/onboarding" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900">Complete Profile</div>
                        <div className="text-sm text-gray-600">Add more details about yourself</div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-600" />
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Matchmaker Notes</h3>
                  <div className="space-y-3">
                    <div className="bg-primary-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        "Hi {user.name}! {needsQuestionnaire 
                          ? 'Complete your assessment to help me find your perfect matches.' 
                          : 'I found some amazing matches for you this week. Check them out!'
                        }"
                      </p>
                      <p className="text-xs text-gray-500 mt-1">- Priya, Your AI Matchmaker</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div>
              {needsQuestionnaire ? (
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-gold-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Assessment First</h3>
                  <p className="text-gray-600 mb-6">We need to understand your preferences to find compatible matches.</p>
                  <Link href="/questionnaire" className="btn-gold">
                    Start Compatibility Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Matches</h1>
                    <p className="text-gray-600">Curated based on your compatibility assessment</p>
                  </div>
                  
                  <div className="grid lg:grid-cols-3 gap-6">
                    {matches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onLike={handleLike}
                        onPass={handlePass}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'conversations' && (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Conversations Yet</h3>
              <p className="text-gray-600 mb-6">Start liking matches to begin conversations!</p>
              <Link href="/matches" className="btn-primary">
                View Matches
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-12 w-12 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <p className="text-gray-900">{user.age || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <p className="text-gray-900">{user.phone || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <p className="text-gray-900">{user.location || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    <p className="text-gray-900">{user.education || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                    <p className="text-gray-900">{user.profession || 'Not specified'}</p>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <Link href="/onboarding" className="btn-secondary flex-1 text-center">
                    Edit Profile
                  </Link>
                  {needsQuestionnaire && (
                    <Link href="/questionnaire" className="btn-primary flex-1 text-center">
                      Complete Assessment
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
