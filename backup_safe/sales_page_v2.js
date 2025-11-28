'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowLeft, Star, Package, Check, X, Shield, Zap, Users, Clock, Share2, Heart, Facebook, Twitter, Linkedin, Minus, Plus, ExternalLink, CreditCard, Award } from 'lucide-react'
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

      {/* Hero Section - Compact with Sidebar */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Product Info + Pricing (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <Card className="border-2 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
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
                      <Badge className="absolute top-4 right-4 bg-blue-600 text-white font-bold px-4 py-2 text-sm">
                        {product.category || 'AI-SaaS'}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    
                    <div className="flex items-center gap-3">
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
                      <span className="text-xl font-bold text-gray-900">
                        {product.rating || 4.8}
                      </span>
                      <span className="text-gray-600 text-sm">Average Review</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-green-200">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-semibold">AI</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-blue-200">
                        <Check className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-semibold">Productivity</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-purple-200">
                        <Check className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-semibold">Content Creation</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-lg p-3 border-2 border-orange-200">
                        <Check className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-semibold">Coding Assistant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing Box - Big Blue */}
            <Card className="border-2 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
                <div className="grid md:grid-cols-2 gap-6 p-8">
                  {/* Left Side - Price Info */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-blue-100 text-sm font-semibold mb-2">Special Launch Price</p>
                      <div className="flex items-baseline gap-4">
                        <span className="text-6xl font-bold">${salePrice}</span>
                        <div>
                          <span className="text-2xl line-through opacity-75">${originalPrice}</span>
                          <Badge className="ml-2 bg-yellow-400 text-yellow-900 font-bold px-3 py-1.5">
                            Save {discount}%
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-lg text-blue-100">
                      One-time payment • Lifetime access
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                          <Check className="h-5 w-5" />
                        </div>
                        <span>Instant digital delivery</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                          <Check className="h-5 w-5" />
                        </div>
                        <span>30-day money-back guarantee</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                          <Check className="h-5 w-5" />
                        </div>
                        <span>Secure checkout process</span>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Quantity</label>
                      <div className="flex items-center gap-3 bg-white/10 rounded-lg p-1 w-fit">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="text-white hover:bg-white/20 h-10 w-10"
                        >
                          <Minus className="h-5 w-5" />
                        </Button>
                        <span className="text-3xl font-bold w-16 text-center">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQuantity(quantity + 1)}
                          className="text-white hover:bg-white/20 h-10 w-10"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Action Buttons */}
                  <div className="space-y-4 flex flex-col justify-center">
                    <Button size="lg" className="w-full h-16 text-xl bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-2xl">
                      <CreditCard className="mr-3 h-6 w-6" />
                      Buy Now - ${(salePrice * quantity).toFixed(2)}
                    </Button>
                    
                    <Button size="lg" variant="outline" className="w-full h-14 text-lg border-2 border-white text-white hover:bg-white/10">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Visit Official Store
                    </Button>

                    {/* Share & Save */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Share:</span>
                        <Button size="icon" variant="ghost" onClick={() => handleShare('facebook')} className="text-white hover:bg-white/20 h-9 w-9">
                          <Facebook className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleShare('twitter')} className="text-white hover:bg-white/20 h-9 w-9">
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleShare('linkedin')} className="text-white hover:bg-white/20 h-9 w-9">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <Heart className="h-5 w-5 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Unbiased Review */}
            <Card className="border-2 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Award className="h-8 w-8 text-blue-600" />
                  Unbiased Review to Help You Make Informed Decisions
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  After extensive testing and evaluation, we've found this product to be exceptional in its category. 
                  It delivers on its promises and provides genuine value for money. Our team has thoroughly assessed 
                  all aspects including performance, ease of use, support quality, and overall user experience. This is 
                  a comprehensive solution that stands out from competitors.
                </p>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-2 border-blue-400 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2">4,615.0</div>
                  <div className="text-blue-100 font-semibold">User Rating</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-2 border-green-400 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2">756+</div>
                  <div className="text-green-100 font-semibold">Active Users</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-2 border-pink-400 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold mb-2">Instant</div>
                  <div className="text-pink-100 font-semibold">Setup Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Key Features & Benefits */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-3xl">Key Features & Benefits</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { num: 1, title: 'Powerful Automation', desc: 'Automate repetitive tasks and save hours every week with intelligent AI-powered workflows.', color: 'blue' },
                    { num: 2, title: 'Seamless Workflow', desc: 'Integrate smoothly with your existing tools and processes for maximum efficiency.', color: 'green' },
                    { num: 3, title: 'Easy Integration', desc: 'Connect with popular platforms and services in just a few clicks.', color: 'purple' },
                    { num: 4, title: 'No-Code Solution', desc: 'Get started immediately without any technical knowledge or coding skills required.', color: 'orange' },
                  ].map((feature) => (
                    <div key={feature.num} className="flex items-start gap-4 p-4 bg-white rounded-lg border-2 hover:shadow-lg transition-shadow">
                      <div className={`h-12 w-12 rounded-full bg-${feature.color}-100 flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-2xl font-bold text-${feature.color}-600`}>{feature.num}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-red-50">
                <CardTitle className="text-3xl">Pros & Cons</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                      <Check className="h-6 w-6" />
                      Pros
                    </h3>
                    <ul className="space-y-3">
                      {[
                        'Exceptional AI capabilities and accuracy',
                        'User-friendly interface and easy to navigate',
                        'Excellent customer support and documentation',
                        'Regular updates and new features',
                        'Great value for money'
                      ].map((pro, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                      <X className="h-6 w-6" />
                      Cons
                    </h3>
                    <ul className="space-y-3">
                      {[
                        'Learning curve for advanced features',
                        'Requires internet connection',
                        'Limited offline functionality'
                      ].map((con, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expert Review */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-3xl">Our Expert Review</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  Our team of experts has thoroughly tested and evaluated this product across multiple dimensions.
                </p>
                <div className="space-y-4">
                  {[
                    { label: 'Value for Money', score: 9.2, color: 'blue' },
                    { label: 'Ease of Use', score: 8.8, color: 'green' },
                    { label: 'Customer Support', score: 9.0, color: 'purple' },
                    { label: 'Features & Functionality', score: 9.5, color: 'orange' },
                    { label: 'Performance', score: 8.5, color: 'pink' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-900">{item.label}</span>
                        <span className={`text-${item.color}-600 font-bold`}>{item.score}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className={`bg-${item.color}-600 h-3 rounded-full transition-all`} style={{width: `${item.score * 10}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-3">4.6/5</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-7 w-7 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-gray-600 font-semibold text-lg">Overall Rating</div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-3xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="space-y-4">
                  {[
                    { q: 'What payment methods do you accept?', a: 'We accept all major payment methods including Credit/Debit Cards (Visa, Mastercard, American Express), PayPal, Stripe, and Bank Transfer. All payments are processed securely with SSL encryption.' },
                    { q: 'Is there a money-back guarantee?', a: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied with your purchase for any reason, contact our support team within 30 days for a full refund.' },
                    { q: 'How quickly will I receive access?', a: 'Access is instant! Once your payment is confirmed, you\'ll receive an email with your login credentials and access instructions within minutes.' },
                    { q: 'Do you offer customer support?', a: 'Absolutely! Our dedicated support team is available 24/7 via email and live chat to help you with any questions or issues you may have.' },
                    { q: 'Can I upgrade or cancel my subscription?', a: 'This is a one-time purchase with lifetime access - no subscription required! You can upgrade to premium features at any time with a simple one-click process.' },
                  ].map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="bg-white border-2 rounded-lg px-6">
                      <AccordionTrigger className="text-left font-semibold text-lg hover:text-blue-600">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-base">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sticky Sidebar (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Special Offer Card */}
              <Card className="border-2 border-red-300 shadow-2xl">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-center">
                    <Badge className="bg-white text-red-600 font-bold px-4 py-1.5 text-sm">
                      HOT DEAL
                    </Badge>
                  </div>
                  <div className="p-6">
                    <p className="text-center text-sm font-semibold text-gray-600 mb-3">Special Offer</p>
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold text-blue-600 mb-2">${salePrice}</div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-xl line-through text-gray-400">${originalPrice}</span>
                        <Badge className="bg-green-500 text-white font-bold">Save {discount}%</Badge>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold">Instant Access</div>
                          <div className="text-gray-500 text-xs">Start immediately</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold">30-Day Guarantee</div>
                          <div className="text-gray-500 text-xs">Risk-free purchase</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold">24/7 Support</div>
                          <div className="text-gray-500 text-xs">Always here to help</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button size="lg" className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg">
                        Get Instant Access
                      </Button>
                      <Button size="lg" variant="outline" className="w-full h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold">
                        Visit Official Site
                      </Button>
                    </div>
                    
                    <p className="text-xs text-center text-gray-500 mt-4">
                      🔒 Secure checkout • Terms & Conditions Apply
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Verified & Trusted */}
              <Card className="border-2 bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="h-20 w-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Verified & Trusted</h3>
                  <p className="text-sm text-gray-700 mb-3">Recommended by 1,250+ users worldwide</p>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
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
            <Button size="lg" className="h-16 px-12 text-xl bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-2xl">
              Get Instant Access Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
