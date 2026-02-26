const express = require('express');
const router = express.Router();
const store = require('../data/store');
const authMiddleware = require('../middleware/auth');
const crypto = require('crypto');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = store.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  store.tokens[token] = user.id;
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// POST /api/auth/register
// BUG-B08: No duplicate email check — returns 200 instead of 409
router.post('/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  // BUG-B08: Missing duplicate check — should be:
  // const existing = store.users.find(u => u.email === email);
  // if (existing) return res.status(409).json({ error: 'Email already in use' });

  const newUser = {
    id: `user_${Date.now()}`,
    email, password, firstName, lastName,
    address: {},
    createdAt: new Date().toISOString()
  };
  store.users.push(newUser);
  const token = crypto.randomBytes(32).toString('hex');
  store.tokens[token] = newUser.id;
  const { password: _, ...safeUser } = newUser;
  res.json({ token, user: safeUser });
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  delete store.tokens[token];
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  const { password: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

module.exports = router;
