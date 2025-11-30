'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'
import { Badge } from '@/components/ui/badge'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <DashboardSidebar isAdmin={false} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-purple-100 flex items-center justify-between px-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome!
            </h1>
            <p className="text-sm text-gray-600">{session?.user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              User
            </Badge>
            <span className="text-sm text-gray-600">{session?.user?.email}</span>
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