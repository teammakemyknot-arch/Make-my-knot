import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Heart, Mail, Lock, Eye, EyeOff, User, Phone, Loader } from 'lucide-react'
import { useUser } from '@/lib/UserContext'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signup, isAuthenticated, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all fields')
      setIsSubmitting(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsSubmitting(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      const success = await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
      
      if (success) {
        router.push('/onboarding')
      } else {
        setError('An account with this email already exists')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Sign Up - Make My Knot</title>
        <meta name="description" content="Join Make My Knot to find your perfect life partner through AI-powered matchmaking." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-primary-600" />
              <span className="ml-2 text-3xl font-bold text-gray-900">Make My Knot</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Make My Knot</h1>
            <p className="text-gray-600">Start your journey to finding your perfect life partner</p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="Create a strong password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300 rounded mt-1"
                  required
                />
                <label className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-500 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
