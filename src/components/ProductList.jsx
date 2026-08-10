import ProductCard from './ProductCard.jsx'

// Props: { products, emptyMessage }
// Pure presentational component — all filtering happens upstream.
export default function ProductList({ products, emptyMessage = 'No products found' }) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-emoji">🔍</p>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
