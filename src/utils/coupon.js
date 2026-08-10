// coupon.js
// Handles CART-LEVEL coupons entered at checkout/cart time.

export const coupons = [
  { code: 'BUY2', type: 'quantity', minItems: 2, value: 100, label: '₹100 OFF on 2+ products' },
  { code: 'BUY3', type: 'quantity', minItems: 3, value: 250, label: '₹250 OFF on 3+ products' },
  { code: 'BUY5', type: 'quantity', minItems: 5, value: 500, label: '₹500 OFF on 5+ products' },
  { code: 'SHOP10', type: 'percent', minPurchase: 2000, value: 10, label: '10% OFF (min ₹2000)' },
  { code: 'SHOP20', type: 'percent', minPurchase: 5000, value: 20, label: '20% OFF (min ₹5000)' },
]

// Validates a coupon code against the current cart contents/subtotal.
// Returns { valid: boolean, message: string, discount: number }
export const validateCoupon = (code, cart, subtotalAfterProductDiscount) => {
  const coupon = coupons.find((c) => c.code === code.trim().toUpperCase())

  if (!coupon) {
    return { valid: false, message: 'Invalid coupon', discount: 0 }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (coupon.type === 'quantity') {
    if (totalItems < coupon.minItems) {
      return {
        valid: false,
        message: `Add at least ${coupon.minItems} items to use ${coupon.code}`,
        discount: 0,
      }
    }
    return { valid: true, message: `Coupon applied successfully`, discount: coupon.value, coupon }
  }

  if (coupon.type === 'percent') {
    if (subtotalAfterProductDiscount < coupon.minPurchase) {
      return {
        valid: false,
        message: `Minimum purchase of ₹${coupon.minPurchase} required`,
        discount: 0,
      }
    }
    const discount = Math.round((subtotalAfterProductDiscount * coupon.value) / 100)
    return { valid: true, message: `Coupon applied successfully`, discount, coupon }
  }

  return { valid: false, message: 'Invalid coupon', discount: 0 }
}
