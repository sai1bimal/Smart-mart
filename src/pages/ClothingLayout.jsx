import { Outlet } from 'react-router-dom'
import CategoryMenu from '../components/CategoryMenu.jsx'

// Parent route for /products/clothing — mirrors ShoesLayout.
export default function ClothingLayout() {
  return (
    <div className="category-page">
      <h2>Clothing</h2>
      <CategoryMenu base="/products/clothing" />
      <Outlet />
    </div>
  )
}
