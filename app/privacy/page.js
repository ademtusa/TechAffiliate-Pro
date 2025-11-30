'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, Database, UserCheck, Bell, FileText } from 'lucide-react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  const [featuredProduct, setFeaturedProduct] = useState(null)

  useEffect(() => {
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

    fetchFeaturedProduct()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <HeroSection 
        title="Privacy Policy"
        subtitle="Your privacy matters to us. Learn how we collect, use, and protect your data."
        featuredProduct={featuredProduct}
        featuredType="securityFocused"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Last Updated */}
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            <strong>Last Updated:</strong> January 29, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Shield className="h-8 w-8 text-blue-600" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              At <strong>Usefulio</strong> ("we," "us," or "our"), we are committed to protecting your privacy and ensuring 
              the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and 
              safeguard your information when you visit our website <strong>usefulio.com</strong> (the "Site").
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our Site, you consent to the data practices described in this policy. If you do not agree with 
              our policies and practices, please do not use our Site.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Database className="h-8 w-8 text-purple-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2 text-blue-900">Personal Information</h3>
                <p className="text-gray-700">
                  When you register an account, subscribe to our newsletter, or contact us, we may collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
                  <li>Name and email address</li>
                  <li>Account credentials (username and password)</li>
                  <li>Communication preferences</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2 text-green-900">Automatically Collected Information</h3>
                <p className="text-gray-700">
                  When you visit our Site, we automatically collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 ml-4 space-y-1">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages viewed and time spent on Site</li>
                  <li>Referring website and clickstream data</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2 text-yellow-900">Cookies and Tracking Technologies</h3>
                <p className="text-gray-700">
                  We use cookies, web beacons, and similar technologies to enhance your experience and analyze Site usage.
                  You can control cookie settings through your browser preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Eye className="h-8 w-8 text-green-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <p className="text-gray-700">
                  <strong>Provide and improve our services:</strong> Deliver content, maintain functionality, and enhance user experience.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <p className="text-gray-700">
                  <strong>Communicate with you:</strong> Send newsletters, updates, and respond to inquiries.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <p className="text-gray-700">
                  <strong>Analyze and optimize:</strong> Understand user behavior to improve content and Site performance.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 font-bold">4</span>
                </div>
                <p className="text-gray-700">
                  <strong>Comply with legal obligations:</strong> Meet regulatory requirements and enforce our terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Lock className="h-8 w-8 text-red-600" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border-2 border-red-200 hover:shadow-md transition-shadow">
                <h4 className="font-bold mb-2 text-red-900">Encryption</h4>
                <p className="text-gray-700 text-sm">SSL/TLS encryption for data transmission</p>
              </div>
              <div className="p-4 bg-white rounded-lg border-2 border-orange-200 hover:shadow-md transition-shadow">
                <h4 className="font-bold mb-2 text-orange-900">Access Control</h4>
                <p className="text-gray-700 text-sm">Limited access to authorized personnel only</p>
              </div>
              <div className="p-4 bg-white rounded-lg border-2 border-yellow-200 hover:shadow-md transition-shadow">
                <h4 className="font-bold mb-2 text-yellow-900">Regular Audits</h4>
                <p className="text-gray-700 text-sm">Periodic security assessments and updates</p>
              </div>
              <div className="p-4 bg-white rounded-lg border-2 border-green-200 hover:shadow-md transition-shadow">
                <h4 className="font-bold mb-2 text-green-900">Secure Storage</h4>
                <p className="text-gray-700 text-sm">Protected databases with backup systems</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <UserCheck className="h-8 w-8 text-indigo-600" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg hover:shadow-md transition-shadow">
                <Bell className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                <p className="text-gray-700"><strong>Access:</strong> Request a copy of your personal data</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
                <Bell className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p className="text-gray-700"><strong>Correction:</strong> Update inaccurate or incomplete information</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:shadow-md transition-shadow">
                <Bell className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <p className="text-gray-700"><strong>Deletion:</strong> Request deletion of your personal data</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg hover:shadow-md transition-shadow">
                <Bell className="h-5 w-5 text-pink-600 flex-shrink-0" />
                <p className="text-gray-700"><strong>Opt-Out:</strong> Unsubscribe from marketing communications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Us */}
        <Card className="shadow-2xl border-2 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <FileText className="h-8 w-8 text-blue-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> useful@usefulio.com</p>
              <p><strong>Support:</strong> support@usefulio.com</p>
              <p><strong>Website:</strong> usefulio.com/contact</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
