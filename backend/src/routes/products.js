const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

// GET /api/products - List all products with filtering and sorting
// BUG-B01: Invalid category returns 200 with empty array instead of 400
router.get('/', (req, res) => {
  const { category, sort, q, limit = 50, page = 1 } = req.query;
  
  let filteredProducts = [...store.products];

  // Filter by category - BUG-B01: Should return 400 for invalid category
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
    // Missing validation - should check if category exists
  }

  // Search by query
  if (q) {
    const query = q.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Sort products
  if (sort) {
    switch (sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    products: paginatedProducts,
    total: filteredProducts.length,
    page: pageNum,
    totalPages: Math.ceil(filteredProducts.length / limitNum)
  });
});

// GET /api/products/featured - Get featured products
// BUG-B06: Ignores limit parameter, returns all featured products
router.get('/featured', (req, res) => {
  const { limit } = req.query;
  
  const featuredProducts = store.products.filter(p => p.featured);
  
  // BUG-B06: Should respect limit parameter but doesn't
  // Should be: featuredProducts.slice(0, parseInt(limit) || 8)
  res.json({ products: featuredProducts });
});

// GET /api/products/:id - Get single product
// BUG-B03: Returns 'productName' instead of 'name' - schema inconsistency
router.get('/:id', (req, res) => {
  const product = store.products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // BUG-B03: Field name is inconsistent with list endpoint
  const productData = { ...product };
  productData.productName = productData.name;
  delete productData.name;

  res.json({ product: productData });
});

// GET /api/products/:id/reviews - Get reviews for a product
router.get('/:id/reviews', (req, res) => {
  const productId = req.params.id;
  const product = store.products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Generate mock reviews
  const reviewsForProduct = store.reviews[productId] || [];
  
  res.json({
    reviews: reviewsForProduct,
    averageRating: product.rating,
    totalReviews: product.reviewCount
  });
});

// POST /api/products/:id/reviews - Submit a review
router.post('/:id/reviews', authMiddleware, (req, res) => {
  const productId = req.params.id;
  const { rating, title, comment } = req.body;
  
  const product = store.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const review = {
    id: `review_${Date.now()}`,
    productId,
    userId: req.user.userId,
    userName: req.user.firstName + ' ' + req.user.lastName,
    rating,
    title: title || '',
    comment: comment || '',
    createdAt: new Date().toISOString()
  };

  if (!store.reviews[productId]) {
    store.reviews[productId] = [];
  }
  store.reviews[productId].push(review);

  res.status(201).json({ review });
});

module.exports = router;
