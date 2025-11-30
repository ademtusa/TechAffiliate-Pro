'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MessageSquare, ExternalLink, Inbox, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="h-6 w-6 mr-2 text-purple-400" />
            Messages & Support
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage user messages and support tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-semibold text-white mb-2">Message Management Coming Soon</h3>
            <p className="text-slate-400 mb-4">View and respond to user inquiries and support requests.</p>
            
            <div className="bg-slate-700/50 rounded-lg p-6 max-w-md mx-auto mb-6">
              <h4 className="text-white font-semibold mb-3">Planned Features:</h4>
              <ul className="text-sm text-slate-400 text-left space-y-2">
                <li className="flex items-start">
                  <Inbox className="h-4 w-4 mr-2 mt-0.5 text-purple-400" />
                  Inbox for contact form submissions
                </li>
                <li className="flex items-start">
                  <Send className="h-4 w-4 mr-2 mt-0.5 text-blue-400" />
                  Reply to users directly
                </li>
                <li className="flex items-start">
                  <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-green-400" />
                  Ticket status tracking
                </li>
              </ul>
            </div>

            <div className="flex justify-center gap-4">
              <Link href="/contact" target="_blank">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Contact Page
                </Button>
              </Link>
              <Link href="/support" target="_blank">
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Support Page
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}