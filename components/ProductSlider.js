'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Star, Eye, ExternalLink, ShoppingCart, Heart, Scale, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/cartStore'

export default function ProductSlider({ title, products, icon: Icon }) {
  const scrollContainerRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const addToCart = useCartStore((state) => state.addItem)

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 400
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })

    setTimeout(() => {
      updateArrowVisibility()
    }, 300)
  }

  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setShowLeftArrow(container.scrollLeft > 0)
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }

  const handleAffiliateClick = async (product) => {
    await fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id })
    })
    window.open(product.affiliate_url, '_blank')
  }

  if (!products || products.length === 0) {
    return null
  }

  // Filter products based on selected filter
  const filteredProducts = selectedFilter === 'all' 
    ? products 
    : selectedFilter === 'popular'
    ? [...products].sort((a, b) => (b.views || 0) - (a.views || 0))
    : [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0))

  return (
    <div className="relative py-8">
      {/* Section Header with Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          
          {/* Filter Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Show all
            </button>
            <button
              onClick={() => setSelectedFilter('popular')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                selectedFilter === 'popular'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setSelectedFilter('rated')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                selectedFilter === 'rated'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Best rated
            </button>
          </div>
        </div>

        {/* Category Dropdown & All Products Button */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="border-gray-300"
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
          >
            Choose category +
          </Button>
          <Link href="/blog">
            <Button variant="outline" className="border-gray-300">
              All Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        )}

        {/* Products Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={updateArrowVisibility}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex-shrink-0 w-[300px] hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500"
            >
              <CardHeader>
                <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-16 w-16 text-blue-300" />
                    </div>
                  )}
                  {product.badge && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2 hover:text-blue-600 transition">
                  {product.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (product.rating || 4)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.rating || 4.5})
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    {product.views || 0}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </p>
                    {product.original_price && (
                      <p className="text-sm text-gray-500 line-through">
                        ${product.original_price}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link href={`/product/${product.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => handleAffiliateClick(product)}
                >
                  Get Deal <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
