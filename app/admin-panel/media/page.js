'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Image as ImageIcon, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MediaManagementPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <ImageIcon className="h-6 w-6 mr-2 text-cyan-400" />
            Media Management
          </CardTitle>
          <CardDescription className="text-slate-400">
            Upload and manage images, videos (Coming Soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold text-white mb-2">Media Library</h3>
            <p className="text-slate-400 mb-6">This feature is under development</p>
            <p className="text-sm text-slate-500">Currently, you can add image URLs directly in product management</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}