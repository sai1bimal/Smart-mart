import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext.jsx'
import { getDiscountedPrice } from '../utils/discount.js'

// Props: { product }
export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext)
  const navigate = useNavigate()
  const finalPrice = getDiscountedPrice(product)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product, 1)
  }

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.discount > 0 && <span className="discount-ribbon">{product.discount}% OFF</span>}
        {product.stock === 0 && <span className="stock-ribbon">Out of stock</span>}
      </div>

      <div className="product-card-body">
        <p className="brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="rating">⭐ {product.rating}</p>

        <div className="price-row">
          <span className="final-price">₹{finalPrice.toLocaleString('en-IN')}</span>
          {product.discount > 0 && (
            <span className="original-price">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>

        <div className="card-actions">
          <button
            className="btn btn-outline"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/product/${product.id}`)
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}
