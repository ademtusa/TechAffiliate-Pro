'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, GitCompare, BookOpen, TrendingUp, Package, Star } from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()

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
            <CardTitle className="text-sm font-medium text-gray-600">Favorilerim</CardTitle>
            <Heart className="h-5 w-5 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">0</div>
            <p className="text-xs text-gray-500 mt-1">Kaydedilmiş ürün</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:border-purple-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Karşılaştırmalar</CardTitle>
            <GitCompare className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">0</div>
            <p className="text-xs text-gray-500 mt-1">Karşılaştırma yapıldı</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all hover:border-purple-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Kaynaklar</CardTitle>
            <BookOpen className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">0</div>
            <p className="text-xs text-gray-500 mt-1">Erişilen kaynak</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-800">Hızlı İşlemler</CardTitle>
          <CardDescription>Bugün ne yapmak istersiniz?</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Link href="/products">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" size="lg">
              <Package className="h-5 w-5 mr-2" />
              Ürünlere Göz At
            </Button>
          </Link>
          <Link href="/resources">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white" size="lg">
              <BookOpen className="h-5 w-5 mr-2" />
              Kaynakları İncele
            </Button>
          </Link>
          <Link href="/dashboard/favorites">
            <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50" size="lg">
              <Heart className="h-5 w-5 mr-2" />
              Favorilerim
            </Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50" size="lg">
              <Star className="h-5 w-5 mr-2" />
              Profil Ayarları
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-800">Son Aktiviteler</CardTitle>
          <CardDescription>Hesabınızdaki son hareketler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Henüz aktivite yok</p>
            <p className="text-sm mt-2">Başlamak için ürünleri incelemeye başlayın!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}