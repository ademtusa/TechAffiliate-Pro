'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BarChart, Package, FileText, Users, Star, TrendingUp, Eye, ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const router = useRouter()

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: 'ai-saas',
    affiliate_url: '',
    image_url: '',
    rating: 4.5,
    badge: ''
  })

  useEffect(() => {
    checkUser()
    fetchAnalytics()
    fetchProducts()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/')
      return
    }
    
    setUser(user)
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      const result = await response.json()
      
      if (result.success) {
        setAnalytics(result.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
          tags: [],
          views: 0,
          sales_count: 0
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Product added successfully!')
        setAddDialogOpen(false)
        fetchProducts()
        setNewProduct({
          name: '',
          description: '',
          price: '',
          original_price: '',
          category: 'ai-saas',
          affiliate_url: '',
          image_url: '',
          rating: 4.5,
          badge: ''
        })
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product')
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Product deleted successfully!')
        fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  if (!user) {
    return null
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

      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <BarChart className="h-12 w-12" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-blue-100">Manage your affiliate website</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Analytics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.products?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.totalUsers || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Star className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.totalReviews || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.totalViews || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="blog">
              <FileText className="h-4 w-4 mr-2" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Manage Products</CardTitle>
                    <CardDescription>Add, edit, or remove products from your catalog</CardDescription>
                  </div>
                  <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>Fill in the product details</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddProduct} className="space-y-4">
                        <div>
                          <Label>Product Name *</Label>
                          <Input
                            required
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Description *</Label>
                          <Textarea
                            required
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Price *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              required
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>Original Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newProduct.original_price}
                              onChange={(e) => setNewProduct({...newProduct, original_price: e.target.value})}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Category *</Label>
                          <select
                            className="w-full p-2 border rounded"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                          >
                            <option value="ai-saas">AI & SaaS Tools</option>
                            <option value="hosting">Hosting Services</option>
                            <option value="vpn-security">VPN & Security</option>
                            <option value="automation">Automation</option>
                            <option value="courses">Courses</option>
                            <option value="cloud">Cloud Services</option>
                          </select>
                        </div>
                        <div>
                          <Label>Affiliate URL *</Label>
                          <Input
                            type="url"
                            required
                            value={newProduct.affiliate_url}
                            onChange={(e) => setNewProduct({...newProduct, affiliate_url: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Image URL</Label>
                          <Input
                            type="url"
                            value={newProduct.image_url}
                            onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Badge (optional)</Label>
                          <Input
                            value={newProduct.badge}
                            onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})}
                            placeholder="e.g., HOT DEAL, NEW, BEST SELLER"
                          />
                        </div>
                        <Button type="submit" className="w-full">Add Product</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          {product.image_url && (
                            <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div>
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-gray-500">${product.price} • {product.views} views • {product.sales_count} clicks</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>Manage your blog content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Blog management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">User management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}