import Head from 'next/head'
import { useState } from 'react'
import { Heart, ArrowRight, ArrowLeft, MessageCircle, User, MapPin, GraduationCap, Briefcase } from 'lucide-react'

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Background', icon: GraduationCap },
  { id: 4, title: 'Preferences', icon: Heart },
  { id: 5, title: 'Chat Setup', icon: MessageCircle },
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    location: '',
    education: '',
    profession: '',
    interests: '',
    values: '',
    partnerPreferences: '',
    communicationStyle: 'chat'
  })

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <Head>
        <title>Create Your Profile - Make My Knot</title>
        <meta name="description" content="Create your profile to start your journey to finding your perfect life partner." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Make My Knot</span>
              </div>
              <div className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}
              </div>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isCompleted = currentStep > step.id
                const isCurrent = currentStep === step.id
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted 
                        ? 'bg-primary-600 border-primary-600 text-white' 
                        : isCurrent 
                        ? 'border-primary-600 text-primary-600 bg-white'
                        : 'border-gray-300 text-gray-400 bg-white'
                    }`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`ml-4 w-12 h-0.5 ${
                        isCompleted ? 'bg-primary-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's start with the basics</h2>
                  <p className="text-gray-600">Tell us a little about yourself</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => updateFormData('age', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      placeholder="Your age"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Where are you located?</h2>
                  <p className="text-gray-600">We'll help you find matches in your area</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City, State/Country</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="e.g., Mumbai, India or New York, NY"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Background */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your background</h2>
                  <p className="text-gray-600">Your education and career help us understand compatibility</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                  <textarea
                    value={formData.education}
                    onChange={(e) => updateFormData('education', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    rows={3}
                    placeholder="Tell us about your educational background..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                  <textarea
                    value={formData.profession}
                    onChange={(e) => updateFormData('profession', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    rows={3}
                    placeholder="What do you do for work? What are you passionate about?"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">What matters most to you?</h2>
                  <p className="text-gray-600">Help us understand your values and what you're looking for</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Values & Interests</label>
                  <textarea
                    value={formData.values}
                    onChange={(e) => updateFormData('values', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    rows={4}
                    placeholder="Tell us about your values, hobbies, and what makes you happy. Be honest and specific..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What you're looking for in a partner</label>
                  <textarea
                    value={formData.partnerPreferences}
                    onChange={(e) => updateFormData('partnerPreferences', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    rows={4}
                    placeholder="Describe your ideal life partner. What qualities and values are most important to you?"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Communication Setup */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">How would you like to connect?</h2>
                  <p className="text-gray-600">Choose how you'd prefer to communicate with your matchmaker</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <button
                    onClick={() => updateFormData('communicationStyle', 'chat')}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${
                      formData.communicationStyle === 'chat'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <MessageCircle className="h-8 w-8 text-primary-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Continue via chat 💬</h3>
                    <p className="text-gray-600 text-sm">Chat with your matchmaker at your own pace</p>
                  </button>
                  
                  <button
                    onClick={() => updateFormData('communicationStyle', 'call')}
                    className={`p-6 border-2 rounded-lg text-left transition-all ${
                      formData.communicationStyle === 'call'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-3">☎️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Switch to a phone call</h3>
                    <p className="text-gray-600 text-sm">Have a personal conversation with your matchmaker</p>
                  </button>
                </div>

                <div className="bg-primary-50 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">🎉 You're all set!</h3>
                  <p className="text-gray-700">
                    Your matchmaker will review your profile and reach out within 24 hours to start finding your perfect matches.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < steps.length ? (
                <button
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              ) : (
                <button className="btn-gold">
                  Complete Setup
                  <Heart className="ml-2 h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
