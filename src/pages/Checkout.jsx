import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { getDiscountedPrice } from '../utils/discount.js'

const emptyForm = { name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' }

// Generates a unique-enough order id like SK20260808-4821
function generateOrderId() {
  const date = new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `SK${y}${m}${d}-${rand}`
}

export default function Checkout() {
  const { cart, subtotal, productDiscount, categoryDiscount, couponDiscount, finalAmount, clearCart, appliedCoupon } =
    useContext(CartContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({ ...emptyForm, name: user?.name || '', email: user?.email || '' })
  const [errors, setErrors] = useState({})

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-emoji">🛒</p>
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = 'This field is required'
    })
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit pincode'
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (!validate()) return

    const order = {
      orderId: generateOrderId(),
      date: new Date().toLocaleDateString('en-IN'),
      customer: form,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: getDiscountedPrice(item),
      })),
      subtotal,
      productDiscount,
      categoryDiscount,
      couponDiscount,
      couponCode: appliedCoupon?.code || null,
      finalAmount,
    }

    // Save the order so the Receipt page can read it after cart is cleared.
    localStorage.setItem('shopkart_last_order', JSON.stringify(order))

    clearCart()
    navigate('/receipt')
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h3>Shipping Details</h3>

          {['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'].map((field) => (
            <label key={field}>
              {field[0].toUpperCase() + field.slice(1)}
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={form[field]}
                onChange={handleChange}
              />
              {errors[field] && <span className="form-error">{errors[field]}</span>}
            </label>
          ))}

          <button type="submit" className="btn btn-primary btn-block">Place Order</button>
        </form>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="summary-row">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(getDiscountedPrice(item) * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <hr />
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row discount-row">
            <span>Product Discount</span>
            <span>−₹{productDiscount.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row discount-row">
            <span>Coupon Discount</span>
            <span>−₹{couponDiscount.toLocaleString('en-IN')}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Final Amount</span>
            <span>₹{finalAmount.toLocaleString('en-IN')}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
