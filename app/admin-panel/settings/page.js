'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="h-6 w-6 mr-2 text-violet-400" />
            Site Settings
          </CardTitle>
          <CardDescription className="text-slate-400">
            General site configuration (Coming Soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Settings className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold text-white mb-2">Site Settings</h3>
            <p className="text-slate-400 mb-6">This feature is under development</p>
            <p className="text-sm text-slate-500 mb-4">Planned settings:</p>
            <ul className="text-sm text-slate-400 text-left max-w-md mx-auto space-y-2">
              <li>• Site title and description</li>
              <li>• Button texts and labels</li>
              <li>• Menu headings</li>
              <li>• SEO settings</li>
              <li>• Analytics integration</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}