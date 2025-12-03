'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { 
  Download, 
  FileText, 
  Video, 
  Lock,
  CheckCircle,
  Gift,
  BookOpen,
  Star,
  TrendingUp
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductSlider from '@/components/ProductSlider'
import HeroSection from '@/components/HeroSection'

export default function ResourcesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [resources, setResources] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchResources()
    fetchProducts()
  }, [])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/resources')
      const data = await response.json()
      if (data.success) {
        setResources(data.data)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleDownloadClick = async (resource) => {
    if (status !== 'authenticated') {
      setSelectedResource(resource)
      setShowMembersModal(true)
      return
    }

    // User is authenticated, proceed with download
    try {
      const response = await fetch('/api/resources/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: resource.id })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Download Started',
          description: `Downloading ${resource.title}...`
        })
        
        // Trigger actual download
        if (data.file_url) {
          const link = document.createElement('a')
          link.href = data.file_url
          link.download = resource.title
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        toast({
          title: 'Download Failed',
          description: data.message || 'Could not download resource',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error downloading:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while downloading',
        variant: 'destructive'
      })
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-400" />
      case 'video':
        return <Video className="h-5 w-5 text-purple-400" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  const featuredProduct = products.length > 0 ? products[0] : null

  const featuredProduct = products.length > 0 ? {
    ...products[0],
    commission_rate: 15.5,
    reviews: 1247
  } : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <HeroSection 
        title="Free Resources & Downloads"
        subtitle="Exclusive guides, tutorials, and bonuses for our affiliates. Download premium content to boost your affiliate success!"
        featuredProduct={featuredProduct}
        featuredType="resourceOffer"
      />

      {/* Resources Content */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">No resources available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-blue-300">
                {resource.thumbnail_url && (
                  <div className="w-full h-48 bg-gray-100 overflow-hidden">
                    <img 
                      src={resource.thumbnail_url} 
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">{resource.title}</h3>
                    {getTypeIcon(resource.type)}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-700 border-0">
                      {resource.type?.toUpperCase() || 'FILE'}
                    </Badge>
                    <Button 
                      onClick={() => handleDownloadClick(resource)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Members Only
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Gift className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want Access to All Resources?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join for free and unlock exclusive content
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Weekly free downloads</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Premium e-books and guides</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Video className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Video tutorials</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold">Exclusive discount codes</p>
            </div>
          </div>
          <Link href="/register">
            <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 text-lg px-8">
              Join Free Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Best Sellers Section */}
      {products.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <ProductSlider 
            title="Trending Products" 
            products={products.slice(0, 8)} 
            icon={TrendingUp}
          />
        </div>
      )}

      <Footer />

      {/* Members Only Modal */}
      <Dialog open={showMembersModal} onOpenChange={setShowMembersModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Members Only Content
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              This resource is available exclusively for registered members.
              {selectedResource && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{selectedResource.title}</p>
                  <p className="text-sm text-gray-600">{selectedResource.description}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Free registration - no credit card required</p>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Access to all exclusive resources</p>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Earn commission on affiliate products</p>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Weekly new resources and updates</p>
            </div>
          </div>
          <DialogFooter className="sm:justify-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowMembersModal(false)}
            >
              Maybe Later
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => router.push('/register')}
            >
              Join Free Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
