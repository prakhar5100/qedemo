const express = require('express');
const router = express.Router();
const store = require('../data/store');

// POST /api/contact - Submit contact form
// BUG-B07: Returns empty object {} instead of { message: 'sent' }
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const contactMessage = {
    id: `msg_${Date.now()}`,
    name,
    email,
    subject: subject || 'No subject',
    message,
    createdAt: new Date().toISOString()
  };

  store.contactMessages.push(contactMessage);

  // BUG-B07: Should return { message: 'sent' } but returns empty object
  res.json({});
});

module.exports = router;
