const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} = require('../controllers/authController');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', getMe);
router.post('/logout', logoutUser);

module.exports = router;
