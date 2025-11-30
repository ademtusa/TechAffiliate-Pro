'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Check, 
  X, 
  Trash2, 
  Search, 
  Users as UsersIcon,
  UserCheck,
  UserX,
  Clock,
  Edit
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function UsersManagementPage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, approved, rejected
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [editFormData, setEditFormData] = useState({ role: '', status: '' })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [searchTerm, filterStatus, users])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data)
      } else {
        toast({
          title: 'Hata',
          description: 'Kullanıcılar yüklenemedi',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Hata',
        description: 'Bir hata oluştu',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }

  const handleApprove = async (userId) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: 'approved' })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Başarılı',
          description: 'Kullanıcı onaylandı',
        })
        fetchUsers()
      }
    } catch (error) {
      console.error('Error approving user:', error)
      toast({
        title: 'Hata',
        description: 'Kullanıcı onaylanamadı',
        variant: 'destructive'
      })
    }
  }

  const handleReject = async (userId) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: 'rejected' })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Başarılı',
          description: 'Kullanıcı reddedildi',
        })
        fetchUsers()
      }
    } catch (error) {
      console.error('Error rejecting user:', error)
      toast({
        title: 'Hata',
        description: 'Kullanıcı reddedilemedi',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setEditFormData({
      role: user.role || 'user',
      status: user.status || 'pending'
    })
    setEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: editingUser.id, 
          role: editFormData.role,
          status: editFormData.status
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Başarılı',
          description: 'Kullanıcı güncellendi',
        })
        setEditDialogOpen(false)
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast({
        title: 'Hata',
        description: 'Kullanıcı güncellenemedi',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Başarılı',
          description: 'Kullanıcı silindi',
        })
        fetchUsers()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: 'Hata',
        description: 'Kullanıcı silinemedi',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Onaylı</Badge>
      case 'pending':
        return <Badge className="bg-yellow-600">Onay Bekliyor</Badge>
      case 'rejected':
        return <Badge className="bg-red-600">Reddedildi</Badge>
      default:
        return <Badge className="bg-gray-600">{status}</Badge>
    }
  }

  const stats = {
    total: users.length,
    pending: users.filter(u => u.status === 'pending').length,
    approved: users.filter(u => u.status === 'approved').length,
    rejected: users.filter(u => u.status === 'rejected').length
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card 
          className={`border-purple-500/30 bg-gray-800/50 backdrop-blur-sm cursor-pointer transition-all ${
            filterStatus === 'all' ? 'ring-2 ring-purple-500' : 'hover:bg-gray-800/70'
          }`}
          onClick={() => setFilterStatus('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Toplam</CardTitle>
            <UsersIcon className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>

        <Card 
          className={`border-yellow-500/30 bg-gray-800/50 backdrop-blur-sm cursor-pointer transition-all ${
            filterStatus === 'pending' ? 'ring-2 ring-yellow-500' : 'hover:bg-gray-800/70'
          }`}
          onClick={() => setFilterStatus('pending')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Onay Bekliyor</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card 
          className={`border-green-500/30 bg-gray-800/50 backdrop-blur-sm cursor-pointer transition-all ${
            filterStatus === 'approved' ? 'ring-2 ring-green-500' : 'hover:bg-gray-800/70'
          }`}
          onClick={() => setFilterStatus('approved')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Onaylı</CardTitle>
            <UserCheck className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card 
          className={`border-red-500/30 bg-gray-800/50 backdrop-blur-sm cursor-pointer transition-all ${
            filterStatus === 'rejected' ? 'ring-2 ring-red-500' : 'hover:bg-gray-800/70'
          }`}
          onClick={() => setFilterStatus('rejected')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Reddedildi</CardTitle>
            <UserX className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-purple-500/30 bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Kullanıcı Yönetimi</CardTitle>
              <CardDescription className="text-gray-400">
                Kullanıcıları onaylayın, reddedin veya silin
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p>Kullanıcı bulunamadı</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{user.name}</h4>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Kayıt: {new Date(user.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(user.status)}
                    <Badge className="bg-gray-600">{user.role}</Badge>
                    
                    {user.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(user.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Onayla
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReject(user.id)}
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-500/20"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reddet
                        </Button>
                      </>
                    )}
                    
                    {user.status === 'rejected' && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(user.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Onayla
                      </Button>
                    )}

                    <Button
                      size="sm"
                      onClick={() => handleEdit(user)}
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {user.role !== 'admin' && (
                      <Button
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        variant="outline"
                        className="border-red-500 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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