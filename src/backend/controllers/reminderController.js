const Reminder = require('../models/Reminder');
const Contact = require('../models/Contact');

/**
 * Get all reminders for the logged-in user
 * @route GET /api/reminders
 * @access Private
 */
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id })
      .populate('contact', 'name email role currentCompany')
      .sort({ dueDate: 1 });

    res.json(reminders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new reminder
 * @route POST /api/reminders
 * @access Private
 */
const createReminder = async (req, res) => {
  try {
    const { contact: contactId, dueDate, description, priority } = req.body;

    // Verify contact exists and belongs to user
    const contact = await Contact.findOne({
      _id: contactId,
      user: req.user._id
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const reminder = new Reminder({
      user: req.user._id,
      contact: contactId,
      dueDate: new Date(dueDate),
      description,
      priority
    });

    const createdReminder = await reminder.save();
    
    // Populate contact data for response
    await createdReminder.populate('contact', 'name email role currentCompany');
    
    res.status(201).json(createdReminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a reminder
 * @route PUT /api/reminders/:id
 * @access Private
 */
const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (reminder) {
      reminder.dueDate = req.body.dueDate || reminder.dueDate;
      reminder.description = req.body.description || reminder.description;
      reminder.completed = req.body.completed !== undefined ? req.body.completed : reminder.completed;
      reminder.priority = req.body.priority || reminder.priority;

      const updatedReminder = await reminder.save();
      await updatedReminder.populate('contact', 'name email role currentCompany');
      
      res.json(updatedReminder);
    } else {
      res.status(404).json({ message: 'Reminder not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a reminder
 * @route DELETE /api/reminders/:id
 * @access Private
 */
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (reminder) {
      await reminder.remove();
      res.json({ message: 'Reminder removed' });
    } else {
      res.status(404).json({ message: 'Reminder not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get upcoming reminders for the next X days
 * @route GET /api/reminders/upcoming/:days
 * @access Private
 */
const getUpcomingReminders = async (req, res) => {
  try {
    const days = parseInt(req.params.days) || 7;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const reminders = await Reminder.find({
      user: req.user._id,
      dueDate: { $gte: new Date(), $lte: endDate },
      completed: false
    })
      .populate('contact', 'name email role currentCompany')
      .sort({ dueDate: 1 });

    res.json(reminders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Mark a reminder as completed
 * @route PUT /api/reminders/:id/complete
 * @access Private
 */
const completeReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (reminder) {
      reminder.completed = true;
      const updatedReminder = await reminder.save();
      await updatedReminder.populate('contact', 'name email role currentCompany');
      
      res.json(updatedReminder);
    } else {
      res.status(404).json({ message: 'Reminder not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  getUpcomingReminders,
  completeReminder
};
