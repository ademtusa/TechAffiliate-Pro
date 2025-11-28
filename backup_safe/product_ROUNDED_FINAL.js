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
import { Star, ExternalLink, ArrowLeft, Heart, Share2, Facebook, Twitter, Linkedin, Check, TrendingUp, ShoppingCart, CreditCard, Package, Shield, Truck, RotateCcw, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { CartStore } from '@/lib/cartStore'
import Navbar from '@/components/Navbar'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <Navbar />

      {/* Product Details Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* LEFT SIDE - Product Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl mb-4">
              {productImages[selectedImage] ? (
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                  <Package className="h-32 w-32 text-blue-300" />
                </div>
              )}
              {product.badge && (
                <Badge className="absolute top-4 right-4 text-lg px-4 py-2 bg-red-500">
                  {product.badge}
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === idx ? 'border-blue-600' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {img ? (
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <Badge className="mb-3" variant="secondary">{product.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < (product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold">{product.rating || 4.5}</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <span className="text-gray-600">{reviews.length} reviews</span>
                <Separator orientation="vertical" className="h-6" />
                <span className="text-gray-600">{product.views} views</span>
              </div>
            </div>

            {/* Price */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-5xl font-bold text-blue-600">${product.price}</span>
                  {product.original_price && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">${product.original_price}</span>
                      <Badge className="bg-green-500 text-lg px-3 py-1">
                        Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Tax included. Shipping calculated at checkout.</p>
              </CardContent>
            </Card>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2">
                {(product.tags || []).map((tag, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-semibold w-16 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 text-lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button 
                  size="lg" 
                  className="h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={handleBuyNow}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
              </div>
              
              <Button 
                size="lg" 
                variant="outline"
                className="w-full h-14 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={handleAffiliateClick}
              >
                Get from Official Store
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Social Share & Wishlist */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Share:</span>
                <Button size="sm" variant="ghost" onClick={() => handleShare('facebook')}>
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleShare('twitter')}>
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleShare('linkedin')}>
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Card className="mb-16">
          <Tabs defaultValue="reviews" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full max-w-xl grid-cols-3">
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="reviews">
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="ml-2 font-semibold">{review.user_name || 'Anonymous'}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.review_text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </TabsContent>
              <TabsContent value="specifications">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Category</p>
                      <p className="text-gray-600">{product.category}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Product ID</p>
                      <p className="text-gray-600">{product.id}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Rating</p>
                      <p className="text-gray-600">{product.rating} / 5.0</p>
                    </div>
                    <div>
                      <p className="font-semibold">Views</p>
                      <p className="text-gray-600">{product.views}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="shipping">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Truck className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Standard Shipping</h4>
                      <p className="text-gray-600">Delivery in 5-7 business days. Free on orders over $50.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Package className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Express Shipping</h4>
                      <p className="text-gray-600">Delivery in 2-3 business days. Additional $9.99.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <RotateCcw className="h-6 w-6 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Returns</h4>
                      <p className="text-gray-600">30-day return policy. Items must be unused and in original packaging.</p>
                    </div>
                  </div>
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
                    <div className="aspect-video relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
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

      <Footer />
    </div>
  )
}