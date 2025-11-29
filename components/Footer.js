'use client'

import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Share2, Mail, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Footer({ categories = [] }) {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    // Mock newsletter subscription
    console.log('Newsletter subscription:', newsletterEmail)
    setSubscribed(true)
    setTimeout(() => {
      setSubscribed(false)
      setNewsletterEmail('')
    }, 3000)
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-white" />
            <h3 className="text-3xl font-bold mb-3 text-white">Stay Updated!</h3>
            <p className="text-lg text-blue-50 mb-6">
              Subscribe to our newsletter and get exclusive deals, tips, and updates delivered to your inbox.
            </p>
            
            {subscribed ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <CheckCircle className="h-8 w-8 text-green-300" />
                <span className="text-xl font-semibold text-white">Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="max-w-xl mx-auto">
                <div className="flex gap-3 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-2xl">
                  <Input
                    type="email"
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="flex-1 h-12 text-base bg-white/90 text-gray-900 border-0 shadow-sm"
                  />
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="h-12 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-blue-100 mt-3">
                  No spam, unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h4 className="text-xl font-bold mb-4 text-white">Usefulio</h4>
              <p className="text-gray-400 leading-relaxed mb-4">
                Find what's actually useful. Your trusted guide for product reviews and comparisons that help you make smarter buying decisions.
              </p>
              <div className="flex space-x-3">
                <div className="p-2 rounded-lg border border-gray-600 hover:border-blue-400 hover:bg-blue-900/20 transition-all duration-300 cursor-pointer group">
                  <Facebook className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="p-2 rounded-lg border border-gray-600 hover:border-blue-300 hover:bg-blue-900/20 transition-all duration-300 cursor-pointer group">
                  <Twitter className="h-5 w-5 text-gray-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <div className="p-2 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-blue-900/20 transition-all duration-300 cursor-pointer group">
                  <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="p-2 rounded-lg border border-gray-600 hover:border-pink-400 hover:bg-pink-900/20 transition-all duration-300 cursor-pointer group">
                  <Instagram className="h-5 w-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
                </div>
                <div className="p-2 rounded-lg border border-gray-600 hover:border-red-500 hover:bg-red-900/20 transition-all duration-300 cursor-pointer group">
                  <Youtube className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
                <div className="p-2 rounded-lg border border-gray-600 hover:border-purple-400 hover:bg-purple-900/20 transition-all duration-300 cursor-pointer group">
                  <Share2 className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-semibold mb-4 text-white text-lg">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h5 className="font-semibold mb-4 text-white text-lg">Categories</h5>
              <ul className="space-y-2 text-gray-400">
                {categories.length > 0 ? (
                  categories.slice(0, 4).map((cat) => (
                    <li key={cat.id}>
                      <Link 
                        href={`/blog?category=${cat.slug}`} 
                        className="hover:text-white transition-colors hover:pl-2 inline-block transition-all"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><Link href="/blog?category=ai-saas" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">AI & SaaS</Link></li>
                    <li><Link href="/blog?category=hosting" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">Hosting</Link></li>
                    <li><Link href="/blog?category=productivity" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">Productivity</Link></li>
                    <li><Link href="/blog?category=security" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">Security</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h5 className="font-semibold mb-4 text-white text-lg">Legal & Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors hover:pl-2 inline-block transition-all">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-700 mb-6" />
          
          {/* Copyright */}
          <div className="text-center text-gray-400">
            <p className="text-sm">
              © {new Date().getFullYear()} Usefulio. All rights reserved. Find what's actually useful.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
