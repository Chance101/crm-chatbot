import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReminderCard from './ReminderCard';
import { renderWithProviders, mockReminder } from '../../tests/testUtils';

describe('ReminderCard', () => {
  it('renders reminder information correctly', () => {
    renderWithProviders(<ReminderCard reminder={mockReminder} />);
    
    // Check due date is displayed
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(mockReminder.dueDate));
    
    expect(screen.getByText(`Due: ${formattedDate}`)).toBeInTheDocument();
    
    // Check reminder description
    expect(screen.getByText(mockReminder.description)).toBeInTheDocument();
    
    // Check contact info
    expect(screen.getByText(`${mockReminder.contact.name} - ${mockReminder.contact.role}`)).toBeInTheDocument();
  });
  
  it('shows pending status for active reminders', () => {
    renderWithProviders(<ReminderCard reminder={mockReminder} />);
    
    // Check that status is pending
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
  
  it('shows completed status for completed reminders', () => {
    const completedReminder = { ...mockReminder, completed: true };
    renderWithProviders(<ReminderCard reminder={completedReminder} />);
    
    // Check that status is completed
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
  
  it('shows overdue status for past due reminders', () => {
    const overdueDueDate = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
    const overdueReminder = { ...mockReminder, dueDate: overdueDueDate };
    renderWithProviders(<ReminderCard reminder={overdueReminder} />);
    
    // Check that status is overdue
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });
  
  it('links to the correct contact detail page', () => {
    renderWithProviders(<ReminderCard reminder={mockReminder} />);
    
    // Contact info should be a link to the contact detail page
    const contactLink = screen.getByRole('link');
    expect(contactLink).toHaveAttribute('href', `/contacts/${mockReminder.contact._id}`);
  });
  
  it('handles reminder without contact gracefully', () => {
    const reminderWithoutContact = { ...mockReminder, contact: null };
    renderWithProviders(<ReminderCard reminder={reminderWithoutContact} />);
    
    // There should be no link to a contact
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});