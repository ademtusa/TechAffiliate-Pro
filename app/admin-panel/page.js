'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Users, 
  Eye, 
  Star, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function AdminPanelPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalViews: 0,
    totalReviews: 0,
    pendingUsers: 0,
    activeProducts: 0
  })

  const fetchStats = async () => {
    // TODO: Connect real API endpoints
    setStats({
      totalProducts: 0,
      totalUsers: 0,
      totalViews: 0,
      totalReviews: 0,
      pendingUsers: 0,
      activeProducts: 0
    })
  }

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome, {session?.user?.name}! 🛡️</CardTitle>
          <CardDescription className="text-slate-300">
            Usefulio Admin Panel - Full site management here
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Products</CardTitle>
            <Package className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalProducts}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-green-400">{stats.activeProducts} active</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
            <Users className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-yellow-400">{stats.pendingUsers} pending</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Views</CardTitle>
            <Eye className="h-5 w-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalViews}</div>
            <p className="text-xs text-slate-400 mt-1">Page views</p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Reviews</CardTitle>
            <Star className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalReviews}</div>
            <p className="text-xs text-slate-400 mt-1">Product reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400">Latest actions on the site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <div>
                  <p className="text-sm font-medium text-white">System started</p>
                  <p className="text-xs text-slate-400">Now</p>
                </div>
                <Badge className="bg-green-600">Success</Badge>
              </div>
              
              <div className="text-center py-8 text-slate-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <p>More activity will appear soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-400" />
              Pending Tasks
            </CardTitle>
            <CardDescription className="text-slate-400">Items awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Pending Users</p>
                    <p className="text-xs text-slate-400">{stats.pendingUsers} users</p>
                  </div>
                </div>
                <Badge className="bg-yellow-600">{stats.pendingUsers}</Badge>
              </div>

              <div className="text-center py-8 text-slate-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <p>All tasks are up to date!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Quick Access</CardTitle>
          <CardDescription className="text-slate-400">Frequently used management panels</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <a href="/admin-panel/products" className="block">
            <div className="p-4 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30 hover:border-blue-400 transition-all group cursor-pointer">
              <Package className="h-8 w-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-white mb-1">Product Management</h4>
              <p className="text-xs text-slate-400">Add, edit, delete products</p>
            </div>
          </a>

          <a href="/admin-panel/users" className="block">
            <div className="p-4 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30 hover:border-green-400 transition-all group cursor-pointer">
              <Users className="h-8 w-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-white mb-1">User Management</h4>
              <p className="text-xs text-slate-400">Approve and manage users</p>
            </div>
          </a>

          <a href="/admin-panel/settings" className="block">
            <div className="p-4 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-lg border border-violet-500/30 hover:border-violet-400 transition-all group cursor-pointer">
              <Star className="h-8 w-8 text-violet-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-white mb-1">Site Settings</h4>
              <p className="text-xs text-slate-400">General settings and configuration</p>
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
