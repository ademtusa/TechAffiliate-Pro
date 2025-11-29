'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Eye, ShoppingCart, ExternalLink, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function FeaturedProductCard({ product }) {
  if (!product) return null

  const calculateCommission = (price, commissionRate = 15.5) => {
    return (price * commissionRate / 100).toFixed(2)
  }

  const calculateDiscount = (original, current) => {
    if (!original || !current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  const commission = calculateCommission(product.price, product.commission_rate || 15.5)

  return (
    <Card className="relative overflow-hidden border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50">
      {/* Featured Badge */}
      <div className="absolute top-2 right-2 z-10">
        <Badge className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold px-2 py-1 text-xs shadow-lg flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Featured
        </Badge>
      </div>

      <CardContent className="p-3">
        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-2 group">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating || 4.5)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">
            ({product.reviews || 1247})
          </span>
        </div>

        {/* Price & Commission - Compact */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-purple-600">
                ${product.price}
              </div>
              {product.original_price && (
                <div className="text-xs text-gray-400 line-through">
                  ${product.original_price}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">
                {product.commission_rate || 15.5}%
              </div>
              <div className="text-xs text-gray-500">Commission</div>
            </div>
          </div>
        </div>

        {/* Commission Earnings - Compact */}
        <div className="bg-green-50 border border-green-200 rounded-md px-2 py-1 mb-2">
          <p className="text-center text-xs text-green-700 font-semibold">
            💰 Earn ${commission}/sale
          </p>
        </div>

        {/* CTA Button - Compact */}
        <Link href={`/product/${product.id}`}>
          <Button className="w-full h-9 text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all">
            View & Earn {product.commission_rate || 15.5}%
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
