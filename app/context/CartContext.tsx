import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  qty: number
  image_url?: string
  image_data?: string
  stall_id?: string
}

interface CartContextType {
  cartItems: CartItem[]
  stallId: string | null
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, qty: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  setStallId: (stallId: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [stallId, setStallId] = useState<string | null>(null)

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id)
      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map(i =>
          i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
        )
      }
      // Add new item
      return [...prevItems, item]
    })
  }, [])

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, qty } : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        stallId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        setStallId,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartProvider
