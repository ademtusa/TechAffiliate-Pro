'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, TrendingUp, Eye, ThumbsUp, Award, Users, ShoppingCart, Package } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalProducts: 15,
    totalViews: 21916,
    totalSales: 5623,
    avgRating: 4.7
  })
  
  const [mounted, setMounted] = useState(false)

  const [topProducts, setTopProducts] = useState({
    bestsellers: [],
    mostViewed: [],
    topRated: []
  })
  
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    fetchTopProducts()
  }, [])

  const fetchTopProducts = async () => {
    try {
      // Fetch bestsellers
      const bestsellersRes = await fetch('/api/products?sort=bestsellers')
      const bestsellers = await bestsellersRes.json()
      
      // Fetch most viewed
      const viewedRes = await fetch('/api/products?sort=mostviewed')
      const mostViewed = await viewedRes.json()
      
      // Fetch all and sort by rating
      const allRes = await fetch('/api/products')
      const all = await allRes.json()
      const topRated = all.data?.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3) || []
      
      setTopProducts({
        bestsellers: bestsellers.data?.slice(0, 3) || [],
        mostViewed: mostViewed.data?.slice(0, 3) || [],
        topRated
      })
    } catch (error) {
      console.error('Error fetching top products:', error)
    }
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 text-sm px-4 py-1">Our Performance</Badge>
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover why our platform is the go-to destination for tech deals and reviews
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500">
            <CardContent className="pt-8 pb-6">
              <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.totalProducts}+</div>
              <div className="text-gray-600 font-medium">Products Listed</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500">
            <CardContent className="pt-8 pb-6">
              <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{mounted ? stats.totalViews.toLocaleString() : '21,916'}+</div>
              <div className="text-gray-600 font-medium">Total Views</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-500">
            <CardContent className="pt-8 pb-6">
              <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{mounted ? stats.totalSales.toLocaleString() : '5,623'}+</div>
              <div className="text-gray-600 font-medium">Affiliate Clicks</div>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-yellow-500">
            <CardContent className="pt-8 pb-6">
              <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-white fill-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stats.avgRating}</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products Sections */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Best Sellers */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6" />
                <h3 className="text-2xl font-bold">Best Sellers</h3>
              </div>
              <p className="text-blue-100">Most purchased products</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topProducts.bestsellers.map((product, idx) => (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-bold">${product.price}</span>
                          <span className="text-sm text-gray-500">{product.sales_count} sales</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Viewed */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="h-6 w-6" />
                <h3 className="text-2xl font-bold">Most Viewed</h3>
              </div>
              <p className="text-green-100">Popular products this week</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topProducts.mostViewed.map((product, idx) => (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{product.views} views</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Rated */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-6 w-6" />
                <h3 className="text-2xl font-bold">Top Rated</h3>
              </div>
              <p className="text-yellow-100">Highest customer ratings</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topProducts.topRated.map((product, idx) => (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < (product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}