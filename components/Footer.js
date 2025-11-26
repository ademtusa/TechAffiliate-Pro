'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone, Send } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (email) {
      // Mock subscription - in production, this would send to an API
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-blue-800/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold mb-3">Stay Updated with Best Deals</h3>
            <p className="text-blue-200 mb-6 text-lg">
              Subscribe to our newsletter and never miss exclusive offers, product reviews, and affiliate tips.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 focus:border-blue-400"
              />
              <Button 
                type="submit"
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg font-semibold"
              >
                <Send className="mr-2 h-5 w-5" />
                Subscribe
              </Button>
            </form>
            
            {subscribed && (
              <p className="mt-4 text-green-400 font-semibold animate-pulse">
                ✓ Successfully subscribed! Check your inbox.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">✨</span> TechAffiliate Pro
            </h4>
            <p className="text-blue-200 mb-4 leading-relaxed">
              Your trusted source for discovering the best tech products, SaaS tools, and digital services with honest reviews and exclusive deals.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-blue-800/50">
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-blue-800/50">
                  <Twitter className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-blue-800/50">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-blue-800/50">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-blue-200 hover:text-white transition-colors flex items-center">
                  → Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-blue-200 hover:text-white transition-colors flex items-center">
                  → Product Reviews
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-blue-200 hover:text-white transition-colors flex items-center">
                  → Resources
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-blue-200 hover:text-white transition-colors flex items-center">
                  → Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xl font-bold mb-4">Categories</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  AI & SaaS Tools
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Web Hosting
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  VPN & Security
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Online Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Cloud Services
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-300">Email</p>
                  <a href="mailto:support@techaffiliate.com" className="text-blue-200 hover:text-white transition-colors">
                    support@techaffiliate.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-300">Phone</p>
                  <a href="tel:+1234567890" className="text-blue-200 hover:text-white transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-300">Location</p>
                  <p className="text-blue-200">
                    San Francisco, CA 94105
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-800/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-blue-300">
            <p>
              © {new Date().getFullYear()} TechAffiliate Pro. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
