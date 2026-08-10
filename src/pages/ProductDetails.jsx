import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProductById } from '../api/productApi.js'
import { mapProduct } from '../utils/productMapper.js'
import { getDiscountedPrice } from '../utils/discount.js'
import { CartContext } from '../context/CartContext.jsx'

export default function ProductDetails() {
  // Dynamic routing: /product/:id — useParams() reads the :id segment
  // straight from the URL, then we fetch that exact product from the API.
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const { addToCart } = useContext(CartContext)
  const navigate = useNavigate()

  useEffect(() => {
    let ignore = false

    async function loadProduct() {
      setLoading(true)
      setError(null)

      try {
        const data = await getProductById(id)
        if (!ignore) {
          const mapped = mapProduct(data)
          setProduct(mapped)
          setActiveImage(mapped.image)
          setQuantity(1)
        }
      } catch (err) {
        if (!ignore) setError('Unable to load product. Please try again.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadProduct()
    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return <div className="loading-state">Loading product…</div>
  }

  if (error || !product) {
    return (
      <div className="empty-state">
        <p className="empty-emoji">📦</p>
        <p>{error || 'Product not found'}</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    )
  }

  const finalPrice = getDiscountedPrice(product)

  const handleQuantity = (delta) => {
    setQuantity((q) => Math.max(1, Math.min(product.stock, q + delta)))
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    // useNavigate() sends the user straight into checkout.
    navigate('/checkout')
  }

  return (
    <div className="product-details">
      <div className="product-details-image">
        <img src={activeImage} alt={product.name} />

        {/* Small gallery — only shown if DummyJSON gave us more than one image */}
        {product.images.length > 1 && (
          <div className="product-thumbnails">
            {product.images.map((img) => (
              <img
                key={img}
                src={img}
                alt={product.name}
                className={img === activeImage ? 'active' : ''}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-details-info">
        <p className="brand">{product.brand}</p>
        <h1>{product.name}</h1>
        <p className="rating">⭐ {product.rating} rating</p>

        <div className="price-row price-row-lg">
          <span className="final-price">₹{finalPrice.toLocaleString('en-IN')}</span>
          {product.discount > 0 && (
            <>
              <span className="original-price">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="discount-tag">{product.discount}% OFF</span>
            </>
          )}
        </div>

        <p className="description">{product.description}</p>

        <p className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
          {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
        </p>

        {product.stock > 0 && (
          <div className="quantity-selector">
            <span>Quantity</span>
            <button onClick={() => handleQuantity(-1)}>−</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantity(1)}>+</button>
          </div>
        )}

        <div className="card-actions">
          <button className="btn btn-outline" onClick={handleAddToCart} disabled={product.stock === 0}>
            Add to Cart
          </button>
          <button className="btn btn-primary" onClick={handleBuyNow} disabled={product.stock === 0}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
