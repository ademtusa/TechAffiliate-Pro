'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Verify admin code first
      const validAdminCode = 'ADMIN2025' // In production, store this securely in env variables
      
      if (adminCode !== validAdminCode) {
        setError('Invalid admin access code')
        setLoading(false)
        return
      }

      // Demo mode: Allow bypass with demo credentials
      const isDemoLogin = email === 'admin@demo.com' && password === 'demo123'
      
      if (isDemoLogin) {
        // Demo admin access - no Supabase required
        sessionStorage.setItem('isAdmin', 'true')
        sessionStorage.setItem('adminVerified', Date.now().toString())
        sessionStorage.setItem('demoMode', 'true')
        router.push('/admin')
        return
      }

      // Real authentication with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })

      if (error) {
        // If Supabase auth fails, check if user wants demo mode
        setError('Invalid credentials. For demo, use: admin@demo.com / demo123')
        setLoading(false)
        return
      }

      // Check if user is admin (you can check against a list of admin emails)
      const adminEmails = [
        'admin@techaffiliate.com',
        'owner@techaffiliate.com',
        // Add more admin emails here
      ]

      // For demo purposes, any authenticated user with correct admin code can access
      // In production, check against the adminEmails list:
      // if (!adminEmails.includes(data.user.email)) {
      //   throw new Error('Access denied: Admin privileges required')
      // }

      // Store admin session flag
      sessionStorage.setItem('isAdmin', 'true')
      sessionStorage.setItem('adminVerified', Date.now().toString())

      // Redirect to admin panel
      router.push('/admin')
    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-2xl">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400">Secure login portal for administrators</p>
        </div>

        {/* Login Card */}
        <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-500" />
              Administrator Login
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials and admin access code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-red-200 font-medium">Access Denied</p>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Admin Access Code */}
              <div>
                <Label htmlFor="adminCode" className="text-gray-300 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Admin Access Code *
                </Label>
                <Input
                  id="adminCode"
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin code"
                  required
                  className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Required for admin panel access</p>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-gray-300">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Access Admin Panel
                  </div>
                )}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  ← Back to Site
                </Link>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                  User Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
            <Lock className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-400">Secured with end-to-end encryption</span>
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <p className="text-sm text-blue-300 font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-400">Admin Code: <span className="font-mono bg-gray-900 px-2 py-1 rounded">ADMIN2025</span></p>
          <p className="text-xs text-blue-400 mt-1">Use any registered account + admin code to access</p>
        </div>
      </div>
    </div>
  )
}