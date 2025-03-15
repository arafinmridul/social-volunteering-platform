const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get user profile (protected)
router.get('/profile', authMiddleware, getUserProfile);

// Update user profile (protected)
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;
