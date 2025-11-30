'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, GitCompare, BookOpen, TrendingUp, Package, Star } from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({ favorites: 0, resources: 0, comparisons: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="border-transparent bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl">Hello, {session?.user?.name}! 👋</CardTitle>
          <CardDescription className="text-purple-100">
            Welcome to Usefulio. Manage all your activities from your dashboard.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:border-purple-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">My Favorites</CardTitle>
            <Heart className="h-5 w-5 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">0</div>
            <p className="text-xs text-gray-500 mt-1">Saved products</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:border-purple-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Comparisons</CardTitle>
            <GitCompare className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">0</div>
            <p className="text-xs text-gray-500 mt-1">Comparisons made</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:border-purple-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Resources</CardTitle>
            <BookOpen className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">0</div>
            <p className="text-xs text-gray-500 mt-1">Resources accessed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-800">Quick Actions</CardTitle>
          <CardDescription>What would you like to do today?</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Link href="/products">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" size="lg">
              <Package className="h-5 w-5 mr-2" />
              Browse Products
            </Button>
          </Link>
          <Link href="/resources">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" size="lg">
              <BookOpen className="h-5 w-5 mr-2" />
              Explore Resources
            </Button>
          </Link>
          <Link href="/dashboard/favorites">
            <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50" size="lg">
              <Heart className="h-5 w-5 mr-2" />
              My Favorites
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50" size="lg">
              <Star className="h-5 w-5 mr-2" />
              Profile Settings
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-800">Recent Activity</CardTitle>
          <CardDescription>Latest actions on your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No activity yet</p>
            <p className="text-sm mt-2">Start exploring products to get started!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}