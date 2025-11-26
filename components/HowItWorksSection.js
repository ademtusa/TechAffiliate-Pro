'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Search, Share2, DollarSign, ChevronDown, ChevronUp, TrendingUp, Clock, CreditCard, Users, BarChart3, Zap, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HowItWorksSection() {
  const [openFaq, setOpenFaq] = useState(0)

  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Sign Up Free',
      description: 'Create your affiliate account in 60 seconds',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      number: '02',
      icon: Search,
      title: 'Choose Products',
      description: 'Browse 50K+ products with up to 50% commission',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      number: '03',
      icon: Share2,
      title: 'Share Your Links',
      description: 'Share on blog, social media, or email',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      number: '04',
      icon: DollarSign,
      title: 'Earn Commission',
      description: 'Get paid monthly. Track earnings in real-time',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    }
  ]

  const faqs = [
    {
      question: 'How much money can you realistically make as an affiliate marketer in 2025?',
      answer: "Earnings vary widely based on your strategy, niche, and effort. Beginners typically earn $100-$1,000/month in their first 6 months. Intermediate affiliates make $1,000-$10,000/month, while top performers earn $10,000-$100,000+ monthly. On our platform, the average active affiliate earns $2,847/month across tech, SaaS, and hosting niches. Your income potential increases with traffic, conversion optimization, and choosing high-ticket products (20-50% commission rates).",
      icon: TrendingUp
    },
    {
      question: 'What are the highest paying affiliate programs for beginners without experience?',
      answer: "High-paying beginner-friendly programs include: (1) SaaS products - 20-40% recurring commissions (e.g., $50-$200 per sale), (2) Web hosting - 50-100% of first payment ($50-$300), (3) VPN services - $50-$125 per sale, (4) Online courses - 30-50% ($30-$500), and (5) Cloud services - 15-25% recurring. Focus on products with 30-day cookies, recurring commissions, and low refund rates for maximum earnings.",
      icon: DollarSign
    },
    {
      question: 'How long does it actually take to make your first $1000 with affiliate marketing?',
      answer: "Most successful affiliates reach their first $1,000 within 3-6 months with consistent effort. Timeline depends on: (1) Traffic sources - paid ads (1-2 months) vs organic SEO (4-6 months), (2) Content quality - 20-30 high-quality posts accelerate results, (3) Niche competition - low-competition niches convert faster, and (4) Email list - building 1,000+ subscribers can cut timeline in half. Focus on high-intent keywords, product comparisons, and buyer-focused content for faster results.",
      icon: Clock
    },
    {
      question: 'Do you need a website or blog to start affiliate marketing successfully?',
      answer: "No, a website isn't required but highly recommended for long-term success. You can start with: (1) Social media (Instagram, TikTok, YouTube) - great for visual products, (2) Email marketing - build a list with lead magnets, (3) Pinterest - drives passive traffic to affiliate links, or (4) Review platforms and forums. However, owning a website gives you full control, better SEO ranking, and builds a valuable asset. 78% of top-earning affiliates have their own website or blog.",
      icon: BarChart3
    },
    {
      question: 'How do affiliate marketers get paid - monthly, per sale, or per click?',
      answer: "Payment models vary: (1) Pay-Per-Sale (PPS) - most common, earn 5-50% per purchase (e.g., $20-$500), (2) Recurring commissions - monthly payments for subscriptions (e.g., $30/month for SaaS), (3) Pay-Per-Lead (PPL) - $1-$50 per signup/trial, and (4) Pay-Per-Click (PPC) - rare, $0.10-$1 per click. Most programs pay monthly via PayPal, bank transfer, or crypto with $50-$100 minimum payout threshold. Payment timing: Net-30 to Net-60 (30-60 days after sale).",
      icon: CreditCard
    },
    {
      question: 'What is the average commission rate for tech and SaaS affiliate products?',
      answer: "Tech and SaaS products offer the highest commissions: (1) SaaS software - 20-40% recurring (lifetime value: $500-$5,000+), (2) Web hosting - 50-150% of first payment ($50-$300), (3) Cloud services - 15-25% monthly recurring, (4) Security software - 20-35% per sale ($30-$150), and (5) Tech hardware - 1-5% per sale ($10-$100). SaaS affiliates earn the most long-term due to recurring monthly commissions. A single customer can generate $1,000+ over their lifetime.",
      icon: Zap
    },
    {
      question: 'Can you succeed in affiliate marketing without social media followers or audience?',
      answer: "Yes! Many top affiliates start with zero followers using: (1) SEO content - target buyer-intent keywords (e.g., 'best CRM for small business 2025'), (2) Paid ads - Google Ads, Facebook Ads for instant traffic, (3) Review sites - create comparison/review websites, (4) YouTube SEO - product tutorials rank well without subscribers, and (5) Niche communities - Reddit, Quora, Facebook groups. Focus on solving specific problems and creating helpful content. 43% of successful affiliates built their business with less than 1,000 followers initially.",
      icon: Users
    },
    {
      question: 'How to increase affiliate conversion rates and double your sales quickly?',
      answer: "Boost conversions with proven strategies: (1) Use comparison tables - increases conversions by 35%, (2) Add urgency - limited-time deals boost sales 40%, (3) Show real screenshots/results - builds trust, increases clicks by 25%, (4) Target buyer keywords - 'best', 'review', 'vs' convert 3x higher, (5) Create bonus offers - exclusive bonuses increase conversion 50%, (6) A/B test CTAs - 'Get 50% Off' outperforms 'Click Here', and (7) Use retargeting pixels - recover 20-30% of lost sales. Average conversion rate: 1-3% for cold traffic, 5-15% for warm audiences.",
      icon: TrendingUp
    }
  ]

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto">
        {/* How It Works Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm">
            Simple Process
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            How Affiliate Marketing Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start earning commissions in 4 simple steps. No experience required.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl group">
              <CardContent className="p-6">
                {/* Step Number Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-sm">
              Frequently Asked Questions
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Everything You Need to Know
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about affiliate marketing earnings, programs, and success strategies
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className={`border-2 transition-all duration-300 cursor-pointer ${
                  openFaq === index ? 'border-blue-500 shadow-xl' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleFaq(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center transition-transform ${
                      openFaq === index ? 'scale-110' : ''
                    }`}>
                      <faq.icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                          {faq.question}
                        </h3>
                        {openFaq === index ? (
                          <ChevronUp className="flex-shrink-0 h-6 w-6 text-blue-600" />
                        ) : (
                          <ChevronDown className="flex-shrink-0 h-6 w-6 text-gray-400" />
                        )}
                      </div>

                      {/* Answer */}
                      {openFaq === index && (
                        <div className="mt-4 text-gray-700 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h3>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Join 100,000+ affiliates earning consistent commissions from top tech and SaaS products
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
              Start Free Today
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-bold text-lg hover:bg-white/20 transition-all">
              View Products
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
