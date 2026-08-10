import { Outlet } from 'react-router-dom'
import CategoryMenu from '../components/CategoryMenu.jsx'

// Parent route for /products/shoes.
// Renders the Men/Women/Kids sub-nav, then <Outlet /> renders whichever
// nested route matched: index (all shoes), /men, /women, or /kids.
export default function ShoesLayout() {
  return (
    <div className="category-page">
      <h2>Shoes</h2>
      <CategoryMenu base="/products/shoes" />
      <Outlet />
    </div>
  )
}
