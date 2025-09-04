// Admin Dashboard Redirect
// This route redirects to the main admin panel to maintain consistency

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main admin panel
    router.push('/admin')
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to Admin Panel...</p>
      </div>
    </div>
  )
}
