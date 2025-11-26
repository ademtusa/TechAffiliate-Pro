'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

export default function TestimonialsSlider() {
  const scrollContainerRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Mock testimonials data - sorted by most recent
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO, TechStartup',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      text: 'TechAffiliate Pro helped me find the perfect AI tools for my business. The detailed comparisons and honest reviews made the decision so much easier!',
      productUsed: 'ChatGPT Pro Plus',
      date: '2025-06-15',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Developer, CodeCraft',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'Amazing platform! I saved over $500 on hosting and automation tools. The affiliate deals are genuine and the support is excellent.',
      productUsed: 'Hostinger Premium',
      date: '2025-06-14',
      verified: true
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'Marketing Manager',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: 'The comparison tools are incredibly helpful. I can see all the features side-by-side and make informed decisions. Highly recommended!',
      productUsed: 'NordVPN Ultimate',
      date: '2025-06-13',
      verified: true
    },
    {
      id: 4,
      name: 'David Rodriguez',
      role: 'Entrepreneur',
      avatar: 'https://i.pravatar.cc/150?img=8',
      rating: 5,
      text: 'Best tech deals aggregator I have found. The blog posts are detailed and the exclusive member resources are worth it!',
      productUsed: 'AI Masterclass 2025',
      date: '2025-06-12',
      verified: true
    },
    {
      id: 5,
      name: 'Jessica Martinez',
      role: 'Freelance Designer',
      avatar: 'https://i.pravatar.cc/150?img=9',
      rating: 5,
      text: 'I love how easy it is to find the right tools. The product reviews are honest and the prices are unbeatable!',
      productUsed: 'Canva Pro',
      date: '2025-06-11',
      verified: true
    },
    {
      id: 6,
      name: 'Alex Thompson',
      role: 'Content Creator',
      avatar: 'https://i.pravatar.cc/150?img=13',
      rating: 5,
      text: 'This platform saved me hours of research. All the best deals in one place with transparent reviews. Game changer!',
      productUsed: 'Jasper AI Writing',
      date: '2025-06-10',
      verified: true
    },
    {
      id: 7,
      name: 'Linda Wang',
      role: 'Small Business Owner',
      avatar: 'https://i.pravatar.cc/150?img=20',
      rating: 5,
      text: 'The member benefits alone are worth signing up. Plus the deals on hosting and cloud services helped me cut costs significantly.',
      productUsed: 'DigitalOcean VPS',
      date: '2025-06-09',
      verified: true
    },
    {
      id: 8,
      name: 'Robert Kim',
      role: 'Software Engineer',
      avatar: 'https://i.pravatar.cc/150?img=15',
      rating: 5,
      text: 'Excellent curation of tech products. The automation tools section helped me streamline my entire workflow!',
      productUsed: 'n8n Automation Pro',
      date: '2025-06-08',
      verified: true
    },
  ]

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 420
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

  useEffect(() => {
    updateArrowVisibility()
  }, [])

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-white/20 text-white text-sm px-4 py-1 border-white/30">
            Customer Reviews
          </Badge>
          <h2 className="text-5xl font-bold mb-4 text-white">
            What Our Users Say
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Real reviews from real customers who found amazing deals
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative group">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-2xl rounded-full p-4 transition-all opacity-0 group-hover:opacity-100 -ml-4"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-2xl rounded-full p-4 transition-all opacity-0 group-hover:opacity-100 -mr-4"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          )}

          {/* Testimonials Container - 4 columns with slider */}
          <div
            ref={scrollContainerRef}
            onScroll={updateArrowVisibility}
            className="grid grid-cols-4 gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              gridAutoFlow: 'column',
              gridAutoColumns: 'minmax(0, 1fr)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="bg-white/95 backdrop-blur hover:shadow-2xl transition-all duration-300 border-2 hover:border-white"
              >
                <CardContent className="pt-6">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="h-10 w-10 text-blue-600 opacity-30" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>

                  {/* Product Used */}
                  <div className="mb-6">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      Used: {testimonial.productUsed}
                    </Badge>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full border-2 border-blue-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{testimonial.name}</p>
                        {testimonial.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(testimonial.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Scroll Indicator Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(Math.ceil(testimonials.length / 3))].map((_, idx) => (
            <div
              key={idx}
              className="h-2 w-2 rounded-full bg-white/40 hover:bg-white/80 transition cursor-pointer"
              onClick={() => {
                const container = scrollContainerRef.current
                if (container) {
                  container.scrollTo({
                    left: idx * 1200,
                    behavior: 'smooth'
                  })
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
