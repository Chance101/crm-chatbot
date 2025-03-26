const Contact = require('../models/Contact');

/**
 * Get all contacts for the logged-in user
 * @route GET /api/contacts
 * @access Private
 */
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a single contact by ID
 * @route GET /api/contacts/:id
 * @access Private
 */
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new contact
 * @route POST /api/contacts
 * @access Private
 */
const createContact = async (req, res) => {
  try {
    const contact = new Contact({
      ...req.body,
      user: req.user._id
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a contact
 * @route PUT /api/contacts/:id
 * @access Private
 */
const updateContact = async (req, res) => {
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
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a contact
 * @route DELETE /api/contacts/:id
 * @access Private
 */
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (contact) {
      await contact.remove();
      res.json({ message: 'Contact removed' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add a communication to a contact
 * @route POST /api/contacts/:id/communications
 * @access Private
 */
const addCommunication = async (req, res) => {
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
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Search contacts based on various criteria
 * @route GET /api/contacts/search
 * @access Private
 */
const searchContacts = async (req, res) => {
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
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
