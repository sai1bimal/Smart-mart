import { NavLink } from 'react-router-dom'

// Props: { base } — the parent path, e.g. "/products/shoes"
// Renders Men / Women / Kids sub-nav links used above an <Outlet />.
export default function CategoryMenu({ base }) {
  return (
    <div className="category-menu">
      <NavLink to={`${base}/men`} className={({ isActive }) => (isActive ? 'active' : '')}>
        Men
      </NavLink>
      <NavLink to={`${base}/women`} className={({ isActive }) => (isActive ? 'active' : '')}>
        Women
      </NavLink>
      <NavLink to={`${base}/kids`} className={({ isActive }) => (isActive ? 'active' : '')}>
        Kids
      </NavLink>
    </div>
  )
}
