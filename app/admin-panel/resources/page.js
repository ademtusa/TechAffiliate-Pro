'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BookOpen, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ResourcesManagementPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-green-400" />
            Resources Management
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage downloadable resources (Coming Soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold text-white mb-2">Resources Management</h3>
            <p className="text-slate-400 mb-6">This feature is under development</p>
            <Link href="/resources">
              <Button className="bg-green-600 hover:bg-green-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Resources Page
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}