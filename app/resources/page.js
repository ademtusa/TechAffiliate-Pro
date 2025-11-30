'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BookOpen, 
  Download, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Search,
  Filter,
  Lock,
  CheckCircle
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function ResourcesPage() {
  const { data: session, status } = useSession()
  const [resources, setResources] = useState([])
  const [downloadedResources, setDownloadedResources] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    fetchResources()
    if (session?.user?.id) {
      fetchUserDownloads()
    }
  }, [session])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/resources')
      const data = await response.json()
      if (data.success) {
        setResources(data.data)
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDownloads = async () => {
    try {
      const response = await fetch('/api/resources/downloads')
      const data = await response.json()
      if (data.success) {
        const downloadedIds = new Set(data.data.map(d => d.resource_id))
        setDownloadedResources(downloadedIds)
      }
    } catch (error) {
      console.error('Error fetching user downloads:', error)
    }
  }

  const handleDownload = async (resourceId, resourceTitle) => {
    if (status !== 'authenticated') {
      toast({
        title: 'Login Required',
        description: 'Please login to download resources',
        variant: 'destructive'
      })
      return
    }

    try {
      const response = await fetch('/api/resources/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Download Started',
          description: `Downloading ${resourceTitle}...`
        })
        
        // Update downloaded resources set
        setDownloadedResources(prev => new Set([...prev, resourceId]))
        
        // Trigger actual download
        if (data.file_url) {
          const link = document.createElement('a')
          link.href = data.file_url
          link.download = resourceTitle
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        toast({
          title: 'Download Failed',
          description: data.message || 'Could not download resource',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error downloading:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while downloading',
        variant: 'destructive'
      })
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-400" />
      case 'video': return <Video className="h-5 w-5 text-purple-400" />
      case 'image': return <ImageIcon className="h-5 w-5 text-blue-400" />
      default: return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory
    const matchesType = filterType === 'all' || resource.type === filterType
    return matchesSearch && matchesCategory && matchesType
  })

  const categories = [...new Set(resources.map(r => r.category).filter(Boolean))]
  const types = [...new Set(resources.map(r => r.type).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Usefulio Resources
            </Link>
            {status === 'authenticated' ? (
              <Link href="/dashboard">
                <Button variant="outline" className="border-violet-500 text-violet-400 hover:bg-violet-500/20">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="bg-violet-600 hover:bg-violet-700">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Free Resources Library
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Download guides, templates, and tools. One resource per category.
          </p>
        </div>

        {/* Filters */}
        <Card className="border-slate-700 bg-slate-800/70 backdrop-blur-sm mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[200px] bg-slate-700 border-slate-600 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px] bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          </div>
        ) : filteredResources.length === 0 ? (
          <Card className="border-slate-700 bg-slate-800/70">
            <CardContent className="py-20 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 text-lg">No resources found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const isDownloaded = downloadedResources.has(resource.id)
              
              return (
                <Card key={resource.id} className="border-slate-700 bg-slate-800/70 backdrop-blur-sm hover:bg-slate-800 transition-all hover:border-violet-500/50">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-3 bg-slate-700 rounded-lg">
                        {getTypeIcon(resource.type)}
                      </div>
                      {isDownloaded && (
                        <Badge className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Downloaded
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-white text-xl">{resource.title}</CardTitle>
                    {resource.description && (
                      <p className="text-slate-400 text-sm mt-2">{resource.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-violet-500/50 text-violet-400">
                          {resource.category}
                        </Badge>
                        <span className="text-sm text-slate-500 flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {resource.download_count || 0}
                        </span>
                      </div>
                      {resource.file_size && (
                        <span className="text-xs text-slate-500">{resource.file_size}</span>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => handleDownload(resource.id, resource.title)}
                      disabled={isDownloaded || status !== 'authenticated'}
                      className={isDownloaded 
                        ? "w-full bg-slate-700 cursor-not-allowed" 
                        : "w-full bg-violet-600 hover:bg-violet-700"
                      }
                    >
                      {isDownloaded ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Already Downloaded
                        </>
                      ) : status !== 'authenticated' ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Login to Download
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Info Notice */}
        {status === 'authenticated' && (
          <Card className="border-yellow-500/30 bg-yellow-900/10 backdrop-blur-sm mt-8">
            <CardContent className="pt-6">
              <p className="text-yellow-400 text-sm text-center">
                ℹ️ You can download one resource per category. Choose wisely!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
