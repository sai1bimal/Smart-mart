import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext.jsx'
import CartItem from '../components/CartItem.jsx'
import CouponBox from '../components/CouponBox.jsx'

export default function Cart() {
  const {
    cart,
    totalItems,
    subtotal,
    productDiscount,
    categoryDiscount,
    categoryDiscountBreakdown,
    couponDiscount,
    finalAmount,
  } = useContext(CartContext)

  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-emoji">🛒</p>
        <h2>Your cart is empty</h2>
        <p className="muted">Start shopping now!</p>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h2>My Cart</h2>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => <CartItem key={item.id} item={item} />)}
        </div>

        <aside className="cart-summary">
          <CouponBox />

          <h3>Price Details</h3>
          <div className="summary-row">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row discount-row">
            <span>Product Discount</span>
            <span>−₹{productDiscount.toLocaleString('en-IN')}</span>
          </div>
          {categoryDiscount > 0 && (
            <div className="summary-row discount-row">
              <span>Bulk / Category Discount</span>
              <span>−₹{categoryDiscount.toLocaleString('en-IN')}</span>
            </div>
          )}
          {categoryDiscountBreakdown.map((rule) => (
            <p key={rule.label} className="muted small">↳ {rule.label}</p>
          ))}
          <div className="summary-row discount-row">
            <span>Coupon Discount</span>
            <span>−₹{couponDiscount.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Final Amount</span>
            <span>₹{finalAmount.toLocaleString('en-IN')}</span>
          </div>

          <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  )
}
