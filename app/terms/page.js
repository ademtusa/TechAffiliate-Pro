'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'

export default function TermsPage() {
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
        title="Terms of Service"
        subtitle="Please read these terms carefully before using Usefulio. By accessing our site, you agree to these terms."
        featuredProduct={featuredProduct}
        featuredType="legalCompliance"
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
              <FileText className="h-8 w-8 text-blue-600" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to <strong>Usefulio</strong>! These Terms of Service (&quot;Terms&quot;) govern your access to and use of 
              our website <strong>usefulio.com</strong> (the &quot;Site&quot;), including any content, functionality, and services 
              offered on or through the Site.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using the Site, you agree to be bound by these Terms and our Privacy Policy. If you do 
              not agree, you may not access or use the Site.
            </p>
          </CardContent>
        </Card>

        {/* Use of Site */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <CheckCircle className="h-8 w-8 text-green-600" />
              Permitted Use
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              You may use our Site for lawful purposes only. You agree to:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Use the Site only for personal, non-commercial purposes (unless otherwise authorized)
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Comply with all applicable laws and regulations
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Respect intellectual property rights and content ownership
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Provide accurate information when creating an account or contacting us
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prohibited Activities */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <XCircle className="h-8 w-8 text-red-600" />
              Prohibited Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              You may <strong>NOT</strong> use the Site to:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg hover:shadow-md transition-shadow">
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Violate any laws, regulations, or third-party rights
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg hover:shadow-md transition-shadow">
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Transmit viruses, malware, or any harmful code
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg hover:shadow-md transition-shadow">
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Scrape, crawl, or harvest content without permission
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg hover:shadow-md transition-shadow">
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Impersonate others or misrepresent your affiliation
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg hover:shadow-md transition-shadow">
                <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Interfere with or disrupt the Site&apos;s functionality
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Disclosure */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Info className="h-8 w-8 text-yellow-600" />
              Affiliate Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Important Notice:</strong> Usefulio participates in various affiliate marketing programs. This means 
                we may earn commissions when you click on links to products and make purchases through our Site.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                These affiliate relationships <strong>do not influence</strong> our reviews or recommendations. We maintain 
                complete editorial independence and only recommend products we genuinely believe are useful.
              </p>
              <p className="text-gray-700 leading-relaxed">
                All opinions expressed are our own, and we strive to provide honest, unbiased information to help you 
                make informed decisions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Scale className="h-8 w-8 text-purple-600" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on the Site, including text, images, logos, graphics, and software, is the property of 
              Usefulio or its content suppliers and is protected by intellectual property laws.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold mb-2 text-purple-900">Content Ownership</h4>
                <p className="text-gray-700 text-sm">
                  Usefulio owns or licenses all content on the Site
                </p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold mb-2 text-pink-900">Limited License</h4>
                <p className="text-gray-700 text-sm">
                  You may view and print content for personal use only
                </p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold mb-2 text-indigo-900">No Reproduction</h4>
                <p className="text-gray-700 text-sm">
                  Copying or republishing content is prohibited without permission
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold mb-2 text-blue-900">Trademarks</h4>
                <p className="text-gray-700 text-sm">
                  Usefulio and our logo are registered trademarks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer of Warranties */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              Disclaimer of Warranties
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-6 bg-orange-50 border-2 border-orange-300 rounded-lg">
              <p className="text-gray-700 leading-relaxed mb-4">
                The Site and its content are provided on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis 
                without warranties of any kind, either express or implied.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We do not warrant that the Site will be error-free, uninterrupted, or free from viruses or other harmful 
                components. We make no guarantees about the accuracy, completeness, or reliability of any content.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Scale className="h-8 w-8 text-red-600" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, Usefulio shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including loss of profits, data, or use, arising out of or related to 
              your use of the Site, even if we have been advised of the possibility of such damages.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="shadow-2xl border-2 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <FileText className="h-8 w-8 text-blue-600" />
              Changes to These Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon 
              posting on the Site. Your continued use of the Site after changes are posted constitutes acceptance of 
              the revised Terms. We encourage you to review these Terms periodically.
            </p>
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
              If you have any questions about these Terms of Service, please contact us:
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
