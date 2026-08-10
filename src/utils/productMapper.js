// src/utils/productMapper.js
//
// DummyJSON's product fields (title, discountPercentage, thumbnail, ...)
// don't match the field names this app's UI was built around (name,
// discount, image, ...). Rather than teaching every component two
// different data shapes, we convert each API product ONCE, right here,
// into the shape the app already knows how to render.
//
// We never invent data — every value below comes straight from the API.

import { getCategoryGroup } from './categoryMap.js'

export const mapProduct = (product) => ({
  id: product.id,
  name: product.title,
  // Broad group (e.g. "Shoes") — powers the cart's category bulk
  // discounts and the search page's "browse by section" hint.
  category: getCategoryGroup(product.category),
  // The real, specific DummyJSON slug (e.g. "mens-shoes").
  subCategory: product.category,
  brand: product.brand || 'Unknown',
  price: product.price,
  discount: Math.round(product.discountPercentage || 0),
  rating: product.rating,
  stock: product.stock,
  image: product.thumbnail,
  images: product.images || [],
  description: product.description,
})

// Convenience helper for mapping a whole array at once.
export const mapProducts = (products) => products.map(mapProduct)
