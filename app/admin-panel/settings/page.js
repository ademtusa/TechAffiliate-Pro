'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings, Save, ExternalLink, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    site_name: '',
    site_tagline: '',
    logo_url: '',
    contact_email: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    google_analytics_id: '',
    adsense_client_id: ''
  })
  const { toast } = useToast()

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      
      if (data.success) {
        setSettings(data.data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load settings',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (max 500KB)
    if (file.size > 500 * 1024) {
      toast({
        title: 'Error',
        description: 'Logo file size must be less than 500KB',
        variant: 'destructive'
      })
      return
    }

    // Check file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Error',
        description: 'Please upload a valid image file (PNG, JPEG, GIF, WebP, SVG)',
        variant: 'destructive'
      })
      return
    }

    // Convert to Base64
    const reader = new FileReader()
    reader.onloadend = () => {
      setSettings({...settings, logo_url: reader.result})
      toast({
        title: 'Success',
        description: 'Logo uploaded. Click "Save Settings" to apply.'
      })
    }
    reader.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to read file',
        variant: 'destructive'
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Settings saved successfully'
        })
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to save settings',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Site Settings</h2>
          <p className="text-slate-400 mt-1">Configure your site&apos;s general settings and preferences</p>
        </div>
        <Link href="/" target="_blank">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Live Site
          </Button>
        </Link>
      </div>

      <Alert className="bg-blue-500/10 border-blue-500/30">
        <AlertCircle className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-slate-300">
          Changes will be reflected immediately on your live website after saving.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-slate-700 bg-slate-800/70">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Basic information about your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name" className="text-slate-300">Site Name *</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Usefulio"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_tagline" className="text-slate-300">Site Tagline *</Label>
                <Input
                  id="site_tagline"
                  value={settings.site_tagline}
                  onChange={(e) => setSettings({...settings, site_tagline: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Find What's Actually Useful"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_upload" className="text-slate-300">Logo Upload</Label>
                <div className="flex flex-col gap-3">
                  {settings.logo_url && (
                    <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <img 
                        src={settings.logo_url} 
                        alt="Logo preview" 
                        className="h-16 w-16 object-contain bg-white rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-slate-300">Current Logo</p>
                        <p className="text-xs text-slate-500">
                          {settings.logo_url.startsWith('data:') ? 'Uploaded image' : 'External URL'}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSettings({...settings, logo_url: ''})}
                        className="border-red-500 text-red-400"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  <Input
                    id="logo_upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="bg-slate-700 border-slate-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-700"
                  />
                  <p className="text-xs text-slate-500">
                    Supported: PNG, JPEG, GIF, WebP, SVG (Max 500KB recommended)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className="text-slate-300">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="contact@usefulio.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card className="border-slate-700 bg-slate-800/70">
            <CardHeader>
              <CardTitle className="text-white">SEO Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Optimize your site for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title" className="text-slate-300">SEO Title</Label>
                <Input
                  id="seo_title"
                  value={settings.seo_title}
                  onChange={(e) => setSettings({...settings, seo_title: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Usefulio - Find What's Actually Useful"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description" className="text-slate-300">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  value={settings.seo_description}
                  onChange={(e) => setSettings({...settings, seo_description: e.target.value})}
                  rows={3}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Discover trusted, useful products..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_keywords" className="text-slate-300">SEO Keywords</Label>
                <Textarea
                  id="seo_keywords"
                  value={settings.seo_keywords}
                  onChange={(e) => setSettings({...settings, seo_keywords: e.target.value})}
                  rows={2}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="useful products, product reviews, AI tools"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="border-slate-700 bg-slate-800/70">
            <CardHeader>
              <CardTitle className="text-white">Analytics & Tracking</CardTitle>
              <CardDescription className="text-slate-400">
                Configure analytics and ad services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google_analytics_id" className="text-slate-300">Google Analytics ID</Label>
                <Input
                  id="google_analytics_id"
                  value={settings.google_analytics_id}
                  onChange={(e) => setSettings({...settings, google_analytics_id: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adsense_client_id" className="text-slate-300">AdSense Client ID</Label>
                <Input
                  id="adsense_client_id"
                  value={settings.adsense_client_id}
                  onChange={(e) => setSettings({...settings, adsense_client_id: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-violet-600 hover:bg-violet-700"
        >
          {saving ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}