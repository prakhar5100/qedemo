const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/categories - List all categories
router.get('/', (req, res) => {
  res.json({ categories: store.categories });
});

// GET /api/categories/:slug - Get category details with product count
router.get('/:slug', (req, res) => {
  const category = store.categories.find(c => c.slug === req.params.slug);
  
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const productCount = store.products.filter(p => p.category === req.params.slug).length;

  res.json({
    category,
    productCount
  });
});

module.exports = router;
