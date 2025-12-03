'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import AdSense from '@/components/AdSense'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [featuredProduct, setFeaturedProduct] = useState(null)

  const fetchFeaturedProduct = async () => {
    try {
      const response = await fetch('/api/products')
      const result = await response.json()
      
      if (result.success && result.data && result.data.length > 0) {
        // Get a random featured product
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
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section with Featured Product */}
      <HeroSection 
        title="Get In Touch"
        subtitle="Have questions or need support? We&apos;re here to help! Send us a message and don&apos;t forget — Take a Look at This Product Before You Leave!"
        featuredProduct={featuredProduct}
        featuredType="specialDeal"
      />

      {/* Contact Content - Modern Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Contact Form */}
          <div className="space-y-6">
            <Card className="shadow-2xl border-2 border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Send className="h-6 w-6" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for contacting us. We&apos;ll respond within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-12 border-2 border-gray-300 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-12 border-2 border-gray-300 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-gray-700 font-semibold">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="h-12 border-2 border-gray-300 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-gray-700 font-semibold">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="resize-none border-2 border-gray-300 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all" 
                      disabled={submitting}
                    >
                      <Send className="mr-2 h-5 w-5" />
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Why Contact Us Card */}
            <Card className="shadow-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-xl text-purple-900">Why Contact Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Fast Response Time</p>
                    <p className="text-xs text-gray-600">We typically respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Expert Support Team</p>
                    <p className="text-xs text-gray-600">Our team has years of industry experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Personalized Solutions</p>
                    <p className="text-xs text-gray-600">Every inquiry gets individual attention</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="shadow-xl border-2 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-xl">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Email</h4>
                    <p className="text-sm text-gray-600">support@usefulio.com</p>
                    <p className="text-sm text-gray-600">useful@usefulio.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Phone</h4>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-600">Mon-Fri, 9AM - 6PM EST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Office</h4>
                    <p className="text-sm text-gray-600">123 Tech Street</p>
                    <p className="text-sm text-gray-600">San Francisco, CA 94105</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="shadow-xl border-2 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-xl">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="/" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Browse Products</span>
                </a>
                <a href="/products" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Read Reviews</span>
                </a>
                <a href="/resources" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Free Resources</span>
                </a>
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card className="shadow-xl border-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl">Support Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-gray-600">9AM - 6PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday</span>
                    <span className="text-gray-600">10AM - 4PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sunday</span>
                    <span className="text-gray-600">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
