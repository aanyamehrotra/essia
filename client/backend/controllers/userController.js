const User = require('../models/user');

exports.getMe = async (req, res) => {
  const user = await User.findByPk(req.user.userId, {
    attributes: ['id', 'name', 'email'],
  });

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user);
};
