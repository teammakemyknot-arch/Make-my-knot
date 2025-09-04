import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface FormData {
  email: string;
}

interface ResetResponse {
  success: boolean;
  message: string;
  resetToken?: string;
}

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'sent' | 'error'>('email');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock API response - replace with actual API call
      const response: ResetResponse = {
        success: true,
        message: 'Password reset link has been sent to your email',
        resetToken: 'mock-reset-token-123'
      };

      if (response.success) {
        setStep('sent');
        setMessage(response.message);
      } else {
        setStep('error');
        setMessage(response.message || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setStep('error');
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage('Reset email sent again! Check your inbox.');
    } catch (error) {
      setMessage('Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <div className="fade-in">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`input-field ${errors.email ? 'input-error' : ''}`}
            placeholder="Enter your email address"
            disabled={loading}
            autoFocus
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <>
              <div className="loading-spinner w-5 h-5 mr-2" />
              Sending Reset Link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link 
          href="/auth/signin" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );

  const renderSentStep = () => (
    <div className="fade-in text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We've sent a password reset link to <strong>{formData.email}</strong>
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
          <div className="text-sm">
            <p className="text-blue-800 font-medium">Link expires in 15 minutes</p>
            <p className="text-blue-600 mt-1">
              Don't forget to check your spam folder if you don't see the email.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleResendEmail}
          disabled={loading}
          className="btn-secondary w-full"
        >
          {loading ? (
            <>
              <div className="loading-spinner w-5 h-5 mr-2" />
              Resending...
            </>
          ) : (
            'Resend Email'
          )}
        </button>

        <Link 
          href="/auth/signin"
          className="btn-ghost w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Link>
      </div>

      {message && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{message}</p>
        </div>
      )}
    </div>
  );

  const renderErrorStep = () => (
    <div className="fade-in text-center">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message || 'We couldn\'t send the reset email. Please try again.'}
      </p>

      <div className="space-y-4">
        <button
          onClick={() => setStep('email')}
          className="btn-primary w-full"
        >
          Try Again
        </button>

        <Link 
          href="/auth/signin"
          className="btn-ghost w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card p-8">
          {step === 'email' && renderEmailStep()}
          {step === 'sent' && renderSentStep()}
          {step === 'error' && renderErrorStep()}
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? {' '}
            <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
