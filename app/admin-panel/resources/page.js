'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BookOpen, ExternalLink, Download, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ResourcesManagementPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-green-400" />
            Resources Management - COMING SOON
          </CardTitle>
          <CardDescription className="text-slate-400">
            Full CRUD system with download tracking is ready in database. UI will be added next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold text-white mb-2">Backend Ready!</h3>
            <p className="text-slate-400 mb-4">Database models and APIs are fully functional.</p>
            
            <div className="bg-slate-700/50 rounded-lg p-6 max-w-md mx-auto mb-6">
              <h4 className="text-white font-semibold mb-3">Completed Backend:</h4>
              <ul className="text-sm text-slate-400 text-left space-y-2">
                <li className="flex items-start">
                  <Download className="h-4 w-4 mr-2 mt-0.5 text-green-400" />
                  Database models (resources + downloads)
                </li>
                <li className="flex items-start">
                  <Lock className="h-4 w-4 mr-2 mt-0.5 text-yellow-400" />
                  1 user = 1 download rule
                </li>
                <li className="flex items-start">
                  <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-blue-400" />
                  Full CRUD API routes
                </li>
              </ul>
            </div>

            <div className="flex justify-center gap-4">
              <Link href="/resources" target="_blank">
                <Button className="bg-green-600 hover:bg-green-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Resources Page
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
