const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = user;
    next();
  } 
  catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
