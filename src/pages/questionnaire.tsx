import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Heart, ArrowLeft, ArrowRight, CheckCircle, Loader } from 'lucide-react'
import { useUser } from '@/lib/UserContext'

interface Question {
  id: string
  category: 'values' | 'lifestyle' | 'interests' | 'personality'
  type: 'multiple_choice' | 'scale' | 'checkbox'
  question: string
  options?: string[]
  scale?: { min: number; max: number; labels: string[] }
}

const questions: Question[] = [
  // Values (12 questions)
  {
    id: 'family_importance',
    category: 'values',
    type: 'scale',
    question: 'How important is family in your life?',
    scale: { min: 1, max: 5, labels: ['Not Important', 'Somewhat Important', 'Important', 'Very Important', 'Extremely Important'] }
  },
  {
    id: 'religious_beliefs',
    category: 'values',
    type: 'multiple_choice',
    question: 'How would you describe your religious or spiritual beliefs?',
    options: ['Very Religious', 'Moderately Religious', 'Spiritual but not Religious', 'Agnostic', 'Atheist', 'Prefer not to say']
  },
  {
    id: 'career_ambition',
    category: 'values',
    type: 'scale',
    question: 'How important is career success to you?',
    scale: { min: 1, max: 5, labels: ['Not Important', 'Somewhat Important', 'Important', 'Very Important', 'Extremely Important'] }
  },
  {
    id: 'financial_security',
    category: 'values',
    type: 'scale',
    question: 'How important is financial security in a relationship?',
    scale: { min: 1, max: 5, labels: ['Not Important', 'Somewhat Important', 'Important', 'Very Important', 'Extremely Important'] }
  },
  
  // Lifestyle (10 questions)
  {
    id: 'social_preference',
    category: 'lifestyle',
    type: 'multiple_choice',
    question: 'How would you describe your ideal weekend?',
    options: ['Quiet night at home', 'Small gathering with close friends', 'Going out to restaurants/movies', 'Large social events/parties', 'Outdoor activities', 'Cultural events (museums, theater)']
  },
  {
    id: 'exercise_frequency',
    category: 'lifestyle',
    type: 'multiple_choice',
    question: 'How often do you exercise?',
    options: ['Daily', '4-5 times a week', '2-3 times a week', 'Once a week', 'Rarely', 'Never']
  },
  {
    id: 'travel_frequency',
    category: 'lifestyle',
    type: 'multiple_choice',
    question: 'How often do you like to travel?',
    options: ['Multiple times per year', 'Once or twice a year', 'Every few years', 'Rarely', 'Never', 'Would like to travel more']
  },
  {
    id: 'living_situation',
    category: 'lifestyle',
    type: 'multiple_choice',
    question: 'What is your preferred living situation?',
    options: ['City center/Urban', 'Suburbs', 'Small town', 'Rural/Countryside', 'Near family', 'Open to different areas']
  },

  // Interests (8 questions)
  {
    id: 'hobbies',
    category: 'interests',
    type: 'checkbox',
    question: 'What are your main interests and hobbies? (Select all that apply)',
    options: ['Reading', 'Movies/TV', 'Music', 'Sports', 'Cooking', 'Travel', 'Art/Culture', 'Technology', 'Fitness', 'Photography', 'Gaming', 'Volunteering']
  },
  {
    id: 'entertainment_preference',
    category: 'interests',
    type: 'multiple_choice',
    question: 'What type of entertainment do you prefer?',
    options: ['Books and reading', 'Movies and shows', 'Live music/concerts', 'Theater and arts', 'Sports events', 'Video games', 'Podcasts/documentaries']
  },
  {
    id: 'learning_style',
    category: 'interests',
    type: 'multiple_choice',
    question: 'How do you prefer to learn new things?',
    options: ['Reading and research', 'Hands-on experience', 'Classes and workshops', 'Online courses', 'Learning from others', 'Trial and error']
  },

  // Personality (10 questions)
  {
    id: 'introversion_extroversion',
    category: 'personality',
    type: 'scale',
    question: 'How would you describe your social energy?',
    scale: { min: 1, max: 5, labels: ['Very Introverted', 'Somewhat Introverted', 'Balanced', 'Somewhat Extroverted', 'Very Extroverted'] }
  },
  {
    id: 'conflict_resolution',
    category: 'personality',
    type: 'multiple_choice',
    question: 'How do you typically handle disagreements?',
    options: ['Address immediately and directly', 'Take time to think then discuss', 'Avoid conflict when possible', 'Compromise and find middle ground', 'Stand firm on important issues', 'Seek outside perspective']
  },
  {
    id: 'emotional_expression',
    category: 'personality',
    type: 'scale',
    question: 'How comfortable are you expressing emotions?',
    scale: { min: 1, max: 5, labels: ['Very Reserved', 'Somewhat Reserved', 'Balanced', 'Somewhat Expressive', 'Very Expressive'] }
  },
  {
    id: 'decision_making',
    category: 'personality',
    type: 'multiple_choice',
    question: 'How do you make important decisions?',
    options: ['Quick and intuitive', 'Careful analysis and research', 'Seek advice from others', 'Follow my heart', 'Weigh pros and cons methodically', 'Go with what feels right']
  }
]

export default function Questionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, isAuthenticated, saveQuestionnaireResponse, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleResponse = (questionId: string, value: any) => {
    setResponses({
      ...responses,
      [questionId]: value
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateCompatibilityProfile = (responses: Record<string, any>) => {
    const profile = {
      values: [] as number[],
      lifestyle: [] as number[],
      interests: [] as number[],
      personality: [] as number[]
    }

    // Process each response and convert to numerical values
    Object.entries(responses).forEach(([questionId, value]) => {
      const question = questions.find(q => q.id === questionId)
      if (!question) return

      let numericValue = 0
      
      if (question.type === 'scale') {
        numericValue = value
      } else if (question.type === 'multiple_choice') {
        numericValue = question.options?.indexOf(value) || 0
      } else if (question.type === 'checkbox') {
        numericValue = Array.isArray(value) ? value.length : 0
      }

      profile[question.category].push(numericValue)
    })

    return profile
  }

  const handleSubmit = async () => {
    if (!user) return

    setIsSubmitting(true)
    
    const compatibilityProfile = calculateCompatibilityProfile(responses)
    
    const questionnaireResponse = {
      userId: user.id,
      responses,
      compatibilityProfile,
      completedAt: new Date().toISOString()
    }

    saveQuestionnaireResponse(questionnaireResponse)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    router.push('/dashboard')
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isLastQuestion = currentQuestion === questions.length - 1
  const canProceed = responses[currentQ.id] !== undefined

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

  return (
    <>
      <Head>
        <title>Compatibility Questionnaire - Make My Knot</title>
        <meta name="description" content="Complete our compatibility questionnaire to find your perfect matches." />
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
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Compatibility Assessment</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-primary-600 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
                  {currentQ.category.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentQ.question}
              </h2>
            </div>

            {/* Question Input */}
            <div className="space-y-4 mb-8">
              {currentQ.type === 'multiple_choice' && (
                <div className="space-y-3">
                  {currentQ.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleResponse(currentQ.id, option)}
                      className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                        responses[currentQ.id] === option
                          ? 'border-primary-600 bg-primary-50 text-primary-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          responses[currentQ.id] === option
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300'
                        }`}>
                          {responses[currentQ.id] === option && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentQ.type === 'scale' && currentQ.scale && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    {currentQ.scale.labels.map((label, index) => (
                      <button
                        key={index}
                        onClick={() => handleResponse(currentQ.id, index + 1)}
                        className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                          responses[currentQ.id] === index + 1
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full border-2 mb-2 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <span className="text-xs text-center font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentQ.type === 'checkbox' && (
                <div className="space-y-3">
                  {currentQ.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const current = responses[currentQ.id] || []
                        const updated = current.includes(option)
                          ? current.filter((item: string) => item !== option)
                          : [...current, option]
                        handleResponse(currentQ.id, updated)
                      }}
                      className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                        (responses[currentQ.id] || []).includes(option)
                          ? 'border-primary-600 bg-primary-50 text-primary-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                          (responses[currentQ.id] || []).includes(option)
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300'
                        }`}>
                          {(responses[currentQ.id] || []).includes(option) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              {currentQuestion > 0 ? (
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed || isSubmitting}
                  className="btn-gold px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Assessment
                      <Heart className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
