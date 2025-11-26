'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, TrendingUp, Award, DollarSign, Check, X, Search, Filter, ArrowLeft, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import HeroSection from '@/components/HeroSection'

export default function ComparisonReviewPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedProduct, setExpandedProduct] = useState(null)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForCompare, setSelectedForCompare] = useState([])
  const [topRatedProduct, setTopRatedProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, priceRange, ratingFilter, searchQuery])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      const result = await response.json()
      
      if (result.success) {
        const allProducts = result.data || []
        setProducts(allProducts)
        
        // Set top rated product for Hero
        if (allProducts.length > 0) {
          const topRated = [...allProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]
          setTopRatedProduct({
            ...topRated,
            commission_rate: 15.5,
            reviews: 1247
          })
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Price range filter
    if (priceRange !== 'all') {
      switch(priceRange) {
        case 'under-20':
          filtered = filtered.filter(p => p.price < 20)
          break
        case '20-50':
          filtered = filtered.filter(p => p.price >= 20 && p.price <= 50)
          break
        case 'over-50':
          filtered = filtered.filter(p => p.price > 50)
          break
      }
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseFloat(ratingFilter)
      filtered = filtered.filter(p => (p.rating || 0) >= minRating)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(filtered)
  }

  const toggleCompareSelection = (product) => {
    if (selectedForCompare.find(p => p.id === product.id)) {
      setSelectedForCompare(selectedForCompare.filter(p => p.id !== product.id))
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, product])
    } else {
      alert('You can compare up to 3 products at a time')
    }
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'ai-saas', label: 'AI & SaaS' },
    { value: 'hosting', label: 'Hosting' },
    { value: 'vpn-security', label: 'VPN & Security' },
    { value: 'automation', label: 'Automation' },
    { value: 'courses', label: 'Courses' },
    { value: 'cloud', label: 'Cloud Services' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <HeroSection 
        title="Product Reviews & Comparisons"
        subtitle="Find the perfect product with detailed reviews and side-by-side comparisons"
        featuredProduct={topRatedProduct}
        featuredType="topRated"
      />

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Badge className="bg-blue-600">Product Reviews & Comparisons</Badge>
          </div>
        </div>
      </nav>

      {/* Old Hero - Removed, now using HeroSection component above */}

      {/* Filters Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products, features, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-14 text-lg bg-white text-gray-900"
                />
              </div>
              <Button size="lg" className="h-14 px-8 bg-white text-blue-600 hover:bg-blue-50">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="bg-white border-b sticky top-[73px] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-20">Under $20</SelectItem>
                  <SelectItem value="20-50">$20 - $50</SelectItem>
                  <SelectItem value="over-50">Over $50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                  <SelectItem value="3.5">3.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant={compareMode ? 'default' : 'outline'}
              onClick={() => setCompareMode(!compareMode)}
            >
              {compareMode ? 'Exit Compare Mode' : 'Compare Products'}
            </Button>
          </div>

          {compareMode && selectedForCompare.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Selected for Comparison: {selectedForCompare.length}/3</p>
                  <p className="text-sm text-gray-600">Click products below to add to comparison</p>
                </div>
                {selectedForCompare.length >= 2 && (
                  <Button onClick={() => window.scrollTo({ top: document.getElementById('comparison-table').offsetTop, behavior: 'smooth' })}>
                    View Comparison
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Results Info */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> products
          </p>
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found matching your criteria</p>
              <Button onClick={() => {
                setSelectedCategory('all')
                setPriceRange('all')
                setRatingFilter('all')
                setSearchQuery('')
              }} className="mt-4">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredProducts.map((product, index) => (
              <Card key={product.id} className={`overflow-hidden transition-all duration-300 ${
                compareMode && selectedForCompare.find(p => p.id === product.id) 
                  ? 'ring-4 ring-blue-500' 
                  : 'hover:shadow-xl'
              }`}>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-5 gap-6">
                    {/* Rank & Image */}
                    <div className="md:col-span-1">
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                          #{index + 1}
                        </div>
                        <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Award className="h-12 w-12 text-blue-300" />
                            </div>
                          )}
                        </div>
                        {product.badge && (
                          <Badge className="absolute bottom-2 left-2 bg-red-500 text-xs">
                            {product.badge}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="md:col-span-3">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge className="mb-2" variant="secondary">{product.category}</Badge>
                          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                        </div>
                        {compareMode && (
                          <Button
                            variant={selectedForCompare.find(p => p.id === product.id) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => toggleCompareSelection(product)}
                          >
                            {selectedForCompare.find(p => p.id === product.id) ? 'Selected' : 'Compare'}
                          </Button>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < (product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-2 font-semibold text-lg">{product.rating || 4.5}</span>
                        </div>
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-600">{product.views} views</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-600">{product.sales_count} purchases</span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Key Features */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {(product.tags || []).slice(0, 4).map((tag, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{tag}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pros & Cons Toggle */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                        className="text-blue-600"
                      >
                        {expandedProduct === product.id ? (
                          <><ChevronUp className="h-4 w-4 mr-1" /> Hide Details</>
                        ) : (
                          <><ChevronDown className="h-4 w-4 mr-1" /> Show Pros & Cons</>
                        )}
                      </Button>

                      {expandedProduct === product.id && (
                        <div className="grid md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                              <Check className="h-5 w-5 mr-2" /> Pros
                            </h4>
                            <ul className="space-y-1">
                              <li className="text-sm text-gray-700">• High quality and reliability</li>
                              <li className="text-sm text-gray-700">• Excellent customer support</li>
                              <li className="text-sm text-gray-700">• Great value for money</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                              <X className="h-5 w-5 mr-2" /> Cons
                            </h4>
                            <ul className="space-y-1">
                              <li className="text-sm text-gray-700">• Learning curve for beginners</li>
                              <li className="text-sm text-gray-700">• Premium price point</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className="md:col-span-1 flex flex-col justify-between">
                      <div>
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-500 mb-1">Starting at</p>
                          <p className="text-4xl font-bold text-blue-600">${product.price}</p>
                          {product.original_price && (
                            <>
                              <p className="text-lg text-gray-500 line-through">${product.original_price}</p>
                              <Badge className="bg-green-500 mt-1">
                                Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                              </Badge>
                            </>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Link href={`/product/${product.id}`} className="block">
                            <Button className="w-full" variant="outline">
                              Full Review
                            </Button>
                          </Link>
                          <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                            onClick={() => window.open(product.affiliate_url, '_blank')}
                          >
                            Get Deal <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="mt-4 space-y-2 text-xs text-center">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="h-3 w-3 text-blue-600" />
                          <span className="text-gray-600">Trending</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Award className="h-3 w-3 text-yellow-600" />
                          <span className="text-gray-600">Editor's Choice</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Comparison Table */}
        {selectedForCompare.length >= 2 && (
          <Card id="comparison-table" className="mt-12">
            <CardHeader>
              <CardTitle className="text-3xl">Side-by-Side Comparison</CardTitle>
              <CardDescription>Compare features, pricing, and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      {selectedForCompare.map(product => (
                        <th key={product.id} className="p-4">
                          <div className="text-center">
                            <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-lg mx-auto mb-2" />
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Price</td>
                      {selectedForCompare.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                          {product.original_price && (
                            <p className="text-sm text-gray-500 line-through">${product.original_price}</p>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Rating</td>
                      {selectedForCompare.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <div className="flex items-center justify-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < (product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <p className="text-sm font-semibold mt-1">{product.rating}</p>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Popularity</td>
                      {selectedForCompare.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <p className="text-sm">{product.views} views</p>
                          <p className="text-sm">{product.sales_count} sales</p>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Action</td>
                      {selectedForCompare.map(product => (
                        <td key={product.id} className="p-4 text-center">
                          <Button 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600"
                            onClick={() => window.open(product.affiliate_url, '_blank')}
                          >
                            Get Deal <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}