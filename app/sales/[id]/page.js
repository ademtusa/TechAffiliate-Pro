'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Star, Package } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SalesPage() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

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
      <Navbar />

      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/blog">
          <Button variant="ghost" className="gap-2 hover:bg-white/60">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      {/* Hero Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left - Product Image */}
          <div className="relative">
            <Card className="overflow-hidden border-2 shadow-2xl">
              <div className="relative aspect-square bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-32 w-32 text-blue-300" />
                  </div>
                )}
                {/* Category Badge - Top Right */}
                <Badge className="absolute top-4 right-4 bg-blue-600 text-white text-sm px-4 py-2">
                  {product.category || 'AI-SaaS'}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 4.8)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  {product.rating || 4.8}
                </span>
                <span className="text-gray-600">Average Review</span>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="px-4 py-2 text-sm border-2 border-blue-500 text-blue-700 hover:bg-blue-50">
                🤖 AI Powered
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm border-2 border-green-500 text-green-700 hover:bg-green-50">
                ⚡ Productivity
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm border-2 border-purple-500 text-purple-700 hover:bg-purple-50">
                ✍️ Content Creation
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm border-2 border-orange-500 text-orange-700 hover:bg-orange-50">
                💻 Coding Assistant
              </Badge>
            </div>

            {/* Short Description */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'Transform your workflow with cutting-edge AI technology. Perfect for professionals, creators, and developers looking to boost productivity and creativity.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
