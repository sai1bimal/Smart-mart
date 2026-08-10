import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

// Wrap any route element with <ProtectedRoute> to require login.
// If the user isn't authenticated, redirect to /login and remember
// where they were headed so we could send them back after login.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
