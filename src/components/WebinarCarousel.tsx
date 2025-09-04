import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, Star, ArrowRight } from 'lucide-react'

interface Webinar {
  id: string
  title: string
  speaker: {
    name: string
    image: string
    rating: number
  }
  date: string
  time: string
  price: string
  attendees: number
  maxAttendees: number
  category: 'couples' | 'marriage' | 'therapy' | 'relationship'
  isPopular?: boolean
}

const featuredWebinars: Webinar[] = [
  {
    id: '1',
    title: 'Building Stronger Marriages: Communication That Works',
    speaker: {
      name: 'Dr. Priya Sharma',
      image: '/api/placeholder/60/60',
      rating: 4.9
    },
    date: 'March 25',
    time: '7:00 PM',
    price: 'Free',
    attendees: 180,
    maxAttendees: 200,
    category: 'marriage',
    isPopular: true
  },
  {
    id: '2',
    title: 'Pre-Marriage Counseling: Starting Right Together',
    speaker: {
      name: 'Dr. Rajesh Mehta',
      image: '/api/placeholder/60/60',
      rating: 4.8
    },
    date: 'March 28',
    time: '8:00 PM',
    price: '₹299',
    attendees: 95,
    maxAttendees: 150,
    category: 'couples'
  },
  {
    id: '3',
    title: 'Love Languages: Speaking Your Partner\'s Heart',
    speaker: {
      name: 'Dr. Kavita Patel',
      image: '/api/placeholder/60/60',
      rating: 4.7
    },
    date: 'April 2',
    time: '7:30 PM',
    price: 'Free',
    attendees: 120,
    maxAttendees: 180,
    category: 'relationship'
  },
  {
    id: '4',
    title: 'Arranged Marriages: Making Modern Connections Work',
    speaker: {
      name: 'Mrs. Sunita Agarwal',
      image: '/api/placeholder/60/60',
      rating: 4.8
    },
    date: 'April 5',
    time: '8:00 PM',
    price: '₹399',
    attendees: 205,
    maxAttendees: 250,
    category: 'marriage',
    isPopular: true
  }
]

export default function WebinarCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visibleWebinars, setVisibleWebinars] = useState(2)

  useEffect(() => {
    const updateVisibleWebinars = () => {
      if (window.innerWidth < 768) {
        setVisibleWebinars(1)
      } else if (window.innerWidth < 1024) {
        setVisibleWebinars(2)
      } else {
        setVisibleWebinars(3)
      }
    }

    updateVisibleWebinars()
    window.addEventListener('resize', updateVisibleWebinars)
    return () => window.removeEventListener('resize', updateVisibleWebinars)
  }, [])

  const maxSlides = Math.max(0, featuredWebinars.length - visibleWebinars)

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlides))
  }

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'marriage': return 'bg-primary-100 text-primary-700'
      case 'couples': return 'bg-gold-100 text-gold-700'
      case 'therapy': return 'bg-green-100 text-green-700'
      case 'relationship': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Upcoming Webinars</h3>
          <p className="text-gray-600">Learn from relationship experts</p>
        </div>
        <Link href="/webinars" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center">
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        {maxSlides > 0 && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                currentSlide === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white shadow-md text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={nextSlide}
              disabled={currentSlide >= maxSlides}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                currentSlide >= maxSlides
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white shadow-md text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ 
              transform: `translateX(-${currentSlide * (100 / visibleWebinars)}%)`,
              width: `${(featuredWebinars.length / visibleWebinars) * 100}%`
            }}
          >
            {featuredWebinars.map((webinar) => (
              <div 
                key={webinar.id} 
                className="px-2"
                style={{ width: `${100 / featuredWebinars.length}%` }}
              >
                <div className="bg-gray-50 rounded-xl p-4 h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(webinar.category)}`}>
                          {webinar.category}
                        </span>
                        {webinar.isPopular && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            🔥 Popular
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                        {webinar.title}
                      </h4>
                    </div>
                    <div className="ml-2 text-right">
                      <div className="font-bold text-primary-600 text-sm">{webinar.price}</div>
                    </div>
                  </div>

                  {/* Speaker */}
                  <div className="flex items-center mb-4">
                    <img 
                      src={webinar.speaker.image} 
                      alt={webinar.speaker.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="ml-2 flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-xs truncate">{webinar.speaker.name}</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{webinar.speaker.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-xs">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      <span>{webinar.date}</span>
                      <Clock className="h-3 w-3 mr-1.5 ml-3" />
                      <span>{webinar.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs">
                      <Users className="h-3 w-3 mr-1.5" />
                      <span>{webinar.attendees}/{webinar.maxAttendees} registered</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-primary-600 h-1.5 rounded-full" 
                        style={{ width: `${(webinar.attendees / webinar.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Register Button */}
                  <Link
                    href={`/webinars?register=${webinar.id}`}
                    className={`w-full py-2 px-4 rounded-lg font-medium text-xs transition-colors flex items-center justify-center ${
                      webinar.attendees >= webinar.maxAttendees
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {webinar.attendees >= webinar.maxAttendees ? (
                      'Fully Booked'
                    ) : (
                      <>
                        Register
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {maxSlides > 0 && (
          <div className="flex justify-center space-x-1 mt-4">
            {Array.from({ length: maxSlides + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
