'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings, ExternalLink, Globe, Mail, Code } from 'lucide-react'
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
            Configure site-wide settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Settings className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold text-white mb-2">Settings Panel Coming Soon</h3>
            <p className="text-slate-400 mb-4">Manage site configuration, SEO, and integrations.</p>
            
            <div className="bg-slate-700/50 rounded-lg p-6 max-w-md mx-auto mb-6">
              <h4 className="text-white font-semibold mb-3">Current Configuration:</h4>
              <ul className="text-sm text-slate-400 text-left space-y-2 mb-4">
                <li>• Site Name: Usefulio</li>
                <li>• Tagline: Find What's Actually Useful</li>
                <li>• Environment: Production</li>
              </ul>
              
              <h4 className="text-white font-semibold mb-3">Planned Settings:</h4>
              <ul className="text-sm text-slate-400 text-left space-y-2">
                <li className="flex items-start">
                  <Globe className="h-4 w-4 mr-2 mt-0.5 text-violet-400" />
                  General (Site title, description, logo)
                </li>
                <li className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 mt-0.5 text-blue-400" />
                  Email & SMTP settings
                </li>
                <li className="flex items-start">
                  <Code className="h-4 w-4 mr-2 mt-0.5 text-green-400" />
                  SEO & Analytics (GA, AdSense)
                </li>
              </ul>
            </div>

            <div className="flex justify-center gap-4">
              <Link href="/about" target="_blank">
                <Button className="bg-violet-600 hover:bg-violet-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View About Page
                </Button>
              </Link>
              <Link href="/" target="_blank">
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Home Page
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}