import { useLocation } from 'react-router-dom'

// The real DummyJSON category list (/products/category-list) has no
// "kids" category for shoes or clothing at all — there's nothing to
// fetch here. Rather than pretending a matching category exists, we
// say so honestly and keep the route/UI working.
export default function Kids() {
  const { pathname } = useLocation()
  const parentLabel = pathname.includes('/clothing') ? 'Clothing' : 'Shoes'

  return (
    <div className="empty-state">
      <p className="empty-emoji">🧒</p>
      <p>The DummyJSON API doesn't have a Kids {parentLabel} category right now.</p>
    </div>
  )
}
