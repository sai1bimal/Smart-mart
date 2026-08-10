import { useState, useEffect } from 'react'
import { getProductsByCategories } from '../api/productApi.js'
import { mapProducts } from '../utils/productMapper.js'
import ProductList from '../components/ProductList.jsx'

// Props: { title, categories } — shown at /products/shoes and /products/clothing
// (the index route inside ShoesLayout / ClothingLayout's <Outlet />).
// `categories` is an array of real DummyJSON slugs to fetch and merge
// (see src/utils/categoryMap.js — DummyJSON has no single "Shoes" category).
export default function CategoryAll({ title, categories }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const raw = await getProductsByCategories(categories)
        if (!ignore) setItems(mapProducts(raw))
      } catch (err) {
        if (!ignore) setError('Unable to load products. Please try again.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [categories.join(',')])

  if (loading) {
    return <div className="loading-state">Loading products…</div>
  }

  if (error) {
    return (
      <div className="empty-state">
        <p className="empty-emoji">⚠️</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <p className="muted">{items.length} products in {title}</p>
      <ProductList products={items} />
    </div>
  )
}
