'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Image as ImageIcon, ExternalLink, Upload, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MediaManagementPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <ImageIcon className="h-6 w-6 mr-2 text-cyan-400" />
            Media Library
          </CardTitle>
          <CardDescription className="text-slate-400">
            Upload and manage images, videos, and files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold text-white mb-2">Media Library Coming Soon</h3>
            <p className="text-slate-400 mb-4">Centralized media management for all your images and files.</p>
            
            <div className="bg-slate-700/50 rounded-lg p-6 max-w-md mx-auto mb-6">
              <h4 className="text-white font-semibold mb-3">Current Workaround:</h4>
              <p className="text-sm text-slate-400 mb-3">You can add image URLs directly in product management.</p>
              
              <h4 className="text-white font-semibold mb-3 mt-4">Planned Features:</h4>
              <ul className="text-sm text-slate-400 text-left space-y-2">
                <li className="flex items-start">
                  <Upload className="h-4 w-4 mr-2 mt-0.5 text-cyan-400" />
                  Drag & drop file uploads
                </li>
                <li className="flex items-start">
                  <Folder className="h-4 w-4 mr-2 mt-0.5 text-blue-400" />
                  Organize in folders
                </li>
                <li className="flex items-start">
                  <ImageIcon className="h-4 w-4 mr-2 mt-0.5 text-green-400" />
                  Image optimization
                </li>
              </ul>
            </div>

            <div className="flex justify-center gap-4">
              <Link href="/admin-panel/products">
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage Product Images
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}