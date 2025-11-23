'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, ExternalLink, ArrowLeft, Heart, Share2, Facebook, Twitter, Linkedin, Check, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkUser()
    if (params.id) {
      fetchProduct()
      fetchReviews()
    }
  }, [params.id])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const result = await response.json()
      
      if (result.success) {
        setProduct(result.data)
        // Fetch related products
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
    // Track click
    await fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id })
    })
    // Open affiliate link
    window.open(product.affiliate_url, '_blank')
  }

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out ${product?.name}!`)
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`
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
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 shadow-2xl">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <TrendingUp className="h-32 w-32 text-blue-300" />
                </div>
              )}
            </div>
            {product.badge && (
              <Badge className="absolute top-4 right-4 text-lg px-4 py-2 bg-red-500">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div>
            <Badge className="mb-4" variant="secondary">{product.category}</Badge>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
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

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-5xl font-bold text-blue-600">${product.price}</span>
                {product.original_price && (
                  <span className="text-2xl text-gray-500 line-through">${product.original_price}</span>
                )}
                {product.original_price && (
                  <Badge className="bg-green-500 text-lg px-3 py-1">
                    Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Key Features */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Key Features:</h3>
              <ul className="space-y-2">
                {(product.tags || []).map((tag, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 mb-8">
              <Button 
                size="lg" 
                className="flex-1 text-lg h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleAffiliateClick}
              >
                Get This Deal <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Social Share */}
            <div>
              <p className="text-sm text-gray-600 mb-3">Share this product:</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleShare('facebook')}>
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleShare('twitter')}>
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleShare('linkedin')}>
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleShare('pinterest')}>
                  <Pinterest className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Customer Reviews</CardTitle>
            <CardDescription>
              {reviews.length > 0 ? `${reviews.length} reviews from verified users` : 'Be the first to review this product'}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.review_text}</p>
                    {review.user_name && (
                      <p className="text-sm text-gray-500 mt-2">- {review.user_name}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
            )}
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">
              You May Be Interested In
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
    </div>
  )
}