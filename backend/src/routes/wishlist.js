const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

// GET /api/wishlist - Get user's wishlist
router.get('/', authMiddleware, (req, res) => {
  const userWishlist = store.wishlists[req.user.userId] || [];
  
  // Populate with full product details
  const items = userWishlist.map(productId => {
    const product = store.products.find(p => p.id === productId);
    return product;
  }).filter(Boolean);

  res.json({ items });
});

// POST /api/wishlist/add - Add product to wishlist
router.post('/add', authMiddleware, (req, res) => {
  const { productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({ error: 'Product ID required' });
  }

  const product = store.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!store.wishlists[req.user.userId]) {
    store.wishlists[req.user.userId] = [];
  }

  const wishlist = store.wishlists[req.user.userId];
  
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
  }

  const items = wishlist.map(id => store.products.find(p => p.id === id)).filter(Boolean);

  res.json({ wishlist: items });
});

// DELETE /api/wishlist/remove/:id - Remove from wishlist
router.delete('/remove/:id', authMiddleware, (req, res) => {
  const productId = req.params.id;
  
  if (!store.wishlists[req.user.userId]) {
    return res.json({ wishlist: [] });
  }

  store.wishlists[req.user.userId] = store.wishlists[req.user.userId].filter(
    id => id !== productId
  );

  const items = store.wishlists[req.user.userId]
    .map(id => store.products.find(p => p.id === id))
    .filter(Boolean);

  res.json({ wishlist: items });
});

module.exports = router;
