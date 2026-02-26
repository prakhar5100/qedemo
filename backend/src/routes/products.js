const express = require('express');
const router = express.Router();
const store = require('../data/store');
const authMiddleware = require('../middleware/auth');

const validCategories = ['electronics', 'apparel', 'home', 'deals'];

// GET /api/products
// BUG-B01: Invalid category returns 200 with [] instead of 400
router.get('/', (req, res) => {
  let { category, sort, q, limit, page } = req.query;
  let results = [...store.products];

  if (category) {
    // BUG-B01: Should check if category is valid and return 400 if not
    // Instead, silently returns empty array for unknown categories
    results = results.filter(p => p.category === category);
  }

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(t => t.includes(query))
    );
  }

  // Handle deals category as discounted products
  if (category === 'deals') {
    results = store.products.filter(p => p.price < p.originalPrice);
  }

  if (sort === 'price-asc') results.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') results.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);
  else if (sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));

  const total = results.length;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 12;
  const start = (pageNum - 1) * limitNum;
  results = results.slice(start, start + limitNum);

  res.json({ products: results, total, page: pageNum });
});

// GET /api/products/featured
// BUG-B06: limit param is ignored — always returns all featured
router.get('/featured', (req, res) => {
  // BUG-B06: Should respect limit param:
  // const limitNum = parseInt(req.query.limit) || 8;
  // const featured = store.products.filter(p => p.featured).slice(0, limitNum);
  const featured = store.products.filter(p => p.featured); // ignores limit
  res.json({ products: featured });
});

// GET /api/products/:id
// BUG-B03: Returns productName instead of name
router.get('/:id', (req, res) => {
  const product = store.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  // BUG-B03: Inconsistent field naming — returns productName instead of name
  const { name, ...rest } = product;
  res.json({ product: { ...rest, productName: name } });
});

// GET /api/products/:id/reviews
router.get('/:id/reviews', (req, res) => {
  const product = store.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const productReviews = store.reviews.filter(r => r.productId === req.params.id);
  const averageRating = productReviews.length
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : 0;

  res.json({ reviews: productReviews, averageRating: Math.round(averageRating * 10) / 10 });
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', authMiddleware, (req, res) => {
  const product = store.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const { rating, title, body } = req.body;
  if (!rating || !title || !body) {
    return res.status(400).json({ error: 'rating, title, and body are required' });
  }

  const review = {
    id: `rev_${Date.now()}`,
    productId: req.params.id,
    userId: req.userId,
    rating: parseInt(rating),
    title, body,
    createdAt: new Date().toISOString()
  };
  store.reviews.push(review);
  res.status(201).json({ review });
});

module.exports = router;
