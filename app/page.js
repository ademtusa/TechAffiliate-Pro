'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Star, TrendingUp, Gift, BookOpen, Download, ShoppingCart } from 'lucide-react'
import ProductSlider from '@/components/ProductSlider'
import TestimonialsSlider from '@/components/TestimonialsSlider'
import HeroSection from '@/components/HeroSection'
import Navbar from '@/components/Navbar'
import HowItWorksSection from '@/components/HowItWorksSection'
import Footer from '@/components/Footer'

export default function Home() {
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [authOpen, setAuthOpen] = useState(false)

  const [bestSellers, setBestSellers] = useState([])
  const [mostViewed, setMostViewed] = useState([])
  const [mostAddedToCart, setMostAddedToCart] = useState([])
  const [mostDownloads, setMostDownloads] = useState([])
  const [featuredProduct, setFeaturedProduct] = useState(null)
  const [compareProducts, setCompareProducts] = useState([])

  useEffect(() => {
    checkUser()
    fetchCategories()
    fetchProductSliders()
    
    // Listen to localStorage changes for compare products
    const handleStorageChange = () => {
      const compare = JSON.parse(localStorage.getItem('compareProducts') || '[]')
      setCompareProducts(compare)
    }
    
    // Initial load
    handleStorageChange()
    
    // Listen for changes
    window.addEventListener('storage', handleStorageChange)
    // Also check periodically (for same-tab updates)
    const interval = setInterval(handleStorageChange, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
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
      <Navbar />

      <HeroSection 
        title="Discover the Best Products"
        subtitle="Compare, review, and find the perfect products with our global affiliate platform"
        featuredProduct={featuredProduct}
        featuredType="bestseller"
      />

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

      <TestimonialsSlider />

      <HowItWorksSection />

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

      <Footer categories={categories} />

      {/* Floating Compare Bar */}
      {compareProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl border-t-4 border-blue-400">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {compareProducts.length}
                  </div>
                  <span className="font-semibold">Ürün Karşılaştırmaya Eklendi</span>
                </div>
                <div className="flex gap-2">
                  {compareProducts.map(product => (
                    <div key={product.id} className="bg-white/20 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                      <span>{product.name}</span>
                      <button
                        onClick={() => {
                          const newCompare = compareProducts.filter(p => p.id !== product.id)
                          setCompareProducts(newCompare)
                          localStorage.setItem('compareProducts', JSON.stringify(newCompare))
                        }}
                        className="hover:bg-white/30 rounded-full p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {compareProducts.length >= 2 && (
                  <a href="/blog#comparison-table">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                      Karşılaştır ({compareProducts.length})
                    </Button>
                  </a>
                )}
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    setCompareProducts([])
                    localStorage.removeItem('compareProducts')
                  }}
                >
                  Temizle
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
