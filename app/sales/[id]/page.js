'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowLeft, Star, Package, Check, X, Shield, Zap, Users, Clock, Share2, Heart, Facebook, Twitter, Linkedin, Minus, Plus, ExternalLink, CreditCard, Award, TrendingUp, Smile, Wrench, Layers } from 'lucide-react'
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
      <div className="container mx-auto px-4 py-3">
        <Link href="/blog">
          <Button variant="ghost" className="gap-2 hover:bg-white/60 border border-transparent hover:border-blue-300 transition-all">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-6">
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left Column - Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hero Product Card - Like Image */}
            <Card className="border-2 shadow-xl hover:shadow-2xl transition-shadow hover:border-blue-300">
              <div className="p-6">
                <div className="grid md:grid-cols-5 gap-6">
                  {/* Product Image - Left (2 cols) */}
                  <div className="md:col-span-2">
                    <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-32 w-32 text-blue-300" />
                        </div>
                      )}
                      <Badge className="absolute top-3 right-3 bg-blue-600 text-white font-semibold px-3 py-1.5 text-sm">
                        {product.category || 'AI-SaaS'}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info - Right (3 cols) */}
                  <div className="md:col-span-3 space-y-4">
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
                        {product.name}
                      </h1>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating || 4.8) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-xl font-bold text-gray-900">{product.rating || 4.8}</span>
                        <span className="text-gray-600">Average Review</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: 'AI Powered', icon: '🤖', color: 'green' },
                        { label: 'Productivity', icon: '⚡', color: 'blue' },
                        { label: 'Content Creation', icon: '✍️', color: 'purple' },
                        { label: 'Coding Assistant', icon: '💻', color: 'orange' },
                      ].map((badge) => (
                        <Badge key={badge.label} variant="outline" className={`justify-start px-3 py-2 text-sm border-2 border-${badge.color}-300 text-${badge.color}-700 hover:bg-${badge.color}-50 transition-colors font-medium`}>
                          <span className="mr-1.5">{badge.icon}</span>
                          {badge.label}
                        </Badge>
                      ))}
                    </div>

                    <Separator />

                    <p className="text-gray-700 leading-relaxed">
                      {product.description || 'Transform your workflow with cutting-edge AI technology. Perfect for professionals, creators, and developers looking to boost productivity and creativity.'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing Box - Compact */}
            <Card className="border-2 shadow-xl hover:shadow-2xl transition-shadow hover:border-blue-300">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="grid md:grid-cols-2 gap-5 p-6">
                  {/* Left - Price */}
                  <div className="space-y-4">
                    <p className="text-blue-100 text-xs font-semibold uppercase tracking-wide">Special Launch Price</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-bold">${salePrice}</span>
                      <div>
                        <span className="text-xl line-through opacity-70">${originalPrice}</span>
                        <Badge className="ml-2 bg-yellow-400 text-yellow-900 font-bold px-2 py-0.5 text-xs">
                          {discount}% OFF
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-blue-100">One-time payment • Lifetime access</p>
                    
                    <div className="space-y-2">
                      {[
                        'Instant digital delivery',
                        '30-day money-back guarantee',
                        'Secure checkout process'
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Quantity</label>
                      <div className="flex items-center gap-2 bg-white/10 rounded-lg p-0.5 w-fit">
                        <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white hover:bg-white/20 h-8 w-8">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} className="text-white hover:bg-white/20 h-8 w-8">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="space-y-3 flex flex-col justify-center">
                    <Button size="lg" className="w-full h-14 text-lg bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-xl border-2 border-transparent hover:border-blue-300 transition-all">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Buy Now - ${(salePrice * quantity).toFixed(2)}
                    </Button>
                    
                    <Button size="lg" variant="outline" className="w-full h-12 border-2 border-white text-white hover:bg-white/10 font-semibold hover:border-blue-200 transition-all">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Official Store
                    </Button>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Share:</span>
                        {[{ icon: Facebook, platform: 'facebook' }, { icon: Twitter, platform: 'twitter' }, { icon: Linkedin, platform: 'linkedin' }].map(({ icon: Icon, platform }) => (
                          <Button key={platform} size="icon" variant="ghost" onClick={() => handleShare(platform)} className="text-white hover:bg-white/20 h-8 w-8 border border-transparent hover:border-white/30 transition-all">
                            <Icon className="h-3.5 w-3.5" />
                          </Button>
                        ))}
                      </div>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 text-xs border border-transparent hover:border-white/30 transition-all">
                        <Heart className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Unbiased Review - Minimal */}
            <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow hover:border-blue-300">
              <CardContent className="p-5">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="h-6 w-6 text-blue-600" />
                  Unbiased Review
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  After extensive testing, we've found this product exceptional in its category. It delivers on promises 
                  and provides genuine value. Our team assessed all aspects including performance, ease of use, and support quality.
                </p>
              </CardContent>
            </Card>

            {/* Stats Cards - Compact */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { value: '4,615.0', label: 'User Rating', color: 'blue' },
                { value: '756+', label: 'Active Users', color: 'green' },
                { value: 'Instant', label: 'Setup Time', color: 'pink' },
              ].map((stat) => (
                <Card key={stat.label} className={`bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 text-white border-2 border-${stat.color}-400 shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl font-bold mb-1">{stat.value}</div>
                    <div className={`text-${stat.color}-100 text-sm font-medium`}>{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Features - Compact */}
            <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow hover:border-blue-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                <CardTitle className="text-2xl">Key Features & Benefits</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { num: 1, title: 'Powerful Automation', desc: 'Automate repetitive tasks and save hours with AI workflows.', color: 'blue' },
                    { num: 2, title: 'Seamless Workflow', desc: 'Integrate smoothly with your existing tools.', color: 'green' },
                    { num: 3, title: 'Easy Integration', desc: 'Connect with popular platforms in just clicks.', color: 'purple' },
                    { num: 4, title: 'No-Code Solution', desc: 'Get started without any coding skills.', color: 'orange' },
                  ].map((feature) => (
                    <div key={feature.num} className="flex items-start gap-3 p-3 bg-white rounded-lg border-2 hover:shadow-md transition-all hover:border-blue-300">
                      <div className={`h-10 w-10 rounded-full bg-${feature.color}-100 flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-xl font-bold text-${feature.color}-600`}>{feature.num}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pros & Cons - Compact */}
            <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow hover:border-blue-300">
              <CardHeader className="bg-gradient-to-r from-green-50 to-red-50 pb-3">
                <CardTitle className="text-2xl">Pros & Cons</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-green-600 mb-3 flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      Pros
                    </h3>
                    <ul className="space-y-2">
                      {[
                        'Exceptional AI capabilities',
                        'User-friendly interface',
                        'Excellent support',
                        'Regular updates',
                        'Great value for money'
                      ].map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-600 mb-3 flex items-center gap-2">
                      <X className="h-5 w-5" />
                      Cons
                    </h3>
                    <ul className="space-y-2">
                      {[
                        'Learning curve for advanced features',
                        'Requires internet connection',
                        'Limited offline functionality'
                      ].map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expert Review - With Icons */}
            <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow hover:border-blue-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-3">
                <CardTitle className="text-2xl">Our Expert Review</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-gray-700 mb-5 text-sm leading-relaxed">
                  Our experts thoroughly tested this product across multiple dimensions.
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Value for Money', score: 9.2, color: 'blue', icon: TrendingUp },
                    { label: 'Ease of Use', score: 8.8, color: 'green', icon: Smile },
                    { label: 'Customer Support', score: 9.0, color: 'purple', icon: Users },
                    { label: 'Features', score: 9.5, color: 'orange', icon: Layers },
                    { label: 'Performance', score: 8.5, color: 'pink', icon: Zap },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 text-${item.color}-600`} />
                            <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                          </div>
                          <span className={`text-${item.color}-600 font-bold text-sm`}>{item.score}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`bg-${item.color}-600 h-2 rounded-full transition-all`} style={{width: `${item.score * 10}%`}}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Separator className="my-5" />
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">4.6/5</div>
                  <div className="flex items-center justify-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-gray-600 font-semibold">Overall Rating</div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ - Compact */}
            <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow hover:border-blue-300">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-3">
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <Accordion type="single" collapsible className="space-y-3">
                  {[
                    { q: 'What payment methods do you accept?', a: 'We accept all major payment methods including Credit/Debit Cards, PayPal, Stripe, and Bank Transfer. All payments are securely processed with SSL encryption.' },
                    { q: 'Is there a money-back guarantee?', a: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied, contact our support team within 30 days for a full refund.' },
                    { q: 'How quickly will I receive access?', a: 'Access is instant! Once your payment is confirmed, you\'ll receive an email with your credentials within minutes.' },
                    { q: 'Do you offer customer support?', a: 'Absolutely! Our support team is available 24/7 via email and live chat.' },
                    { q: 'Can I upgrade or cancel?', a: 'This is a one-time purchase with lifetime access - no subscription! You can upgrade to premium features anytime.' },
                  ].map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="bg-white border-2 rounded-lg px-4 hover:border-blue-300 transition-colors">
                      <AccordionTrigger className="text-left font-semibold hover:text-blue-600 text-sm py-3">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-sm pb-3">
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
            <div className="sticky top-4 space-y-5">
              {/* Special Offer Card - Compact */}
              <Card className="border-2 border-red-300 shadow-xl hover:shadow-2xl transition-all hover:border-red-400">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 text-center">
                  <Badge className="bg-white text-red-600 font-bold px-3 py-1 text-xs">
                    🔥 HOT DEAL
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <p className="text-center text-xs font-semibold text-gray-600 mb-2">Special Offer</p>
                  <div className="text-center mb-3">
                    <div className="text-4xl font-bold text-blue-600 mb-1">${salePrice}</div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg line-through text-gray-400">${originalPrice}</span>
                      <Badge className="bg-green-500 text-white font-bold text-xs">Save {discount}%</Badge>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="space-y-2 mb-4">
                    {[
                      { icon: Zap, title: 'Instant Access', desc: 'Start immediately', color: 'green' },
                      { icon: Shield, title: '30-Day Guarantee', desc: 'Risk-free', color: 'blue' },
                      { icon: Users, title: '24/7 Support', desc: 'Always here', color: 'purple' },
                    ].map(({ icon: Icon, title, desc, color }) => (
                      <div key={title} className="flex items-center gap-2 text-xs">
                        <div className={`h-7 w-7 rounded-full bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`h-3.5 w-3.5 text-${color}-600`} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{title}</div>
                          <div className="text-gray-500 text-xs">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Button size="lg" className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg border-2 border-transparent hover:border-blue-300 transition-all">
                      Get Instant Access
                    </Button>
                    <Button size="lg" variant="outline" className="w-full h-10 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-sm hover:border-blue-700 transition-all">
                      Visit Official Site
                    </Button>
                  </div>
                  
                  <p className="text-xs text-center text-gray-500 mt-3">
                    🔒 Secure checkout • SSL encrypted
                  </p>
                </CardContent>
              </Card>

              {/* Verified & Trusted - Compact */}
              <Card className="border-2 bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-xl hover:shadow-2xl transition-all hover:border-green-400">
                <CardContent className="p-4 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Verified & Trusted</h3>
                  <p className="text-xs text-gray-700 mb-2">Recommended by 1,250+ users</p>
                  <div className="flex items-center justify-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
