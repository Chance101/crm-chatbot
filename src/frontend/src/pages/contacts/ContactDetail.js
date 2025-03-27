import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { 
  FaUser, FaBuilding, FaBriefcase, FaCalendarAlt, FaPhone, 
  FaEnvelope, FaLinkedin, FaTwitter, FaGithub, FaLink,
  FaEdit, FaTrashAlt, FaPlus, FaThermometerHalf, FaHistory
} from 'react-icons/fa';
import api from '../../services/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${({ temperature }) => {
    if (temperature === 'hot') return 'var(--hot-temp)';
    if (temperature === 'warm') return 'var(--warm-temp)';
    return 'var(--cold-temp)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 24px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const Subtitle = styled.div`
  color: var(--text-light);
  display: flex;
  align-items: center;
  margin-top: 5px;
  
  svg {
    margin-right: 5px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled(Link)`
  padding: 8px;
  border-radius: 4px;
  background-color: ${props => props.danger ? 'var(--danger-color)' : 'var(--primary-color)'};
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: ${props => props.danger ? 'var(--danger-dark)' : 'var(--primary-dark)'};
  }
`;

const DeleteButton = styled.button`
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: var(--danger-color);
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: var(--danger-dark);
  }
`;

const Section = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px var(--shadow-color);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 10px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 16px;
`;

const TemperatureSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const TemperatureButton = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background-color: ${props => {
    if (props.active) {
      if (props.temp === 'hot') return 'var(--hot-temp)';
      if (props.temp === 'warm') return 'var(--warm-temp)';
      return 'var(--cold-temp)';
    }
    return '#f0f0f0';
  }};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => {
      if (props.temp === 'hot') return 'var(--hot-temp)';
      if (props.temp === 'warm') return 'var(--warm-temp)';
      return 'var(--cold-temp)';
    }};
    color: white;
  }
`;

const CommunicationsList = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CommunicationItem = styled.div`
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border-left: 4px solid var(--primary-color);
`;

const CommunicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CommunicationType = styled.span`
  font-weight: 500;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
`;

const CommunicationDate = styled.span`
  color: var(--text-light);
  font-size: 14px;
`;

const CommunicationContent = styled.div`
  margin-bottom: 10px;
`;

const CommunicationNotes = styled.div`
  font-style: italic;
  color: var(--text-light);
  font-size: 14px;
`;

const AddCommunicationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  padding: 8px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  cursor: pointer;
  color: var(--text-light);
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 500px;
  max-width: 90%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  background-color: ${props => props.primary ? 'var(--primary-color)' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : 'var(--text-color)'};
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : '#e0e0e0'};
  }
`;

const PreviousCompaniesSection = styled.div`
  margin-top: 15px;
`;

const PreviousCompanyItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CompanyIcon = styled.div`
  margin-right: 10px;
  color: var(--text-light);
`;

const CompanyInfo = styled.div``;

const CompanyName = styled.div`
  font-weight: 500;
`;

const CompanyRole = styled.div`
  font-size: 14px;
  color: var(--text-light);
`;

const AccomplishmentsList = styled.div`
  margin-top: 15px;
`;

const AccomplishmentItem = styled.div`
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const AccomplishmentTitle = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const AccomplishmentDate = styled.div`
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 5px;
`;

const AccomplishmentDescription = styled.div`
  font-size: 14px;
`;

const OverlapPointsList = styled.div`
  margin-top: 15px;
`;

const OverlapItem = styled.div`
  background-color: #f0f0f0;
  border-radius: 16px;
  padding: 5px 12px;
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
  font-size: 14px;
`;

const NotesSection = styled.div`
  margin-top: 15px;
  white-space: pre-line;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: 'email',
    content: '',
    notes: ''
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/contacts/${id}`);
      setContact(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load contact details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [id]);

  const handleTemperatureChange = async (temperature) => {
    try {
      await api.patch(`/api/contacts/${id}`, { temperature });
      setContact({ ...contact, temperature });
      toast.success('Contact temperature updated');
    } catch (err) {
      toast.error('Failed to update contact temperature');
      console.error(err);
    }
  };

  const handleAddCommunication = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewCommunication({
      type: 'email',
      content: '',
      notes: ''
    });
  };

  const handleCommunicationChange = (e) => {
    const { name, value } = e.target;
    setNewCommunication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitCommunication = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        communications: [...(contact.communications || []), {
          type: newCommunication.type,
          content: newCommunication.content,
          notes: newCommunication.notes,
          date: new Date()
        }],
        lastContactedDate: new Date()
      };
      
      const response = await api.patch(`/api/contacts/${id}`, payload);
      setContact(response.data);
      closeModal();
      toast.success('Communication added successfully');
    } catch (err) {
      toast.error('Failed to add communication');
      console.error(err);
    }
  };

  const handleDeleteContact = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    try {
      await api.delete(`/api/contacts/${id}`);
      toast.success('Contact deleted successfully');
      navigate('/contacts');
    } catch (err) {
      toast.error('Failed to delete contact');
      console.error(err);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return <LoadingSpinner>Loading contact details...</LoadingSpinner>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!contact) {
    return <div>Contact not found</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get the first letter of the contact's name
  const firstLetter = contact.name ? contact.name.charAt(0).toUpperCase() : 'U';

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Avatar temperature={contact.temperature}>
            {firstLetter}
          </Avatar>
          <HeaderInfo>
            <Title>{contact.name}</Title>
            <Subtitle>
              <FaBuilding />
              {contact.role} {contact.currentCompany ? `at ${contact.currentCompany}` : ''}
            </Subtitle>
          </HeaderInfo>
        </HeaderLeft>
        <ActionButtons>
          <IconButton to={`/contacts/${id}/edit`}>
            <FaEdit /> Edit
          </IconButton>
          <DeleteButton onClick={handleDeleteContact}>
            <FaTrashAlt /> {confirmDelete ? 'Confirm Delete' : 'Delete'}
          </DeleteButton>
        </ActionButtons>
      </Header>

      <Section>
        <SectionTitle><FaUser />Contact Information</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Name</InfoLabel>
            <InfoValue>{contact.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Role</InfoLabel>
            <InfoValue>{contact.role || 'Not specified'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Current Company</InfoLabel>
            <InfoValue>{contact.currentCompany || 'Not specified'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Team</InfoLabel>
            <InfoValue>{contact.team || 'Not specified'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Time in Role</InfoLabel>
            <InfoValue>
              {contact.timeInRole ? `${contact.timeInRole} months` : 'Not specified'}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Time at Company</InfoLabel>
            <InfoValue>
              {contact.timeAtCompany ? `${contact.timeAtCompany} months` : 'Not specified'}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{contact.email || 'Not specified'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Phone</InfoLabel>
            <InfoValue>{contact.phone || 'Not specified'}</InfoValue>
          </InfoItem>
        </InfoGrid>
        
        {contact.socialProfiles && (
          <div style={{ marginTop: '20px' }}>
            <InfoLabel>Social Profiles</InfoLabel>
            <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
              {contact.socialProfiles.linkedin && (
                <a href={contact.socialProfiles.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin size={20} />
                </a>
              )}
              {contact.socialProfiles.twitter && (
                <a href={contact.socialProfiles.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter size={20} />
                </a>
              )}
              {contact.socialProfiles.github && (
                <a href={contact.socialProfiles.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub size={20} />
                </a>
              )}
              {contact.socialProfiles.other && (
                <a href={contact.socialProfiles.other} target="_blank" rel="noopener noreferrer">
                  <FaLink size={20} />
                </a>
              )}
            </div>
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle><FaThermometerHalf />Contact Temperature</SectionTitle>
        <div>
          <InfoLabel>Current Temperature</InfoLabel>
          <InfoValue style={{ 
            color: contact.temperature === 'hot' ? 'var(--hot-temp)' : 
                   contact.temperature === 'warm' ? 'var(--warm-temp)' : 
                   'var(--cold-temp)',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            {contact.temperature.charAt(0).toUpperCase() + contact.temperature.slice(1)}
          </InfoValue>
          
          <TemperatureSelector>
            <TemperatureButton 
              temp="cold"
              active={contact.temperature === 'cold'}
              onClick={() => handleTemperatureChange('cold')}
            >
              Cold
            </TemperatureButton>
            <TemperatureButton 
              temp="warm"
              active={contact.temperature === 'warm'}
              onClick={() => handleTemperatureChange('warm')}
            >
              Warm
            </TemperatureButton>
            <TemperatureButton 
              temp="hot"
              active={contact.temperature === 'hot'}
              onClick={() => handleTemperatureChange('hot')}
            >
              Hot
            </TemperatureButton>
          </TemperatureSelector>
        </div>
      </Section>

      {contact.previousCompanies && contact.previousCompanies.length > 0 && (
        <Section>
          <SectionTitle><FaBriefcase />Previous Companies</SectionTitle>
          <PreviousCompaniesSection>
            {contact.previousCompanies.map((company, index) => (
              <PreviousCompanyItem key={index}>
                <CompanyIcon>
                  <FaBuilding />
                </CompanyIcon>
                <CompanyInfo>
                  <CompanyName>{company.name}</CompanyName>
                  <CompanyRole>
                    {company.role}
                    {company.duration && ` • ${company.duration} months`}
                  </CompanyRole>
                </CompanyInfo>
              </PreviousCompanyItem>
            ))}
          </PreviousCompaniesSection>
        </Section>
      )}

      {contact.accomplishments && contact.accomplishments.length > 0 && (
        <Section>
          <SectionTitle><FaCalendarAlt />Accomplishments</SectionTitle>
          <AccomplishmentsList>
            {contact.accomplishments.map((accomplishment, index) => (
              <AccomplishmentItem key={index}>
                <AccomplishmentTitle>{accomplishment.title}</AccomplishmentTitle>
                {accomplishment.date && (
                  <AccomplishmentDate>{formatDate(accomplishment.date)}</AccomplishmentDate>
                )}
                <AccomplishmentDescription>{accomplishment.description}</AccomplishmentDescription>
              </AccomplishmentItem>
            ))}
          </AccomplishmentsList>
        </Section>
      )}

      {contact.overlapPoints && contact.overlapPoints.length > 0 && (
        <Section>
          <SectionTitle>Overlap Points</SectionTitle>
          <OverlapPointsList>
            {contact.overlapPoints.map((point, index) => (
              <OverlapItem key={index}>
                {point.category}: {point.description}
              </OverlapItem>
            ))}
          </OverlapPointsList>
        </Section>
      )}

      <Section>
        <SectionTitle><FaHistory />Communication History</SectionTitle>
        <div>
          <InfoItem>
            <InfoLabel>Last Contacted</InfoLabel>
            <InfoValue>
              {contact.lastContactedDate ? formatDate(contact.lastContactedDate) : 'Never'}
              {contact.daysSinceLastContacted && contact.daysSinceLastContacted > 0 && 
                ` (${contact.daysSinceLastContacted} days ago)`}
            </InfoValue>
          </InfoItem>

          {(!contact.communications || contact.communications.length === 0) ? (
            <div style={{ marginTop: '15px', color: 'var(--text-light)' }}>
              No communication history recorded.
            </div>
          ) : (
            <CommunicationsList>
              {[...contact.communications]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((comm, index) => (
                <CommunicationItem key={index}>
                  <CommunicationHeader>
                    <CommunicationType>
                      {comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}
                    </CommunicationType>
                    <CommunicationDate>{formatDate(comm.date)}</CommunicationDate>
                  </CommunicationHeader>
                  <CommunicationContent>{comm.content}</CommunicationContent>
                  {comm.notes && <CommunicationNotes>Note: {comm.notes}</CommunicationNotes>}
                </CommunicationItem>
              ))}
            </CommunicationsList>
          )}

          <AddCommunicationButton onClick={handleAddCommunication}>
            <FaPlus /> Add Communication
          </AddCommunicationButton>
        </div>
      </Section>

      {contact.notes && (
        <Section>
          <SectionTitle>Notes</SectionTitle>
          <NotesSection>{contact.notes}</NotesSection>
        </Section>
      )}

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Add Communication</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <Form onSubmit={submitCommunication}>
              <FormGroup>
                <Label>Type</Label>
                <Select 
                  name="type" 
                  value={newCommunication.type}
                  onChange={handleCommunicationChange}
                  required
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="meeting">Meeting</option>
                  <option value="social">Social</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Content</Label>
                <Textarea 
                  name="content"
                  value={newCommunication.content}
                  onChange={handleCommunicationChange}
                  placeholder="What was discussed?"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Notes (Optional)</Label>
                <Textarea 
                  name="notes"
                  value={newCommunication.notes}
                  onChange={handleCommunicationChange}
                  placeholder="Any additional notes..."
                />
              </FormGroup>
              <ButtonGroup>
                <Button type="button" onClick={closeModal}>Cancel</Button>
                <Button type="submit" primary>Add</Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ContactDetail;