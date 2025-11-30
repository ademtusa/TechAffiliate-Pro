'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package,
  Image as ImageIcon,
  ExternalLink,
  Filter
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ProductsManagementPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    affiliate_link: '',
    image_url: '',
    features: '',
    pros: '',
    cons: '',
    rating: '5',
    status: 'active'
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchTrackingStats()
  }, [])

  const fetchTrackingStats = async () => {
    try {
      const response = await fetch('/api/admin/products/stats')
      const data = await response.json()
      if (data.success) {
        setTrackingStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching tracking stats:', error)
    }
  }

  useEffect(() => {
    filterProducts()
  }, [searchTerm, filterCategory, filterStatus, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data)
      } else {
        toast({
          title: 'Hata',
          description: 'Ürünler yüklenemedi',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: 'Hata',
        description: 'Bir hata oluştu',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories?type=product&status=active')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory)
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingProduct ? '/api/admin/products' : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const payload = editingProduct 
        ? { id: editingProduct.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Başarılı',
          description: editingProduct ? 'Ürün güncellendi' : 'Ürün eklendi'
        })
        setDialogOpen(false)
        resetForm()
        fetchProducts()
        fetchCategories()
      } else {
        toast({
          title: 'Hata',
          description: data.message || 'İşlem başarısız',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: 'Hata',
        description: 'Bir hata oluştu',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title || '',
      description: product.description || '',
      category: product.category || '',
      price: product.price || '',
      affiliate_link: product.affiliate_link || '',
      image_url: product.image_url || '',
      features: Array.isArray(product.features) ? product.features.join('\n') : product.features || '',
      pros: Array.isArray(product.pros) ? product.pros.join('\n') : product.pros || '',
      cons: Array.isArray(product.cons) ? product.cons.join('\n') : product.cons || '',
      rating: product.rating || '5',
      status: product.status || 'active'
    })
    setDialogOpen(true)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Hata',
        description: 'Lütfen geçerli bir görsel dosyası seçin (PNG, JPEG, GIF, WebP)',
        variant: 'destructive'
      })
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Hata',
        description: 'Görsel boyutu 2MB\'dan küçük olmalıdır',
        variant: 'destructive'
      })
      return
    }

    setUploadingImage(true)
    const reader = new FileReader()
    
    reader.onloadend = () => {
      setFormData({
        ...formData,
        image_url: reader.result
      })
      setUploadingImage(false)
      toast({
        title: 'Başarılı',
        description: 'Görsel yüklendi. Kaydetmeyi unutmayın!'
      })
    }
    
    reader.onerror = () => {
      setUploadingImage(false)
      toast({
        title: 'Hata',
        description: 'Görsel yüklenirken hata oluştu',
        variant: 'destructive'
      })
    }
    
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image_url: ''
    })
    toast({
      title: 'Başarılı',
      description: 'Görsel kaldırıldı'
    })
  }

  const handleDelete = async (productId) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Başarılı',
          description: 'Ürün silindi'
        })
        fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: 'Hata',
        description: 'Ürün silinemedi',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      affiliate_link: '',
      image_url: '',
      features: '',
      pros: '',
      cons: '',
      rating: '5',
      status: 'active'
    })
  }

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <Badge className="bg-green-600">Aktif</Badge>
      : <Badge className="bg-gray-600">Pasif</Badge>
  }

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    categories: categories.length,
    total_views: 0,
    total_clicks: 0
  }
  const [trackingStats, setTrackingStats] = useState(null)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-6 gap-4">
        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active</CardTitle>
            <Package className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Inactive</CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">{stats.inactive}</div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Categories</CardTitle>
            <Filter className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{stats.categories}</div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {trackingStats ? trackingStats.total_views.toLocaleString() : '-'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {trackingStats ? trackingStats.total_clicks.toLocaleString() : '-'}
            </div>
            <p className="text-xs text-slate-500 mt-1">Affiliate link clicks</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Ürün Yönetimi</CardTitle>
              <CardDescription className="text-slate-400">
                Ürünleri ekleyin, düzenleyin veya silin
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 text-white border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Fill in the product details
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-slate-300">Product Name *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., ChatGPT Plus, Midjourney"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-slate-300">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {categories.length === 0 ? (
                            <SelectItem value="uncategorized" disabled>
                              No categories - Add one first
                            </SelectItem>
                          ) : (
                            categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">
                        Can&apos;t find a category? <a href="/admin-panel/categories" target="_blank" className="text-violet-400 hover:underline">Add new category</a>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Brief description of the product"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-slate-300">Price</Label>
                      <Input
                        id="price"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="$19.99/mo"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating" className="text-slate-300">Rating (1-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => setFormData({...formData, rating: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Product Image</Label>
                    
                    {/* Image Preview */}
                    {formData.image_url && (
                      <div className="relative inline-block">
                        <img 
                          src={formData.image_url} 
                          alt="Preview" 
                          className="h-32 w-32 rounded-lg object-cover border-2 border-slate-600"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={handleRemoveImage}
                        >
                          ×
                        </Button>
                      </div>
                    )}
                    
                    {/* File Upload */}
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                        onChange={handleImageUpload}
                        className="bg-slate-700 border-slate-600 text-white"
                        disabled={uploadingImage}
                      />
                      {uploadingImage && (
                        <p className="text-sm text-yellow-400">Uploading image...</p>
                      )}
                      <p className="text-xs text-slate-500">
                        PNG, JPEG, GIF or WebP (Max 2MB)
                      </p>
                    </div>

                    {/* Or URL Input */}
                    <div className="space-y-2">
                      <Label htmlFor="image_url" className="text-slate-400 text-sm">or enter URL:</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affiliate_link" className="text-slate-300">Affiliate Link</Label>
                    <Input
                      id="affiliate_link"
                      value={formData.affiliate_link}
                      onChange={(e) => setFormData({...formData, affiliate_link: e.target.value})}
                      placeholder="https://affiliate.link"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features" className="text-slate-300">Features</Label>
                    <Textarea
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({...formData, features: e.target.value})}
                      rows={3}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pros" className="text-slate-300">Pros</Label>
                      <Textarea
                        id="pros"
                        value={formData.pros}
                        onChange={(e) => setFormData({...formData, pros: e.target.value})}
                        rows={3}
                        placeholder="Pro 1&#10;Pro 2"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cons" className="text-slate-300">Cons</Label>
                      <Textarea
                        id="cons"
                        value={formData.cons}
                        onChange={(e) => setFormData({...formData, cons: e.target.value})}
                        rows={3}
                        placeholder="Con 1&#10;Con 2"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-slate-300">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-600 text-slate-300">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      {editingProduct ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p>Ürün bulunamadı</p>
              <Button onClick={() => setDialogOpen(true)} className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                İlk Ürünü Ekle
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-all"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} className="h-16 w-16 rounded object-cover" />
                    ) : (
                      <div className="h-16 w-16 rounded bg-slate-600 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{product.title}</h4>
                      <p className="text-sm text-slate-400 line-clamp-1">{product.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">{product.category}</Badge>
                        {product.price && <span className="text-xs text-slate-400">{product.price}</span>}
                        {product.rating && <span className="text-xs text-yellow-400">★ {product.rating}</span>}
                      </div>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center">
                          👁️ {product.view_count || 0} views
                        </span>
                        <span className="flex items-center">
                          🔗 {product.click_count || 0} clicks
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(product.status)}
                    {product.affiliate_link && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(product.affiliate_link, '_blank')}
                        className="text-slate-400 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
