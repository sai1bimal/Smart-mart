// src/utils/categoryMap.js
//
// The DummyJSON API's real category slugs (from /products/category-list)
// don't line up 1:1 with this app's custom "Shoes / Clothing / Electronics"
// navigation. This file is the ONE place that maps between them, so no
// component has to guess or invent a category that doesn't exist.
//
// Real DummyJSON slugs used below:
// beauty, fragrances, furniture, groceries, home-decoration,
// kitchen-accessories, laptops, mens-shirts, mens-shoes, mens-watches,
// mobile-accessories, motorcycle, skin-care, smartphones,
// sports-accessories, sunglasses, tablets, tops, vehicle, womens-bags,
// womens-dresses, womens-jewellery, womens-shoes, womens-watches

// Shoes: DummyJSON has mens/womens shoes, but no single "shoes" category
// and no kids shoes category at all.
export const SHOES_CATEGORIES = {
  men: 'mens-shoes',
  women: 'womens-shoes',
  all: ['mens-shoes', 'womens-shoes'],
}

// Clothing: closest matches are shirts (men), dresses (women), and the
// unisex "tops" category. There's no kids clothing category.
export const CLOTHING_CATEGORIES = {
  men: 'mens-shirts',
  women: 'womens-dresses',
  all: ['mens-shirts', 'womens-dresses', 'tops'],
}

// Electronics: DummyJSON splits this into several categories instead of
// one. We fetch each and show them as labeled sections, like the old
// subCategory grouping used to.
export const ELECTRONICS_GROUPS = [
  { slug: 'smartphones', label: 'Mobile Phones' },
  { slug: 'laptops', label: 'Laptops' },
  { slug: 'tablets', label: 'Tablets' },
  { slug: 'mobile-accessories', label: 'Accessories' },
]

// Broad group a DummyJSON slug belongs to, in this app's own vocabulary.
// Used by productMapper.js so `product.category` stays a friendly label
// like "Shoes" — which the cart's category-level bulk discounts
// (src/utils/discount.js) and the search page's "browse by section" hint
// already expect.
const GROUP_BY_SLUG = {
  'mens-shoes': 'Shoes',
  'womens-shoes': 'Shoes',
  'mens-shirts': 'Clothing',
  'womens-dresses': 'Clothing',
  tops: 'Clothing',
  smartphones: 'Electronics',
  laptops: 'Electronics',
  tablets: 'Electronics',
  'mobile-accessories': 'Electronics',
  'home-decoration': 'Home',
  furniture: 'Home',
  'kitchen-accessories': 'Home',
  beauty: 'Beauty',
  'skin-care': 'Beauty',
  fragrances: 'Beauty',
}

// Falls back to the raw slug itself if we haven't mapped it to a group.
export const getCategoryGroup = (slug) => GROUP_BY_SLUG[slug] || slug
