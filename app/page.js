'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Star, TrendingUp, Gift, BookOpen, Facebook, Twitter, Linkedin, Instagram, Youtube, Share2, Download, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import ProductSlider from '@/components/ProductSlider'
import TestimonialsSlider from '@/components/TestimonialsSlider'
import HeroSection from '@/components/HeroSection'
import Navbar from '@/components/Navbar'
import HowItWorksSection from '@/components/HowItWorksSection'

export default function Home() {
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [authOpen, setAuthOpen] = useState(false)

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
      setCategories([])
    }
  }

  const fetchProductSliders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      const result = await response.json()
      
      if (result.success && result.data) {
        const allProducts = result.data
        
        const bestsellers = [...allProducts].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
        setBestSellers(bestsellers)
        
        const viewed = [...allProducts].sort((a, b) => (b.views || 0) - (a.views || 0))
        setMostViewed(viewed)
        
        const cart = [...allProducts].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
        setMostAddedToCart(cart)
        
        const downloads = [...allProducts].sort((a, b) => (b.views || 0) - (a.views || 0))
        setMostDownloads(downloads)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection 
        title="Discover the Best Products"
        subtitle="Compare, review, and find the perfect products with our global affiliate platform"
        featuredProduct={featuredProduct}
        featuredType="bestseller"
      />

      {/* Main Content - Product Sliders */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <ProductSlider 
              title="Best Sellers" 
              products={bestSellers} 
              icon={TrendingUp}
            />

            <ProductSlider 
              title="Most Popular" 
              products={mostViewed} 
              icon={Star}
            />

            <ProductSlider 
              title="Most Added to Cart" 
              products={mostAddedToCart} 
              icon={ShoppingCart}
            />

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

      {/* How It Works + FAQ Section */}
      <HowItWorksSection />

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
                <li><Link href="/blog" className="hover:text-white">Review</Link></li>
                <li><Link href="/resources" className="hover:text-white">Resources</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
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
