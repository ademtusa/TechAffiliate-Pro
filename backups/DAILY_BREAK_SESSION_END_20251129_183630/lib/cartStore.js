// Cart Store using localStorage
// Client-side cart management

const CART_KEY = 'affiliate_cart'

export const CartStore = {
  // Get cart from localStorage
  getCart() {
    if (typeof window === 'undefined') return []
    try {
      const cart = localStorage.getItem(CART_KEY)
      return cart ? JSON.parse(cart) : []
    } catch {
      return []
    }
  },

  // Save cart to localStorage
  saveCart(cart) {
    if (typeof window === 'undefined') return
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  },

  // Add item to cart
  addToCart(product, quantity = 1) {
    const cart = this.getCart()
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        category: product.category,
        quantity: quantity
      })
    }

    this.saveCart(cart)
    return cart
  },

  // Update item quantity
  updateQuantity(productId, quantity) {
    const cart = this.getCart()
    const item = cart.find(item => item.id === productId)
    
    if (item) {
      item.quantity = Math.max(1, quantity)
      this.saveCart(cart)
    }
    
    return cart
  },

  // Remove item from cart
  removeFromCart(productId) {
    let cart = this.getCart()
    cart = cart.filter(item => item.id !== productId)
    this.saveCart(cart)
    return cart
  },

  // Clear entire cart
  clearCart() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(CART_KEY)
    return []
  },

  // Get cart total
  getTotal() {
    const cart = this.getCart()
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  // Get cart item count
  getItemCount() {
    const cart = this.getCart()
    return cart.reduce((count, item) => count + item.quantity, 0)
  }
}
