import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { SHOES_CATEGORIES, CLOTHING_CATEGORIES } from './utils/categoryMap.js'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Products from './pages/Products.jsx'
import CategoryAll from './pages/CategoryAll.jsx'
import ShoesLayout from './pages/ShoesLayout.jsx'
import ClothingLayout from './pages/ClothingLayout.jsx'
import Men from './pages/categories/Men.jsx'
import Women from './pages/categories/Women.jsx'
import Kids from './pages/categories/Kids.jsx'
import Electronics from './pages/categories/Electronics.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Receipt from './pages/Receipt.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Full catalog + search: /products, /products?search=... */}
          <Route path="/products" element={<Products />} />

          {/* Nested routing: /products/shoes (+ /men /women /kids via Outlet) */}
          <Route path="/products/shoes" element={<ShoesLayout />}>
            <Route index element={<CategoryAll title="Shoes" categories={SHOES_CATEGORIES.all} />} />
            <Route path="men" element={<Men />} />
            <Route path="women" element={<Women />} />
            <Route path="kids" element={<Kids />} />
          </Route>

          {/* Nested routing: /products/clothing (+ /men /women /kids via Outlet) */}
          <Route path="/products/clothing" element={<ClothingLayout />}>
            <Route index element={<CategoryAll title="Clothing" categories={CLOTHING_CATEGORIES.all} />} />
            <Route path="men" element={<Men />} />
            <Route path="women" element={<Women />} />
            <Route path="kids" element={<Kids />} />
          </Route>

          <Route path="/products/electronics" element={<Electronics />} />

          {/* Generic category page: /products/home, /products/beauty, etc. */}
          <Route path="/products/:category" element={<Products />} />

          {/* Dynamic routing: /product/:id */}
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Protected routes — require login */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/receipt" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
