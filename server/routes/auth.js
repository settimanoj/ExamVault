const express = require('express');
const { googleLogin, getCurrentUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/google', googleLogin);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
