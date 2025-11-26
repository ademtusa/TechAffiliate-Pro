'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Star, ExternalLink, ArrowLeft, Heart, Share2, Facebook, Twitter, Linkedin, Check, X, TrendingUp, ShoppingCart, CreditCard, Package, Shield, Truck, RotateCcw, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { CartStore } from '@/lib/cartStore'
import Footer from '@/components/Footer'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  // Mock product images (in real app, these would come from product data)
  const productImages = [
    product?.image_url,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600',
  ]

  useEffect(() => {
    checkUser()
    if (params.id) {
      fetchProduct()
      fetchReviews()
    }
  }, [params.id])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.log('Auth check skipped')
      setUser(null)
    }
  }

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const result = await response.json()
      
      if (result.success) {
        setProduct(result.data)
        fetchRelatedProducts(result.data.category, result.data.id)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${params.id}`)
      const result = await response.json()
      
      if (result.success) {
        setReviews(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchRelatedProducts = async (category, excludeId) => {
    try {
      const response = await fetch(`/api/related?category=${category}&excludeId=${excludeId}`)
      const result = await response.json()
      
      if (result.success) {
        setRelatedProducts(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleAffiliateClick = async () => {
    await fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id })
    })
    window.open(product.affiliate_url, '_blank')
  }

  const handleAddToCart = () => {
    // Mock add to cart
    alert(`Added ${quantity} ${product.name} to cart!`)
  }

  const handleBuyNow = () => {
    setCheckoutOpen(true)
  }

  const handleCheckout = async () => {
    // Mock checkout process
    alert(`Processing payment via ${paymentMethod.toUpperCase()}...\n\nThis is a demo. In production, this would integrate with:\n- Stripe\n- PayPal\n- Credit Card processors\n\nRedirecting to affiliate link instead...`)
    setCheckoutOpen(false)
    handleAffiliateClick()
  }

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out ${product?.name}!`)
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Product not found</p>
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </nav>

      {/* Product Details Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT SIDE - Product Images */}
          <div>
            {/* Main Image */}
            <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-3 border border-gray-200 hover:border-blue-600 transition-colors duration-300 cursor-pointer">
              <div className="aspect-square">
                {productImages[selectedImage] ? (
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-20 w-20 text-gray-300" />
                  </div>
                )}
              </div>
              {product.badge && (
                <Badge className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1">
                  {product.badge}
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-md overflow-hidden border transition-all duration-300 ${
                    selectedImage === idx ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  {img ? (
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-300" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - Product Info (3 columns) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Title & Rating */}
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < (product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-900">{product.rating || 4.5}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-600">{reviews.length} reviews</span>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-600">{product.sales_count}+ sold</span>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="border-2 border-gray-200 rounded-xl p-6 space-y-5 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-5xl font-bold text-gray-900">${product.price}</span>
                    {product.original_price && (
                      <>
                        <span className="text-2xl text-gray-400 line-through">${product.original_price}</span>
                        <Badge className="bg-green-600 text-white text-sm">
                          -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">✓ Tax included • ✓ Free shipping</p>
                </div>

                <Separator />

                {/* Key Features - Compact */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">What's Included:</h3>
                  <ul className="space-y-1.5">
                    {(product.tags || []).slice(0, 4).map((tag, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <Check className="h-3.5 w-3.5 text-green-600 mr-2 flex-shrink-0" />
                        <span>{tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg hover:border-blue-600 transition-colors">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-9 w-9 hover:bg-gray-100 rounded-l-lg"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-bold w-10 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-9 w-9 hover:bg-gray-100 rounded-r-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 hover:shadow-xl text-white transition-all duration-300 hover:scale-105"
                    onClick={handleBuyNow}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now - ${(product.price * quantity).toFixed(2)}
                  </Button>
                  
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full h-12 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                    onClick={handleAddToCart}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>

                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full h-12 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                    onClick={handleAffiliateClick}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Official Store
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>30-Day Money Back Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Description Below Card */}
              <div className="mt-6">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Comprehensive Review Section */}
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-200 pt-8 mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent h-auto p-0 rounded-none">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 border-b-2 border-transparent rounded-none px-6 py-3 font-medium hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-500 hover:rounded-md transition-all duration-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="features"
                className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 border-b-2 border-transparent rounded-none px-6 py-3 font-medium hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-500 hover:rounded-md transition-all duration-300"
              >
                Features
              </TabsTrigger>
              <TabsTrigger 
                value="proscons"
                className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 border-b-2 border-transparent rounded-none px-6 py-3 font-medium hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-500 hover:rounded-md transition-all duration-300"
              >
                Pros & Cons
              </TabsTrigger>
              <TabsTrigger 
                value="pricing"
                className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 border-b-2 border-transparent rounded-none px-6 py-3 font-medium hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-500 hover:rounded-md transition-all duration-300"
              >
                Pricing
              </TabsTrigger>
              <TabsTrigger 
                value="faq"
                className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 border-b-2 border-transparent rounded-none px-6 py-3 font-medium hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-500 hover:rounded-md transition-all duration-300"
              >
                FAQ
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 border-b-2 border-transparent rounded-none px-6 py-3 font-medium hover:text-blue-600 hover:bg-blue-50 hover:border hover:border-blue-500 hover:rounded-md transition-all duration-300"
              >
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Comprehensive Review to Help You Make an Informed Decision</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    At TechAffiliate Pro, we provide comprehensive and unbiased product reviews to help you navigate the complex world of tech products and services. Our team of experts meticulously researches and analyzes various options to provide you with reliable and up-to-date information.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    When it comes to {product.name}, we've conducted a thorough review to provide you with all the essential details. We delve into the features, performance, pricing, user experience, and customer support to give you a complete picture of what to expect.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Our analysis includes real-world testing, comparison with competitors, and evaluation of value for money. We aim to help you make confident purchasing decisions by providing transparent, detailed insights into every aspect of this product.
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="pt-6 text-center">
                      <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                          <circle cx="64" cy="64" r="56" stroke="#3B82F6" strokeWidth="8" fill="none" 
                            strokeDasharray={`${(product.rating / 5) * 352} 352`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div>
                            <p className="text-3xl font-bold text-blue-600">{product.rating}</p>
                            <p className="text-sm text-gray-600">/ 5.0</p>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">Overall Rating</h4>
                      <p className="text-sm text-gray-600">Based on expert analysis</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="pt-6 text-center">
                      <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                          <circle cx="64" cy="64" r="56" stroke="#10B981" strokeWidth="8" fill="none" 
                            strokeDasharray="282 352" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div>
                            <p className="text-3xl font-bold text-green-600">80%</p>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">Value for Money</h4>
                      <p className="text-sm text-gray-600">Price vs Features ratio</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="pt-6 text-center">
                      <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                          <circle cx="64" cy="64" r="56" stroke="#A855F7" strokeWidth="8" fill="none" 
                            strokeDasharray="334 352" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div>
                            <p className="text-3xl font-bold text-purple-600">95%</p>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">User Satisfaction</h4>
                      <p className="text-sm text-gray-600">Customer happiness rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Rating Breakdown - Modern Cards */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Rating</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: 'Features', score: 95, icon: '⚡' },
                      { label: 'Ease of Use', score: 88, icon: '✨' },
                      { label: 'Performance', score: 92, icon: '🚀' },
                      { label: 'Support', score: 85, icon: '💬' },
                      { label: 'Documentation', score: 90, icon: '📚' },
                      { label: 'Security', score: 97, icon: '🔒' }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-2xl font-bold text-blue-600">{item.score}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{item.label}</p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center py-6">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleAffiliateClick}
                  >
                    Get Started <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </TabsContent>

              {/* Features Tab */}
              <TabsContent value="features" className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Complete Feature Overview</h3>
                  <p className="text-gray-700 mb-6">
                    Explore all the powerful features and capabilities that make {product.name} stand out from the competition.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {(product.tags || ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5', 'Feature 6']).map((tag, index) => (
                    <Card key={index} className="hover:shadow-lg hover:border-blue-500 transition-all duration-300 border border-gray-200">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            <Check className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg mb-2">{tag}</h4>
                            <p className="text-gray-600 text-sm">
                              Comprehensive functionality designed to enhance your workflow and boost productivity with cutting-edge technology.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Technical Specifications */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-semibold">Category</span>
                          <span className="text-gray-600">{product.category}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-semibold">Product Type</span>
                          <span className="text-gray-600">Digital Service</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-semibold">Deployment</span>
                          <span className="text-gray-600">Cloud-based</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-semibold">Support</span>
                          <span className="text-gray-600">24/7 Available</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-semibold">Rating</span>
                          <span className="text-gray-600">{product.rating} / 5.0</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-semibold">Total Users</span>
                          <span className="text-gray-600">{product.sales_count}+</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-semibold">Last Updated</span>
                          <span className="text-gray-600">Recently</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="font-semibold">Free Trial</span>
                          <span className="text-green-600 font-semibold">Available</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <div className="text-center py-6">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    onClick={handleAffiliateClick}
                  >
                    Try It Now <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </TabsContent>

              {/* Pros & Cons Tab */}
              <TabsContent value="proscons" className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Honest Assessment: Advantages & Limitations</h3>
                  <p className="text-gray-700 mb-8">
                    We believe in providing a balanced view. Here's what we found after extensive testing and analysis of {product.name}.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Pros */}
                  <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center">
                        <Check className="h-6 w-6 mr-2" />
                        Advantages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {[
                          'Competitive pricing with excellent value',
                          'Intuitive and user-friendly interface',
                          'Fast and reliable performance',
                          'Comprehensive feature set',
                          'Outstanding customer support',
                          'Regular updates and improvements',
                          'Strong security measures',
                          'Extensive documentation and tutorials'
                        ].map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Cons */}
                  <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
                    <CardHeader>
                      <CardTitle className="text-red-700 flex items-center">
                        <X className="h-6 w-6 mr-2" />
                        Limitations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {[
                          'Learning curve for advanced features',
                          'Premium features require higher tier plans',
                          'Limited offline functionality',
                          'Some integrations require additional setup'
                        ].map((con, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Our Verdict */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle>Our Verdict</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      After thorough testing and evaluation, we believe {product.name} is an excellent choice for individuals and businesses looking for a reliable, feature-rich solution. While it has minor limitations, the advantages far outweigh them, making it a worthwhile investment.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      The product delivers exceptional value for money, with strong performance, comprehensive features, and excellent support. We confidently recommend it to our users.
                    </p>
                  </CardContent>
                </Card>

                {/* CTA */}
                <div className="text-center py-6">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={handleAffiliateClick}
                  >
                    Get Started Today <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Transparent Pricing Plans</h3>
                  <p className="text-gray-700 mb-8">
                    Choose the plan that best fits your needs. All plans include our core features with flexible options to scale as you grow.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Basic Plan */}
                  <Card className="hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit mb-2">Starter</Badge>
                      <CardTitle className="text-2xl">Basic</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">${product.price}</span>
                        <span className="text-gray-600">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Core Features</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Email Support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Basic Analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">1 User Account</span>
                        </li>
                      </ul>
                      <Button className="w-full" variant="outline" onClick={handleAffiliateClick}>
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Pro Plan */}
                  <Card className="border-2 border-blue-500 hover:shadow-xl transition-shadow relative">
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                      Most Popular
                    </Badge>
                    <CardHeader>
                      <Badge className="w-fit mb-2 bg-blue-600">Professional</Badge>
                      <CardTitle className="text-2xl">Pro</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">${Math.round(product.price * 2.5)}</span>
                        <span className="text-gray-600">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">All Basic Features</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Priority Support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Advanced Analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">5 User Accounts</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">API Access</span>
                        </li>
                      </ul>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600" onClick={handleAffiliateClick}>
                        Start Free Trial
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Enterprise Plan */}
                  <Card className="hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit mb-2 bg-purple-600">Enterprise</Badge>
                      <CardTitle className="text-2xl">Business</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">${Math.round(product.price * 5)}</span>
                        <span className="text-gray-600">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">All Pro Features</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">24/7 Phone Support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Custom Integration</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Unlimited Users</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Dedicated Manager</span>
                        </li>
                      </ul>
                      <Button className="w-full" variant="outline" onClick={handleAffiliateClick}>
                        Contact Sales
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Money Back Guarantee */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">30-Day Money-Back Guarantee</h4>
                        <p className="text-gray-700">
                          Try {product.name} risk-free. If you're not completely satisfied within 30 days, we'll refund your purchase - no questions asked.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
                  <p className="text-gray-700 mb-8">
                    Find answers to common questions about {product.name}. Can't find what you're looking for? Contact our support team.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      q: 'How do I get started with this product?',
                      a: 'Getting started is easy! Simply click the "Get Deal" button, create your account, and you\'ll have immediate access to all features. Our setup wizard will guide you through the initial configuration in just a few minutes.'
                    },
                    {
                      q: 'What payment methods do you accept?',
                      a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise plans. All payments are processed securely through industry-standard encryption.'
                    },
                    {
                      q: 'Can I upgrade or downgrade my plan anytime?',
                      a: 'Yes! You can upgrade or downgrade your subscription at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at the start of your next billing cycle.'
                    },
                    {
                      q: 'Is there a free trial available?',
                      a: 'Yes, we offer a 14-day free trial for our Pro plan with no credit card required. This gives you full access to test all features before committing to a paid subscription.'
                    },
                    {
                      q: 'What kind of customer support is included?',
                      a: 'All plans include email support with response times within 24 hours. Pro and Enterprise plans include priority support with faster response times and additional phone support for Enterprise customers.'
                    },
                    {
                      q: 'Can I cancel my subscription?',
                      a: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your current billing period, and no further charges will be made.'
                    },
                    {
                      q: 'Do you offer refunds?',
                      a: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with the product within the first 30 days, contact our support team for a full refund.'
                    },
                    {
                      q: 'Is my data secure?',
                      a: 'Absolutely. We use bank-level encryption (256-bit SSL) to protect your data. All information is stored in secure data centers with regular backups and strict access controls. We are fully compliant with GDPR and other data protection regulations.'
                    }
                  ].map((faq, idx) => (
                    <Card key={idx} className="hover:shadow-md hover:border-blue-500 transition-all duration-300 border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">{faq.q}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{faq.a}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h4 className="text-xl font-bold mb-3">Still Have Questions?</h4>
                  <p className="text-gray-600 mb-6">Our support team is here to help you</p>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      size="lg" 
                      variant="outline"
                    >
                      Contact Support
                    </Button>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600"
                      onClick={handleAffiliateClick}
                    >
                      Start Free Trial
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Customer Reviews & Testimonials</h3>
                  <p className="text-gray-700 mb-8">
                    See what our customers have to say about {product.name}. Real feedback from real users.
                  </p>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <Card key={review.id} className="hover:shadow-md hover:border-blue-500 transition-all duration-300 border border-gray-200">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                {(review.user_name || 'A')[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold">{review.user_name || 'Anonymous User'}</p>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-4">No reviews yet. Be the first to share your experience!</p>
                      <Button onClick={handleAffiliateClick}>
                        Try It Now & Leave a Review
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* CTA */}
                <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h4 className="text-2xl font-bold mb-3">Join Our Satisfied Customers</h4>
                  <p className="text-gray-600 mb-6">Experience the difference for yourself</p>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    onClick={handleAffiliateClick}
                  >
                    Get Started Now <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                      {relatedProduct.image_url && (
                        <img
                          src={relatedProduct.image_url}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{relatedProduct.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {relatedProduct.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-blue-600">${relatedProduct.price}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm">{relatedProduct.rating || 4.5}</span>
                      </div>
                    </div>
                    <Link href={`/product/${relatedProduct.id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Choose your payment method to complete the order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                  </div>
                  <p className="text-xl font-bold">${(product.price * quantity).toFixed(2)}</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(product.price * quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">${(product.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <div>
              <h3 className="font-semibold mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-lg transition ${
                    paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Credit Card</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 border-2 rounded-lg transition ${
                    paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="h-8 w-8 mx-auto mb-2 bg-blue-600 rounded flex items-center justify-center text-white font-bold">P</div>
                  <p className="text-sm font-semibold">PayPal</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 border-2 rounded-lg transition ${
                    paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="h-8 w-8 mx-auto mb-2 bg-purple-600 rounded flex items-center justify-center text-white font-bold">S</div>
                  <p className="text-sm font-semibold">Stripe</p>
                </button>
              </div>
            </div>

            {/* Payment Note */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-sm text-blue-900">
                  <Shield className="h-4 w-4 inline mr-2" />
                  This is a demo checkout. In production, this would integrate with real payment processors.
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCheckoutOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCheckout} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600">
                Complete Purchase
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  )
}
