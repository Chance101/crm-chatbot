const express = require('express');
const router = express.Router();
const { processQuery } = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect);

// @route   POST /api/chatbot/query
// @desc    Process a natural language query
// @access  Private
router.post('/query', processQuery);

module.exports = router;
