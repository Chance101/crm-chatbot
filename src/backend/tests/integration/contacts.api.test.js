const mongoose = require('mongoose');
const Contact = require('../../models/Contact');
const User = require('../../models/User');

// Use the global app and request objects set in integration-setup.js
// and global.testUserId and global.authToken for authenticated requests

describe('Contacts API', () => {
  
  beforeEach(async () => {
    // Clear the contacts collection before each test
    await Contact.deleteMany({});
  });
  
  describe('GET /api/contacts', () => {
    it('should get all contacts for the authenticated user', async () => {
      // Create a few test contacts
      await Contact.create([
        { 
          user: global.testUserId, 
          name: 'John Doe',
          team: 'Engineering',
          temperature: 'warm' 
        },
        { 
          user: global.testUserId, 
          name: 'Jane Smith',
          team: 'Marketing',
          temperature: 'hot' 
        },
        { 
          user: new mongoose.Types.ObjectId(), // Different user
          name: 'Other User Contact',
          team: 'Sales' 
        }
      ]);
      
      const response = await global.request(global.app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${global.authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2); // Should only return the auth user's contacts
      expect(response.body[0].name).toBeDefined();
      expect(response.body.some(c => c.name === 'John Doe')).toBe(true);
      expect(response.body.some(c => c.name === 'Jane Smith')).toBe(true);
      expect(response.body.some(c => c.name === 'Other User Contact')).toBe(false);
    });
    
    it('should return 401 without auth token', async () => {
      const response = await global.request(global.app)
        .get('/api/contacts');
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('GET /api/contacts/:id', () => {
    it('should get a specific contact by id', async () => {
      // Create a test contact
      const contact = await Contact.create({ 
        user: global.testUserId, 
        name: 'John Doe',
        team: 'Engineering',
        temperature: 'warm' 
      });
      
      const response = await global.request(global.app)
        .get(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${global.authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('John Doe');
      expect(response.body.team).toBe('Engineering');
      expect(response.body.temperature).toBe('warm');
    });
    
    it('should return 404 for a non-existent contact', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await global.request(global.app)
        .get(`/api/contacts/${nonExistentId}`)
        .set('Authorization', `Bearer ${global.authToken}`);
      
      expect(response.status).toBe(404);
    });
    
    it('should not allow access to another user\'s contact', async () => {
      // Create a contact for a different user
      const otherContact = await Contact.create({ 
        user: new mongoose.Types.ObjectId(), 
        name: 'Other User Contact',
        team: 'Sales' 
      });
      
      const response = await global.request(global.app)
        .get(`/api/contacts/${otherContact._id}`)
        .set('Authorization', `Bearer ${global.authToken}`);
      
      expect(response.status).toBe(404); // Should return 404 not 403 for security
    });
  });
  
  describe('POST /api/contacts', () => {
    it('should create a new contact', async () => {
      const newContact = {
        name: 'New Test Contact',
        team: 'Product',
        role: 'Product Manager',
        currentCompany: 'Acme Inc',
        email: 'test@example.com',
        temperature: 'cold'
      };
      
      const response = await global.request(global.app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${global.authToken}`)
        .send(newContact);
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newContact.name);
      expect(response.body.team).toBe(newContact.team);
      expect(response.body.user).toBeDefined();
      expect(response.body._id).toBeDefined();
      
      // Verify it's in the database
      const savedContact = await Contact.findById(response.body._id);
      expect(savedContact).not.toBeNull();
      expect(savedContact.name).toBe(newContact.name);
      expect(savedContact.user.toString()).toBe(global.testUserId.toString());
    });
    
    it('should return validation errors for invalid data', async () => {
      // Missing required name field
      const invalidContact = {
        team: 'Product',
        role: 'Product Manager'
      };
      
      const response = await global.request(global.app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${global.authToken}`)
        .send(invalidContact);
      
      expect(response.status).toBe(500); // Should ideally be 400 Bad Request
      expect(response.body.error).toBeDefined();
    });
  });
  
  describe('PUT /api/contacts/:id', () => {
    it('should update a contact', async () => {
      // Create a test contact
      const contact = await Contact.create({ 
        user: global.testUserId, 
        name: 'Update Test',
        team: 'Engineering',
        temperature: 'cold' 
      });
      
      const updateData = {
        name: 'Updated Name',
        team: 'Design',
        temperature: 'hot'
      };
      
      const response = await global.request(global.app)
        .put(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${global.authToken}`)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.team).toBe(updateData.team);
      expect(response.body.temperature).toBe(updateData.temperature);
      
      // Verify it's updated in the database
      const updatedContact = await Contact.findById(contact._id);
      expect(updatedContact.name).toBe(updateData.name);
      expect(updatedContact.temperature).toBe(updateData.temperature);
    });
    
    it('should not update another user\'s contact', async () => {
      // Create a contact for a different user
      const otherContact = await Contact.create({ 
        user: new mongoose.Types.ObjectId(), 
        name: 'Other User Contact',
        team: 'Sales' 
      });
      
      const updateData = {
        name: 'Hacked Name'
      };
      
      const response = await global.request(global.app)
        .put(`/api/contacts/${otherContact._id}`)
        .set('Authorization', `Bearer ${global.authToken}`)
        .send(updateData);
      
      expect(response.status).toBe(404); // Should return 404 not 403 for security
      
      // Verify it wasn't updated
      const stillOriginal = await Contact.findById(otherContact._id);
      expect(stillOriginal.name).toBe('Other User Contact');
    });
  });
  
  describe('DELETE /api/contacts/:id', () => {
    it('should delete a contact', async () => {
      // Create a test contact
      const contact = await Contact.create({ 
        user: global.testUserId, 
        name: 'Delete Test',
        team: 'Engineering'
      });
      
      const response = await global.request(global.app)
        .delete(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${global.authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
      
      // Verify it's gone from the database
      const deletedContact = await Contact.findById(contact._id);
      expect(deletedContact).toBeNull();
    });
    
    it('should not delete another user\'s contact', async () => {
      // Create a contact for a different user
      const otherContact = await Contact.create({ 
        user: new mongoose.Types.ObjectId(), 
        name: 'Other User Contact',
        team: 'Sales' 
      });
      
      const response = await global.request(global.app)
        .delete(`/api/contacts/${otherContact._id}`)
        .set('Authorization', `Bearer ${global.authToken}`);
      
      expect(response.status).toBe(404); // Should return 404 not 403 for security
      
      // Verify it wasn't deleted
      const stillExists = await Contact.findById(otherContact._id);
      expect(stillExists).not.toBeNull();
    });
  });
});