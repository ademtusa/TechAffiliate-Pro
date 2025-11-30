'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { List, ExternalLink, Navigation, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MenuManagementPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <List className="h-6 w-6 mr-2 text-orange-400" />
            Navigation Menu Editor
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage site navigation and menu items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <List className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold text-white mb-2">Menu Editor Coming Soon</h3>
            <p className="text-slate-400 mb-4">Customize navigation menus and site structure.</p>
            
            <div className="bg-slate-700/50 rounded-lg p-6 max-w-md mx-auto mb-6">
              <h4 className="text-white font-semibold mb-3">Current Navigation:</h4>
              <ul className="text-sm text-slate-400 text-left space-y-2 mb-4">
                <li>• Home</li>
                <li>• Products</li>
                <li>• Resources</li>
                <li>• Contact</li>
              </ul>
              
              <h4 className="text-white font-semibold mb-3">Planned Features:</h4>
              <ul className="text-sm text-slate-400 text-left space-y-2">
                <li className="flex items-start">
                  <Plus className="h-4 w-4 mr-2 mt-0.5 text-green-400" />
                  Add/remove menu items
                </li>
                <li className="flex items-start">
                  <Navigation className="h-4 w-4 mr-2 mt-0.5 text-blue-400" />
                  Drag & drop reordering
                </li>
                <li className="flex items-start">
                  <List className="h-4 w-4 mr-2 mt-0.5 text-orange-400" />
                  Nested sub-menus
                </li>
              </ul>
            </div>

            <div className="flex justify-center gap-4">
              <Link href="/" target="_blank">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Navigation
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}