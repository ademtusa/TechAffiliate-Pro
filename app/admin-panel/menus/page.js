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
import { List, Plus, Edit, Trash2, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react'

export default function MenuManagementPage() {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    order: 0,
    target: '_self',
    is_active: true
  })
  
  const { toast } = useToast()

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/menus')
      const data = await response.json()
      if (data.success) {
        setMenus(data.data)
      }
    } catch (error) {
      console.error('Error fetching menus:', error)
      toast({
        title: 'Error',
        description: 'Failed to load menus',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.label || !formData.url) {
      toast({
        title: 'Error',
        description: 'Label and URL are required',
        variant: 'destructive'
      })
      return
    }

    try {
      const url = '/api/admin/menus'
      const method = editingMenu ? 'PUT' : 'POST'
      const body = editingMenu 
        ? { id: editingMenu.id, ...formData }
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
          description: editingMenu ? 'Menu updated' : 'Menu created'
        })
        setIsDialogOpen(false)
        resetForm()
        fetchMenus()
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

  const handleEdit = (menu) => {
    setEditingMenu(menu)
    setFormData({
      label: menu.label,
      url: menu.url,
      order: menu.order || 0,
      target: menu.target || '_self',
      is_active: menu.is_active !== undefined ? menu.is_active : true
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      const response = await fetch(`/api/admin/menus?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Menu deleted'
        })
        fetchMenus()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete menu',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      label: '',
      url: '',
      order: 0,
      target: '_self',
      is_active: true
    })
    setEditingMenu(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Menu Management</h2>
          <p className="text-slate-400 mt-1">Manage site navigation and menu items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>{editingMenu ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Configure navigation menu item
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label" className="text-slate-300">Label *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Home"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-slate-300">URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="/home"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="target" className="text-slate-300">Target</Label>
                  <Select value={formData.target} onValueChange={(value) => setFormData({...formData, target: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="_self">Same Window</SelectItem>
                      <SelectItem value="_blank">New Window</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="h-4 w-4"
                />
                <Label className="text-slate-300">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-600">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
                {editingMenu ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu List */}
      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <List className="h-5 w-5 mr-2 text-orange-400" />
            Navigation Items ({menus.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {menus.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <List className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p>No menu items yet</p>
              <Button onClick={() => setIsDialogOpen(true)} className="mt-4 bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-orange-500/50 transition-all"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-slate-500 font-mono text-sm w-8">{menu.order}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white">{menu.label}</h4>
                        {menu.is_active ? (
                          <Badge className="bg-green-600">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-600">Inactive</Badge>
                        )}
                        {menu.target === '_blank' && (
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{menu.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(menu)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(menu.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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