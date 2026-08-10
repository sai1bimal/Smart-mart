import { createContext, useState, useEffect } from 'react'
import { getDiscountedPrice, getProductDiscountTotal, getCategoryDiscount } from '../utils/discount'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  // The cart is an array of product objects + a `quantity` field.
  // Initial value is read once from LocalStorage (lazy initializer).
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('shopkart_cart')
    return saved ? JSON.parse(saved) : []
  })

  // Whichever coupon (if any) the user has successfully applied.
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem('shopkart_coupon')
    return saved ? JSON.parse(saved) : null
  })

  // Persist the cart to LocalStorage every time it changes.
  useEffect(() => {
    localStorage.setItem('shopkart_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('shopkart_coupon', JSON.stringify(appliedCoupon))
    } else {
      localStorage.removeItem('shopkart_coupon')
    }
  }, [appliedCoupon])

  // Add a product to the cart. If it already exists, bump the quantity.
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item,
        )
      }
      return [...prev, { ...product, quantity: qty }]
    })
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
    )
  }

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const clearCart = () => {
    setCart([])
    setAppliedCoupon(null)
  }

  // ---------- Derived totals (all via reduce/array methods) ----------
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const productDiscount = getProductDiscountTotal(cart)

  const { total: categoryDiscount, breakdown: categoryDiscountBreakdown } = getCategoryDiscount(cart)

  const subtotalAfterProductDiscount = subtotal - productDiscount - categoryDiscount

  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0

  const finalAmount = Math.max(0, subtotalAfterProductDiscount - couponDiscount)

  const applyCoupon = (couponResult) => setAppliedCoupon(couponResult)
  const removeCoupon = () => setAppliedCoupon(null)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        subtotal,
        productDiscount,
        categoryDiscount,
        categoryDiscountBreakdown,
        couponDiscount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        finalAmount,
        getDiscountedPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
