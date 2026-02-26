const express = require('express');
const router = express.Router();
const store = require('../data/store');
const authMiddleware = require('../middleware/auth');

// ── CATEGORIES ──────────────────────────────────────────
router.get('/categories', (req, res) => {
  const catsWithCount = store.categories.map(cat => ({
    ...cat,
    productCount: store.products.filter(p => p.category === cat.slug || (cat.slug === 'deals' && p.price < p.originalPrice)).length
  }));
  res.json({ categories: catsWithCount });
});

router.get('/categories/:slug', (req, res) => {
  const category = store.categories.find(c => c.slug === req.params.slug);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  const productCount = store.products.filter(p => p.category === category.slug).length;
  res.json({ category, productCount });
});

// ── SEARCH ──────────────────────────────────────────────
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ results: [], count: 0 });
  const query = q.toLowerCase();
  const results = store.products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query) ||
    p.tags.some(t => t.includes(query)) ||
    p.category.includes(query)
  );
  res.json({ results, count: results.length });
});

// ── WISHLIST ─────────────────────────────────────────────
router.get('/wishlist', authMiddleware, (req, res) => {
  const ids = store.wishlists[req.userId] || [];
  const items = ids.map(id => store.products.find(p => p.id === id)).filter(Boolean);
  res.json({ items });
});

router.post('/wishlist/add', authMiddleware, (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId required' });
  if (!store.wishlists[req.userId]) store.wishlists[req.userId] = [];
  if (!store.wishlists[req.userId].includes(productId)) {
    store.wishlists[req.userId].push(productId);
  }
  const ids = store.wishlists[req.userId];
  const items = ids.map(id => store.products.find(p => p.id === id)).filter(Boolean);
  res.json({ wishlist: items });
});

router.delete('/wishlist/remove/:id', authMiddleware, (req, res) => {
  if (!store.wishlists[req.userId]) store.wishlists[req.userId] = [];
  store.wishlists[req.userId] = store.wishlists[req.userId].filter(id => id !== req.params.id);
  const ids = store.wishlists[req.userId];
  const items = ids.map(id => store.products.find(p => p.id === id)).filter(Boolean);
  res.json({ wishlist: items });
});

// ── CONTACT ──────────────────────────────────────────────
// BUG-B07: Returns empty {} instead of { message: 'sent' }
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }
  // BUG-B07: Should return { message: 'sent' } but returns {}
  res.json({});
});

module.exports = router;
