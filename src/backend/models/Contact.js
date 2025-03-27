const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true
  },
  team: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  timeInRole: {
    type: Number, // in months
    default: 0
  },
  timeAtCompany: {
    type: Number, // in months
    default: 0
  },
  currentCompany: {
    type: String,
    trim: true
  },
  previousCompanies: [{
    name: String,
    role: String,
    duration: Number // in months
  }],
  accomplishments: [{
    title: String,
    description: String,
    date: Date
  }],
  communications: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['email', 'phone', 'meeting', 'social', 'other'],
      default: 'other'
    },
    content: String,
    notes: String
  }],
  temperature: {
    type: String,
    enum: ['cold', 'warm', 'hot'],
    default: 'cold'
  },
  lastContactedDate: {
    type: Date
  },
  overlapPoints: [{
    category: String,
    description: String
  }],
  notes: String,
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  socialProfiles: {
    linkedin: String,
    twitter: String,
    github: String,
    other: String
  }
}, { timestamps: true });

// Virtual for days since last contacted
contactSchema.virtual('daysSinceLastContacted').get(function() {
  if (!this.lastContactedDate) return null;
  const diffTime = Math.abs(new Date() - this.lastContactedDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Add text index for full-text search
contactSchema.index({
  name: 'text',
  role: 'text',
  team: 'text',
  currentCompany: 'text',
  notes: 'text',
  'accomplishments.title': 'text',
  'accomplishments.description': 'text',
  'overlapPoints.description': 'text'
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
