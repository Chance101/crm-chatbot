const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notificationSent: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Virtual for checking if reminder is overdue
reminderSchema.virtual('isOverdue').get(function() {
  return !this.completed && this.dueDate < new Date();
});

// Index for efficiently finding upcoming reminders
reminderSchema.index({ user: 1, dueDate: 1, completed: 1 });

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
