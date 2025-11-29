'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, MessageCircle, Mail, Book, Video, Search, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

export default function SupportPage() {
  const [featuredProduct, setFeaturedProduct] = useState(null)
  const [expandedFaq, setExpandedFaq] = useState(null)

  useEffect(() => {
    fetchFeaturedProduct()
  }, [])

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

  const faqs = [
    {
      question: 'What is Usefulio?',
      answer: 'Usefulio is a trusted platform that helps you discover genuinely useful products through honest reviews and detailed comparisons. We focus on real-world usefulness rather than marketing hype.'
    },
    {
      question: 'Are your reviews biased because of affiliate links?',
      answer: 'No. While we do earn commissions from affiliate links, our editorial team maintains complete independence. We only recommend products we genuinely believe are useful, and our reviews are based on thorough testing and research.'
    },
    {
      question: 'How do you test products?',
      answer: 'We use a comprehensive evaluation process that includes hands-on testing, feature analysis, price comparison, and user feedback research. Each product is evaluated based on real-world use cases and practical utility.'
    },
    {
      question: 'Can I suggest a product for review?',
      answer: 'Absolutely! We love hearing from our community. Contact us through our support email (support@usefulio.com) with your product suggestion, and we\'ll consider it for future reviews.'
    },
    {
      question: 'Do you offer refunds for products purchased through your links?',
      answer: 'Refund policies are determined by the individual retailers, not Usefulio. Please refer to the specific store\'s refund policy. However, we\'re here to help guide you to products with good return policies.'
    },
    {
      question: 'How often do you update your reviews?',
      answer: 'We regularly update our reviews to reflect new product versions, price changes, and evolving market conditions. Major reviews are updated quarterly, while breaking changes are addressed immediately.'
    },
    {
      question: 'Can I trust the ratings and rankings?',
      answer: 'Yes. Our ratings are based on objective criteria including features, performance, value for money, and user satisfaction. We use a transparent scoring system and never accept payment for higher rankings.'
    },
    {
      question: 'How do I unsubscribe from your newsletter?',
      answer: 'Every newsletter includes an unsubscribe link at the bottom. You can also manage your email preferences by contacting support@usefulio.com.'
    }
  ]

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <HeroSection 
        title="Support Center"
        subtitle="Get help with Usefulio. Browse FAQs, contact our team, or explore our resources."
        featuredProduct={featuredProduct}
        featuredType="support"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Quick Help Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Contact Support */}
          <Card className="shadow-2xl border-2 border-blue-200 hover:border-blue-500 hover:shadow-3xl hover:scale-105 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-center text-xl">Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-700 mb-4">
                Get personalized help from our support team
              </p>
              <Link href="/contact">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-2 border-transparent hover:border-blue-300 transition-all">
                  Send Message
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Browse Resources */}
          <Card className="shadow-2xl border-2 border-purple-200 hover:border-purple-500 hover:shadow-3xl hover:scale-105 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4">
                <Book className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-center text-xl">Browse Resources</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-700 mb-4">
                Access guides, tips, and helpful articles
              </p>
              <Link href="/resources">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-2 border-transparent hover:border-purple-300 transition-all">
                  View Resources
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Community Chat */}
          <Card className="shadow-2xl border-2 border-green-200 hover:border-green-500 hover:shadow-3xl hover:scale-105 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-center text-xl">Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-700 mb-4">
                Chat with us in real-time (Coming Soon)
              </p>
              <Button disabled className="w-full bg-gray-400 text-gray-700 font-semibold cursor-not-allowed border-2 border-gray-500 hover:border-gray-600">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="shadow-2xl border-2 border-blue-200 hover:border-blue-400 mb-12 transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-3xl flex items-center gap-3">
              <HelpCircle className="h-10 w-10" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border-2 border-blue-200 hover:border-blue-500 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 flex items-center justify-between transition-colors"
                  >
                    <span className="font-semibold text-left text-gray-900">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="p-4 bg-white border-t-2 border-blue-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-2xl border-2 border-purple-200 hover:border-purple-400 mb-12 hover:shadow-3xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Mail className="h-8 w-8 text-purple-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                <h3 className="font-bold text-lg mb-3 text-blue-900">General Inquiries</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> useful@usefulio.com
                </p>
                <p className="text-gray-700">
                  We typically respond within 24 hours
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all duration-300">
                <h3 className="font-bold text-lg mb-3 text-green-900">Technical Support</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> support@usefulio.com
                </p>
                <p className="text-gray-700">
                  24/7 support for urgent issues
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card className="shadow-2xl border-2 border-indigo-200 hover:border-indigo-400 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-3xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Video className="h-8 w-8 text-blue-600" />
              Additional Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/about" className="p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <h4 className="font-bold mb-2 text-blue-900">About Usefulio</h4>
                <p className="text-gray-700 text-sm">Learn more about our mission and values</p>
              </Link>

              <Link href="/privacy" className="p-4 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-500 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <h4 className="font-bold mb-2 text-purple-900">Privacy Policy</h4>
                <p className="text-gray-700 text-sm">How we handle your personal information</p>
              </Link>

              <Link href="/terms" className="p-4 bg-white rounded-lg border-2 border-green-200 hover:border-green-500 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <h4 className="font-bold mb-2 text-green-900">Terms of Service</h4>
                <p className="text-gray-700 text-sm">Our terms and conditions</p>
              </Link>

              <Link href="/blog" className="p-4 bg-white rounded-lg border-2 border-pink-200 hover:border-pink-500 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <h4 className="font-bold mb-2 text-pink-900">Browse Products</h4>
                <p className="text-gray-700 text-sm">Explore our product reviews and guides</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
