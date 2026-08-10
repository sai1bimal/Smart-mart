// discount.js
// Handles PRODUCT-LEVEL discounts: the flat "discount" % that lives on
// every product object, plus extra CATEGORY-level bulk discounts that
// kick in when the cart holds enough items of one category.

// Final unit price after a product's own percentage discount.
export const getDiscountedPrice = (product) => {
  const cut = (product.price * product.discount) / 100
  return Math.round(product.price - cut)
}

// Total ₹ saved from product-level discounts across the whole cart.
export const getProductDiscountTotal = (cart) =>
  cart.reduce((total, item) => {
    const perUnitSaving = item.price - getDiscountedPrice(item)
    return total + perUnitSaving * item.quantity
  }, 0)

// Category-specific "buy more, save more" rules.
// Each rule looks at how many units of a category are in the cart
// and returns an additional discount description.
const categoryRules = [
  {
    category: 'Shoes',
    minQty: 2,
    type: 'percent',
    value: 5,
    label: 'Buy 2+ Shoes → extra 5% off',
  },
  {
    category: 'Clothing',
    minQty: 3,
    type: 'percent',
    value: 10,
    label: 'Buy 3+ Clothing items → extra 10% off',
  },
  {
    category: 'Electronics',
    minQty: 2,
    type: 'flat',
    value: 500,
    label: 'Buy 2+ Electronics → extra ₹500 off',
  },
]

// Returns { total, breakdown[] } of extra category-based discounts.
export const getCategoryDiscount = (cart) => {
  let total = 0
  const breakdown = []

  categoryRules.forEach((rule) => {
    const itemsInCategory = cart.filter((item) => item.category === rule.category)
    const qty = itemsInCategory.reduce((sum, i) => sum + i.quantity, 0)

    if (qty >= rule.minQty) {
      const categorySubtotal = itemsInCategory.reduce(
        (sum, i) => sum + getDiscountedPrice(i) * i.quantity,
        0,
      )

      const amount =
        rule.type === 'percent' ? Math.round((categorySubtotal * rule.value) / 100) : rule.value

      total += amount
      breakdown.push({ label: rule.label, amount })
    }
  })

  return { total, breakdown }
}
