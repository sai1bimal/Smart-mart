# ShopKart — React E-commerce Demo

A Flipkart-style e-commerce front-end built with **React + Vite**, no backend —
all product data is mocked and cart/login state persists to `localStorage`.

## How to run

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

Demo login: `user@gmail.com` / `123456`

## Project structure

Component-based architecture, one responsibility per file:

```
src/
├── components/   reusable UI pieces (Navbar, ProductCard, CartItem, CouponBox...)
├── pages/        route-level screens (Home, Cart, Checkout, Receipt...)
├── pages/categories/  Men/Women/Kids/Electronics sub-pages used by nested routes
├── context/      AuthContext + CartContext (global state via Context API)
├── data/         mock products.js
├── utils/        coupon.js and discount.js (pure calculation logic)
├── App.jsx       the full route tree
└── main.jsx      entry point, wraps <App/> in providers + BrowserRouter
```

## Where each React concept lives

1. **Context API** — `AuthContext.jsx` and `CartContext.jsx` hold global state
   (logged-in user, cart array, totals) so any component can read/update it
   with `useContext()` instead of passing props down many levels.

2. **Nested routing** — `/products/shoes` and `/products/clothing` render
   `ShoesLayout.jsx` / `ClothingLayout.jsx`, which show a Men/Women/Kids
   sub-menu and an `<Outlet />`. The matched child route (`index`, `men`,
   `women`, `kids`) renders inside that outlet — see `App.jsx`.

3. **Dynamic routing** — `/product/:id` renders `ProductDetails.jsx`, which
   calls `useParams()` to read `id` from the URL and looks the product up
   with `getProductById(id)`.

4. **`useParams()`** — used in `ProductDetails.jsx` (`:id`) and `Products.jsx`
   (`:category`, for generic category pages like `/products/home`).

5. **The cart array** — `CartContext.jsx` stores `cart` as an array of
   `{ ...product, quantity }` objects. `addToCart`, `removeFromCart`,
   `increaseQuantity`, `decreaseQuantity`, and `clearCart` all update it
   immutably with `map`/`filter`/spread. Totals (`subtotal`, discounts,
   `finalAmount`) are derived with `reduce()`.

6. **Coupons** — `utils/coupon.js` defines quantity-based (`BUY2/BUY3/BUY5`)
   and percentage-based (`SHOP10/SHOP20`) coupons and `validateCoupon()`
   checks them against the current cart. `CouponBox.jsx` is the UI for it.

7. **Product discounts** — `utils/discount.js` applies each product's own
   `discount` %, plus extra **category-level** bulk discounts (e.g. buy 2+
   shoes → extra 5% off) via `getCategoryDiscount()`.

8. **LocalStorage** — `AuthContext` and `CartContext` both read their initial
   state from `localStorage` (lazy `useState` initializer) and write to it
   inside a `useEffect` whenever that state changes, so login/cart survive
   a page refresh. The last placed order is also saved to `localStorage` so
   `Receipt.jsx` can display it.

9. **The receipt** — `Checkout.jsx` builds an `order` object (items, totals,
   a generated `orderId`), saves it to `localStorage`, clears the cart, and
   navigates to `/receipt`. `Receipt.jsx` reads that order back out with
   `useEffect` + `useState` and renders it.

10. **Running the project** — see "How to run" above. `npm run build`
    produces a production build in `dist/`.

## Routing map

```
/
├── /login
├── /products                      (search via ?search=, e.g. /products?search=shoe)
├── /products/shoes    (Outlet) ── /men  /women  /kids
├── /products/clothing (Outlet) ── /men  /women  /kids
├── /products/electronics
├── /products/:category            (generic — /products/home, /products/beauty)
├── /product/:id
├── /cart        (protected — redirects to /login if not signed in)
├── /checkout    (protected)
├── /receipt     (protected)
└── *            (404)
```
