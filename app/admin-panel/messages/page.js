'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { MessageSquare, Trash2, Search, Mail, MailOpen } from 'lucide-react'

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { toast } = useToast()

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/messages')
      const data = await response.json()
      if (data.success) {
        setMessages(data.data)
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load messages', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'read' })
      })
      fetchMessages()
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' })
      toast({ title: 'Success', description: 'Message deleted' })
      fetchMessages()
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' })
    }
  }

  const filtered = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    read: messages.filter(m => m.status === 'read').length
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div></div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Messages</h2>
        <p className="text-slate-400 mt-1">Contact form submissions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-slate-700 bg-slate-800/70">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-sm text-slate-400">Total Messages</p>
          </CardContent>
        </Card>
        <Card className="border-slate-700 bg-slate-800/70">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-400">{stats.unread}</div>
            <p className="text-sm text-slate-400">Unread</p>
          </CardContent>
        </Card>
        <Card className="border-slate-700 bg-slate-800/70">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-400">{stats.read}</div>
            <p className="text-sm text-slate-400">Read</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-700 bg-slate-800/70">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-slate-700 border-slate-600 text-white" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-700 border-slate-600 text-white rounded px-3">
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="border-slate-700 bg-slate-800/70">
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">No messages</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((msg) => (
            <Card key={msg.id} className="border-slate-700 bg-slate-800/70">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{msg.name}</h3>
                      <Badge className={msg.status === 'unread' ? 'bg-yellow-600' : 'bg-gray-600'}>{msg.status}</Badge>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{msg.email}</p>
                    {msg.subject && <p className="text-slate-300 font-medium mb-2">{msg.subject}</p>}
                    <p className="text-slate-300">{msg.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {msg.status === 'unread' && (
                      <Button size="sm" onClick={() => handleMarkAsRead(msg.id)} className="bg-blue-600 hover:bg-blue-700">
                        <MailOpen className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(msg.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
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
