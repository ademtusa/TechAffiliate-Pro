'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Folder, Plus, Edit, Trash2, Search, Package, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('product')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'product',
    color: '#6366F1',
    status: 'active',
    order: 0
  })
  
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/categories?withStats=true')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive'
      })
      return
    }

    try {
      const url = '/api/admin/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      const body = editingCategory 
        ? { id: editingCategory.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: editingCategory ? 'Category updated' : 'Category created'
        })
        setIsDialogOpen(false)
        resetForm()
        fetchCategories()
      } else {
        toast({
          title: 'Error',
          description: data.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      type: category.type,
      color: category.color || '#6366F1',
      status: category.status || 'active',
      order: category.order || 0
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id, itemCount) => {
    if (itemCount > 0) {
      toast({
        title: 'Cannot Delete',
        description: `This category has ${itemCount} items. Remove them first.`,
        variant: 'destructive'
      })
      return
    }

    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Category deleted'
        })
        fetchCategories()
      } else {
        toast({
          title: 'Error',
          description: data.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: activeTab,
      color: '#6366F1',
      status: 'active',
      order: 0
    })
    setEditingCategory(null)
  }

  const handleAddNew = () => {
    resetForm()
    setFormData({ ...formData, type: activeTab })
    setIsDialogOpen(true)
  }

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = cat.type === activeTab
    return matchesSearch && matchesTab
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Categories Management</h2>
          <p className="text-slate-400 mt-1">Organize products and resources with categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Create categories for {activeTab === 'product' ? 'products' : 'resources'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., VPN Services, eBooks"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Brief description (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-300">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})} disabled={!!editingCategory}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="resource">Resource</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="text-slate-300">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="bg-slate-700 border-slate-600 h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-slate-300">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order" className="text-slate-300">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-600">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-violet-600 hover:bg-violet-700">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs and Search */}
      <Card className="border-slate-700 bg-slate-800/70">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-slate-700">
                <TabsTrigger value="product" className="data-[state=active]:bg-violet-600">
                  <Package className="h-4 w-4 mr-2" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="resource" className="data-[state=active]:bg-violet-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Resources
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.length === 0 ? (
          <Card className="border-slate-700 bg-slate-800/70 col-span-full">
            <CardContent className="py-12 text-center">
              <Folder className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">No categories found</p>
              <Button className="mt-4 bg-violet-600 hover:bg-violet-700" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Category
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCategories.map((category) => (
            <Card key={category.id} className="border-slate-700 bg-slate-800/70 hover:bg-slate-800 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <Folder className="h-6 w-6" style={{ color: category.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      <Badge variant={category.status === 'active' ? 'default' : 'secondary'} 
                             className={category.status === 'active' ? 'bg-green-600' : 'bg-slate-600'}>
                        {category.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {category.description && (
                  <p className="text-slate-400 text-sm mb-3">{category.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {category.item_count || 0} items
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(category)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(category.id, category.item_count)}
                      className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
