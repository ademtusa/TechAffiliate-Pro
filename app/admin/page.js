'use client'

import { useState, useEffect } from 'react'
import { checkAdminAuth, clearAdminAuth } from '@/middleware/adminAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { BarChart, Package, FileText, Users, Star, TrendingUp, Eye, Home, Settings, Menu, X, Plus, Edit, Trash2, Check, XIcon, ChevronLeft, ChevronRight, LogOut, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [products, setProducts] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
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
    badge: '',
    status: 'active'
  })

  useEffect(() => {
    checkUser()
    fetchAnalytics()
    fetchProducts()
    fetchMembers()
  }, [])

  const checkUser = async () => {
    // Check admin authentication
    if (!checkAdminAuth()) {
      router.push('/admin/login')
      return
    }

    // Check if demo mode
    const isDemoMode = typeof window !== 'undefined' && sessionStorage.getItem('demoMode') === 'true'
    
    if (isDemoMode) {
      // Demo mode - create a mock user
      setUser({
        email: 'admin@demo.com',
        id: 'demo-admin',
        user_metadata: {
          name: 'Demo Admin'
        }
      })
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      clearAdminAuth()
      router.push('/admin/login')
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

  const fetchMembers = async () => {
    // Mock members data
    setMembers([
      { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', created_at: new Date().toISOString() },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'pending', created_at: new Date().toISOString() },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'active', created_at: new Date().toISOString() },
    ])
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
          badge: '',
          status: 'active'
        })
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product')
    }
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedProduct)
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Product updated successfully!')
        setEditDialogOpen(false)
        fetchProducts()
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
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

  const handleApproveProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      })
      
      if (response.ok) {
        alert('Product approved!')
        fetchProducts()
      }
    } catch (error) {
      console.error('Error approving product:', error)
    }
  }

  const handleRejectProduct = async (productId) => {
    if (!confirm('Are you sure you want to reject this product?')) return
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      })
      
      if (response.ok) {
        alert('Product rejected!')
        fetchProducts()
      }
    } catch (error) {
      console.error('Error rejecting product:', error)
    }
  }

  const handleApproveMember = async (memberId) => {
    alert(`Member ${memberId} approved!`)
    fetchMembers()
  }

  const handleRejectMember = async (memberId) => {
    if (!confirm('Are you sure you want to reject this member?')) return
    alert(`Member ${memberId} rejected!`)
    fetchMembers()
  }

  const handleSignOut = async () => {
    clearAdminAuth()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const menuItems = [
    { id: 'dashboard', icon: BarChart, label: 'Dashboard' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'blog', icon: FileText, label: 'Blog Posts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col`}>
        {/* Logo & Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'px-6'} py-3 space-x-3 transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white border-r-4 border-blue-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-gray-800 p-4 space-y-2">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-400 hover:text-white`}
            >
              <Home className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">Back to Site</span>}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-red-400 hover:text-red-300`}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-950">
        {/* Header */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold">
            {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-600">
              Admin
            </Badge>
            <span className="text-sm text-gray-400">{user?.email}</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{analytics?.products?.length || 0}</div>
                    <p className="text-xs text-gray-500 mt-1">Active listings</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Members</CardTitle>
                    <Users className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{analytics?.totalUsers || 0}</div>
                    <p className="text-xs text-gray-500 mt-1">Registered users</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Reviews</CardTitle>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{analytics?.totalReviews || 0}</div>
                    <p className="text-xs text-gray-500 mt-1">Product reviews</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{analytics?.totalViews || 0}</div>
                    <p className="text-xs text-gray-500 mt-1">Page views</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">Latest actions on your site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">New product added</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <Badge className="bg-green-600">Success</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Member approved</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                      <Badge className="bg-blue-600">Info</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Product review posted</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                      <Badge className="bg-purple-600">Review</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Product Management</h2>
                  <p className="text-gray-400">Manage all products and services</p>
                </div>
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription className="text-gray-400">Fill in the product details</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Product Name *</Label>
                        <Input
                          required
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Description *</Label>
                        <Textarea
                          required
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Price *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            required
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Original Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newProduct.original_price}
                            onChange={(e) => setNewProduct({...newProduct, original_price: e.target.value})}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">Category *</Label>
                        <select
                          className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-white"
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
                        <Label className="text-gray-300">Affiliate URL *</Label>
                        <Input
                          type="url"
                          required
                          value={newProduct.affiliate_url}
                          onChange={(e) => setNewProduct({...newProduct, affiliate_url: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Image URL</Label>
                        <Input
                          type="url"
                          value={newProduct.image_url}
                          onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Badge (optional)</Label>
                        <Input
                          value={newProduct.badge}
                          onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})}
                          placeholder="e.g., HOT DEAL, NEW, BEST SELLER"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Add Product</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {product.image_url && (
                            <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white text-lg">{product.name}</h4>
                              {product.badge && (
                                <Badge className="bg-red-600">{product.badge}</Badge>
                              )}
                              <Badge variant="secondary" className="bg-gray-800">{product.category}</Badge>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>${product.price}</span>
                              <span>•</span>
                              <span>{product.views} views</span>
                              <span>•</span>
                              <span>{product.sales_count} clicks</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setSelectedProduct(product); setEditDialogOpen(true); }}
                                className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-red-900 border-red-800 hover:bg-red-800 text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveProduct(product.id)}
                                className="bg-green-900 border-green-800 hover:bg-green-800 text-white"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectProduct(product.id)}
                                className="bg-red-900 border-red-800 hover:bg-red-800 text-white"
                              >
                                <XIcon className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Member Management</h2>
                <p className="text-gray-400">Approve, reject, or manage members</p>
              </div>

              <div className="grid gap-4">
                {members.map((member) => (
                  <Card key={member.id} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{member.name}</h4>
                            <p className="text-sm text-gray-400">{member.email}</p>
                            <p className="text-xs text-gray-500 mt-1">Joined: {new Date(member.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={member.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'}>
                            {member.status}
                          </Badge>
                          {member.status === 'pending' ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveMember(member.id)}
                                className="bg-green-900 border-green-800 hover:bg-green-800 text-white"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectMember(member.id)}
                                className="bg-red-900 border-red-800 hover:bg-red-800 text-white"
                              >
                                <XIcon className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectMember(member.id)}
                              className="bg-red-900 border-red-800 hover:bg-red-800 text-white"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Blog Tab */}
          {activeTab === 'blog' && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Blog Management</h3>
              <p className="text-gray-400">Coming soon...</p>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Settings</h3>
              <p className="text-gray-400">Coming soon...</p>
            </div>
          )}
        </div>
      </main>

      {/* Edit Product Dialog */}
      {selectedProduct && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription className="text-gray-400">Update product details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <Label className="text-gray-300">Product Name</Label>
                <Input
                  value={selectedProduct.name}
                  onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  value={selectedProduct.description}
                  onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Original Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={selectedProduct.original_price || ''}
                    onChange={(e) => setSelectedProduct({...selectedProduct, original_price: parseFloat(e.target.value)})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Update Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}