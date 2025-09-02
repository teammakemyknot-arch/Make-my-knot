import Head from 'next/head'
import { useState } from 'react'
import { Heart, Filter, Search, MapPin, Users, MessageCircle, Star } from 'lucide-react'
import MatchCard from '@/components/MatchCard'

// Sample match data
const sampleMatches = [
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

export default function Matches() {
  const [matches, setMatches] = useState(sampleMatches)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    ageRange: [25, 35],
    location: '',
    education: '',
    profession: ''
  })

  const handleLike = (matchId: string) => {
    console.log('Liked:', matchId)
    // Move to next match
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1)
    }
  }

  const handlePass = (matchId: string) => {
    console.log('Passed:', matchId)
    // Move to next match
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1)
    }
  }

  const currentMatch = matches[currentMatchIndex]

  return (
    <>
      <Head>
        <title>Your Matches - Make My Knot</title>
        <meta name="description" content="Discover your curated matches based on compatibility and shared values." />
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
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/matches" className="text-primary-600 font-semibold">Matches</a>
                <a href="/conversations" className="text-gray-700 hover:text-primary-600 transition-colors">Conversations</a>
                <a href="/profile" className="text-gray-700 hover:text-primary-600 transition-colors">Profile</a>
                <button className="btn-secondary text-sm">Settings</button>
              </nav>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Bar */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
              <div className="text-sm text-gray-600">New Matches</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gold-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-gold-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">2</div>
              <div className="text-sm text-gray-600">Active Conversations</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">92%</div>
              <div className="text-sm text-gray-600">Avg Compatibility</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Matchmaker Chat */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Matchmaker</h3>
                  <p className="text-gray-600 text-sm">Priya is here to help</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3 text-left">
                    <p className="text-sm text-gray-700">"I found 3 amazing matches for you this week! Each one shares your values and interests."</p>
                  </div>
                  <div className="bg-primary-600 text-white rounded-lg p-3 text-right ml-6">
                    <p className="text-sm">"That's great! Tell me about the first one."</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-left">
                    <p className="text-sm text-gray-700">"Perfect! Let me introduce you to {currentMatch?.name}. You both value family and share a passion for {currentMatch?.interests[0]?.toLowerCase()}. 💕"</p>
                  </div>
                </div>

                <button className="w-full btn-primary text-sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Priya
                </button>
              </div>
            </div>

            {/* Main Match Area */}
            <div className="lg:col-span-2">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Weekly Matches</h1>
                <p className="text-gray-600">Curated just for you based on deep compatibility</p>
              </div>

              {/* Filter Bar */}
              <div className="bg-white rounded-xl p-4 mb-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </button>
                  <div className="hidden sm:flex items-center space-x-2">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by location, profession..."
                      className="border-none focus:outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {currentMatchIndex + 1} of {matches.length} matches
                </div>
              </div>

              {/* Match Card */}
              {currentMatch ? (
                <div className="flex justify-center">
                  <MatchCard
                    match={currentMatch}
                    onLike={handleLike}
                    onPass={handlePass}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No more matches for now</h3>
                  <p className="text-gray-600 mb-6">Check back next week for new curated matches!</p>
                  <button className="btn-primary">
                    Chat with Your Matchmaker
                  </button>
                </div>
              )}

              {/* Navigation Dots */}
              {matches.length > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    {matches.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMatchIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentMatchIndex
                            ? 'bg-primary-600'
                            : index < currentMatchIndex
                            ? 'bg-gray-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
