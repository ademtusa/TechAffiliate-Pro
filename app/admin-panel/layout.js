'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminPanelLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-purple-300">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  // Admin check
  if (session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Bu sayfaya erişim yetkiniz yok. Sadece yöneticiler bu alana erişebilir.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <a href="/dashboard" className="text-purple-600 hover:text-purple-700 font-semibold">
              ← Kullanıcı Paneline Dön
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <DashboardSidebar isAdmin={true} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Admin Paneli
            </h1>
            <p className="text-sm text-slate-400">{session?.user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-red-600 text-white">
              Yönetici
            </Badge>
            <span className="text-sm text-slate-400">{session?.user?.email}</span>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
