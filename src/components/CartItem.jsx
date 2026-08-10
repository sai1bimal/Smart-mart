import { useContext } from 'react'
import { CartContext } from '../context/CartContext.jsx'
import { getDiscountedPrice } from '../utils/discount.js'

// Props: { item } — a cart entry (product fields + quantity)
export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext)
  const unitPrice = getDiscountedPrice(item)
  const lineTotal = unitPrice * item.quantity

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />

      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p className="muted">{item.brand} · {item.category}</p>
        <p className="cart-item-price">
          ₹{unitPrice.toLocaleString('en-IN')}
          {item.discount > 0 && (
            <span className="original-price"> ₹{item.price.toLocaleString('en-IN')}</span>
          )}
        </p>
      </div>

      <div className="cart-item-qty">
        <button onClick={() => decreaseQuantity(item.id)} aria-label="Decrease quantity">−</button>
        <span>{item.quantity}</span>
        <button onClick={() => increaseQuantity(item.id)} aria-label="Increase quantity">+</button>
      </div>

      <div className="cart-item-total">₹{lineTotal.toLocaleString('en-IN')}</div>

      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
        Remove
      </button>
    </div>
  )
}
