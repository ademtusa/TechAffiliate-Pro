'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ExternalLink, ArrowLeft, Heart, Facebook, Twitter, Linkedin, Check, Shield, Headphones, Gift } from 'lucide-react'
import Link from 'next/link'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const result = await response.json()
      
      if (result.success) {
        setProduct(result.data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAffiliateClick = async () => {
    if (product?.affiliate_url) {
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      })
      window.open(product.affiliate_url, '_blank')
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Product not found</p>
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const discount = product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/blog">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content - 2 Column Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Product Image and Details Card */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600'}
                  alt={product.name}
                  className="w-full h-80 object-cover"
                />
                {product.badge && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2">
                    {product.badge}
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-6">
                <Badge className="mb-3" variant="secondary">{product.category}</Badge>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{product.rating || 4.8}</span>
                  <span className="text-gray-500">Average Review</span>
                </div>

                {/* Feature Icons */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {(product.tags || ['AI', 'Productivity', 'Content Creation', 'Coding Assistant']).slice(0, 4).map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm">{tag}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Blue Pricing Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-8">
                <p className="text-blue-100 mb-2">Special Launch Price</p>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-5xl font-bold">${product.price}</span>
                  {product.original_price && (
                    <>
                      <span className="text-2xl line-through text-blue-200">${product.original_price}</span>
                      <Badge className="bg-yellow-500 text-black text-sm px-3 py-1">
                        Save {discount}%
                      </Badge>
                    </>
                  )}
                </div>
                
                <p className="text-sm text-blue-100 mb-6">One-time payment • Lifetime access</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    <span>Instant digital delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    <span>Secure checkout process</span>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <p className="text-sm mb-3">Quantity</p>
                  <div className="flex items-center gap-4 bg-white/20 rounded-lg p-2 w-fit">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 rounded bg-white/20 hover:bg-white/30 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Buttons in Blue Card */}
                <div className="space-y-3 mb-6">
                  <Button 
                    size="lg" 
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 h-14"
                    onClick={() => alert('Buy Now - Demo')}
                  >
                    Buy Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full border-2 border-white text-white hover:bg-white/10 h-14"
                    onClick={handleAffiliateClick}
                  >
                    Visit Official Store
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                {/* Social Share */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                  <span className="text-sm">Share:</span>
                  <button onClick={() => handleShare('facebook')} className="hover:opacity-80">
                    <Facebook className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleShare('twitter')} className="hover:opacity-80">
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="hover:opacity-80">
                    <Linkedin className="h-5 w-5" />
                  </button>
                  <button className="ml-auto hover:opacity-80 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Save
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Hot Deal Card */}
            <Card className="relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2 text-sm z-10">
                HOT DEAL
              </Badge>
              
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-gray-500 text-sm">Special Offer</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-purple-600">${product.price}</span>
                  {product.original_price && (
                    <div className="mt-2">
                      <span className="text-xl line-through text-gray-400">${product.original_price}</span>
                      <Badge className="ml-3 bg-green-500 text-white">Save {discount}%</Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Gift className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Instant Access</p>
                      <p className="text-sm text-gray-600">Start immediately</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">30-Day Guarantee</p>
                      <p className="text-sm text-gray-600">Risk-free purchase</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold">24/7 Support</p>
                      <p className="text-sm text-gray-600">Always here to help</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-14"
                    onClick={handleAffiliateClick}
                  >
                    Get Instant Access
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full border-2 h-14"
                    onClick={handleAffiliateClick}
                  >
                    Visit Official Site
                  </Button>
                </div>

                <p className="text-xs text-center text-gray-500 mt-4">
                  Secure checkout • Terms & Conditions Apply
                </p>
              </CardContent>
            </Card>

            {/* Verified & Trusted Card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verified & Trusted</h3>
                <p className="text-sm text-gray-600 mb-3">Recommended by 1250+ users worldwide</p>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Unbiased Review Section */}
        <div className="max-w-7xl mx-auto mt-12">
          <h2 className="text-3xl font-bold text-center mb-6">
            Unbiased Review to Help You Make Informed Decisions
          </h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
