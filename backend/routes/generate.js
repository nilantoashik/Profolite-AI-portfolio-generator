const express = require('express');
const router = express.Router();
const { generatePortfolioContent } = require('../controllers/generateController');
const { validateProfileInput } = require('../middleware/validation');

// POST /api/generate
// Generate portfolio content from user profile
router.post('/', validateProfileInput, generatePortfolioContent);

module.exports = router;
