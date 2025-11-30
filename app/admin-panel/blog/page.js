'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function BlogManagementPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-400" />
            Product Articles Management
          </CardTitle>
          <CardDescription className="text-slate-400">
            This section is now part of Product Management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold text-white mb-2">Redirected to Products</h3>
            <p className="text-slate-400 mb-4">Blog/Articles are now managed as part of the products section.</p>
            <p className="text-sm text-slate-500 mb-6">Use Product Management to add descriptions and details.</p>
            <div className="flex justify-center gap-4">
              <Link href="/admin-panel/products">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage Products
                </Button>
              </Link>
              <Link href="/products" target="_blank">
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Products Page
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}