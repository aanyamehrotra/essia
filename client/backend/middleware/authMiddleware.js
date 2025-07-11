const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers['authorization']?.split(' ')[1];

  console.log('🔐 Token from cookie:', req.cookies.token);
  console.log('🔐 Token from Authorization header:', req.headers.authorization);

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: No token provided' });
  }

  try {
    console.log('🔐 Token used for verify:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT Decoded:', decoded);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateUser };
