import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactCard from './ContactCard';
import { renderWithProviders, mockContact } from '../../tests/testUtils';

describe('ContactCard', () => {
  it('renders contact information correctly', () => {
    renderWithProviders(<ContactCard contact={mockContact} />);
    
    // Check that name is displayed
    expect(screen.getByText(mockContact.name)).toBeInTheDocument();
    
    // Check role and company info
    expect(screen.getByText(`${mockContact.role} at ${mockContact.currentCompany}`)).toBeInTheDocument();
    
    // Check email and phone
    expect(screen.getByText(mockContact.email)).toBeInTheDocument();
    expect(screen.getByText(mockContact.phone)).toBeInTheDocument();
    
    // Check last contacted date
    expect(screen.getByText('3 days ago')).toBeInTheDocument();
  });
  
  it('displays first letter of name in avatar', () => {
    renderWithProviders(<ContactCard contact={mockContact} />);
    
    // The first letter 'J' should be in the avatar
    expect(screen.getByText('J')).toBeInTheDocument();
  });
  
  it('handles missing company name gracefully', () => {
    const contactWithoutCompany = { ...mockContact, currentCompany: null };
    renderWithProviders(<ContactCard contact={contactWithoutCompany} />);
    
    // Should only show role without "at Company"
    expect(screen.getByText(mockContact.role)).toBeInTheDocument();
  });
  
  it('handles null lastContactedDate correctly', () => {
    const contactWithoutDate = { ...mockContact, lastContactedDate: null };
    renderWithProviders(<ContactCard contact={contactWithoutDate} />);
    
    // Should show "Never contacted"
    expect(screen.getByText('Never contacted')).toBeInTheDocument();
  });

  it('renders with correct link to contact detail page', () => {
    renderWithProviders(<ContactCard contact={mockContact} />);
    
    // Card should be a link to the contact detail page
    const cardLink = screen.getByRole('link');
    expect(cardLink).toHaveAttribute('href', `/contacts/${mockContact._id}`);
  });
});