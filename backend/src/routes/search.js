const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/search - Full-text product search
router.get('/', (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({ error: 'Search query required' });
  }

  const query = q.toLowerCase();
  const results = store.products.filter(product => {
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  res.json({
    results,
    count: results.length,
    query: q
  });
});

module.exports = router;
