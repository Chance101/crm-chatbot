const Contact = require('../models/Contact');
const { logger, createError } = require('../utils/logger');

/**
 * Get all contacts for the logged-in user
 * @route GET /api/contacts
 * @access Private
 */
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ user: req.user._id });
    res.json(contacts);
  } catch (error) {
    logger.error('Error fetching contacts', { 
      error: error.message, 
      userId: req.user._id 
    });
    next(createError('Failed to fetch contacts', 500));
  }
};

/**
 * Get a single contact by ID
 * @route GET /api/contacts/:id
 * @access Private
 */
const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (contact) {
      res.json(contact);
    } else {
      next(createError('Contact not found', 404));
    }
  } catch (error) {
    logger.error('Error fetching contact by ID', { 
      error: error.message, 
      contactId: req.params.id,
      userId: req.user._id 
    });
    next(createError('Failed to fetch contact', 500));
  }
};

/**
 * Create a new contact
 * @route POST /api/contacts
 * @access Private
 */
const createContact = async (req, res, next) => {
  try {
    const contact = new Contact({
      ...req.body,
      user: req.user._id
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    // Check if this is a validation error
    if (error.name === 'ValidationError') {
      // Return a 400 Bad Request status with validation details
      logger.warn('Contact validation error', {
        error: error.message,
        validationErrors: Object.keys(error.errors).map(field => ({
          field,
          message: error.errors[field].message
        })),
        userId: req.user._id
      });
      
      return res.status(400).json({
        message: 'Validation error: Contact could not be created',
        errors: Object.keys(error.errors).reduce((acc, field) => {
          acc[field] = error.errors[field].message;
          return acc;
        }, {})
      });
    }
    
    // Otherwise it's a server error
    logger.error('Error creating contact', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user._id 
    });
    next(createError('Failed to create contact', 500));
  }
};

/**
 * Update a contact
 * @route PUT /api/contacts/:id
 * @access Private
 */
const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (contact) {
      // Update fields from request body
      Object.keys(req.body).forEach(key => {
        contact[key] = req.body[key];
      });

      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      next(createError('Contact not found', 404));
    }
  } catch (error) {
    // Check if this is a validation error
    if (error.name === 'ValidationError') {
      // Return a 400 Bad Request status with validation details
      logger.warn('Contact validation error during update', {
        error: error.message,
        validationErrors: Object.keys(error.errors).map(field => ({
          field,
          message: error.errors[field].message
        })),
        contactId: req.params.id,
        userId: req.user._id
      });
      
      return res.status(400).json({
        message: 'Validation error: Contact could not be updated',
        errors: Object.keys(error.errors).reduce((acc, field) => {
          acc[field] = error.errors[field].message;
          return acc;
        }, {})
      });
    }
    
    logger.error('Error updating contact', { 
      error: error.message, 
      contactId: req.params.id,
      userId: req.user._id 
    });
    next(createError('Failed to update contact', 500));
  }
};

/**
 * Delete a contact
 * @route DELETE /api/contacts/:id
 * @access Private
 */
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (contact) {
      res.json({ message: 'Contact removed' });
    } else {
      next(createError('Contact not found', 404));
    }
  } catch (error) {
    logger.error('Error deleting contact', { 
      error: error.message, 
      contactId: req.params.id,
      userId: req.user._id 
    });
    next(createError('Failed to delete contact', 500));
  }
};

/**
 * Add a communication to a contact
 * @route POST /api/contacts/:id/communications
 * @access Private
 */
const addCommunication = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (contact) {
      const communication = {
        ...req.body,
        date: req.body.date || new Date()
      };

      contact.communications.push(communication);
      contact.lastContactedDate = communication.date;
      
      const updatedContact = await contact.save();
      res.status(201).json(updatedContact);
    } else {
      next(createError('Contact not found', 404));
    }
  } catch (error) {
    // Check if this is a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error: Communication could not be added',
        errors: Object.keys(error.errors).reduce((acc, field) => {
          acc[field] = error.errors[field].message;
          return acc;
        }, {})
      });
    }
    
    logger.error('Error adding communication', { 
      error: error.message, 
      contactId: req.params.id,
      userId: req.user._id 
    });
    next(createError('Failed to add communication', 500));
  }
};

/**
 * Search contacts based on various criteria
 * @route GET /api/contacts/search
 * @access Private
 */
const searchContacts = async (req, res, next) => {
  try {
    const { query, team, role, temperature, company, lastContactDays } = req.query;
    const searchQuery = { user: req.user._id };

    // Add query parameters to search criteria
    if (query) {
      searchQuery.$text = { $search: query };
    }
    
    if (team) {
      searchQuery.team = { $regex: team, $options: 'i' };
    }
    
    if (role) {
      searchQuery.role = { $regex: role, $options: 'i' };
    }
    
    if (temperature) {
      searchQuery.temperature = temperature;
    }
    
    if (company) {
      searchQuery.currentCompany = { $regex: company, $options: 'i' };
    }
    
    if (lastContactDays) {
      const date = new Date();
      date.setDate(date.getDate() - parseInt(lastContactDays));
      searchQuery.lastContactedDate = { $lte: date };
    }

    const contacts = await Contact.find(searchQuery);
    
    logger.info('Contact search performed', {
      userId: req.user._id,
      criteria: req.query,
      resultCount: contacts.length
    });
    
    res.json(contacts);
  } catch (error) {
    logger.error('Error searching contacts', { 
      error: error.message, 
      searchParams: req.query,
      userId: req.user._id 
    });
    next(createError('Failed to search contacts', 500));
  }
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  addCommunication,
  searchContacts
};