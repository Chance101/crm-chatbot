const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['contact', 'team', 'company', 'engagement', 'custom'],
    required: true
  },
  parameters: {
    type: Object,
    default: {}
  },
  results: {
    type: Object,
    default: {}
  },
  visualizationType: {
    type: String,
    enum: ['bar', 'pie', 'line', 'table', 'custom'],
    default: 'table'
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  lastGenerated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
