'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Search, Share2, DollarSign, Plus, Minus, TrendingUp, Clock, CreditCard, Users, BarChart3, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HowItWorksSection() {
  const [openFaq, setOpenFaq] = useState(0)

  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Create account in 60 seconds',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      number: '02',
      icon: Search,
      title: 'Browse',
      description: '50K+ products, up to 50% commission',
      gradient: 'from-purple-600 to-pink-500'
    },
    {
      number: '03',
      icon: Share2,
      title: 'Share',
      description: 'Get tracking links, share anywhere',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      number: '04',
      icon: DollarSign,
      title: 'Earn',
      description: 'Monthly payouts, real-time tracking',
      gradient: 'from-green-500 to-emerald-500'
    }
  ]

  const faqs = [
    {
      q: 'How much money can you realistically make as an affiliate marketer in 2025?',
      a: "Earnings vary widely. Beginners: $100-$1K/month (first 6 months). Intermediate: $1K-$10K/month. Top performers: $10K-$100K+/month. Our platform average: $2,847/month across tech, SaaS, hosting niches. Income grows with traffic, conversion optimization, and high-ticket products (20-50% rates).",
      icon: TrendingUp
    },
    {
      q: 'What are the highest paying affiliate programs for beginners without experience?',
      a: "Top beginner programs: (1) SaaS - 20-40% recurring ($50-$200/sale), (2) Hosting - 50-100% first payment ($50-$300), (3) VPN - $50-$125/sale, (4) Online courses - 30-50% ($30-$500), (5) Cloud services - 15-25% recurring. Focus on 30-day cookies, recurring commissions, low refunds.",
      icon: DollarSign
    },
    {
      q: 'How long does it take to make your first $1000 with affiliate marketing?',
      a: "3-6 months typically. Timeline factors: Paid ads (1-2 months) vs SEO (4-6 months), 20-30 quality posts accelerate results, low-competition niches convert faster, 1,000+ email subscribers cut time in half. Focus on buyer keywords, comparisons, and product-focused content.",
      icon: Clock
    },
    {
      q: 'Do you need a website to start affiliate marketing successfully?',
      a: "Not required but recommended. Alternatives: Social media (Instagram, TikTok, YouTube), email marketing with lead magnets, Pinterest for passive traffic, review platforms. However, 78% of top earners own websites for SEO control and asset building.",
      icon: BarChart3
    },
    {
      q: 'How do affiliate marketers get paid?',
      a: "Payment models: (1) Pay-Per-Sale (PPS) - 5-50% per purchase ($20-$500), (2) Recurring - monthly for subscriptions ($30/month SaaS), (3) Pay-Per-Lead (PPL) - $1-$50 per signup, (4) Pay-Per-Click (PPC) - $0.10-$1/click. Most pay monthly via PayPal, bank, or crypto. Threshold: $50-$100. Timing: Net-30 to Net-60.",
      icon: CreditCard
    },
    {
      q: 'Can you succeed without social media followers?',
      a: "Yes! Methods: SEO content targeting buyer keywords, paid ads for instant traffic, review sites with comparisons, YouTube product tutorials (rank without subscribers), niche communities (Reddit, Quora). 43% of successful affiliates started with <1,000 followers.",
      icon: Users
    },
    {
      q: 'How to increase affiliate conversion rates quickly?',
      a: "Proven tactics: Comparison tables (+35% conversions), urgency/scarcity (+40% sales), real screenshots (+25% clicks), buyer keywords ('best', 'review', 'vs' = 3x higher), exclusive bonuses (+50% conversion), A/B test CTAs, retargeting pixels (recover 20-30%). Average: 1-3% cold, 5-15% warm traffic.",
      icon: Zap
    }
  ]

  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
      
      <div className="container mx-auto relative z-10">
        {/* How It Works */}
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-sm px-4 py-1.5">
            Simple 4-Step Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start earning commissions in minutes
          </p>
        </div>

        {/* Steps - Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, idx) => (
            <div key={idx} className="group">
              <Card className="bg-white border-2 border-gray-100 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden h-full">
                <CardContent className="p-0">
                  {/* Icon Area */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 pt-12 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-100/20"></div>
                    <div className="relative">
                      {/* Number Badge - Half Outside, positioned higher */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white font-bold text-lg shadow-2xl border-4 border-white`}>
                          {step.number}
                        </div>
                      </div>
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl`}>
                        <step.icon className="h-9 w-9 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{step.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>

                    {/* Features List */}
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          {idx === 0 ? 'No credit card required' : 
                           idx === 1 ? 'Filter by niche & payout' :
                           idx === 2 ? 'Unique tracking links' :
                           'Real-time dashboard'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          {idx === 0 ? 'Setup in 60 seconds' : 
                           idx === 1 ? 'Up to 50% commission' :
                           idx === 2 ? 'Share anywhere' :
                           'Monthly payouts'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          {idx === 0 ? 'Free forever' : 
                           idx === 1 ? '50K+ products' :
                           idx === 2 ? 'Performance analytics' :
                           'Multiple payment methods'}
                        </span>
                      </li>
                    </ul>

                    {/* Button */}
                    <Link href={idx === 0 ? '/' : '/blog'}>
                      <button className={`w-full bg-gradient-to-r ${step.gradient} text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 group/btn`}>
                        {idx === 0 ? 'Get Started' : 'Learn More'}
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-sm px-4 py-1.5">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
              Affiliate Marketing Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about earning commissions
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className={`bg-white/70 backdrop-blur-sm rounded-xl border-2 transition-all cursor-pointer ${
                  openFaq === idx 
                    ? 'border-purple-400 shadow-xl' 
                    : 'border-white/60 hover:border-purple-200 shadow-md'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center transition-transform ${
                      openFaq === idx ? 'scale-110' : ''
                    }`}>
                      <faq.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight pr-2">
                          {faq.q}
                        </h3>
                        <div className="flex-shrink-0">
                          {openFaq === idx ? (
                            <Minus className="h-5 w-5 text-purple-600" />
                          ) : (
                            <Plus className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {openFaq === idx && (
                        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA - Compact */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full px-8 py-4 shadow-2xl">
            <span className="text-white font-bold">Ready to start earning?</span>
            <Link href="/blog">
              <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
