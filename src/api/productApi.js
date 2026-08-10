// src/api/productApi.js
//
// Every fetch() call to the DummyJSON API lives in this one file.
// Components never call fetch() directly — they import functions from
// here instead. That way, if the API ever changes, we only fix it here.
//
// Docs: https://dummyjson.com/docs/products

const BASE_URL = 'https://dummyjson.com'

// GET /products?limit=&skip=
// Fetches one "page" of the full catalog. `limit` = page size,
// `skip` = how many products to skip (used to build pagination).
export async function getProducts(limit = 12, skip = 0) {
  const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return response.json() // { products, total, skip, limit }
}

// GET /products/{id}
// Fetches a single product for the /product/:id details page.
export async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  return response.json()
}

// GET /products/search?q=
// Lets the API do the searching — we never download everything and
// filter with JavaScript.
export async function searchProducts(query, limit = 12, skip = 0) {
  const response = await fetch(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`,
  )

  if (!response.ok) {
    throw new Error('Failed to search products')
  }

  return response.json()
}

// GET /products/categories
// Full category objects ({ slug, name, url }) — used when the app needs
// more than just the slug (e.g. a nicer display name).
export async function getCategories() {
  const response = await fetch(`${BASE_URL}/products/categories`)

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  return response.json()
}

// GET /products/category-list
// Just the plain slug strings, e.g. ["smartphones", "laptops", ...].
export async function getCategoryList() {
  const response = await fetch(`${BASE_URL}/products/category-list`)

  if (!response.ok) {
    throw new Error('Failed to fetch category list')
  }

  return response.json()
}

// GET /products/category/{category}
// Products belonging to ONE real DummyJSON category slug,
// e.g. getProductsByCategory('smartphones').
export async function getProductsByCategory(category, limit = 12, skip = 0) {
  const response = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch category products')
  }

  return response.json()
}

// Fetches several category slugs and merges them into one flat product
// array. DummyJSON doesn't have a single "Shoes" or "Clothing" category —
// it's split into e.g. "mens-shoes" + "womens-shoes" — so this app
// combines the closest real categories where it needs one broad group.
export async function getProductsByCategories(categorySlugs) {
  const responses = await Promise.all(
    categorySlugs.map((slug) => getProductsByCategory(slug, 100, 0)),
  )

  return responses.flatMap((res) => res.products)
}
