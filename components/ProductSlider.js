'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Star, Eye, ExternalLink, Heart, ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'

export default function ProductSlider({ title, products, icon: Icon }) {
  const scrollContainerRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('rated')
  const [likedProducts, setLikedProducts] = useState([])
  const [compareProducts, setCompareProducts] = useState([])

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    const cardWidth = 300
    const gap = 24
    const scrollAmount = (cardWidth + gap) * 4

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

    setShowLeftArrow(container.scrollLeft > 10)
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }

  useEffect(() => {
    updateArrowVisibility()
    // Load liked and compare from localStorage
    const liked = JSON.parse(localStorage.getItem('likedProducts') || '[]')
    const compare = JSON.parse(localStorage.getItem('compareProducts') || '[]')
    setLikedProducts(liked)
    setCompareProducts(compare)
  }, [selectedFilter])

  const toggleLike = (product) => {
    const newLiked = likedProducts.includes(product.id)
      ? likedProducts.filter(id => id !== product.id)
      : [...likedProducts, product.id]
    setLikedProducts(newLiked)
    localStorage.setItem('likedProducts', JSON.stringify(newLiked))
  }

  const toggleCompare = (product) => {
    const isInCompare = compareProducts.find(p => p.id === product.id)
    let newCompare
    if (isInCompare) {
      newCompare = compareProducts.filter(p => p.id !== product.id)
    } else if (compareProducts.length < 3) {
      newCompare = [...compareProducts, product]
    } else {
      alert('En fazla 3 ürün karşılaştırabilirsiniz!')
      return
    }
    setCompareProducts(newCompare)
    localStorage.setItem('compareProducts', JSON.stringify(newCompare))
  }

  const handleAffiliateClick = async (product) => {
    try {
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      })
    } catch (error) {
      console.log('Track click failed:', error)
    }
    window.open(product.affiliate_url, '_blank')
  }

  if (!products || products.length === 0) {
    return null
  }

  const filteredProducts = selectedFilter === 'popular'
    ? [...products].sort((a, b) => (b.views || 0) - (a.views || 0))
    : selectedFilter === 'rated'
    ? [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : selectedFilter === 'discount'
    ? [...products].filter(p => p.original_price).sort((a, b) => {
        const discountA = ((a.original_price - a.price) / a.original_price) * 100
        const discountB = ((b.original_price - b.price) / b.original_price) * 100
        return discountB - discountA
      })
    : products

  return (
    <div className="relative py-8">
      {/* Section Header with Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          
          {/* Filter Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedFilter('rated')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                selectedFilter === 'rated'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Best Rated
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
              onClick={() => setSelectedFilter('discount')}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                selectedFilter === 'discount'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Discount
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/blog">
            <Button variant="outline" className="border-gray-300">
              All Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Products Slider */}
      <div className="relative group">
        {showLeftArrow && filteredProducts.length > 4 && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all -ml-4"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
        )}

        {showRightArrow && filteredProducts.length > 4 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all -mr-4"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={updateArrowVisibility}
          className="overflow-x-hidden scrollbar-hide scroll-smooth pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="flex-shrink-0 hover:shadow-xl transition-all duration-300 border overflow-hidden"
                style={{ width: 'calc((100% - 72px) / 4)' }}
              >
                {/* Product Image with Badge */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 group">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-400 text-6xl">📦</div>
                    </div>
                  )}
                  
                  {/* Badge - Top Right */}
                  {product.badge && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white font-bold px-3 py-1 text-xs">
                      {product.badge}
                    </Badge>
                  )}
                  
                  {/* Popular Badge */}
                  {(product.views || 0) > 1000 && !product.badge && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white font-bold px-3 py-1 text-xs">
                      POPULAR
                    </Badge>
                  )}

                  {/* Like & Compare Icons - Top Left */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {/* Like/Heart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleLike(product)
                      }}
                      className={`p-2 rounded-full transition-all shadow-lg ${
                        likedProducts.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 text-gray-700 hover:bg-red-50'
                      }`}
                      title="Beğen"
                    >
                      <Heart className={`h-4 w-4 ${likedProducts.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>

                    {/* Compare Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleCompare(product)
                      }}
                      className={`p-2 rounded-full transition-all shadow-lg ${
                        compareProducts.find(p => p.id === product.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/90 text-gray-700 hover:bg-blue-50'
                      }`}
                      title="Karşılaştır"
                    >
                      <Check className={`h-4 w-4 ${compareProducts.find(p => p.id === product.id) ? 'font-bold' : ''}`} />
                    </button>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Product Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Product Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {product.description || 'High-quality product with amazing features and benefits.'}
                  </p>

                  {/* Rating and Views */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 4)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        ({product.rating || 4.9})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{product.views || 2450}</span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-end justify-between mb-4">
                    <div className="flex flex-col">
                      <div className="text-3xl font-bold text-blue-600">
                        ${product.price}
                      </div>
                      {product.original_price && (
                        <div className="text-sm text-gray-400 line-through">
                          ${product.original_price}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {product.category || 'general'}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/sales/${product.id}`} className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-gray-300 hover:bg-gray-50"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Button
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                      onClick={() => handleAffiliateClick(product)}
                    >
                      Get Deal
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
