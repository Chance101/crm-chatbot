const express = require('express');
const router = express.Router();
const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  getUpcomingReminders,
  completeReminder
} = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect);

// @route   GET /api/reminders
// @desc    Get all reminders
// @access  Private
router.get('/', getReminders);

// @route   GET /api/reminders/upcoming/:days
// @desc    Get upcoming reminders for the next X days
// @access  Private
router.get('/upcoming/:days', getUpcomingReminders);

// @route   POST /api/reminders
// @desc    Create a new reminder
// @access  Private
router.post('/', createReminder);

// @route   PUT /api/reminders/:id
// @desc    Update a reminder
// @access  Private
router.put('/:id', updateReminder);

// @route   PUT /api/reminders/:id/complete
// @desc    Mark a reminder as completed
// @access  Private
router.put('/:id/complete', completeReminder);

// @route   DELETE /api/reminders/:id
// @desc    Delete a reminder
// @access  Private
router.delete('/:id', deleteReminder);

module.exports = router;
