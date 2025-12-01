'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Star, Plus, Edit, Trash2, Check, X, Search, User } from 'lucide-react'

export default function TestimonialsManagementPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    image_url: '',
    status: 'pending',
    featured: false
  })
  
  const { toast } = useToast()

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/testimonials')
      const data = await response.json()
      if (data.success) {
        setTestimonials(data.data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast({
        title: 'Error',
        description: 'Failed to load testimonials',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select a valid image file',
        variant: 'destructive'
      })
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size must be less than 2MB',
        variant: 'destructive'
      })
      return
    }

    setUploadingImage(true)
    const reader = new FileReader()
    
    reader.onloadend = () => {
      setFormData({ ...formData, image_url: reader.result })
      setUploadingImage(false)
      toast({
        title: 'Success',
        description: 'Image uploaded. Remember to save!'
      })
    }
    
    reader.onerror = () => {
      setUploadingImage(false)
      toast({
        title: 'Error',
        description: 'Failed to read image',
        variant: 'destructive'
      })
    }
    
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: '' })
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.content) {
      toast({
        title: 'Error',
        description: 'Name and testimonial content are required',
        variant: 'destructive'
      })
      return
    }

    try {
      const url = '/api/admin/testimonials'
      const method = editingTestimonial ? 'PUT' : 'POST'
      const body = editingTestimonial 
        ? { id: editingTestimonial.id, ...formData }
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
          description: editingTestimonial ? 'Testimonial updated' : 'Testimonial created'
        })
        setIsDialogOpen(false)
        resetForm()
        fetchTestimonials()
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

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role: testimonial.role || '',
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating || 5,
      image_url: testimonial.image_url || '',
      status: testimonial.status,
      featured: testimonial.featured || false
    })
    setIsDialogOpen(true)
  }

  const handleApprove = async (id) => {
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'approve' })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Testimonial approved'
        })
        fetchTestimonials()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve testimonial',
        variant: 'destructive'
      })
    }
  }

  const handleReject = async (id) => {
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'reject' })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Testimonial rejected'
        })
        fetchTestimonials()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject testimonial',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Testimonial deleted'
        })
        fetchTestimonials()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
      image_url: '',
      status: 'pending',
      featured: false
    })
    setEditingTestimonial(null)
  }

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-600',
      approved: 'bg-green-600',
      rejected: 'bg-red-600'
    }
    return <Badge className={colors[status]}>{status}</Badge>
  }

  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (t.content && t.content.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    rejected: testimonials.filter(t => t.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Testimonials Management</h2>
          <p className="text-slate-400 mt-1">Manage customer testimonials and reviews</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Add or edit customer testimonials
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-300">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="CEO"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-slate-300">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-300">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={4}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="What did they say?"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Customer Photo</Label>
                
                {formData.image_url && (
                  <div className="relative inline-block">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="h-24 w-24 rounded-full object-cover border-2 border-slate-600"
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
                
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <p className="text-sm text-yellow-400">Uploading image...</p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating" className="text-slate-300">Rating</Label>
                  <Select value={String(formData.rating)} onValueChange={(value) => setFormData({...formData, rating: parseInt(value)})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-slate-300">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Featured</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-slate-400">Show on homepage</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-600">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-violet-600 hover:bg-violet-700">
                {editingTestimonial ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-700 bg-slate-800/70">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <div className="space-y-4">
        {filteredTestimonials.length === 0 ? (
          <Card className="border-slate-700 bg-slate-800/70">
            <CardContent className="py-12 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">No testimonials found</p>
              <Button onClick={() => setIsDialogOpen(true)} className="mt-4 bg-violet-600 hover:bg-violet-700">
                <Plus className="h-4 w-4 mr-2" />
                Add First Testimonial
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-slate-700 bg-slate-800/70 hover:bg-slate-800 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {testimonial.image_url ? (
                      <img 
                        src={testimonial.image_url} 
                        alt={testimonial.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-slate-700 flex items-center justify-center">
                        <User className="h-8 w-8 text-slate-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                        {getStatusBadge(testimonial.status)}
                        {testimonial.featured && (
                          <Badge className="bg-violet-600">Featured</Badge>
                        )}
                      </div>
                      {(testimonial.role || testimonial.company) && (
                        <p className="text-sm text-slate-400 mb-2">
                          {testimonial.role}{testimonial.role && testimonial.company && ' at '}{testimonial.company}
                        </p>
                      )}
                      <p className="text-slate-300 mb-3">&quot;{testimonial.content}&quot;</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {testimonial.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(testimonial.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReject(testimonial.id)}
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(testimonial)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(testimonial.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
