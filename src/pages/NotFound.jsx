import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="empty-state">
      <p className="empty-emoji">🧭</p>
      <h1>404</h1>
      <p className="muted">Page Not Found</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  )
}
