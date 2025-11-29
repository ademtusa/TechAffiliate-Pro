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

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    // TODO: Gerçek API endpoint'lerini bağla
    setStats({
      totalProducts: 0,
      totalUsers: 0,
      totalViews: 0,
      totalReviews: 0,
      pendingUsers: 0,
      activeProducts: 0
    })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Hoş Geldiniz, {session?.user?.name}! 🛡️</CardTitle>
          <CardDescription className="text-slate-300">
            Usefulio Admin Paneli - Tüm site yönetimi burada
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Toplam Ürün</CardTitle>
            <Package className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalProducts}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-green-400">{stats.activeProducts} aktif</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Toplam Kullanıcı</CardTitle>
            <Users className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-yellow-400">{stats.pendingUsers} onay bekliyor</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Toplam Görüntüleme</CardTitle>
            <Eye className="h-5 w-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalViews}</div>
            <p className="text-xs text-slate-400 mt-1">Sayfa görüntüleme</p>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Toplam Yorum</CardTitle>
            <Star className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalReviews}</div>
            <p className="text-xs text-slate-400 mt-1">Ürün yorumu</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-400" />
              Son Aktiviteler
            </CardTitle>
            <CardDescription className="text-slate-400">Site üzerindeki son hareketler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-purple-500/20">
                <div>
                  <p className="text-sm font-medium text-white">Sistem başlatıldı</p>
                  <p className="text-xs text-gray-400">Şimdi</p>
                </div>
                <Badge className="bg-green-600">Başarılı</Badge>
              </div>
              
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <p>Daha fazla aktivite yakında görünecek</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-400" />
              Bekleyen İşlemler
            </CardTitle>
            <CardDescription className="text-gray-400">Onay bekleyen ve yapılması gerekenler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Onay Bekleyen Kullanıcılar</p>
                    <p className="text-xs text-gray-400">{stats.pendingUsers} kullanıcı</p>
                  </div>
                </div>
                <Badge className="bg-yellow-600">{stats.pendingUsers}</Badge>
              </div>

              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <p>Tüm işlemler güncel!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <Card className="border-purple-500/30 bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Hızlı Erişim</CardTitle>
          <CardDescription className="text-gray-400">Sık kullanılan yönetim panelleri</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <a href="/admin-panel/products" className="block">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30 hover:border-blue-400 transition-all group cursor-pointer">
              <Package className="h-8 w-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-white mb-1">Ürün Yönetimi</h4>
              <p className="text-xs text-gray-400">Ürünleri ekle, düzenle, sil</p>
            </div>
          </a>

          <a href="/admin-panel/users" className="block">
            <div className="p-4 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg border border-green-500/30 hover:border-green-400 transition-all group cursor-pointer">
              <Users className="h-8 w-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-white mb-1">Kullanıcı Yönetimi</h4>
              <p className="text-xs text-gray-400">Kullanıcıları onayla, yönet</p>
            </div>
          </a>

          <a href="/admin-panel/settings" className="block">
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 hover:border-purple-400 transition-all group cursor-pointer">
              <Star className="h-8 w-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-white mb-1">Site Ayarları</h4>
              <p className="text-xs text-gray-400">Genel ayarlar ve yapılandırma</p>
            </div>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
