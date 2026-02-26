const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const store = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

// POST /api/auth/login - User login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = store.users.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // In real app, would use bcrypt.compare() here
  // For demo, accept any password that equals 'password123'
  if (password !== 'password123') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const userResponse = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address
  };

  res.json({ token, user: userResponse });
});

// POST /api/auth/register - Register new user
// BUG-B08: No duplicate email check - returns 200 instead of 409 for existing email
router.post('/register', (req, res) => {
  const { email, password, firstName, lastName, address } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields required' });
  }

  // BUG-B08: Missing duplicate email check
  // Should check: const existing = store.users.find(u => u.email === email);
  // if (existing) return res.status(409).json({ error: 'Email already registered' });

  const newUser = {
    id: `user_${Date.now()}`,
    email,
    password: '$2a$10$xHKVQJL8Z3rMzY1Y5Y5Y5.Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5', // Mock hash
    firstName,
    lastName,
    address: address || {},
    createdAt: new Date().toISOString()
  };

  store.users.push(newUser);

  const token = jwt.sign(
    { 
      userId: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const userResponse = {
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    address: newUser.address
  };

  res.json({ token, user: userResponse });
});

// POST /api/auth/logout - Logout (client-side token removal mainly)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me - Get current user profile
router.get('/me', authMiddleware, (req, res) => {
  const user = store.users.find(u => u.id === req.user.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userResponse = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address
  };

  res.json({ user: userResponse });
});

module.exports = router;
