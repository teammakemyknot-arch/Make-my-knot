import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Users, MessageCircle, CheckCircle, Star, ArrowRight } from 'lucide-react'
import Footer from '@/components/Footer'
import LeadQuestionnaire from '@/components/LeadQuestionnaire'

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
                <Heart className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Make My Knot</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">How It Works</a>
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
              {/* Left Side - Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Meet Your <span className="text-primary-600">Perfect</span><br />
                  Life Partner
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Skip the endless swiping. Our AI matchmaker understands your values, lifestyle, and what truly matters to you—delivering 3-5 handpicked matches each week who are genuinely compatible.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <a href="#how-it-works" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
                    Learn More
                  </a>
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
                    <span>10,000+ happy couples</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Visual */}
              <div className="relative">
                <div className="relative w-full max-w-lg mx-auto">
                  {/* Main card mockup */}
                  <div className="bg-white rounded-2xl shadow-2xl p-6 relative z-10">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Heart className="h-10 w-10 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Your AI Matchmaker</h3>
                      <p className="text-gray-600 text-sm">Priya is here to help</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3 text-left">
                        <p className="text-sm text-gray-700">"Tell me about your ideal life partner..."</p>
                      </div>
                      <div className="bg-primary-600 text-white rounded-lg p-3 text-right ml-8">
                        <p className="text-sm">"I value family, spirituality, and someone who shares my love for travel"</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-left">
                        <p className="text-sm text-gray-700">"Perfect! I have 3 compatible matches for you this week 💕"</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center z-0">
                    <Star className="h-8 w-8 text-gold-600" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center z-0">
                    <MessageCircle className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mini Lead Questionnaire Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Start free today</h2>
                <p className="text-lg text-gray-600 mb-6">Answer a few quick questions and we'll reach out with handpicked, compatible matches.</p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>No credit card required</li>
                  <li>3-5 curated matches weekly</li>
                  <li>7-day free features, then flexible monthly subscription</li>
                </ul>
              </div>
              <div>
                {/* @ts-expect-error Server bundle import */}
                {/* Lead questionnaire client component */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <LeadQuestionnaire />
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

        {/* CTA Section */}
        <section className="py-20 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Find Your Life Partner?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of people who have found meaningful relationships through our personalized matchmaking service.
            </p>
            <Link href="/signup" className="btn-gold text-lg px-8 py-4 inline-flex items-center justify-center">
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
