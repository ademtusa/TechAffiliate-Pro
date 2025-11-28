'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard, Tag, Truck, Shield, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { CartStore } from '@/lib/cartStore'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const router = useRouter()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    setLoading(true)
    const cart = CartStore.getCart()
    setCartItems(cart)
    setLoading(false)
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    CartStore.updateQuantity(productId, newQuantity)
    loadCart()
  }

  const removeItem = (productId) => {
    CartStore.removeFromCart(productId)
    loadCart()
  }

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      CartStore.clearCart()
      loadCart()
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shipping + tax

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }
    setCheckoutOpen(true)
  }

  const processCheckout = () => {
    alert(`Demo Checkout\n\nThis would process payment via ${paymentMethod.toUpperCase()}\n\nTotal: $${total.toFixed(2)}\n\nIn production, this integrates with:\n- Stripe\n- PayPal\n- Credit card processors\n\nFor demo, redirecting to affiliate links...`)
    
    // Open affiliate links for all products
    cartItems.forEach(item => {
      // Track affiliate clicks
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.id })
      })
    })
    
    CartStore.clearCart()
    setCheckoutOpen(false)
    router.push('/?checkout=success')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-16">
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-6">Add some products to get started!</p>
              <Link href="/">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Cart Items ({cartItems.length})</h2>
                <Button variant="outline" size="sm" onClick={clearCart}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <Link href={`/product/${item.id}`}>
                        <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 cursor-pointer hover:opacity-80 transition">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="h-12 w-12 text-blue-300" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link href={`/product/${item.id}`}>
                              <h3 className="text-xl font-bold hover:text-blue-600 transition cursor-pointer">{item.name}</h3>
                            </Link>
                            <Badge variant="secondary" className="mt-1">{item.category}</Badge>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Quantity:</span>
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-16 text-center border-0 focus-visible:ring-0"
                                min="1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="text-2xl font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-500">${item.price} each</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {subtotal < 50 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Tag className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900">Almost there!</p>
                          <p className="text-xs text-amber-700">
                            Add ${(50 - subtotal).toFixed(2)} more for FREE shipping
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Checkout
                  </Button>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="h-4 w-4" />
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>Secure SSL encrypted checkout</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Choose your payment method to complete the order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary ({cartItems.length} items)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <div>
              <h3 className="font-semibold mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-lg transition ${
                    paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Credit Card</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 border-2 rounded-lg transition ${
                    paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="h-8 w-8 mx-auto mb-2 bg-blue-600 rounded flex items-center justify-center text-white font-bold">P</div>
                  <p className="text-sm font-semibold">PayPal</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-4 border-2 rounded-lg transition ${
                    paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="h-8 w-8 mx-auto mb-2 bg-purple-600 rounded flex items-center justify-center text-white font-bold">S</div>
                  <p className="text-sm font-semibold">Stripe</p>
                </button>
              </div>
            </div>

            {/* Payment Note */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-sm text-blue-900">
                  <Shield className="h-4 w-4 inline mr-2" />
                  This is a demo checkout. In production, this would integrate with real payment processors.
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCheckoutOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={processCheckout} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600">
                Complete Purchase
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}