import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api/productApi.js'
import { mapProducts } from '../utils/productMapper.js'
import ProductCard from '../components/ProductCard.jsx'

// These are ShopKart's own top-level nav categories, not literal DummyJSON
// slugs — that's why they're a small local list instead of something
// fetched from the API. Each tile links to a route that DOES fetch real
// DummyJSON data (see App.jsx / categoryMap.js for the slug mapping).
const categoryTiles = [
  { label: 'Shoes', icon: '👟', to: '/products/shoes' },
  { label: 'Clothing', icon: '👕', to: '/products/clothing' },
  { label: 'Electronics', icon: '📱', to: '/products/electronics' },
  { label: 'Home', icon: '🛋️', to: '/products/home-decoration' },
  { label: 'Beauty', icon: '💄', to: '/products/beauty' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        // Pull one decent-sized pool of products, then sort it two
        // different ways below for "Trending" vs "Best Deals" — no need
        // for two separate API calls.
        const data = await getProducts(30, 0)
        if (!ignore) setProducts(mapProducts(data.products))
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

  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4)
  const bestDeals = [...products].sort((a, b) => b.discount - a.discount).slice(0, 4)

  return (
    <div className="home">
      <section className="hero">
        <h1>BIG SALE<br />Up to 70% OFF</h1>
        <p>Fresh styles, top electronics, and everyday essentials — all in one cart.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
      </section>

      <section className="section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categoryTiles.map((cat) => (
            <Link key={cat.label} to={cat.to} className="category-tile">
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {loading && <div className="loading-state">Loading products…</div>}

      {error && (
        <div className="empty-state">
          <p className="empty-emoji">⚠️</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="section">
            <h2>Trending Products</h2>
            <div className="product-grid">
              {trending.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>

          <section className="section">
            <h2>Best Deals</h2>
            <div className="product-grid">
              {bestDeals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
