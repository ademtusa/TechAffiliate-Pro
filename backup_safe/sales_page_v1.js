'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowLeft, Star, Package, Check, X, Shield, Zap, TrendingUp, Users, Clock, Share2, Heart, Facebook, Twitter, Linkedin, ChevronDown, ChevronUp, Minus, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SalesPage() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const result = await response.json()
      
      if (result.success) {
        setProduct(result.data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out ${product?.name}!`)
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Product not found</p>
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const salePrice = product.price || 29.99
  const originalPrice = product.original_price || 49.99
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/blog">
          <Button variant="ghost" className="gap-2 hover:bg-white/60">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      {/* Hero Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left - Product Image */}
          <div className="relative">
            <Card className="overflow-hidden border-2 shadow-2xl">
              <div className="relative aspect-square bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-32 w-32 text-blue-300" />
                  </div>
                )}
                <Badge className="absolute top-4 right-4 bg-blue-600 text-white text-sm px-4 py-2">
                  {product.category || 'AI-SaaS'}
                </Badge>
              </div>
            </Card>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 4.8)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  {product.rating || 4.8}
                </span>
                <span className="text-gray-600">Average Review</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="px-4 py-2 text-sm border-2 border-blue-500 text-blue-700 hover:bg-blue-50">
                🤖 AI Powered
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm border-2 border-green-500 text-green-700 hover:bg-green-50">
                ⚡ Productivity
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm border-2 border-purple-500 text-purple-700 hover:bg-purple-50">
                ✍️ Content Creation
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm border-2 border-orange-500 text-orange-700 hover:bg-orange-50">
                💻 Coding Assistant
              </Badge>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'Transform your workflow with cutting-edge AI technology. Perfect for professionals, creators, and developers looking to boost productivity and creativity.'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pricing Box */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-2 shadow-2xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">🎉 Special Launch Price</h2>
                
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-6xl font-bold">${salePrice}</span>
                  <div>
                    <span className="text-2xl line-through opacity-75">${originalPrice}</span>
                    <Badge className="ml-3 bg-yellow-400 text-yellow-900 font-bold px-3 py-1">
                      Save {discount}%
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-lg">💳 One-time payment • Lifetime access</p>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    <span>Instant delivery after purchase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>

                <Separator className="my-6 bg-white/20" />

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">Quantity</label>
                  <div className="flex items-center gap-4 bg-white/10 rounded-lg p-2 w-fit">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-white hover:bg-white/20"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-white hover:bg-white/20"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button size="lg" className="w-full h-14 text-lg bg-white text-blue-600 hover:bg-gray-100 font-bold">
                    💳 Buy Now - ${(salePrice * quantity).toFixed(2)}
                  </Button>
                  <Button size="lg" variant="outline" className="w-full h-14 text-lg border-2 border-white text-white hover:bg-white/10">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Visit Official Store
                  </Button>
                </div>

                {/* Share & Save */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Share:</span>
                    <Button size="sm" variant="ghost" onClick={() => handleShare('facebook')} className="text-white hover:bg-white/20">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleShare('twitter')} className="text-white hover:bg-white/20">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleShare('linkedin')} className="text-white hover:bg-white/20">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Heart className="h-5 w-5 mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Unbiased Review */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">📝 Our Unbiased Review</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                After extensive testing and evaluation, we've found this product to be exceptional in its category. 
                It delivers on its promises and provides genuine value for money. Our team has thoroughly assessed 
                all aspects including performance, ease of use, support quality, and overall user experience.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-2 shadow-lg">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3" />
                  <div className="text-4xl font-bold mb-2">4,615.0</div>
                  <div className="text-blue-100">User Rating</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-2 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-3" />
                  <div className="text-4xl font-bold mb-2">756+</div>
                  <div className="text-green-100">Active Users</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-2 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-3" />
                  <div className="text-4xl font-bold mb-2">Instant</div>
                  <div className="text-pink-100">Setup Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Key Features & Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Key Features & Benefits</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Powerful Automation</h3>
                        <p className="text-gray-600">Automate repetitive tasks and save hours every week with intelligent AI-powered workflows.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-green-600">2</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Seamless Workflow</h3>
                        <p className="text-gray-600">Integrate smoothly with your existing tools and processes for maximum efficiency.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-purple-600">3</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Integration</h3>
                        <p className="text-gray-600">Connect with popular platforms and services in just a few clicks.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-orange-600">4</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No-Code Solution</h3>
                        <p className="text-gray-600">Get started immediately without any technical knowledge or coding skills required.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Pros & Cons */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">⚖️ Pros & Cons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Pros */}
                  <div>
                    <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      Pros
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Exceptional AI capabilities and accuracy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">User-friendly interface and easy to navigate</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Excellent customer support and documentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Regular updates and new features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Great value for money</span>
                      </li>
                    </ul>
                  </div>
                  {/* Cons */}
                  <div>
                    <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                      <X className="h-5 w-5" />
                      Cons
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Learning curve for advanced features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Requires internet connection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Limited offline functionality</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expert Review */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">👨‍💼 Our Expert Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Our team of experts has thoroughly tested and evaluated this product across multiple dimensions. 
                  Here's our detailed assessment:
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Value for Money</span>
                      <span className="text-blue-600 font-bold">9.2/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Ease of Use</span>
                      <span className="text-green-600 font-bold">8.8/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{width: '88%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Customer Support</span>
                      <span className="text-purple-600 font-bold">9.0/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full" style={{width: '90%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Features & Functionality</span>
                      <span className="text-orange-600 font-bold">9.5/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-orange-600 h-3 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Performance</span>
                      <span className="text-pink-600 font-bold">8.5/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-pink-600 h-3 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">4.6/5</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-gray-600 font-semibold">Overall Rating</div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">❓ Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-white border-2 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold text-lg">
                    What payment methods do you accept?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    We accept all major payment methods including Credit/Debit Cards (Visa, Mastercard, American Express), 
                    PayPal, Stripe, and Bank Transfer. All payments are processed securely with SSL encryption.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-white border-2 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold text-lg">
                    Is there a money-back guarantee?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes! We offer a 30-day money-back guarantee. If you're not satisfied with your purchase for any reason, 
                    contact our support team within 30 days for a full refund.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="bg-white border-2 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold text-lg">
                    How quickly will I receive access?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Access is instant! Once your payment is confirmed, you'll receive an email with your login credentials 
                    and access instructions within minutes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="bg-white border-2 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold text-lg">
                    Do you offer customer support?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Absolutely! Our dedicated support team is available 24/7 via email and live chat to help you with any 
                    questions or issues you may have.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="bg-white border-2 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold text-lg">
                    Can I upgrade or cancel my subscription?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    This is a one-time purchase with lifetime access - no subscription required! You can upgrade to premium 
                    features at any time with a simple one-click process.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Special Offer Card */}
              <Card className="border-2 shadow-2xl">
                <CardContent className="p-6">
                  <Badge className="bg-red-500 text-white font-bold px-3 py-1 mb-4">
                    🔥 HOT DEAL
                  </Badge>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-blue-600 mb-2">${salePrice}</div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-xl line-through text-gray-400">${originalPrice}</span>
                      <Badge className="bg-green-500 text-white">Save {discount}%</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Limited Time Offer</p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span>Instant Access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span>30-Day Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>24/7 Support</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold">
                      Get Instant Access
                    </Button>
                    <Button size="lg" variant="outline" className="w-full border-2">
                      Visit Official Site
                    </Button>
                  </div>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
                    🔒 Secure checkout • SSL encrypted
                  </p>
                </CardContent>
              </Card>

              {/* Verified & Trusted */}
              <Card className="border-2 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Verified & Trusted</h3>
                  <p className="text-sm text-gray-700 mb-3">Recommended by 1,250+ users</p>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-2 shadow-2xl mt-12">
          <CardContent className="p-12 text-center">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and transform your workflow today. 
              Special launch pricing won't last forever!
            </p>
            <Button size="lg" className="h-14 px-12 text-lg bg-white text-blue-600 hover:bg-gray-100 font-bold">
              Get Instant Access Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
