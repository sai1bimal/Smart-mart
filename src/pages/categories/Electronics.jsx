import { useState, useEffect } from 'react'
import { getProductsByCategory } from '../../api/productApi.js'
import { mapProducts } from '../../utils/productMapper.js'
import { ELECTRONICS_GROUPS } from '../../utils/categoryMap.js'
import ProductCard from '../../components/ProductCard.jsx'

// /products/electronics — DummyJSON splits electronics into several real
// categories (smartphones, laptops, ...) instead of one, so we fetch each
// and group them into labeled sections, like the old subCategory grouping.
export default function Electronics() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const responses = await Promise.all(
          ELECTRONICS_GROUPS.map((g) => getProductsByCategory(g.slug, 8, 0)),
        )

        if (!ignore) {
          const mappedGroups = ELECTRONICS_GROUPS.map((g, i) => ({
            label: g.label,
            items: mapProducts(responses[i].products),
          })).filter((g) => g.items.length > 0)

          setGroups(mappedGroups)
        }
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
  }, [])

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
    <div className="category-page">
      <h2>Electronics</h2>

      {groups.map((group) => (
        <div key={group.label} className="section">
          <h3>{group.label}</h3>
          <div className="product-grid">
            {group.items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
