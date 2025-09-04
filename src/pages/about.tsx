import Head from 'next/head'
import Link from 'next/link'
import { Heart, Clock, Users, Award, ArrowRight, CheckCircle } from 'lucide-react'
import Footer from '@/components/Footer'

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Make My Knot | 50 Years of Matchmaking Excellence</title>
        <meta name="description" content="Discover our 5 Decades of legacy of bringing couples together. From traditional matchmaking to AI-powered compatibility, we've evolved while keeping love at our core." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href="/" className="flex items-center">
                <Heart className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Make My Knot</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">How It Works</Link>
                <Link href="/webinars" className="text-gray-700 hover:text-primary-600 transition-colors">Webinars</Link>
                <Link href="/login" className="btn-secondary text-sm">Sign In</Link>
                <Link href="/signup" className="btn-primary text-sm">Get Started</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-gold-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <Clock className="h-12 w-12 text-primary-600 mr-4" />
              <span className="text-4xl font-bold text-primary-600">50 Years</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              A Legacy of <span className="text-primary-600">Love Stories</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Since 1975, we've been India's most trusted matchmaking family. What started as a traditional 
              matrimonial service in post-independence India has evolved into a technology-powered platform in 2025, 
              but our commitment to meaningful connections remains unchanged across three generations.
            </p>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey Through Time</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From handwritten letters to AI algorithms, we've adapted with the times while preserving the human touch
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200"></div>

              {/* Timeline items */}
              <div className="space-y-12">
                {/* 1950 */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="text-2xl font-bold text-gray-900">1950</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">The Foundation</h4>
                    <p className="text-gray-600">
                      Where Matches Are Made With Mannat, Not Just Metrics.
At Goyal Marriage Bureau, every rishta is more than a profile —
it’s someone’s dream, someone’s trust, someone’s family.
                    </p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* 1985s */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8">
                    <h3 className="text-2xl font-bold text-gray-900">1985</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Second Generation</h4>
                    <p className="text-gray-600">
                      Over time, his legacy passed on to his son, Shri Anil Goyal, who has dedicated the last 16+ years to nurturing this mission with extra effort, unmatched care, and deep emotional understanding.
                    </p>
                  </div>
                </div>

                {/* 1990s */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="text-2xl font-bold text-gray-900">1995</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Digital Revolution</h4>
                    <p className="text-gray-600">
                      Where others saw just biodata — he saw human stories.
Where others offered options — he offered guidance, intuition, and trust.
                    </p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* 2005 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8">
                    <h3 className="text-2xl font-bold text-gray-900">2005</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Notepad & Platform</h4>
                    <p className="text-gray-600">
                      With nothing but handwritten diaries and heartfelt conversations, he helped unite 1000+ couples, with one simple belief: “Shaadi ek event nahi — ek zindagi bhar ka saath hota hai.”
                    </p>
                  </div>
                </div>

                {/* 2015 */}
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <h3 className="text-2xl font-bold text-gray-900">2015</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">Third Generation Leadership</h4>
                    <p className="text-gray-600">
                      Maulik Goel  joined as CEO, bringing fresh perspective on technology integration A Third Generation
                      while preserving traditional matchmaking wisdom. Expanded internationally to serve NRI community.
                    </p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8"></div>
                </div>

                {/* 2025 */}
                <div className="relative flex items-center">
                  <div className="flex-1 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gold-600 rounded-full border-4 border-white"></div>
                  <div className="flex-1 pl-8">
                    <h3 className="text-2xl font-bold text-gray-900">2025</h3>
                    <h4 className="text-lg font-semibold text-primary-600 mb-2">AI-Powered Future</h4>
                    <p className="text-gray-600">
                      Under Maulik's leadership, launched "Make My Knot" - combining 50 years of matchmaking expertise 
                      with advanced AI, machine learning, and modern dating sensibilities for today's generation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership</h2>
              <p className="text-xl text-gray-600">Third generation leadership driving innovation while preserving tradition</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <div className="text-6xl font-bold text-primary-600">MG</div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Maulik Goel</h3>
                  <div className="text-lg text-primary-600 font-semibold mb-4">Chief Executive Officer</div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    As the third-generation leader of the Goel family legacy, Maulik brings together traditional matchmaking 
                    wisdom with cutting-edge technology. Armed with an MBA from IIM Ahmedabad and a passion for innovation, 
                    he has transformed our 75-year-old family business into India's most sophisticated AI-powered matchmaking platform.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong className="text-gray-900">Education:</strong><br />
                      MBA, IIM Ahmedabad<br />
                      B.Tech, IIT Delhi
                    </div>
                    <div>
                      <strong className="text-gray-900">Experience:</strong><br />
                      10+ years in Technology<br />
                      5+ years leading Make My Knot
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact Over 50 Years</h2>
              <p className="text-xl text-gray-600">Numbers that tell our story of success</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-2">20,000+</div>
                <div className="text-lg text-gray-900 font-semibold mb-2">Happy Couples</div>
                <div className="text-gray-600">Marriages facilitated since 1975</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-2">89%</div>
                <div className="text-lg text-gray-900 font-semibold mb-2">Success Rate</div>
                <div className="text-gray-600">Of our matches lead to marriage</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-2">75,000+</div>
                <div className="text-lg text-gray-900 font-semibold mb-2">Children Born</div>
                <div className="text-gray-600">Next generation from our matches</div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-2">4.8★</div>
                <div className="text-lg text-gray-900 font-semibold mb-2">Client Rating</div>
                <div className="text-gray-600">Average satisfaction score</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-600">What guides us in every match we make</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Authentic Connections</h3>
                <p className="text-gray-600">
                  We believe in deep, meaningful relationships built on genuine compatibility, 
                  not superficial attractions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Over Quantity</h3>
                <p className="text-gray-600">
                  We focus on finding the right person, not just more options. 
                  Every match is carefully curated for compatibility.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Service</h3>
                <p className="text-gray-600">
                  Despite our technology, we maintain the personal touch that has made us 
                  successful for seven decades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Be Part of Our Story?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands who have found love through 75 years of proven matchmaking expertise, 
              now enhanced with the latest AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-gold text-lg px-8 py-4 inline-flex items-center justify-center">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/webinars" className="btn-secondary bg-white text-primary-600 text-lg px-8 py-4 inline-flex items-center justify-center">
                Join Our Webinars
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
