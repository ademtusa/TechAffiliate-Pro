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

      {/* Products Grid/Slider Container */}
      <div className="relative group">
        {/* Conditional Rendering: Grid for 4 or fewer products, Slider for more */}
        {filteredProducts.length <= 4 ? (
          /* Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-xl transition-all duration-300 border hover:border-gray-300"
              >
                <CardHeader className="p-0">
                  <div className="aspect-square relative rounded-t-lg overflow-hidden bg-gray-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    {product.badge && (
                      <Badge className="absolute top-3 right-3 bg-yellow-400 text-black font-bold px-3 py-1 rotate-12 shadow-lg">
                        {product.badge}
                      </Badge>
                    )}
                    {(product.rating || 4) >= 4.5 && (
                      <Badge className="absolute top-3 left-3 bg-green-500 text-white rounded-full px-3 py-1">
                        {product.rating || 4.5}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                  </h3>
                  
                  {/* Price Section */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-red-600">
                        ${product.price}
                      </span>
                      {product.original_price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.original_price}
                        </span>
                      )}
                    </div>
                    {product.original_price && (
                      <span className="text-xs text-green-600 font-semibold">
                        ↓ {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded transition">
                      <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded transition">
                      <Scale className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Slider Layout for more than 4 products */
          <>
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 shadow-lg rounded-full p-3 transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
            )}

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 shadow-lg rounded-full p-3 transition-all"
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
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="flex-shrink-0 w-[280px] hover:shadow-xl transition-all duration-300 border hover:border-gray-300"
                >
                  <CardHeader className="p-0">
                    <div className="aspect-square relative rounded-t-lg overflow-hidden bg-gray-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                      {product.badge && (
                        <Badge className="absolute top-3 right-3 bg-yellow-400 text-black font-bold px-3 py-1 rotate-12 shadow-lg">
                          {product.badge}
                        </Badge>
                      )}
                      {(product.rating || 4) >= 4.5 && (
                        <Badge className="absolute top-3 left-3 bg-green-500 text-white rounded-full px-3 py-1">
                          {product.rating || 4.5}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                      {product.name}
                    </h3>
                    
                    {/* Price Section */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-red-600">
                          ${product.price}
                        </span>
                        {product.original_price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.original_price}
                          </span>
                        )}
                      </div>
                      {product.original_price && (
                        <span className="text-xs text-green-600 font-semibold">
                          ↓ {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded transition">
                        <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded transition">
                        <Scale className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
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
