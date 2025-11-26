'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Search, Star, TrendingUp, Eye, ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, Gift, BookOpen, Facebook, Twitter, Linkedin, Instagram, Youtube, Share2, Download, Home as HomeIcon, FileText, Library, Sparkles, ExternalLink, Shield, Globe } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StatsSection from '@/components/StatsSection'
import ProductSlider from '@/components/ProductSlider'
import TestimonialsSlider from '@/components/TestimonialsSlider'
import FeaturedProductCard from '@/components/FeaturedProductCard'

export default function Home() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authOpen, setAuthOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  // Product lists for sliders
  const [bestSellers, setBestSellers] = useState([])
  const [mostViewed, setMostViewed] = useState([])
  const [mostAddedToCart, setMostAddedToCart] = useState([])
  const [mostDownloads, setMostDownloads] = useState([])
  const [featuredProduct, setFeaturedProduct] = useState(null)

  useEffect(() => {
    checkUser()
    fetchCategories()
    fetchProductSliders()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.log('Auth check skipped - Supabase not available')
      setUser(null)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const result = await response.json()
      if (result.success && result.data) {
        setCategories(result.data)
      }
    } catch (error) {
      console.log('Categories fetch skipped')
      setCategories([])
    }
  }

  const fetchProductSliders = async () => {
    setLoading(true)
    try {
      // Fetch all products
      const response = await fetch('/api/products')
      const result = await response.json()
      
      if (result.success && result.data) {
        const allProducts = result.data
        
        // Best Sellers (sorted by sales_count)
        const bestsellers = [...allProducts].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
        setBestSellers(bestsellers)
        
        // Most Viewed (sorted by views)
        const viewed = [...allProducts].sort((a, b) => (b.views || 0) - (a.views || 0))
        setMostViewed(viewed)
        
        // Most Added to Cart (using sales_count as proxy)
        const cart = [...allProducts].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
        setMostAddedToCart(cart)
        
        // Most Downloads (using views as proxy for digital downloads)
        const downloads = [...allProducts].sort((a, b) => (b.views || 0) - (a.views || 0))
        setMostDownloads(downloads)

        // Featured Product (highest rated product)
        if (allProducts.length > 0) {
          const featured = [...allProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]
          setFeaturedProduct({
            ...featured,
            commission_rate: 15.5,
            reviews: 1247
          })
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setUser(data.user)
        setAuthOpen(false)
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { name }
          }
        })
        if (error) throw error
        alert('Check your email for the confirmation link!')
        setAuthOpen(false)
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery) {
      router.push(`/blog?search=${searchQuery}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 backdrop-blur-md border-b border-blue-100 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center gap-2 group">
                <Sparkles className="h-6 w-6 text-blue-600 group-hover:text-indigo-600 transition-colors" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TechAffiliate Pro
                </h1>
              </Link>
              <div className="hidden md:flex space-x-2">
                <Link href="/" className="group relative px-4 py-2 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all rounded-lg hover:bg-white/60">
                  <HomeIcon className="h-4 w-4" />
                  <span className="font-medium">Home</span>
                  <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
                </Link>
                <Link href="/blog" className="group relative px-4 py-2 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all rounded-lg hover:bg-white/60">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Review</span>
                  <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
                </Link>
                <Link href="/resources" className="group relative px-4 py-2 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all rounded-lg hover:bg-white/60">
                  <Library className="h-4 w-4" />
                  <span className="font-medium">Resources</span>
                  <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
                </Link>
                {user && (
                  <Link href="/dashboard" className="group relative px-4 py-2 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all rounded-lg hover:bg-white/60">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="font-medium">Dashboard</span>
                    <span className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-400 group-hover:animate-pulse transition-all"></span>
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
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
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{authMode === 'login' ? 'Welcome Back!' : 'Create Account'}</DialogTitle>
                      <DialogDescription>
                        {authMode === 'login' ? 'Sign in to access member benefits' : 'Join to get exclusive deals and free resources'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAuth} className="space-y-4">
                      {authMode === 'signup' && (
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        className="w-full"
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                      >
                        {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
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
                Review
              </Link>
              <Link href="/resources" className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded px-3 transition-all">
                <Library className="h-4 w-4" />
                Resources
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

      {/* Hero Section */}
      <section 
        className="relative py-8 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6">
              {/* Trust Badge */}
              <div>
                <Badge className="inline-flex bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm shadow-lg">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Trusted by 100K+ Affiliates Worldwide
                </Badge>
              </div>

              {/* Heading */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
                  Discover the Best Products{' '}
                  <span className="text-yellow-300">Worldwide</span>
                </h2>
                
                <p className="text-lg text-blue-50 leading-relaxed">
                  Compare, review, and find the perfect products with our global affiliate platform
                </p>
              </div>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch}>
                <div className="flex gap-3 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-2xl">
                  <Input
                    type="text"
                    placeholder="Search for products, tools, or services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-12 text-base bg-white/90 text-gray-900 border-0 shadow-sm"
                  />
                  <Button type="submit" size="lg" className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </form>

              {/* CTA Buttons & Rating */}
              <div className="flex items-center gap-4">
                {/* Explore Products - Same height as Search */}
                <Link href="/blog">
                  <Button className="h-12 bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all px-6 text-base">
                    Explore Products
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                {/* Start Earning Now - Same height as Search */}
                <Button variant="outline" className="h-12 bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 backdrop-blur-sm shadow-xl px-6 text-base">
                  Start Earning Now
                </Button>

                {/* Rating Badge - Same height as Search, extends to Featured Product */}
                <div className="flex-1 h-12 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-lg px-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3">
                  <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-white">4.9/5</span>
                    <span className="text-sm text-blue-100">Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Featured Product */}
            <div className="flex justify-center lg:justify-end">
              {featuredProduct ? (
                <div className="w-full max-w-md">
                  <FeaturedProductCard product={featuredProduct} />
                </div>
              ) : (
                <div className="w-full max-w-md h-[400px] bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Product Sliders */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Best Sellers Slider */}
            <ProductSlider 
              title="Best Sellers" 
              products={bestSellers} 
              icon={TrendingUp}
            />

            {/* Most Popular Slider */}
            <ProductSlider 
              title="Most Popular" 
              products={mostViewed} 
              icon={Star}
            />

            {/* Most Added to Cart Slider */}
            <ProductSlider 
              title="Most Added to Cart" 
              products={mostAddedToCart} 
              icon={ShoppingCart}
            />

            {/* Most Downloads Slider */}
            <ProductSlider 
              title="Most Downloads" 
              products={mostDownloads} 
              icon={Download}
            />
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      <TestimonialsSlider />

      {/* Stats Section */}
      <StatsSection />

      {/* Member Benefits Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <Gift className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-4xl font-bold mb-4">Exclusive Member Benefits</h3>
          <p className="text-xl mb-8">Join for free and get access to:</p>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Free E-books</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
              <Gift className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Exclusive Discounts</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Premium Guides</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Weekly Bonuses</p>
            </div>
          </div>
          {!user && (
            <Button size="lg" className="mt-8 bg-white text-purple-600 hover:bg-gray-100" onClick={() => setAuthOpen(true)}>
              Join Free Now
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">TechAffiliate Pro</h4>
              <p className="text-gray-400">Your trusted source for the best tech deals and reviews.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/blog" className="hover:text-white">Compare</Link></li>
                <li><Link href="/resources" className="hover:text-white">Resources</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-gray-400">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/blog?category=${cat.slug}`} className="hover:text-white">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                <Facebook className="h-6 w-6 cursor-pointer hover:text-blue-400" />
                <Twitter className="h-6 w-6 cursor-pointer hover:text-blue-300" />
                <Linkedin className="h-6 w-6 cursor-pointer hover:text-blue-500" />
                <Instagram className="h-6 w-6 cursor-pointer hover:text-pink-400" />
                <Youtube className="h-6 w-6 cursor-pointer hover:text-red-500" />
                <Share2 className="h-6 w-6 cursor-pointer hover:text-purple-400" />
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-gray-700" />
          <p className="text-center text-gray-400">
            © 2025 TechAffiliate Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
