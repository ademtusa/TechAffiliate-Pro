'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, ArrowLeft, ExternalLink, Facebook, Twitter, Linkedin, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchPost()
    }
  }, [params.slug])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blog/${params.slug}`)
      const result = await response.json()
      
      if (result.success) {
        setPost(result.data)
        if (result.data?.products) {
          fetchRelatedProducts(result.data.products.category)
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await fetch(`/api/related?category=${category}`)
      const result = await response.json()
      
      if (result.success) {
        setRelatedProducts(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post?.title || '')
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  const handleAffiliateClick = async (product) => {
    await fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id })
    })
    window.open(product.affiliate_url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Post not found</p>
          <Link href="/blog">
            <Button className="mt-4">Back to Blog</Button>
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
          <Link href="/blog">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </nav>

      {/* Article */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-2xl">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
          {post.excerpt && (
            <p className="text-xl text-gray-600">{post.excerpt}</p>
          )}
        </div>

        <Separator className="my-8" />

        {/* Social Share */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-sm text-gray-600 mr-2">Share:</span>
          <Button size="sm" variant="outline" onClick={() => handleShare('facebook')}>
            <Facebook className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleShare('twitter')}>
            <Twitter className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleShare('linkedin')}>
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleShare('linkedin')}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Featured Product */}
        {post.products && (
          <Card className="mb-12 border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <Badge className="w-fit mb-2">Featured Product</Badge>
              <CardTitle className="text-3xl">{post.products.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {post.products.image_url && (
                    <img
                      src={post.products.image_url}
                      alt={post.products.name}
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
                <div>
                  <p className="text-gray-700 mb-4">{post.products.description}</p>
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="text-4xl font-bold text-blue-600">${post.products.price}</span>
                    {post.products.original_price && (
                      <span className="text-xl text-gray-500 line-through">${post.products.original_price}</span>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Link href={`/sales/${post.products.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                      onClick={() => handleAffiliateClick(post.products)}
                    >
                      Get Deal <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">You May Be Interested In</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    <Link href={`/product/${product.id}`}>
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