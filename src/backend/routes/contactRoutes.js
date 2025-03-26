const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  addCommunication,
  searchContacts
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect);

// @route   GET /api/contacts/search
// @desc    Search contacts based on criteria
// @access  Private
router.get('/search', searchContacts);

// @route   GET /api/contacts
// @desc    Get all contacts
// @access  Private
router.get('/', getContacts);

// @route   GET /api/contacts/:id
// @desc    Get a contact by ID
// @access  Private
router.get('/:id', getContactById);

// @route   POST /api/contacts
// @desc    Create a new contact
// @access  Private
router.post('/', createContact);

// @route   PUT /api/contacts/:id
// @desc    Update a contact
// @access  Private
router.put('/:id', updateContact);

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete('/:id', deleteContact);

// @route   POST /api/contacts/:id/communications
// @desc    Add communication to a contact
// @access  Private
router.post('/:id/communications', addCommunication);

module.exports = router;
