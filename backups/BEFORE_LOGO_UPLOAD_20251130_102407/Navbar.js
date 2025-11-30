'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { HomeIcon, FileText, Library, User, LogOut, LayoutDashboard, Menu, X, Shield } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import UsefulioLogo from '@/components/UsefulioLogo'

export default function Navbar() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState({
    site_name: 'Usefulio',
    site_tagline: 'Find What\'s Actually Useful',
    logo_url: ''
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const isAdmin = session?.user?.role === 'admin'

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-500 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-2xl border-blue-100 shadow-lg' 
        : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-100 shadow-lg'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-3 group">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="h-10 w-10 object-contain" />
              ) : (
                <UsefulioLogo />
              )}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {settings.site_name}
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-2">
              <Link href="/" className={`group relative px-4 py-2 flex items-center gap-2 transition-all rounded-lg hover:bg-white/60 ${scrolled ? 'text-gray-800 hover:text-blue-700' : 'text-gray-700 hover:text-blue-600'}`}>
                <HomeIcon className="h-4 w-4" />
                <span className="font-medium">Home</span>
                <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
              </Link>
              <Link href="/products" className={`group relative px-4 py-2 flex items-center gap-2 transition-all rounded-lg hover:bg-white/60 ${scrolled ? 'text-gray-800 hover:text-blue-700' : 'text-gray-700 hover:text-blue-600'}`}>
                <FileText className="h-4 w-4" />
                <span className="font-medium">Products</span>
                <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
              </Link>
              <Link href="/resources" className={`group relative px-4 py-2 flex items-center gap-2 transition-all rounded-lg hover:bg-white/60 ${scrolled ? 'text-gray-800 hover:text-blue-700' : 'text-gray-700 hover:text-blue-600'}`}>
                <Library className="h-4 w-4" />
                <span className="font-medium">Resources</span>
                <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
              </Link>
              <Link href="/contact" className={`group relative px-4 py-2 flex items-center gap-2 transition-all rounded-lg hover:bg-white/60 ${scrolled ? 'text-gray-800 hover:text-blue-700' : 'text-gray-700 hover:text-blue-600'}`}>
                <User className="h-4 w-4" />
                <span className="font-medium">Contact</span>
                <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
              </Link>
            </div>
          </div>

          {/* Right Side - Auth Buttons */}
          <div className="flex items-center space-x-4">
            {status === 'authenticated' ? (
              <div className="hidden md:flex items-center space-x-3">
                {isAdmin && (
                  <Link href="/admin-panel">
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Link href={isAdmin ? '/admin-panel' : '/dashboard'}>
                  <Button variant="ghost" size="sm" className="hover:bg-white/60">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-white/60">
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış Yap
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                    <User className="h-4 w-4 mr-2" />
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
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
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t pt-4">
            <Link href="/" className="block px-4 py-2 rounded-lg hover:bg-white/60 transition-all">
              <div className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </div>
            </Link>
            <Link href="/products" className="block px-4 py-2 rounded-lg hover:bg-white/60 transition-all">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Products</span>
              </div>
            </Link>
            <Link href="/resources" className="block px-4 py-2 rounded-lg hover:bg-white/60 transition-all">
              <div className="flex items-center gap-2">
                <Library className="h-4 w-4" />
                <span>Resources</span>
              </div>
            </Link>
            <Link href="/contact" className="block px-4 py-2 rounded-lg hover:bg-white/60 transition-all">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Contact</span>
              </div>
            </Link>

            <div className="border-t pt-2 mt-2">
              {status === 'authenticated' ? (
                <>
                  {isAdmin && (
                    <Link href="/admin-panel" className="block">
                      <Button variant="outline" size="sm" className="w-full mb-2 border-red-300 text-red-600">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Link href={isAdmin ? '/admin-panel' : '/dashboard'} className="block">
                    <Button variant="outline" size="sm" className="w-full mb-2">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block mb-2">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                      <User className="h-4 w-4 mr-2" />
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button variant="outline" className="w-full">
                      Kayıt Ol
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
