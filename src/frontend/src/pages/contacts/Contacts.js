import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import api from '../../services/api';
import ContactCard from '../../components/chatbot/ContactCard';

const ContactsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const AddButton = styled(Link)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  svg {
    margin-right: 8px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
`;

const SearchInput = styled.div`
  flex: 1;
  position: relative;

  input {
    width: 100%;
    padding: 8px 16px 8px 36px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
  }
`;

const FilterDropdown = styled.select`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  cursor: pointer;

  svg {
    margin-right: 8px;
  }
`;

const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const NoContacts = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--text-light);
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [temperatureFilter, setTemperatureFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (temperatureFilter) params.append('temperature', temperatureFilter);
      params.append('sort', 'updatedAt');
      params.append('order', sortOrder);
      params.append('page', currentPage);
      params.append('limit', 10);

      const response = await api.get(`/api/contacts?${params.toString()}`);
      setContacts(response.data.contacts);
      setTotalPages(Math.ceil(response.data.total / 10));
      setError(null);
    } catch (err) {
      setError('Failed to load contacts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [searchTerm, temperatureFilter, sortOrder, currentPage]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTemperatureFilter = (e) => {
    setTemperatureFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ContactsContainer>
      <Header>
        <Title>Contacts</Title>
        <AddButton to="/contacts/add">
          <FaPlus /> Add Contact
        </AddButton>
      </Header>

      <FilterBar>
        <SearchInput>
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search contacts..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchInput>
        <FilterDropdown 
          value={temperatureFilter} 
          onChange={handleTemperatureFilter}
        >
          <option value="">All Temperatures</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
        </FilterDropdown>
        <SortButton onClick={toggleSortOrder}>
          {sortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
          {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
        </SortButton>
      </FilterBar>

      {loading ? (
        <div>Loading contacts...</div>
      ) : error ? (
        <div>{error}</div>
      ) : contacts.length === 0 ? (
        <NoContacts>
          <p>No contacts found. Add your first contact to get started!</p>
        </NoContacts>
      ) : (
        <ContactsList>
          {contacts.map(contact => (
            <ContactCard key={contact._id} contact={contact} />
          ))}
        </ContactsList>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PageButton 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PageButton>
          
          {[...Array(totalPages).keys()].map(page => (
            <PageButton
              key={page + 1}
              active={currentPage === page + 1}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </PageButton>
          ))}
          
          <PageButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PageButton>
        </Pagination>
      )}
    </ContactsContainer>
  );
};

export default Contacts;