const mongoose = require('mongoose');
const Contact = require('../../models/Contact');
const User = require('../../models/User');

describe('Contact Model', () => {
  let testUser;
  
  beforeAll(async () => {
    // Create a test user for contact associations
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();
  });
  
  it('should create a valid contact', async () => {
    const contactData = {
      user: testUser._id,
      name: 'John Doe',
      team: 'Engineering',
      role: 'Senior Developer',
      currentCompany: 'Tech Corp',
      email: 'john@example.com',
      phone: '555-123-4567',
      temperature: 'warm'
    };
    
    const contact = new Contact(contactData);
    const savedContact = await contact.save();
    
    expect(savedContact._id).toBeDefined();
    expect(savedContact.name).toBe(contactData.name);
    expect(savedContact.team).toBe(contactData.team);
    expect(savedContact.role).toBe(contactData.role);
    expect(savedContact.temperature).toBe(contactData.temperature);
    expect(savedContact.createdAt).toBeDefined();
    expect(savedContact.updatedAt).toBeDefined();
  });
  
  it('should fail validation without required fields', async () => {
    const invalidContact = new Contact({
      // Missing required user field
      name: 'Invalid Contact'
    });
    
    let error;
    try {
      await invalidContact.validate();
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.user).toBeDefined();
  });
  
  it('should require a name field', async () => {
    const contactWithoutName = new Contact({
      user: testUser._id
      // Missing name field
    });
    
    let error;
    try {
      await contactWithoutName.validate();
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.name.message).toBe('Contact name is required');
  });
  
  it('should correctly calculate days since last contacted', async () => {
    // Create a contact with last contacted date 5 days ago
    const lastContactedDate = new Date();
    lastContactedDate.setDate(lastContactedDate.getDate() - 5);
    
    const contact = new Contact({
      user: testUser._id,
      name: 'Contact With Last Contacted',
      lastContactedDate
    });
    
    await contact.save();
    
    // The virtual should return close to 5 days (may be off by a few milliseconds in the test)
    expect(contact.daysSinceLastContacted).toBeGreaterThanOrEqual(5);
    expect(contact.daysSinceLastContacted).toBeLessThan(6);
  });
  
  it('should return null for daysSinceLastContacted if no date exists', async () => {
    const contact = new Contact({
      user: testUser._id,
      name: 'Contact Without Last Contacted Date'
    });
    
    await contact.save();
    
    expect(contact.daysSinceLastContacted).toBeNull();
  });
  
  it('should enforce temperature enum values', async () => {
    const contactWithInvalidTemp = new Contact({
      user: testUser._id,
      name: 'Invalid Temperature Contact',
      temperature: 'lukewarm' // Not in the enum
    });
    
    let error;
    try {
      await contactWithInvalidTemp.validate();
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.temperature).toBeDefined();
  });
  
  it('should allow adding communications to a contact', async () => {
    const contact = new Contact({
      user: testUser._id,
      name: 'Contact With Communications'
    });
    
    // Add communications
    contact.communications.push({
      type: 'email',
      content: 'Initial outreach',
      notes: 'Introduced product features'
    });
    
    contact.communications.push({
      type: 'phone',
      content: 'Follow-up call',
      notes: 'Discussed pricing'
    });
    
    await contact.save();
    
    expect(contact.communications.length).toBe(2);
    expect(contact.communications[0].type).toBe('email');
    expect(contact.communications[1].type).toBe('phone');
  });
});