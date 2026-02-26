const store = require('../data/store');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized — missing token' });
  }
  const token = authHeader.split(' ')[1];
  const userId = store.tokens[token];
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized — invalid token' });
  }
  req.userId = userId;
  req.user = store.users.find(u => u.id === userId);
  next();
}

module.exports = authMiddleware;
