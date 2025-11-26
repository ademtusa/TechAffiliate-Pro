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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </nav>

      {/* Product Details Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Urgency Banner */}
        <div className="mb-6 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center justify-center gap-4 flex-wrap text-center">
            <TrendingUp className="h-5 w-5" />
            <p className="font-bold">🔥 Limited Time Offer - {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF Today! Only 7 spots left at this price</p>
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* LEFT SIDE - Product Images (Smaller, 2 columns) */}
          <div className="lg:col-span-2">
            {/* Main Image - Reduced Size */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl mb-4" style={{ aspectRatio: '4/3' }}>
              {productImages[selectedImage] ? (
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                  <Package className="h-24 w-24 text-blue-300" />
                </div>
              )}
              {product.badge && (
                <Badge className="absolute top-4 right-4 text-base px-3 py-1 bg-red-500 animate-bounce">
                  {product.badge}
                </Badge>
              )}
              {/* Live viewers indicator */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {Math.floor(Math.random() * 20) + 15} people viewing now
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === idx ? 'border-blue-600 scale-105 shadow-lg' : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                  }`}
                >
                  {img ? (
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 text-center">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-green-700">30-Day Guarantee</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-center">
                <Check className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-blue-700">Verified Product</p>
              </div>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3 text-center">
                <Shield className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-purple-700">Secure Payment</p>
              </div>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3 text-center">
                <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-orange-700">Best Price</p>
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-semibold text-green-700">Real-time Activity</p>
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                  <p>✓ <strong>Sarah M.</strong> purchased 3 minutes ago</p>
                  <p>✓ <strong>John D.</strong> purchased 12 minutes ago</p>
                  <p>✓ <strong>24 people</strong> added to cart in last hour</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE - Product Info (Larger, 3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className="text-sm px-3 py-1" variant="secondary">{product.category}</Badge>
                <Badge className="text-sm px-3 py-1 bg-blue-600">⭐ Best Seller</Badge>
                <Badge className="text-sm px-3 py-1 bg-green-600">✓ Verified</Badge>
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{product.name}</h1>
              
              <div className="flex items-center gap-6 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${i < (product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-bold">{product.rating || 4.5}</span>
                  <span className="text-gray-600">({reviews.length} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-semibold">{product.sales_count}+ Happy Customers</span>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-2 text-blue-600">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">{product.views} views</span>
                </div>
              </div>
            </div>

            {/* Price with Countdown */}
            <Card className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 border-4 border-red-300 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-2">⏰ Limited Time Offer Expires Soon</p>
                  <div className="flex items-baseline gap-4 mb-3">
                    <span className="text-6xl font-bold text-red-600">${product.price}</span>
                    {product.original_price && (
                      <>
                        <span className="text-3xl text-gray-500 line-through">${product.original_price}</span>
                        <div className="flex flex-col">
                          <Badge className="bg-green-500 text-xl px-4 py-2 mb-1">
                            Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                          </Badge>
                          <span className="text-sm text-gray-600">You save ${(product.original_price - product.price).toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Payment Options */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Or pay in installments:</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">${(product.price / 4).toFixed(2)}</span>
                    <span className="text-gray-600">x 4 interest-free payments</span>
                  </div>
                </div>

                {/* Stock Indicator */}
                <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-orange-800">🔥 High Demand</span>
                    <span className="text-sm font-bold text-orange-600">Only 7 left!</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  ✓ Tax included • ✓ Free shipping • ✓ 30-day returns
                </p>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-gradient-to-br from-slate-50 to-blue-50">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-blue-600">📋</span> What's Included
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {product.description}
                </p>
                <ul className="grid md:grid-cols-2 gap-3">
                  {(product.tags || []).map((tag, index) => (
                    <li key={index} className="flex items-center text-gray-700 bg-white rounded-lg p-2">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium">{tag}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quantity & Add to Cart */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Select Quantity</p>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="bg-white/20 border-white/30 hover:bg-white/30 text-white"
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <span className="text-3xl font-bold w-20 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        className="bg-white/20 border-white/30 hover:bg-white/30 text-white"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90 mb-1">Total Price</p>
                    <p className="text-4xl font-bold">${(product.price * quantity).toFixed(2)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full h-16 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                    onClick={handleBuyNow}
                  >
                    <ShoppingCart className="mr-3 h-6 w-6" />
                    Buy Now - Secure Checkout
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full h-14 text-lg bg-white/20 border-white/40 hover:bg-white/30"
                    onClick={handleAddToCart}
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Add to Wishlist
                  </Button>

                  <div className="text-center text-sm opacity-90">
                    <p>✓ Instant Access • ✓ 30-Day Money Back • ✓ Secure Payment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alternative CTA */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <h4 className="text-xl font-bold mb-2">Prefer to Buy from Official Store?</h4>
                  <p className="text-gray-600 mb-4">Get the same great deal directly from the provider</p>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 hover:scale-105 transition-transform"
                    onClick={handleAffiliateClick}
                  >
                    Visit Official Store
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Proof & Share */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Share with friends:</span>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => handleShare('facebook')}>
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => handleShare('twitter')}>
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => handleShare('linkedin')}>
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
              <Badge className="bg-blue-600 text-white px-4 py-2">
                🎁 Refer & Earn Rewards
              </Badge>
            </div>

            {/* Customer Testimonial Preview */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    JD
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">Verified Purchase</span>
                    </div>
                    <p className="text-gray-700 italic mb-2">
                      "Best investment I've made this year! The features are incredible and customer support is outstanding."
                    </p>
                    <p className="text-sm text-gray-600">- John D., Enterprise Customer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comprehensive Review Section */}
        <Card className="mb-16 shadow-2xl">
          <Tabs defaultValue="overview" className="w-full">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
              <TabsList className="grid w-full max-w-5xl grid-cols-6 h-auto bg-transparent gap-2 p-2">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg border-2 border-transparent hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 py-3 font-semibold rounded-lg"
                >
                  📊 Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="features"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg border-2 border-transparent hover:border-green-300 hover:bg-green-50 transition-all duration-300 py-3 font-semibold rounded-lg"
                >
                  ⚡ Features
                </TabsTrigger>
                <TabsTrigger 
                  value="proscons"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg border-2 border-transparent hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 py-3 font-semibold rounded-lg"
                >
                  ⚖️ Pros & Cons
                </TabsTrigger>
                <TabsTrigger 
                  value="pricing"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg border-2 border-transparent hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 py-3 font-semibold rounded-lg"
                >
                  💰 Pricing
                </TabsTrigger>
                <TabsTrigger 
                  value="faq"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg border-2 border-transparent hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-300 py-3 font-semibold rounded-lg"
                >
                  ❓ FAQ
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg border-2 border-transparent hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-300 py-3 font-semibold rounded-lg"
                >
                  ⭐ Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
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

                {/* Detailed Rating Breakdown */}
                <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      📊 Detailed Rating Breakdown
                    </CardTitle>
                    <p className="text-gray-600">Based on comprehensive expert analysis across multiple criteria</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-8">
                      {/* Left Column - Product Image */}
                      <div className="col-span-1">
                        <div className="sticky top-4">
                          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-blue-200">
                            {productImages[0] ? (
                              <img
                                src={productImages[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                                <Package className="h-24 w-24 text-blue-300" />
                              </div>
                            )}
                          </div>
                          <div className="mt-4 text-center bg-white rounded-lg p-4 shadow-md">
                            <div className="text-4xl font-bold text-blue-600 mb-1">{product.rating}</div>
                            <div className="flex justify-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">Overall Rating</p>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Rating Bars */}
                      <div className="col-span-2 space-y-6">
                        {[
                          { label: 'Features & Functionality', score: 95, color: 'blue' },
                          { label: 'Ease of Use', score: 88, color: 'green' },
                          { label: 'Performance & Speed', score: 92, color: 'purple' },
                          { label: 'Customer Support', score: 85, color: 'orange' },
                          { label: 'Documentation & Resources', score: 90, color: 'cyan' },
                          { label: 'Security & Reliability', score: 97, color: 'red' }
                        ].map((item, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between mb-2">
                              <span className="font-semibold text-gray-800">{item.label}</span>
                              <span className="font-bold text-lg" style={{
                                color: item.color === 'blue' ? '#3B82F6' :
                                       item.color === 'green' ? '#10B981' :
                                       item.color === 'purple' ? '#A855F7' :
                                       item.color === 'orange' ? '#F97316' :
                                       item.color === 'cyan' ? '#06B6D4' :
                                       '#EF4444'
                              }}>
                                {item.score}%
                              </span>
                            </div>
                            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div 
                                className={`bg-gradient-to-r ${
                                  item.color === 'blue' ? 'from-blue-400 to-blue-600' :
                                  item.color === 'green' ? 'from-green-400 to-green-600' :
                                  item.color === 'purple' ? 'from-purple-400 to-purple-600' :
                                  item.color === 'orange' ? 'from-orange-400 to-orange-600' :
                                  item.color === 'cyan' ? 'from-cyan-400 to-cyan-600' :
                                  'from-red-400 to-red-600'
                                } h-3 rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h4 className="text-2xl font-bold mb-3">Ready to Get Started?</h4>
                  <p className="text-gray-600 mb-6">Join thousands of satisfied customers today</p>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      onClick={handleAffiliateClick}
                    >
                      Get Deal Now <ExternalLink className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      View Pricing
                    </Button>
                  </div>
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
                    <Card key={index} className="hover:shadow-lg transition-shadow">
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
                    <Card key={idx} className="hover:shadow-md transition-shadow">
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
                      <Card key={review.id} className="hover:shadow-md transition-shadow">
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
            </CardContent>
          </Tabs>
        </Card>

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
    </div>
  )
}