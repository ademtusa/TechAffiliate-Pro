'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Users, Lightbulb, Heart, Award, TrendingUp, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const [featuredProduct, setFeaturedProduct] = useState(null)

  const fetchFeaturedProduct = async () => {
    try {
      const response = await fetch('/api/products')
      const result = await response.json()
      
      if (result.success && result.data && result.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * result.data.length)
        setFeaturedProduct({
          ...result.data[randomIndex],
          commission_rate: 15.5,
          reviews: 1247
        })
      }
    } catch (error) {
      console.error('Error fetching featured product:', error)
    }
  }

  useEffect(() => {
    fetchFeaturedProduct()
  }, [fetchFeaturedProduct])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <HeroSection 
        title="About Usefulio"
        subtitle="We help you discover genuinely useful products through honest reviews and detailed comparisons"
        featuredProduct={featuredProduct}
        featuredType="topRated"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Our Mission */}
          <Card className="shadow-2xl border-2 border-blue-200 hover:shadow-3xl hover:scale-105 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Target className="h-8 w-8 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                At <strong>Usefulio</strong>, our mission is simple: help you find what's <strong>actually useful</strong>. 
                In a world overwhelmed with products and marketing noise, we cut through the clutter to bring you 
                honest, detailed reviews of products that genuinely solve problems and add value to your life.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We believe in transparency, authenticity, and putting <strong>your needs first</strong>. Every product 
                we review is evaluated based on real-world usefulness, not hype.
              </p>
            </CardContent>
          </Card>

          {/* Our Vision */}
          <Card className="shadow-2xl border-2 border-purple-200 hover:shadow-3xl hover:scale-105 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Lightbulb className="h-8 w-8 text-purple-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                We envision a world where consumers make <strong>informed, confident decisions</strong> backed by 
                genuine insights rather than flashy advertisements. Usefulio aims to become your 
                <strong> go-to trusted resource</strong> for product information.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our goal is to build a community where usefulness matters more than popularity, and where 
                <strong> real value</strong> is celebrated.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Do */}
        <Card className="shadow-2xl border-2 mb-12 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-3xl flex items-center gap-3">
              <Award className="h-10 w-10" />
              What We Do
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Honest Reviews */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-blue-900">Honest Reviews</h3>
                <p className="text-gray-700 text-center">
                  We test and review products based on real-world use cases. No sugarcoating, just honest feedback.
                </p>
              </div>

              {/* Detailed Comparisons */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-purple-900">Detailed Comparisons</h3>
                <p className="text-gray-700 text-center">
                  Side-by-side comparisons help you see the real differences between similar products.
                </p>
              </div>

              {/* User-Focused Content */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center mb-4 mx-auto">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-green-900">User-Focused Content</h3>
                <p className="text-gray-700 text-center">
                  Every article, review, and guide is written with YOUR needs and questions in mind.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Values */}
        <Card className="shadow-2xl border-2 mb-12 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-3xl flex items-center gap-3">
              <Users className="h-10 w-10 text-indigo-600" />
              Our Core Values
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1 text-gray-900">Transparency</h4>
                  <p className="text-gray-600">We disclose affiliate relationships and maintain honest editorial independence.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1 text-gray-900">Authenticity</h4>
                  <p className="text-gray-600">Real experiences, real testing, real opinions. No fake reviews or paid endorsements.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1 text-gray-900">User-First</h4>
                  <p className="text-gray-600">Your needs drive our content. We create guides that genuinely help you make decisions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1 text-gray-900">Quality Over Quantity</h4>
                  <p className="text-gray-600">We focus on comprehensive, useful content rather than churning out superficial reviews.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Trust Us */}
        <Card className="shadow-2xl border-2 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-blue-900">Why Trust Usefulio?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">100%</div>
                <p className="text-gray-700 font-medium">Honest Reviews</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-purple-600 mb-2">1000+</div>
                <p className="text-gray-700 font-medium">Products Evaluated</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-green-600 mb-2">24/7</div>
                <p className="text-gray-700 font-medium">Support Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
