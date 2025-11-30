'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

export default function TestimonialsSlider() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      const data = await response.json()
      if (data.success && data.data && data.data.length > 0) {
        setTestimonials(data.data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkArrows = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 10)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
      setTimeout(checkArrows, 100)
    }
  }

  useEffect(() => {
    checkArrows()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkArrows)
      return () => container.removeEventListener('scroll', checkArrows)
    }
  }, [testimonials])

  if (loading) {
    return null
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-8 md:py-12 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-slate-800">
            What Our Users Say
          </h2>
          <p className="text-slate-600 text-sm md:text-base lg:text-lg">
            Real feedback from real users
          </p>
        </div>

        {/* Horizontal Slider with 4 Boxes Visible on Desktop */}
        <div className="relative group px-8 md:px-12">
          {/* Left Arrow - Hidden on mobile */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-slate-700 p-2 md:p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-slate-200"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          )}

          {/* Scrollable Grid Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 md:gap-6 lg:grid lg:grid-flow-col lg:auto-cols-[calc(25%-18px)]">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] lg:w-auto bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <CardContent className="p-4 md:p-6 flex flex-col h-full">
                    {/* Stars */}
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 md:h-4 md:w-4 ${
                            i < (testimonial.rating || 5)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-slate-700 text-xs md:text-sm mb-4 leading-relaxed flex-1 line-clamp-4">
                      {testimonial.content}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center space-x-3 border-t border-slate-200 pt-3 md:pt-4 mt-auto">
                      {testimonial.avatar_url ? (
                        <img
                          src={testimonial.avatar_url}
                          alt={testimonial.name}
                          className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover border-2 border-blue-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs md:text-sm">
                            {testimonial.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-xs md:text-sm truncate">
                          {testimonial.name}
                        </p>
                        {(testimonial.role || testimonial.company) && (
                          <p className="text-[10px] md:text-xs text-slate-500 truncate">
                            {testimonial.role}
                            {testimonial.role && testimonial.company && ' • '}
                            {testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Arrow - Hidden on mobile */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-slate-700 p-2 md:p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-slate-200"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
