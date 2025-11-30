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
  Download,
  ExternalLink,
  FileText,
  Video,
  Image as ImageIcon,
  File
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
import Link from 'next/link'

export default function ResourcesManagementPage() {
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'pdf',
    file_url: '',
    thumbnail_url: '',
    file_size: '',
    status: 'draft'
  })

  useEffect(() => {
    fetchResources()
  }, [])

  useEffect(() => {
    filterResources()
  }, [searchTerm, filterCategory, filterStatus, resources])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/resources')
      const data = await response.json()
      
      if (data.success) {
        setResources(data.data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load resources',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const filterResources = () => {
    let filtered = resources

    if (filterCategory !== 'all') {
      filtered = filtered.filter(r => r.category === filterCategory)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredResources(filtered)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = '/api/admin/resources'
      const method = editingResource ? 'PUT' : 'POST'
      
      const payload = editingResource 
        ? { id: editingResource.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: editingResource ? 'Resource updated' : 'Resource added'
        })
        setDialogOpen(false)
        resetForm()
        fetchResources()
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Operation failed',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error saving resource:', error)
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
      title: resource.title || '',
      description: resource.description || '',
      category: resource.category || '',
      type: resource.type || 'pdf',
      file_url: resource.file_url || '',
      thumbnail_url: resource.thumbnail_url || '',
      file_size: resource.file_size || '',
      status: resource.status || 'draft'
    })
    setDialogOpen(true)
  }

  const handleDelete = async (resourceId) => {
    if (!confirm('Delete this resource?')) return

    try {
      const response = await fetch(`/api/admin/resources?id=${resourceId}`, {
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
      console.error('Error deleting resource:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete resource',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setEditingResource(null)
    setFormData({
      title: '',
      description: '',
      category: '',
      type: 'pdf',
      file_url: '',
      thumbnail_url: '',
      file_size: '',
      status: 'draft'
    })
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText className=\"h-4 w-4\" />
      case 'video': return <Video className=\"h-4 w-4\" />
      case 'image': return <ImageIcon className=\"h-4 w-4\" />
      default: return <File className=\"h-4 w-4\" />
    }
  }

  const stats = {
    total: resources.length,
    published: resources.filter(r => r.status === 'published').length,
    draft: resources.filter(r => r.status === 'draft').length,
    downloads: resources.reduce((sum, r) => sum + (r.download_count || 0), 0)
  }

  return (
    <div className=\"space-y-6\">
      <div className=\"flex items-center justify-between\">
        <div>
          <h2 className=\"text-2xl font-bold text-white\">Resources Management</h2>
          <p className=\"text-slate-400 mt-1\">Manage downloadable content with tracking</p>
        </div>
        <Link href=\"/resources\" target=\"_blank\">
          <Button variant=\"outline\" className=\"border-slate-600 text-slate-300\">
            <ExternalLink className=\"h-4 w-4 mr-2\" />
            View Live Page
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className=\"grid md:grid-cols-4 gap-4\">
        <Card className=\"border-slate-700 bg-slate-800/70\">
          <CardHeader className=\"flex flex-row items-center justify-between pb-2\">
            <CardTitle className=\"text-sm font-medium text-slate-300\">Total</CardTitle>
            <File className=\"h-4 w-4 text-green-400\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold text-white\">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className=\"border-slate-700 bg-slate-800/70\">
          <CardHeader className=\"flex flex-row items-center justify-between pb-2\">
            <CardTitle className=\"text-sm font-medium text-slate-300\">Published</CardTitle>
            <FileText className=\"h-4 w-4 text-blue-400\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold text-blue-400\">{stats.published}</div>
          </CardContent>
        </Card>

        <Card className=\"border-slate-700 bg-slate-800/70\">
          <CardHeader className=\"flex flex-row items-center justify-between pb-2\">
            <CardTitle className=\"text-sm font-medium text-slate-300\">Draft</CardTitle>
            <FileText className=\"h-4 w-4 text-yellow-400\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold text-yellow-400\">{stats.draft}</div>
          </CardContent>
        </Card>

        <Card className=\"border-slate-700 bg-slate-800/70\">
          <CardHeader className=\"flex flex-row items-center justify-between pb-2\">
            <CardTitle className=\"text-sm font-medium text-slate-300\">Downloads</CardTitle>
            <Download className=\"h-4 w-4 text-green-400\" />
          </CardHeader>
          <CardContent>
            <div className=\"text-2xl font-bold text-green-400\">{stats.downloads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card className=\"border-slate-700 bg-slate-800/70\">
        <CardHeader>
          <div className=\"flex items-center justify-between\">
            <div>
              <CardTitle className=\"text-white\">All Resources</CardTitle>
              <CardDescription className=\"text-slate-400\">
                Add, edit, or delete resources
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button className=\"bg-green-600 hover:bg-green-700\">
                  <Plus className=\"h-4 w-4 mr-2\" />
                  New Resource
                </Button>
              </DialogTrigger>
              <DialogContent className=\"max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 text-white border-slate-700\">
                <DialogHeader>
                  <DialogTitle className=\"text-white\">
                    {editingResource ? 'Edit Resource' : 'Add New Resource'}
                  </DialogTitle>
                  <DialogDescription className=\"text-slate-400\">
                    Fill in the resource details
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className=\"space-y-4\">
                  <div className=\"space-y-2\">
                    <Label htmlFor=\"title\" className=\"text-slate-300\">Title *</Label>
                    <Input
                      id=\"title\"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      className=\"bg-slate-700 border-slate-600 text-white\"
                    />
                  </div>

                  <div className=\"space-y-2\">
                    <Label htmlFor=\"description\" className=\"text-slate-300\">Description</Label>
                    <Textarea
                      id=\"description\"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className=\"bg-slate-700 border-slate-600 text-white\"
                    />
                  </div>

                  <div className=\"grid md:grid-cols-2 gap-4\">
                    <div className=\"space-y-2\">
                      <Label htmlFor=\"category\" className=\"text-slate-300\">Category *</Label>
                      <Input
                        id=\"category\"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                        className=\"bg-slate-700 border-slate-600 text-white\"
                        placeholder=\"Guides, Templates, eBooks\"
                      />
                    </div>
                    <div className=\"space-y-2\">
                      <Label htmlFor=\"type\" className=\"text-slate-300\">Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger className=\"bg-slate-700 border-slate-600 text-white\">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=\"pdf\">PDF</SelectItem>
                          <SelectItem value=\"video\">Video</SelectItem>
                          <SelectItem value=\"image\">Image</SelectItem>
                          <SelectItem value=\"zip\">ZIP</SelectItem>
                          <SelectItem value=\"doc\">Document</SelectItem>
                          <SelectItem value=\"other\">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className=\"space-y-2\">
                    <Label htmlFor=\"file_url\" className=\"text-slate-300\">File URL *</Label>
                    <Input
                      id=\"file_url\"
                      value={formData.file_url}
                      onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                      required
                      className=\"bg-slate-700 border-slate-600 text-white\"
                      placeholder=\"https://example.com/file.pdf\"
                    />
                  </div>

                  <div className=\"space-y-2\">
                    <Label htmlFor=\"thumbnail_url\" className=\"text-slate-300\">Thumbnail URL</Label>
                    <Input
                      id=\"thumbnail_url\"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                      className=\"bg-slate-700 border-slate-600 text-white\"
                      placeholder=\"https://example.com/thumbnail.jpg\"
                    />
                  </div>

                  <div className=\"grid md:grid-cols-2 gap-4\">
                    <div className=\"space-y-2\">
                      <Label htmlFor=\"file_size\" className=\"text-slate-300\">File Size</Label>
                      <Input
                        id=\"file_size\"
                        value={formData.file_size}
                        onChange={(e) => setFormData({...formData, file_size: e.target.value})}
                        className=\"bg-slate-700 border-slate-600 text-white\"
                        placeholder=\"2.5 MB\"
                      />
                    </div>
                    <div className=\"space-y-2\">
                      <Label htmlFor=\"status\" className=\"text-slate-300\">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger className=\"bg-slate-700 border-slate-600 text-white\">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=\"draft\">Draft</SelectItem>
                          <SelectItem value=\"published\">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className=\"flex justify-end space-x-2\">
                    <Button type=\"button\" variant=\"outline\" onClick={() => setDialogOpen(false)} className=\"border-slate-600 text-slate-300\">
                      Cancel
                    </Button>
                    <Button type=\"submit\" className=\"bg-green-600 hover:bg-green-700\">
                      {editingResource ? 'Update' : 'Add'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className=\"flex flex-col md:flex-row gap-4 mb-6\">
            <div className=\"relative flex-1\">
              <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400\" />
              <Input
                type=\"text\"
                placeholder=\"Search resources...\"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=\"pl-10 bg-slate-700 border-slate-600 text-white\"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className=\"w-32 bg-slate-700 border-slate-600 text-white\">
                <SelectValue placeholder=\"Status\" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=\"all\">All</SelectItem>
                <SelectItem value=\"published\">Published</SelectItem>
                <SelectItem value=\"draft\">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resources List */}
          {loading ? (
            <div className=\"text-center py-12\">
              <div className=\"inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600\"></div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className=\"text-center py-12 text-slate-500\">
              <File className=\"h-12 w-12 mx-auto mb-4 text-slate-600\" />
              <p>No resources found</p>
              <Button onClick={() => setDialogOpen(true)} className=\"mt-4 bg-green-600 hover:bg-green-700\">
                <Plus className=\"h-4 w-4 mr-2\" />
                Add First Resource
              </Button>
            </div>
          ) : (
            <div className=\"space-y-3\">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className=\"flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-all\"
                >
                  <div className=\"flex items-center space-x-4 flex-1\">
                    {resource.thumbnail_url ? (
                      <img src={resource.thumbnail_url} alt={resource.title} className=\"h-12 w-12 rounded object-cover\" />
                    ) : (
                      <div className=\"h-12 w-12 rounded bg-slate-600 flex items-center justify-center\">
                        {getTypeIcon(resource.type)}
                      </div>
                    )}
                    <div className=\"flex-1\">
                      <h4 className=\"font-semibold text-white\">{resource.title}</h4>
                      <p className=\"text-sm text-slate-400 line-clamp-1\">{resource.description}</p>
                      <div className=\"flex items-center space-x-2 mt-1\">
                        <Badge variant=\"outline\" className=\"text-xs border-slate-600 text-slate-300\">{resource.category}</Badge>
                        <Badge variant=\"outline\" className=\"text-xs border-slate-600 text-slate-300\">{resource.type}</Badge>
                        {resource.file_size && <span className=\"text-xs text-slate-400\">{resource.file_size}</span>}
                        <span className=\"text-xs text-slate-400\">• {resource.download_count || 0} downloads</span>
                      </div>
                    </div>
                  </div>
                  <div className=\"flex items-center space-x-3\">
                    <Badge className={resource.status === 'published' ? 'bg-green-600' : 'bg-yellow-600'}>
                      {resource.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                    <Button
                      size=\"sm\"
                      onClick={() => handleEdit(resource)}
                      className=\"bg-blue-600 hover:bg-blue-700\"
                    >
                      <Edit2 className=\"h-4 w-4\" />
                    </Button>
                    <Button
                      size=\"sm\"
                      onClick={() => handleDelete(resource.id)}
                      variant=\"outline\"
                      className=\"border-red-500 text-red-400 hover:bg-red-500/20\"
                    >
                      <Trash2 className=\"h-4 w-4\" />
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