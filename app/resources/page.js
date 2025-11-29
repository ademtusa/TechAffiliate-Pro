'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gift, Download, Video, FileText, Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import HeroSection from '@/components/HeroSection'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdSense from '@/components/AdSense'

export default function ResourcesPage() {
  const [resources, setResources] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mostDownloadedProduct, setMostDownloadedProduct] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchResources()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchResources = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/resources')
      const result = await response.json()
      
      if (result.success) {
        setResources(result.data || [])
      }

      // Fetch most downloaded/viewed product
      const productsRes = await fetch('/api/products?sort=mostviewed')
      const productsResult = await productsRes.json()
      
      if (productsResult.success && productsResult.data && productsResult.data.length > 0) {
        setMostDownloadedProduct({
          ...productsResult.data[0],
          commission_rate: 15.5,
          reviews: 1247
        })
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-12 w-12 text-red-500" />
      case 'video':
        return <Video className="h-12 w-12 text-purple-500" />
      default:
        return <Download className="h-12 w-12 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection 
        title="Free Resources & Downloads"
        subtitle="Exclusive guides, tutorials, and bonuses for our affiliates"
        featuredProduct={mostDownloadedProduct}
        featuredType="mostDownloaded"
      />

      {/* Resources Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No resources available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-500 relative">
                {/* Members Only Badge - Prominent */}
                {resource.members_only && !user && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-3 py-1 text-sm shadow-lg animate-pulse">
                      <Lock className="h-3 w-3 mr-1 inline" />
                      MEMBERS ONLY
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {getIcon(resource.type)}
                  </div>
                  <CardTitle className="text-center text-xl">{resource.title}</CardTitle>
                  <CardDescription className="text-center">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge className="mb-4" variant="secondary">
                    {resource.type.toUpperCase()}
                  </Badge>
                  <div className="mt-4">
                    {resource.members_only && !user ? (
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-orange-400 text-orange-700 bg-orange-50 hover:bg-orange-100 hover:border-orange-500 font-semibold transition-all duration-300" 
                        disabled
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Members Only - Sign In to Access
                      </Button>
                    ) : (
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-2 border-transparent hover:border-purple-300 transition-all duration-300">
                        <Download className="h-4 w-4 mr-2" />
                        Download Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Benefits Section */}
        {!user && (
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-3xl">Want Access to All Resources?</CardTitle>
                <CardDescription className="text-lg">
                  Join for free and unlock exclusive content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <Gift className="h-5 w-5 text-purple-600 mr-2" />
                    Weekly free downloads
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-5 w-5 text-purple-600 mr-2" />
                    Premium e-books and guides
                  </li>
                  <li className="flex items-center">
                    <Video className="h-5 w-5 text-purple-600 mr-2" />
                    Video tutorials
                  </li>
                  <li className="flex items-center">
                    <Download className="h-5 w-5 text-purple-600 mr-2" />
                    Exclusive discount codes
                  </li>
                </ul>
                <Link href="/">
                  <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    Join Free Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* AdSense at Bottom of Resources */}
        <div className="mt-12 max-w-4xl mx-auto">
          <AdSense 
            adSlot="0987654321"
            adFormat="horizontal"
            style={{ display: 'block', minHeight: '90px', textAlign: 'center' }}
            className="my-6"
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}