import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { getProducts, searchProducts, getProductsByCategory } from '../api/productApi.js'
import { mapProducts } from '../utils/productMapper.js'
import ProductList from '../components/ProductList.jsx'
import CategoryMenu from '../components/CategoryMenu.jsx'

const PAGE_SIZE = 12

// Handles three cases with ONE component:
//  1. /products                -> full catalog (GET /products)
//  2. /products?search=shoe    -> search results (GET /products/search)
//  3. /products/:category      -> generic category page (GET /products/category/:category)
export default function Products() {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const page = Number(searchParams.get('page')) || 1
  const skip = (page - 1) * PAGE_SIZE

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // If category/search/page changes again before this request finishes,
    // `ignore` stops the OLDER response from overwriting the newer one.
    let ignore = false

    async function loadProducts() {
      setLoading(true)
      setError(null)

      try {
        let data
        if (search) {
          data = await searchProducts(search, PAGE_SIZE, skip)
        } else if (category) {
          data = await getProductsByCategory(category, PAGE_SIZE, skip)
        } else {
          data = await getProducts(PAGE_SIZE, skip)
        }

        if (!ignore) {
          setResults(mapProducts(data.products))
          setTotal(data.total)
        }
      } catch (err) {
        if (!ignore) setError('Unable to load products. Please try again.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProducts()
    return () => {
      ignore = true
    }
  }, [category, search, skip])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const goToPage = (nextPage) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(nextPage))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

  // If a search matches shoes/clothing items, nudge the user toward the
  // richer nested-routing pages (Men/Women/Kids) for that category.
  // `p.category` is already the friendly group name (see productMapper.js).
  const matchedNestedCategory =
    search &&
    results.length > 0 &&
    [...new Set(results.map((p) => p.category))].find((c) => c === 'Shoes' || c === 'Clothing')

  return (
    <div className="category-page">
      <h2>
        {search ? `Search results for "${search}"` : category ? category : 'All Products'}
      </h2>

      {matchedNestedCategory && (
        <div className="search-hint">
          <p>Browse {matchedNestedCategory} by section:</p>
          <CategoryMenu base={`/products/${matchedNestedCategory.toLowerCase()}`} />
        </div>
      )}

      <p className="muted">{total} products found</p>
      <ProductList products={results} emptyMessage="No products found" />

      {results.length === 0 && (
        <Link to="/products" className="btn btn-outline">Browse All Products</Link>
      )}

      {results.length > 0 && totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-outline"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
            ← Prev
          </button>
          <span className="muted">Page {page} of {totalPages}</span>
          <button
            className="btn btn-outline"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
