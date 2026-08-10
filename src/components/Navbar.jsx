import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { CartContext } from '../context/CartContext.jsx'
import SearchBar from './SearchBar.jsx'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext)
  const { totalItems } = useContext(CartContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-top">
        <Link to="/" className="brand">
          Shop<span>Kart</span>
        </Link>

        <SearchBar />

        <nav className="navbar-links">
          <Link to="/products">Categories</Link>

          {isAuthenticated ? (
            <div className="navbar-user">
              <span>Hello, {user.name}</span>
              <button className="link-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="navbar-login">Login</Link>
          )}

          <Link to="/cart" className="cart-link">
            🛒 Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}
