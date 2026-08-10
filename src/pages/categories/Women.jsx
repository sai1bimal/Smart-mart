import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProductsByCategory } from '../../api/productApi.js'
import { mapProducts } from '../../utils/productMapper.js'
import { SHOES_CATEGORIES, CLOTHING_CATEGORIES } from '../../utils/categoryMap.js'
import ProductList from '../../components/ProductList.jsx'

// Mirrors Men.jsx — powers BOTH /products/shoes/women and /products/clothing/women.
export default function Women() {
  const { pathname } = useLocation()
  const isClothing = pathname.includes('/clothing')
  const parentLabel = isClothing ? 'Clothing' : 'Shoes'
  const slug = isClothing ? CLOTHING_CATEGORIES.women : SHOES_CATEGORIES.women

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProductsByCategory(slug)
        if (!ignore) setItems(mapProducts(data.products))
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
  }, [slug])

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
      <p className="muted">{items.length} {parentLabel} products for Women</p>
      <ProductList products={items} emptyMessage="No women's products found" />
    </div>
  )
}
