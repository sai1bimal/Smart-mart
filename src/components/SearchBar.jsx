import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    // Search results are just the /products page with a ?search= param —
    // Products.jsx reads that param and filters with Array.filter().
    navigate(`/products?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for shoes, mobiles, laptops..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}
