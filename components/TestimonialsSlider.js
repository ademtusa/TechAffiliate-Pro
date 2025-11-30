'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

export default function TestimonialsSlider() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
            <h2 className="text-2xl font-bold text-white">
              Loading Testimonials...
            </h2>
          </div>
        </div>
      </div>
    )
  }

  if (testimonials.length === 0) {
    return null // Don't show section if no testimonials
  }

  return (
    <div className="py-16 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <p className="text-gray-400 text-lg">
            Real feedback from real users
          </p>
        </div>

        {/* Grid Layout - Responsive: 1 col mobile, 2 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-sm h-full flex flex-col"
            >
              <CardContent className="p-6 flex flex-col flex-1">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-purple-500 mb-3 opacity-50" />
                
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (testimonial.rating || 5)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-300 text-sm mb-6 leading-relaxed flex-1">
                  {testimonial.content}
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-3 border-t border-slate-700 pt-4 mt-auto">
                  {testimonial.avatar_url ? (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500/30"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {testimonial.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{testimonial.name}</p>
                    {(testimonial.role || testimonial.company) && (
                      <p className="text-xs text-gray-400 truncate">
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
    </div>
  )
}
