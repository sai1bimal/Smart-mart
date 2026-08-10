import { useState, useContext } from 'react'
import { CartContext } from '../context/CartContext.jsx'
import { validateCoupon, coupons } from '../utils/coupon.js'

export default function CouponBox() {
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState(null) // { type: 'success' | 'error', text }

  const { cart, subtotal, productDiscount, categoryDiscount, appliedCoupon, applyCoupon, removeCoupon } =
    useContext(CartContext)

  const subtotalAfterProductDiscount = subtotal - productDiscount - categoryDiscount

  const handleApply = (e) => {
    e.preventDefault()

    if (!code.trim()) return

    if (appliedCoupon) {
      setFeedback({ type: 'error', text: 'A coupon is already applied. Remove it first.' })
      return
    }

    const result = validateCoupon(code, cart, subtotalAfterProductDiscount)

    if (result.valid) {
      applyCoupon({ code: result.coupon.code, discount: result.discount })
      setFeedback({ type: 'success', text: `✓ Coupon applied — you saved ₹${result.discount}` })
      setCode('')
    } else {
      setFeedback({ type: 'error', text: result.message })
    }
  }

  const handleRemove = () => {
    removeCoupon()
    setFeedback(null)
  }

  return (
    <div className="coupon-box">
      <h4>Have a coupon?</h4>

      {appliedCoupon ? (
        <div className="coupon-applied">
          <span>✓ <strong>{appliedCoupon.code}</strong> applied — saved ₹{appliedCoupon.discount}</span>
          <button className="link-btn" onClick={handleRemove}>Remove</button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="coupon-form">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Apply</button>
        </form>
      )}

      {feedback && (
        <p className={feedback.type === 'success' ? 'coupon-success' : 'coupon-error'}>
          {feedback.text}
        </p>
      )}

      <div className="coupon-hints">
        {coupons.map((c) => (
          <span key={c.code} className="coupon-chip">{c.code} — {c.label}</span>
        ))}
      </div>
    </div>
  )
}
