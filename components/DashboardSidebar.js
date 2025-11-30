'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Settings,
  Heart,
  GitCompare,
  BookOpen,
  Bell,
  User,
  Home,
  LogOut,
  Shield,
  Menu,
  Image as ImageIcon,
  List,
  MessageSquare,
  BarChart3,
  Folder,
  Star
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function DashboardSidebar({ isAdmin = false, isOpen, setIsOpen }) {
  const pathname = usePathname()

  const userMenuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { id: 'favorites', icon: Heart, label: 'My Favorites', href: '/dashboard/favorites' },
    { id: 'comparisons', icon: GitCompare, label: 'Comparisons', href: '/dashboard/comparisons' },
    { id: 'resources', icon: BookOpen, label: 'My Resources', href: '/dashboard/resources' },
    { id: 'notifications', icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
    { id: 'profile', icon: User, label: 'Profile Settings', href: '/dashboard/profile' },
  ]

  const adminMenuItems = [
    { id: 'overview', icon: BarChart3, label: 'Overview', href: '/admin-panel' },
    { id: 'products', icon: Package, label: 'Products', href: '/admin-panel/products' },
    { id: 'categories', icon: Folder, label: 'Categories', href: '/admin-panel/categories' },
    { id: 'resources', icon: BookOpen, label: 'Resources', href: '/admin-panel/resources' },
    { id: 'users', icon: Users, label: 'Users', href: '/admin-panel/users' },
    { id: 'testimonials', icon: Star, label: 'Testimonials', href: '/admin-panel/testimonials' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', href: '/admin-panel/messages' },
    { id: 'media', icon: ImageIcon, label: 'Media', href: '/admin-panel/media' },
    { id: 'menus', icon: List, label: 'Menus', href: '/admin-panel/menus' },
    { id: 'settings', icon: Settings, label: 'Settings', href: '/admin-panel/settings' },
  ]

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <aside 
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 flex flex-col shadow-2xl border-r border-slate-700`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50 backdrop-blur-sm">
        {isOpen && (
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="font-bold text-lg">
              {isAdmin ? 'Admin Panel' : 'Dashboard'}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-white hover:bg-slate-700/50"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          
          return (
            <Link key={item.id} href={item.href}>
              <button
                className={`w-full flex items-center ${
                  isOpen ? 'px-4' : 'px-6'
                } py-3 space-x-3 transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-r-4 border-blue-400 shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/70 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                } transition-transform`} />
                {isOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-slate-700/50 p-4 space-y-2 backdrop-blur-sm">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className={`w-full ${
              isOpen ? 'justify-start' : 'justify-center'
            } text-slate-300 hover:text-white hover:bg-slate-700/50`}
          >
            <Home className="h-5 w-5" />
            {isOpen && <span className="ml-3">Home</span>}
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className={`w-full ${
            isOpen ? 'justify-start' : 'justify-center'
          } text-red-400 hover:text-white hover:bg-red-600/50`}
        >
          <LogOut className="h-5 w-5" />
          {isOpen && <span className="ml-3">Sign Out</span>}
        </Button>
      </div>
    </aside>
  )
}