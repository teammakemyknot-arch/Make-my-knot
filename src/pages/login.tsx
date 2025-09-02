import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Heart, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react'
import { useUser } from '@/lib/UserContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, isAuthenticated, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setIsSubmitting(false)
      return
    }

    try {
      const success = await login(email, password)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
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
        <title>Sign In - Make My Knot</title>
        <meta name="description" content="Sign in to your Make My Knot account to find your perfect life partner." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center mb-6">
              <Heart className="h-10 w-10 text-primary-600" />
              <span className="ml-2 text-3xl font-bold text-gray-900">Make My Knot</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to continue your journey to finding love</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="your@email.com"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="Your password"
                    required
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
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
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary-600 hover:text-primary-500 font-semibold">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 bg-gold-50 border border-gold-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gold-800 mb-2">Demo Account</h3>
            <p className="text-sm text-gold-700 mb-2">Try the platform with these credentials:</p>
            <div className="text-sm text-gold-700">
              <p><strong>Email:</strong> demo@makemyknot.com</p>
              <p><strong>Password:</strong> demo123</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
