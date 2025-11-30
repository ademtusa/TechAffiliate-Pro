'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BookOpen, Plus, Edit, Trash2, FileText, Video, Image as ImageIcon, Download, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export default function ResourcesManagementPage() {
  const [resources, setResources] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState(null)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'pdf',
    file_url: '',
    file_size: '',
    status: 'draft',
    thumbnail_url: ''
  })
  
  const { toast } = useToast()

  useEffect(() => {
    fetchResources()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories?type=resource&status=active')
      const data = await response.json()
      console.log('📁 Fetched categories:', data)
      if (data.success) {
        console.log('✅ Setting categories:', data.data.length, 'items')
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchResources = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/resources')
      const data = await response.json()
      if (data.success) {
        setResources(data.data)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
      toast({
        title: 'Error',
        description: 'Failed to load resources',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (max 10MB for now)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 10MB',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({
        ...formData,
        file_url: reader.result,
        file_size: (file.size / 1024).toFixed(2) + ' KB'
      })
      setUploading(false)
      toast({
        title: 'Success',
        description: 'File uploaded. Remember to save!'
      })
    }
    reader.onerror = () => {
      setUploading(false)
      toast({
        title: 'Error',
        description: 'Failed to read file',
        variant: 'destructive'
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.category) {
      toast({
        title: 'Error',
        description: 'Title and category are required',
        variant: 'destructive'
      })
      return
    }

    try {
      const url = '/api/admin/resources'
      const method = editingResource ? 'PUT' : 'POST'
      const body = editingResource 
        ? { id: editingResource.id, ...formData }
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
          description: editingResource ? 'Resource updated' : 'Resource created'
        })
        setIsDialogOpen(false)
        resetForm()
        fetchResources()
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

  const handleEdit = (resource) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description || '',
      category: resource.category,
      type: resource.type || 'pdf',
      file_url: resource.file_url || '',
      file_size: resource.file_size || '',
      status: resource.status || 'draft',
      thumbnail_url: resource.thumbnail_url || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const response = await fetch(`/api/admin/resources?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Resource deleted'
        })
        fetchResources()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete resource',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      type: 'pdf',
      file_url: '',
      file_size: '',
      status: 'draft',
      thumbnail_url: ''
    })
    setEditingResource(null)
  }

  const handleAddNew = () => {
    resetForm()
    fetchCategories() // Refresh categories when opening dialog
    setIsDialogOpen(true)
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-400" />
      case 'video': return <Video className="h-5 w-5 text-purple-400" />
      case 'image': return <ImageIcon className="h-5 w-5 text-blue-400" />
      default: return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory
    const matchesStatus = filterStatus === 'all' || resource.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Extract unique category names from resources for filter dropdown
  const resourceCategories = [...new Set(resources.map(r => r.category).filter(Boolean))]

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
          <h2 className="text-2xl font-bold text-white">Resources Management</h2>
          <p className="text-slate-400 mt-1">Manage downloadable content and track user downloads</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (open) {
            fetchCategories() // Refresh categories when dialog opens
          }
          setIsDialogOpen(open)
        }}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Upload files and manage digital resources
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Resource title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Brief description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    Can't find a category? <a href="/admin-panel/categories" target="_blank" className="text-violet-400 hover:underline">Add new category</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-300">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail" className="text-slate-300">Thumbnail/Preview Image</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setFormData({...formData, thumbnail_url: reader.result})
                        toast({
                          title: 'Success',
                          description: 'Thumbnail uploaded'
                        })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                {formData.thumbnail_url && (
                  <div className="mt-2 border border-slate-600 rounded-lg p-2 bg-slate-900">
                    <img 
                      src={formData.thumbnail_url} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file" className="text-slate-300">File Upload (or URL)</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  className="bg-slate-700 border-slate-600 text-white"
                  accept=".pdf,.doc,.docx,.mp4,.jpg,.jpeg,.png"
                />
                {uploading && <p className="text-sm text-yellow-400">Uploading...</p>}
                {formData.file_size && (
                  <p className="text-sm text-green-400">File size: {formData.file_size}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-300">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-600">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-violet-600 hover:bg-violet-700">
                {editingResource ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-slate-700 bg-slate-800/70">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px] bg-slate-700 border-slate-600 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Categories</SelectItem>
                {resourceCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources List */}
      <div className="grid gap-4">
        {filteredResources.length === 0 ? (
          <Card className="border-slate-700 bg-slate-800/70">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">No resources found</p>
            </CardContent>
          </Card>
        ) : (
          filteredResources.map((resource) => (
            <Card key={resource.id} className="border-slate-700 bg-slate-800/70 hover:bg-slate-800 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-slate-700 rounded-lg">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
                        <Badge variant={resource.status === 'published' ? 'default' : 'secondary'} className={resource.status === 'published' ? 'bg-green-600' : 'bg-slate-600'}>
                          {resource.status}
                        </Badge>
                      </div>
                      {resource.description && (
                        <p className="text-slate-400 text-sm mb-3">{resource.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {resource.category}
                        </span>
                        <span className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {resource.download_count || 0} downloads
                        </span>
                        {resource.file_size && (
                          <span>{resource.file_size}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(resource)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(resource.id)}
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
