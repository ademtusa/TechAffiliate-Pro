'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Image as ImageIcon, Plus, Edit, Trash2, Copy, ExternalLink } from 'lucide-react'

export default function MediaManagementPage() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMedia, setEditingMedia] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'image',
    alt_text: '',
    file_size: 0
  })
  
  const { toast } = useToast()

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/media')
      const data = await response.json()
      if (data.success) {
        setMedia(data.data)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
      toast({
        title: 'Error',
        description: 'Failed to load media',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.url) {
      toast({
        title: 'Error',
        description: 'Title and URL are required',
        variant: 'destructive'
      })
      return
    }

    try {
      const url = '/api/admin/media'
      const method = editingMedia ? 'PUT' : 'POST'
      const body = editingMedia 
        ? { id: editingMedia.id, ...formData }
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
          description: editingMedia ? 'Media updated' : 'Media added'
        })
        setIsDialogOpen(false)
        resetForm()
        fetchMedia()
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

  const handleEdit = (item) => {
    setEditingMedia(item)
    setFormData({
      title: item.title,
      url: item.url,
      type: item.type || 'image',
      alt_text: item.alt_text || '',
      file_size: item.file_size || 0
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media?')) return

    try {
      const response = await fetch(`/api/admin/media?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Media deleted'
        })
        fetchMedia()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete media',
        variant: 'destructive'
      })
    }
  }

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
    toast({
      title: 'Copied!',
      description: 'URL copied to clipboard'
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      type: 'image',
      alt_text: '',
      file_size: 0
    })
    setEditingMedia(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Media Library</h2>
          <p className="text-slate-400 mt-1">Manage images, videos, and files with URLs</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMedia ? 'Edit Media' : 'Add New Media'}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Add media by providing an external URL
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
                  placeholder="My Image"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-slate-300">Image/File URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-300">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file_size" className="text-slate-300">Size (KB)</Label>
                  <Input
                    id="file_size"
                    type="number"
                    value={formData.file_size}
                    onChange={(e) => setFormData({...formData, file_size: parseInt(e.target.value) || 0})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt_text" className="text-slate-300">Alt Text</Label>
                <Input
                  id="alt_text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({...formData, alt_text: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Description for accessibility"
                />
              </div>

              {formData.url && formData.type === 'image' && (
                <div className="space-y-2">
                  <Label className="text-slate-300">Preview</Label>
                  <div className="border border-slate-600 rounded-lg p-4 bg-slate-900">
                    <img 
                      src={formData.url} 
                      alt="Preview" 
                      className="max-h-48 mx-auto rounded"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = '<p class="text-red-400 text-sm">Invalid image URL</p>'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-600">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-cyan-600 hover:bg-cyan-700">
                {editingMedia ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{media.length}</div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">
              {media.filter(m => m.type === 'image').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {media.filter(m => m.type === 'video').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {media.filter(m => m.type === 'document').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Grid */}
      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <ImageIcon className="h-5 w-5 mr-2 text-cyan-400" />
            Media Files ({media.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {media.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p>No media files yet</p>
              <Button onClick={() => setIsDialogOpen(true)} className="mt-4 bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Add First Media
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-600 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all bg-slate-900"
                >
                  <div className="aspect-square bg-slate-800 flex items-center justify-center p-4">
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.alt_text || item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = '<div class="text-slate-600"><svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>'
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-16 w-16 text-slate-600" />
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <h4 className="font-semibold text-white text-sm truncate">{item.title}</h4>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-cyan-600 text-xs">{item.type}</Badge>
                      {item.file_size > 0 && (
                        <span className="text-xs text-slate-400">{item.file_size}KB</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 pt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(item.url)}
                        className="flex-1 text-xs text-blue-400 hover:text-blue-300"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                        className="text-xs text-green-400 hover:text-green-300"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
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