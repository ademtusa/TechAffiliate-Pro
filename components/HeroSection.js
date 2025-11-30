'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Star, ExternalLink, Sparkles } from 'lucide-react'
import Link from 'next/link'
import FeaturedProductCard from './FeaturedProductCard'

export default function HeroSection({ 
  title = "Discover the Best Products",
  subtitle = "Compare, review, and find the perfect products with our global affiliate platform",
  featuredProduct = null,
  featuredType = "bestseller" // 'bestseller', 'mostDownloaded', 'topRated', etc.
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
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

            {/* Heading - Dynamic */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
                {title}{' '}
                <span className="text-yellow-300">Worldwide</span>
              </h2>
              
              <p className="text-lg text-blue-50 leading-relaxed">
                {subtitle}
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
              <Link href="/products">
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
  )
}
