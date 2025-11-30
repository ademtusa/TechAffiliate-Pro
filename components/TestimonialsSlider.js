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
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-800">
            What Our Users Say
          </h2>
          <p className="text-slate-600 text-lg">
            Real feedback from real users
          </p>
        </div>

        {/* Grid Layout - 4 Boxes, Products Style, No Overflow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.slice(0, 4).map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Stars */}
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (testimonial.rating || 5)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-700 text-sm mb-4 leading-relaxed flex-1 line-clamp-4">
                  {testimonial.content}
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-3 border-t border-slate-200 pt-4 mt-auto">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full object-cover border-2 border-blue-200"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {testimonial.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {testimonial.name}
                    </p>
                    {(testimonial.role || testimonial.company) && (
                      <p className="text-xs text-slate-500 truncate">
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
    </section>
  )
}
