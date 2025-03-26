const express = require('express');
const router = express.Router();
const {
  uploadPdf,
  extractPdfText,
  parseContactInfo
} = require('../controllers/pdfController');
const { protect } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect);

// @route   POST /api/pdf/upload
// @desc    Upload a PDF file
// @access  Private
router.post('/upload', uploadPdf);

// @route   POST /api/pdf/extract
// @desc    Extract text from a PDF file
// @access  Private
router.post('/extract', extractPdfText);

// @route   POST /api/pdf/parse
// @desc    Parse contact information from PDF text
// @access  Private
router.post('/parse', parseContactInfo);

module.exports = router;
