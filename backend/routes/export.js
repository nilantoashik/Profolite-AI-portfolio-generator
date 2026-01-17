const express = require('express');
const router = express.Router();
const {
  exportAsJSON,
  exportAsHTML,
  exportAsMarkdown
} = require('../controllers/exportController');

// POST /api/export/json - Export as JSON
router.post('/json', exportAsJSON);

// POST /api/export/html - Export as HTML
router.post('/html', exportAsHTML);

// POST /api/export/markdown - Export as Markdown
router.post('/markdown', exportAsMarkdown);

module.exports = router;
