import { mockContact, mockReminder } from '../testUtils';

// Mock API responses for tests
const mockApiResponses = {
  contacts: {
    getAll: [mockContact, { ...mockContact, _id: '234567890', name: 'Jane Smith' }],
    getById: mockContact,
    create: { ...mockContact, _id: '345678901' },
    update: { ...mockContact, name: 'John Doe Updated' },
    delete: { message: 'Contact deleted successfully' }
  },
  reminders: {
    getAll: [mockReminder, { ...mockReminder, _id: '876543210', description: 'Send proposal' }],
    getById: mockReminder,
    create: { ...mockReminder, _id: '765432109' },
    update: { ...mockReminder, description: 'Updated description' },
    delete: { message: 'Reminder deleted successfully' }
  },
  chatbot: {
    message: {
      type: 'bot',
      content: 'I am the chatbot. How can I help you?'
    }
  },
  auth: {
    login: {
      token: 'mock-jwt-token',
      user: {
        id: '123',
        name: 'Test User',
        email: 'test@example.com'
      }
    },
    register: {
      message: 'User registered successfully'
    }
  }
};

// Mock implementation of the API service
const mockApiService = {
  // Auth endpoints
  login: jest.fn().mockResolvedValue({ data: mockApiResponses.auth.login }),
  register: jest.fn().mockResolvedValue({ data: mockApiResponses.auth.register }),
  
  // Contacts endpoints
  getContacts: jest.fn().mockResolvedValue({ data: mockApiResponses.contacts.getAll }),
  getContact: jest.fn().mockResolvedValue({ data: mockApiResponses.contacts.getById }),
  createContact: jest.fn().mockResolvedValue({ data: mockApiResponses.contacts.create }),
  updateContact: jest.fn().mockResolvedValue({ data: mockApiResponses.contacts.update }),
  deleteContact: jest.fn().mockResolvedValue({ data: mockApiResponses.contacts.delete }),
  
  // Reminders endpoints
  getReminders: jest.fn().mockResolvedValue({ data: mockApiResponses.reminders.getAll }),
  getReminder: jest.fn().mockResolvedValue({ data: mockApiResponses.reminders.getById }),
  createReminder: jest.fn().mockResolvedValue({ data: mockApiResponses.reminders.create }),
  updateReminder: jest.fn().mockResolvedValue({ data: mockApiResponses.reminders.update }),
  deleteReminder: jest.fn().mockResolvedValue({ data: mockApiResponses.reminders.delete }),
  
  // Chatbot endpoints
  sendMessage: jest.fn().mockResolvedValue({ data: mockApiResponses.chatbot.message }),
  
  // Utility method to reset all mocks
  resetMocks: () => {
    Object.keys(mockApiService).forEach(key => {
      if (typeof mockApiService[key] === 'function' && mockApiService[key].mockReset) {
        mockApiService[key].mockReset();
      }
    });
  },
  
  // Utility to set custom mock responses
  setMockResponse: (endpoint, method, response) => {
    if (mockApiService[method]) {
      mockApiService[method].mockResolvedValueOnce({ data: response });
    }
  },
  
  // Utility to simulate errors
  setMockError: (endpoint, method, errorMsg = 'An error occurred', status = 500) => {
    if (mockApiService[method]) {
      const error = new Error(errorMsg);
      error.response = { status, data: { message: errorMsg } };
      mockApiService[method].mockRejectedValueOnce(error);
    }
  }
};

export default mockApiService;