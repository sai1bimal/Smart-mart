import { useState, useContext } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

export default function Login() {
  // useState handles the controlled form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = login(email, password)

    if (result.success) {
      // useNavigate() sends the user either back to the page they were
      // trying to reach (via ProtectedRoute), or to the Home page.
      const redirectTo = location.state?.from || '/'
      navigate(redirectTo, { replace: true })
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login to ShopKart</h2>
        <p className="muted">Use the demo credentials below to sign in.</p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@gmail.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-primary btn-block">Login</button>

        <div className="demo-creds">
          <p><strong>Demo login</strong></p>
          <p>Email: user@gmail.com</p>
          <p>Password: 123456</p>
        </div>

        <Link to="/" className="back-link">← Back to Home</Link>
      </form>
    </div>
  )
}
