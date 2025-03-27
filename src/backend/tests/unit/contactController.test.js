const mongoose = require('mongoose');
const Contact = require('../../models/Contact');
const User = require('../../models/User');
const contactController = require('../../controllers/contactController');
const { createError } = require('../../utils/logger');

// Mock the dependencies
jest.mock('../../models/Contact');
jest.mock('../../models/User');
jest.mock('../../utils/logger', () => ({
  createError: jest.fn((message, code, details) => {
    const error = new Error(message);
    error.statusCode = code;
    error.details = details;
    return error;
  })
}));

describe('Contact Controller', () => {
  let req, res;
  
  beforeEach(() => {
    // Mock request and response objects
    req = {
      user: { _id: mongoose.Types.ObjectId() },
      params: { id: mongoose.Types.ObjectId().toString() },
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Clear all mock calls
    jest.clearAllMocks();
  });
  
  describe('createContact', () => {
    it('should create a contact successfully', async () => {
      // Setup
      const mockContact = {
        _id: mongoose.Types.ObjectId(),
        name: 'Test Contact',
        user: req.user._id,
        save: jest.fn().mockResolvedValue({
          _id: mongoose.Types.ObjectId(),
          name: 'Test Contact',
          user: req.user._id
        })
      };
      
      Contact.mockImplementation(() => mockContact);
      
      // Setup request body
      req.body = {
        name: 'Test Contact',
        email: 'test@example.com',
        temperature: 'warm'
      };
      
      // Execute
      await contactController.createContact(req, res);
      
      // Assert
      expect(Contact).toHaveBeenCalledWith({
        ...req.body,
        user: req.user._id
      });
      expect(mockContact.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
    
    it('should return 400 on validation error', async () => {
      // Setup
      const validationError = new mongoose.Error.ValidationError();
      validationError.errors = {
        name: new mongoose.Error.ValidatorError({ message: 'Name is required' })
      };
      
      const mockContact = {
        save: jest.fn().mockRejectedValue(validationError)
      };
      
      Contact.mockImplementation(() => mockContact);
      
      // Setup request body - missing required fields
      req.body = {
        email: 'test@example.com'
        // name is missing, which should trigger validation error
      };
      
      // Execute
      await contactController.createContact(req, res);
      
      // Assert - should return 400 Bad Request, not 500 Server Error
      expect(Contact).toHaveBeenCalled();
      expect(mockContact.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('validation'),
          errors: expect.any(Object)
        })
      );
    });
  });
  
  describe('updateContact', () => {
    it('should update a contact successfully', async () => {
      // Setup
      const mockContact = {
        _id: req.params.id,
        name: 'Original Name',
        user: req.user._id,
        save: jest.fn().mockResolvedValue({
          _id: req.params.id,
          name: 'Updated Name',
          user: req.user._id
        })
      };
      
      Contact.findOne = jest.fn().mockResolvedValue(mockContact);
      
      // Setup request body
      req.body = {
        name: 'Updated Name'
      };
      
      // Execute
      await contactController.updateContact(req, res);
      
      // Assert
      expect(Contact.findOne).toHaveBeenCalledWith({
        _id: req.params.id,
        user: req.user._id
      });
      expect(mockContact.name).toBe('Updated Name');
      expect(mockContact.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
    
    it('should return 400 on validation error during update', async () => {
      // Setup
      const validationError = new mongoose.Error.ValidationError();
      validationError.errors = {
        temperature: new mongoose.Error.ValidatorError({ message: 'Invalid temperature value' })
      };
      
      const mockContact = {
        _id: req.params.id,
        name: 'Original Name',
        user: req.user._id,
        save: jest.fn().mockRejectedValue(validationError)
      };
      
      Contact.findOne = jest.fn().mockResolvedValue(mockContact);
      
      // Setup request body with invalid temperature
      req.body = {
        temperature: 'invalid-value' // Should be hot, warm, or cold
      };
      
      // Execute
      await contactController.updateContact(req, res);
      
      // Assert - should return 400 Bad Request, not 500 Server Error
      expect(Contact.findOne).toHaveBeenCalled();
      expect(mockContact.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('validation'),
          errors: expect.any(Object)
        })
      );
    });
  });
});