'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HomeIcon, FileText, Library, Sparkles, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    checkUser()
    
    // Scroll listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      setUser(data.user)
      setAuthOpen(false)
      setEmail('')
      setPassword('')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      
      alert('Check your email for the confirmation link!')
      setAuthOpen(false)
      setEmail('')
      setPassword('')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-500 ${
      scrolled 
        ? 'bg-white/5 backdrop-blur-xl border-white/20 shadow-2xl' 
        : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-100 shadow-lg'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2 group">
              <Sparkles className={`h-6 w-6 transition-colors ${scrolled ? 'text-blue-600 drop-shadow-[0_2px_4px_rgba(37,99,235,0.5)]' : 'text-blue-600'} group-hover:text-indigo-600`} />
              <h1 className={`text-2xl font-bold ${scrolled ? 'text-blue-700 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]' : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'}`}>
                TechAffiliate Pro
              </h1>
            </Link>
            <div className="hidden md:flex space-x-2">
              <Link href="/" className={`group relative px-4 py-2 flex items-center gap-2 transition-all rounded-lg hover:bg-white/60 ${scrolled ? 'text-gray-800 hover:text-blue-700 drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)]' : 'text-gray-700 hover:text-blue-600'}`}>
                <HomeIcon className="h-4 w-4" />
                <span className="font-medium">Home</span>
                <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
              </Link>
              <Link href="/blog" className={`group relative px-4 py-2 flex items-center gap-2 transition-all rounded-lg hover:bg-white/60 ${scrolled ? 'text-gray-800 hover:text-blue-700 drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)]' : 'text-gray-700 hover:text-blue-600'}`}>
                <FileText className="h-4 w-4" />
                <span className="font-medium">Products</span>
                <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
              </Link>
              <Link href="/resources" className={`group relative px-4 py-2 flex items-center gap-2 transition-all rounded-lg hover:bg-white/60 ${scrolled ? 'text-gray-800 hover:text-blue-700 drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)]' : 'text-gray-700 hover:text-blue-600'}`}>
                <Library className="h-4 w-4" />
                <span className="font-medium">Resources</span>
                <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
              </Link>
              <Link href="/contact" className={`group relative px-4 py-2 flex items-center gap-2 transition-all rounded-lg hover:bg-white/60 ${scrolled ? 'text-gray-800 hover:text-blue-700 drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)]' : 'text-gray-700 hover:text-blue-600'}`}>
                <User className="h-4 w-4" />
                <span className="font-medium">Contact</span>
                <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
              </Link>
              {user && (
                <Link href="/dashboard" className={`group relative px-4 py-2 flex items-center gap-2 transition-all rounded-lg hover:bg-white/60 ${scrolled ? 'text-gray-800 hover:text-blue-700 drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)]' : 'text-gray-700 hover:text-blue-600'}`}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="font-medium">Dashboard</span>
                  <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="hover:bg-white/60">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-white/60">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Dialog open={authOpen} onOpenChange={setAuthOpen}>
                <DialogTrigger asChild>
                  <Button className="hidden md:flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200">
                  <DialogHeader className="space-y-3">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <DialogTitle className="text-2xl text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Welcome to TechAffiliate Pro
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                      Sign in to access exclusive deals and reviews
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs defaultValue="signin" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-2 bg-white/60 p-1">
                      <TabsTrigger 
                        value="signin" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger 
                        value="signup"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="signin" className="mt-6">
                      <form onSubmit={handleSignIn} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 bg-white/80 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 bg-white/80 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                          />
                        </div>
                        {authError && (
                          <div className="p-3 rounded-lg bg-red-50 border-2 border-red-200">
                            <p className="text-sm text-red-600 flex items-center gap-2">
                              <span className="text-red-500">⚠</span>
                              {authError}
                            </p>
                          </div>
                        )}
                        <Button 
                          type="submit" 
                          className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all font-semibold" 
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin">⏳</span>
                              Signing in...
                            </span>
                          ) : (
                            'Sign In'
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="signup" className="mt-6">
                      <form onSubmit={handleSignUp} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email Address</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 bg-white/80 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-gray-700 font-medium">Password</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 bg-white/80 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                          />
                          <p className="text-xs text-gray-500">Minimum 6 characters required</p>
                        </div>
                        {authError && (
                          <div className="p-3 rounded-lg bg-red-50 border-2 border-red-200">
                            <p className="text-sm text-red-600 flex items-center gap-2">
                              <span className="text-red-500">⚠</span>
                              {authError}
                            </p>
                          </div>
                        )}
                        <Button 
                          type="submit" 
                          className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all font-semibold" 
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin">⏳</span>
                              Creating account...
                            </span>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                        <p className="text-xs text-center text-gray-500">
                          By signing up, you agree to our Terms of Service
                        </p>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-2 bg-white/80 rounded-lg mt-2 p-3">
            <Link href="/" className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded px-3 transition-all">
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>
            <Link href="/blog" className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded px-3 transition-all">
              <FileText className="h-4 w-4" />
              Products
            </Link>
            <Link href="/resources" className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded px-3 transition-all">
              <Library className="h-4 w-4" />
              Resources
            </Link>
            <Link href="/contact" className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded px-3 transition-all">
              <User className="h-4 w-4" />
              Contact
            </Link>
            {user && (
              <Link href="/dashboard" className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded px-3 transition-all">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
