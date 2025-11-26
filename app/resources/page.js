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
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <Gift className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Free Member Resources</h1>
          <p className="text-xl text-purple-100">
            Exclusive guides, tutorials, and bonuses for our members
          </p>
          {!user && (
            <div className="mt-8">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Link href="/">Sign Up to Access</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

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
              <Card key={resource.id} className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-500">
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
                      <Button variant="outline" className="w-full" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Members Only
                      </Button>
                    ) : (
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
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
      </div>
    </div>
  )
}