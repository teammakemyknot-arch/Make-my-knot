import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Users, MessageCircle, CheckCircle, Star, ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Footer from '@/components/Footer'
import LeadQuestionnaire from '@/components/LeadQuestionnaire'
import BrandLogo from '@/components/BrandLogo'
import { useState, useEffect } from 'react'

// Couple Slider Component
function CoupleSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const couples = [
    {
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop',
      names: 'Rajesh & Priya',
      story: 'Matched in Mumbai, married in 2023',
      quote: 'Make My Knot helped us find each other when we least expected it!'
    },
    {
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop',
      names: 'Arjun & Kavya',
      story: 'Connected through shared values, engaged in 2024',
      quote: 'The AI matching was incredibly accurate. We share the same life goals!'
    },
    {
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop',
      names: 'Vikram & Sneha',
      story: 'Long-distance match, now living together in Delhi',
      quote: 'Distance was no barrier when you find your soulmate!'
    },
    {
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
      names: 'Rohit & Ananya',
      story: 'Both doctors, found love through compatibility',
      quote: 'We understood each other instantly. Perfect match!'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % couples.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % couples.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + couples.length) % couples.length)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Happy Couples</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Over 50,000 couples have found love through Make My Knot. Here are some of their beautiful stories.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {couples.map((couple, index) => (
                <div key={index} className="w-full flex-shrink-0 relative">
                  <div className="relative h-96">
                    <Image
                      src={couple.image}
                      alt={couple.names}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">{couple.names}</h3>
                      <p className="text-lg mb-2 text-gray-200">{couple.story}</p>
                      <p className="text-sm italic text-gray-300">"{couple.quote}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {couples.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-primary-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section Component
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      age: '28, Marketing Manager',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=faces',
      quote: 'I was skeptical about online matchmaking, but Make My Knot changed my perspective completely. The AI understood my preferences better than I did myself!',
      rating: 5
    },
    {
      name: 'Arjun Patel',
      age: '31, Software Engineer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      quote: 'The quality of matches was exceptional. Every profile I received was thoughtfully curated. Found my life partner within 3 months!',
      rating: 5
    },
    {
      name: 'Kavya Reddy',
      age: '26, Doctor',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
      quote: 'The personalized approach made all the difference. My matchmaker understood my busy schedule and found someone who truly complements my lifestyle.',
      rating: 5
    },
    {
      name: 'Rohit Gupta',
      age: '29, Financial Analyst',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      quote: 'Professional, efficient, and results-driven. The team at Make My Knot goes above and beyond to ensure successful matches.',
      rating: 5
    }
  ]

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Members Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our successful members have to say about their experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.age}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="h-6 w-6 text-primary-200 absolute -top-2 -left-2" />
                <p className="text-gray-700 italic pl-4">"{testimonial.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Make My Knot - AI-Powered Wedding Matchmaking</title>
        <meta name="description" content="Find your perfect life partner with our AI-powered matchmaking platform. Quality matches, compatibility-based pairing, and personalized service." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="absolute w-full z-10 top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <BrandLogo size="md" className="mr-2" />
                <span className="text-2xl font-bold text-gray-900">Make My Knot</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">How It Works</a>
                <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">Our Story</Link>
                <a href="#testimonials" className="text-gray-700 hover:text-primary-600 transition-colors">Success Stories</a>
                <Link href="/login" className="btn-secondary text-sm">Sign In</Link>
                <Link href="/signup" className="btn-primary text-sm">Get Started</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-gold-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Quick Questionnaire */}
              <div className="order-2 lg:order-1">
                <LeadQuestionnaire />
              </div>

              {/* Right Side - Content */}
              <div className="text-center lg:text-left order-1 lg:order-2">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Meet Your <span className="text-primary-600">Perfect</span><br />
                  Life Partner
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  75 years of matchmaking expertise now powered by AI. We understand your values, lifestyle, and what truly matters to you.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link href="/about" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
                    Our Story
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>91% success rate</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-gold-500 mr-2" />
                    <span>4.9/5 rating</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary-600 mr-2" />
                    <span>50,000+ happy couples</span>
                  </div>
                </div>

                {/* Webinar Announcement */}
                <div className="mt-8 p-4 bg-gold-50 border border-gold-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-semibold text-gold-800 uppercase">Live This Week</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Relationship Mastery Webinar</h3>
                  <p className="text-sm text-gray-700 mb-3">Join our expert therapists for insights on building lasting relationships</p>
                  <Link href="/webinars" className="btn-primary text-sm px-4 py-2">
                    Register Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How Make My Knot Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our intelligent matching process ensures you meet people who truly align with your values and life goals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Meet Your Matchmaker</h3>
                <p className="text-gray-600">
                  Have a conversation with your AI matchmaker about your values, lifestyle, and what you're looking for in a life partner.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-gold-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Curated Matches</h3>
                <p className="text-gray-600">
                  Receive 3-5 carefully selected profiles each week, chosen based on deep compatibility rather than just photos.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Connect & Meet</h3>
                <p className="text-gray-600">
                  When both parties are interested, your matchmaker introduces you personally and helps facilitate your first meeting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Happy Couples Slider */}
        <CoupleSlider />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl opacity-70"></div>
          
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6 text-shadow-lg">
              Ready to Find Your
              <span className="block mt-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Life Partner?</span>
            </h2>
            <p className="text-xl text-slate-200 mb-8">
              Join thousands of people who have found meaningful relationships through our premium matchmaking platform.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
