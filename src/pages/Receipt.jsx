import { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

export default function Receipt() {
  const { user } = useContext(AuthContext)

  // useEffect + useState: load the last placed order from LocalStorage
  // once, when this page mounts.
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('shopkart_last_order')
    if (saved) setOrder(JSON.parse(saved))
  }, [])

  if (!order) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="receipt-page">
      <div className="receipt-success">✓ Order placed successfully!</div>

      <div className="receipt-card">
        <h2 className="receipt-title">SHOPKART</h2>
        <p className="receipt-subtitle">ORDER RECEIPT</p>
        <hr />

        <div className="receipt-meta">
          <p>Customer Name: {user?.name || order.customer.name}</p>
          <p>Email: {user?.email || order.customer.email}</p>
          <p>Order ID: {order.orderId}</p>
          <p>Order Date: {order.date}</p>
        </div>

        <hr />

        <table className="receipt-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price.toLocaleString('en-IN')}</td>
                <td>₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-row discount-row">
          <span>Product Discount</span>
          <span>−₹{order.productDiscount.toLocaleString('en-IN')}</span>
        </div>
        {order.categoryDiscount > 0 && (
          <div className="summary-row discount-row">
            <span>Category Discount</span>
            <span>−₹{order.categoryDiscount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="summary-row discount-row">
          <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
          <span>−₹{order.couponDiscount.toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-row summary-total">
          <span>Final Amount</span>
          <span>₹{order.finalAmount.toLocaleString('en-IN')}</span>
        </div>

        <p className="payment-status">Payment Status: Paid</p>

        <hr />
        <p className="receipt-thanks">THANK YOU FOR SHOPPING!</p>
      </div>

      <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
    </div>
  )
}
