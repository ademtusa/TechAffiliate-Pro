'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Download, ExternalLink, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

export default function MyResourcesPage() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchResources = async () => {
    setLoading(true)
    try {
      // Fetch resources from backend
      const response = await fetch('/api/user/resources')
      const data = await response.json()
      
      if (data.success) {
        setResources(data.data)
        // Update localStorage for consistency
        const downloaded = data.data.map(r => ({
          resourceId: r.id,
          downloadedAt: r.downloadedAt
        }))
        localStorage.setItem('downloadedResources', JSON.stringify(downloaded))
      }
    } catch (error) {
      console.error('Error loading resources:', error)
      toast({
        title: 'Error',
        description: 'Failed to load resources',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (resource) => {
    try {
      // Track download
      await fetch('/api/resources/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: resource.id })
      })
      
      // Open download link
      window.open(resource.file_url, '_blank')
      
      toast({
        title: 'Success',
        description: 'Resource download started'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download resource',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-purple-800 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-green-500" />
                My Resources
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {resources.length} {resources.length === 1 ? 'resource' : 'resources'} downloaded
              </p>
            </div>
            <Link href="/resources">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <ExternalLink className="h-4 w-4 mr-2" />
                Browse More
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No resources downloaded yet</p>
              <p className="text-sm mt-2">Start exploring and download useful resources!</p>
              <Link href="/resources">
                <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Explore Resources
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <Card key={resource.id} className="border-purple-200 hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {resource.category && (
                            <Badge className="bg-purple-100 text-purple-800">
                              {resource.category}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Downloaded: {new Date(resource.downloadedAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          {resource.file_size && (
                            <span>{resource.file_size}</span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleDownload(resource)}
                        className="bg-green-600 hover:bg-green-700 ml-4"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
