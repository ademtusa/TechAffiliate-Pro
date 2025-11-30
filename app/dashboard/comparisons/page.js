'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeftRight, ExternalLink, Trash2, Star } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

export default function ComparisonsPage() {
  const [compareProducts, setCompareProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadComparisons()
  }, [])

  const loadComparisons = async () => {
    setLoading(true)
    try {
      const compare = JSON.parse(localStorage.getItem('compareProducts') || '[]')
      setCompareProducts(compare)
    } catch (error) {
      console.error('Error loading comparisons:', error)
      toast({
        title: 'Error',
        description: 'Failed to load comparisons',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFromComparison = (productId) => {
    const updated = compareProducts.filter(p => p.id !== productId)
    setCompareProducts(updated)
    localStorage.setItem('compareProducts', JSON.stringify(updated))
    
    toast({
      title: 'Success',
      description: 'Removed from comparison'
    })
  }

  const clearAll = () => {
    setCompareProducts([])
    localStorage.setItem('compareProducts', JSON.stringify([]))
    toast({
      title: 'Success',
      description: 'All comparisons cleared'
    })
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
                <ArrowLeftRight className="h-6 w-6 text-blue-500" />
                My Comparisons
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {compareProducts.length} {compareProducts.length === 1 ? 'product' : 'products'} in comparison
              </p>
            </div>
            {compareProducts.length > 0 && (
              <Button
                variant="outline"
                onClick={clearAll}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {compareProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ArrowLeftRight className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No products to compare</p>
              <p className="text-sm mt-2">Add products to comparison from the products page!</p>
              <Link href="/products">
                <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Comparison Table */}
              {compareProducts.length >= 2 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-purple-200">
                        <th className="text-left p-4 font-semibold bg-purple-50">Feature</th>
                        {compareProducts.map(product => (
                          <th key={product.id} className="p-4 bg-gradient-to-b from-purple-50 to-pink-50">
                            <div className="text-center">
                              <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded-lg mx-auto mb-2" />
                              <p className="font-semibold text-lg">{product.name}</p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-purple-50/50">
                        <td className="p-4 font-medium">Price</td>
                        {compareProducts.map(product => (
                          <td key={product.id} className="p-4 text-center">
                            <p className="text-2xl font-bold text-purple-600">${product.price}</p>
                            {product.original_price && (
                              <p className="text-sm text-gray-500 line-through">${product.original_price}</p>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-purple-50/50">
                        <td className="p-4 font-medium">Rating</td>
                        {compareProducts.map(product => (
                          <td key={product.id} className="p-4 text-center">
                            <div className="flex items-center justify-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${i < (product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <p className="text-lg font-semibold mt-1">{product.rating}</p>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Action</td>
                        {compareProducts.map(product => (
                          <td key={product.id} className="p-4 text-center space-y-2">
                            <Link href={`/sales/${product.id}`}>
                              <Button variant="outline" className="w-full">
                                View Details
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromComparison(product.id)}
                              className="w-full text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Product Cards for single item */}
              {compareProducts.length === 1 && (
                <div>
                  <p className="text-center text-gray-500 mb-4">Add at least one more product to compare</p>
                  {compareProducts.map((product) => (
                    <Card key={product.id} className="border-purple-200 max-w-md mx-auto">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                            <p className="text-2xl font-bold text-purple-600 mb-2">${product.price}</p>
                            <div className="flex gap-2">
                              <Link href={`/sales/${product.id}`} className="flex-1">
                                <Button variant="outline" className="w-full">View Details</Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromComparison(product.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
