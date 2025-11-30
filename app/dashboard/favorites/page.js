'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ExternalLink, Trash2, Star } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    setLoading(true)
    try {
      // Fetch favorites from backend
      const response = await fetch('/api/user/favorites')
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data)
        // Update localStorage for consistency
        const productIds = data.data.map(p => p.id)
        setFavorites(productIds)
        localStorage.setItem('likedProducts', JSON.stringify(productIds))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
      toast({
        title: 'Error',
        description: 'Failed to load favorites',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (productId) => {
    try {
      // Remove from backend
      const response = await fetch(`/api/user/favorites?productId=${productId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        const updatedFavorites = favorites.filter(id => id !== productId)
        setFavorites(updatedFavorites)
        localStorage.setItem('likedProducts', JSON.stringify(updatedFavorites))
        setProducts(products.filter(p => p.id !== productId))
        
        toast({
          title: 'Success',
          description: 'Removed from favorites'
        })
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove from favorites',
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
                <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
                My Favorites
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {products.length} {products.length === 1 ? 'product' : 'products'} saved
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No favorites yet</p>
              <p className="text-sm mt-2">Start exploring products and save your favorites!</p>
              <Link href="/products">
                <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="border-purple-200 hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="aspect-square relative bg-gray-100 rounded-t-lg overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                      {product.badge && (
                        <Badge className="absolute top-3 right-3 bg-red-500">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 4)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({product.rating || 4.5})</span>
                      </div>

                      <div className="mb-4">
                        <div className="text-2xl font-bold text-purple-600">${product.price}</div>
                        {product.original_price && (
                          <div className="text-sm text-gray-400 line-through">
                            ${product.original_price}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/sales/${product.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFavorite(product.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
