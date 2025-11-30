'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    setLoading(true)
    try {
      // Get notifications from localStorage
      const saved = JSON.parse(localStorage.getItem('userNotifications') || '[]')
      setNotifications(saved)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    localStorage.setItem('userNotifications', JSON.stringify(updated))
  }

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    localStorage.setItem('userNotifications', JSON.stringify(updated))
    toast({
      title: 'Success',
      description: 'Notification deleted'
    })
  }

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem('userNotifications', JSON.stringify(updated))
    toast({
      title: 'Success',
      description: 'All notifications marked as read'
    })
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-purple-800 flex items-center gap-2">
                <Bell className="h-6 w-6 text-blue-500" />
                Notifications
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount > 0 ? (
                  <span>{unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}</span>
                ) : (
                  <span>All caught up!</span>
                )}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No notifications yet</p>
              <p className="text-sm mt-2">We'll notify you when something important happens!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`border transition-all ${
                    notification.read 
                      ? 'border-gray-200 bg-white' 
                      : 'border-purple-300 bg-purple-50/50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold text-gray-800">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <Badge className="bg-purple-600 ml-2">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Notification Generator */}
      {notifications.length === 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-800">Want to see how notifications work?</h4>
                <p className="text-sm text-blue-600 mt-1">Generate a demo notification to test the system</p>
              </div>
              <Button
                onClick={() => {
                  const demoNotification = {
                    id: Date.now().toString(),
                    type: 'info',
                    title: 'Welcome to Usefulio!',
                    message: 'This is a demo notification. Your real notifications will appear here.',
                    timestamp: new Date().toISOString(),
                    read: false
                  }
                  const updated = [demoNotification, ...notifications]
                  setNotifications(updated)
                  localStorage.setItem('userNotifications', JSON.stringify(updated))
                  toast({
                    title: 'Demo Created',
                    description: 'Demo notification added'
                  })
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Generate Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
