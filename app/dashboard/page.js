'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { User, Heart, Gift, TrendingUp, ArrowLeft, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [savedProducts, setSavedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/')
      return
    }
    
    setUser(user)
    fetchProfile(user.id)
  }

  const fetchProfile = async (userId) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/profile?userId=${userId}`)
      const result = await response.json()
      
      if (result.success) {
        setProfile(result.data)
        if (result.data?.saved_products?.length > 0) {
          fetchSavedProducts(result.data.saved_products)
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedProducts = async (productIds) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)
      
      if (!error && data) {
        setSavedProducts(data)
      }
    } catch (error) {
      console.error('Error fetching saved products:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.user_metadata?.name || 'Member'}!
              </h1>
              <p className="text-blue-100">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="overview">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Heart className="h-4 w-4 mr-2" />
              Saved ({savedProducts.length})
            </TabsTrigger>
            <TabsTrigger value="resources">
              <Gift className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-blue-600">{savedProducts.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Member Since</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">
                    {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Resources Accessed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-purple-600">0</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>What would you like to do today?</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Link href="/">
                  <Button className="w-full" variant="outline">
                    Browse Products
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button className="w-full" variant="outline">
                    Read Reviews
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button className="w-full" variant="outline">
                    Download Resources
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button className="w-full" variant="outline">
                    Admin Panel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            {savedProducts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-4">No saved products yet</p>
                  <Link href="/">
                    <Button>Browse Products</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {savedProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      <Link href={`/sales/${product.id}`}>
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Member Resources</CardTitle>
                <CardDescription>Exclusive content just for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Ultimate AI Prompt Guide</h4>
                      <p className="text-sm text-gray-500">PDF • 100+ prompts</p>
                    </div>
                    <Button>Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Web Hosting Checklist</h4>
                      <p className="text-sm text-gray-500">PDF • Complete guide</p>
                    </div>
                    <Button>Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">VPN Setup Tutorial</h4>
                      <p className="text-sm text-gray-500">Video • Step-by-step</p>
                    </div>
                    <Button>Watch</Button>
                  </div>
                </div>
                <Link href="/resources">
                  <Button variant="outline" className="w-full mt-6">
                    View All Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}