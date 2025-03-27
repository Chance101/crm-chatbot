import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { 
  FaPlus, FaCalendarAlt, FaListUl, FaFilter, 
  FaCheck, FaTimes, FaTrashAlt, FaClock, FaUser
} from 'react-icons/fa';
import api from '../../services/api';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Localizer for the calendar
const localizer = momentLocalizer(moment);

const RemindersContainer = styled.div`
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

const AddButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-dark);
  }

  svg {
    margin-right: 8px;
  }
`;

const ControlsBar = styled.div`
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const ViewButton = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  cursor: pointer;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : '#f0f0f0'};
  }
`;

const FilterDropdown = styled.select`
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
`;

const RemindersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ReminderItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px var(--shadow-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid ${props => {
    if (props.completed) return 'var(--success-color)';
    if (props.overdue) return 'var(--error-color)';
    if (props.priority === 'high') return 'var(--hot-temp)';
    if (props.priority === 'medium') return 'var(--warm-temp)';
    return 'var(--cold-temp)';
  }};
`;

const ReminderContent = styled.div`
  flex: 1;
`;

const ReminderTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 500;
`;

const ReminderDetail = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 3px;
  
  svg {
    margin-right: 5px;
    font-size: 12px;
  }
`;

const ReminderActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: ${props => {
    if (props.complete) return 'var(--success-color)';
    if (props.delete) return 'var(--error-color)';
    return '#f0f0f0';
  }};
  color: ${props => (props.complete || props.delete) ? 'white' : 'var(--text-color)'};
  border: none;
  border-radius: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => {
      if (props.complete) return 'var(--success-dark)';
      if (props.delete) return 'var(--error-dark)';
      return '#e0e0e0';
    }};
  }
`;

const CalendarContainer = styled.div`
  height: 600px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px var(--shadow-color);
  
  .rbc-calendar {
    font-family: inherit;
  }
  
  .rbc-event {
    background-color: var(--primary-color);
  }
  
  .rbc-event.completed {
    background-color: var(--success-color);
  }
  
  .rbc-event.overdue {
    background-color: var(--error-color);
  }
  
  .rbc-event.high-priority {
    background-color: var(--hot-temp);
  }
  
  .rbc-event.medium-priority {
    background-color: var(--warm-temp);
  }
  
  .rbc-event.low-priority {
    background-color: var(--cold-temp);
  }
`;

const NoReminders = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--text-light);
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Reminders = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    contact: '',
    dueDate: '',
    dueTime: '12:00',
    description: '',
    priority: 'medium'
  });
  const [error, setError] = useState(null);

  // Fetch reminders and contacts data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch reminders
        const remindersResponse = await api.get('/api/reminders');
        
        // Fetch contacts for dropdown
        const contactsResponse = await api.get('/api/contacts');
        
        setReminders(remindersResponse.data);
        setContacts(contactsResponse.data.contacts || contactsResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to load reminders. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Format for calendar events
  const calendarEvents = reminders.map(reminder => {
    const dueDate = new Date(reminder.dueDate);
    const isOverdue = !reminder.completed && dueDate < new Date();
    
    return {
      id: reminder._id,
      title: reminder.description,
      start: dueDate,
      end: new Date(dueDate.getTime() + 60 * 60 * 1000), // 1 hour duration
      allDay: false,
      resource: {
        ...reminder,
        isOverdue
      }
    };
  });

  // Filter reminders based on selected filter
  const filteredReminders = reminders.filter(reminder => {
    const dueDate = new Date(reminder.dueDate);
    const isOverdue = !reminder.completed && dueDate < new Date();
    
    switch (filter) {
      case 'completed':
        return reminder.completed;
      case 'pending':
        return !reminder.completed && !isOverdue;
      case 'overdue':
        return isOverdue;
      case 'today':
        const today = new Date();
        return dueDate.getDate() === today.getDate() &&
               dueDate.getMonth() === today.getMonth() &&
               dueDate.getFullYear() === today.getFullYear();
      case 'high':
        return reminder.priority === 'high';
      case 'medium':
        return reminder.priority === 'medium';
      case 'low':
        return reminder.priority === 'low';
      default:
        return true;
    }
  });

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Combine date and time
      const dateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
      
      const reminderData = {
        contact: formData.contact,
        dueDate: dateTime.toISOString(),
        description: formData.description,
        priority: formData.priority
      };
      
      const response = await api.post('/api/reminders', reminderData);
      
      // Add the new reminder to the list
      setReminders(prev => [...prev, response.data]);
      
      // Close the modal and reset form
      setShowModal(false);
      setFormData({
        contact: '',
        dueDate: '',
        dueTime: '12:00',
        description: '',
        priority: 'medium'
      });
      
      toast.success('Reminder created successfully');
    } catch (err) {
      toast.error('Failed to create reminder');
      console.error(err);
    }
  };

  // Handle complete reminder
  const handleCompleteReminder = async (id) => {
    try {
      await api.put(`/api/reminders/${id}/complete`);
      
      // Update the reminders list
      setReminders(prev => 
        prev.map(reminder => 
          reminder._id === id ? { ...reminder, completed: true } : reminder
        )
      );
      
      toast.success('Reminder marked as completed');
    } catch (err) {
      toast.error('Failed to update reminder');
      console.error(err);
    }
  };

  // Handle delete reminder
  const handleDeleteReminder = async (id) => {
    try {
      await api.delete(`/api/reminders/${id}`);
      
      // Remove reminder from the list
      setReminders(prev => prev.filter(reminder => reminder._id !== id));
      
      toast.success('Reminder deleted successfully');
    } catch (err) {
      toast.error('Failed to delete reminder');
      console.error(err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  // Custom event styles for the calendar
  const eventPropGetter = (event) => {
    const { completed, priority } = event.resource;
    const isOverdue = event.resource.isOverdue;
    
    let className = '';
    
    if (completed) {
      className = 'completed';
    } else if (isOverdue) {
      className = 'overdue';
    } else if (priority) {
      className = `${priority}-priority`;
    }
    
    return { className };
  };

  return (
    <RemindersContainer>
      <Header>
        <Title>Reminders</Title>
        <AddButton onClick={() => setShowModal(true)}>
          <FaPlus /> Add Reminder
        </AddButton>
      </Header>

      <ControlsBar>
        <ViewToggle>
          <ViewButton 
            active={viewMode === 'list'} 
            onClick={() => setViewMode('list')}
          >
            <FaListUl /> List
          </ViewButton>
          <ViewButton 
            active={viewMode === 'calendar'} 
            onClick={() => setViewMode('calendar')}
          >
            <FaCalendarAlt /> Calendar
          </ViewButton>
        </ViewToggle>
        
        <FilterDropdown 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Reminders</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </FilterDropdown>
      </ControlsBar>

      {loading ? (
        <LoadingSpinner>Loading reminders...</LoadingSpinner>
      ) : error ? (
        <div>{error}</div>
      ) : reminders.length === 0 ? (
        <NoReminders>
          <p>No reminders found. Add your first reminder to get started!</p>
        </NoReminders>
      ) : viewMode === 'list' ? (
        <RemindersList>
          {filteredReminders.map(reminder => {
            const dueDate = new Date(reminder.dueDate);
            const isOverdue = !reminder.completed && dueDate < new Date();
            
            return (
              <ReminderItem 
                key={reminder._id}
                completed={reminder.completed}
                overdue={isOverdue}
                priority={reminder.priority}
              >
                <ReminderContent>
                  <ReminderTitle>{reminder.description}</ReminderTitle>
                  <ReminderDetail>
                    <FaClock /> Due: {formatDate(reminder.dueDate)}
                  </ReminderDetail>
                  <ReminderDetail>
                    <FaUser /> Contact: {reminder.contact?.name || 'Unknown'}
                  </ReminderDetail>
                </ReminderContent>
                <ReminderActions>
                  {!reminder.completed && (
                    <ActionButton 
                      complete
                      onClick={() => handleCompleteReminder(reminder._id)}
                      title="Mark as completed"
                    >
                      <FaCheck />
                    </ActionButton>
                  )}
                  <ActionButton 
                    delete
                    onClick={() => handleDeleteReminder(reminder._id)}
                    title="Delete reminder"
                  >
                    <FaTrashAlt />
                  </ActionButton>
                </ReminderActions>
              </ReminderItem>
            );
          })}
        </RemindersList>
      ) : (
        <CalendarContainer>
          <Calendar
            localizer={localizer}
            events={filter === 'all' ? calendarEvents : calendarEvents.filter(event => {
              const { completed, priority } = event.resource;
              const isOverdue = event.resource.isOverdue;
              const dueDate = new Date(event.start);
              const today = new Date();
              const isTodayEvent = dueDate.getDate() === today.getDate() &&
                                 dueDate.getMonth() === today.getMonth() &&
                                 dueDate.getFullYear() === today.getFullYear();
              
              switch (filter) {
                case 'completed':
                  return completed;
                case 'pending':
                  return !completed && !isOverdue;
                case 'overdue':
                  return isOverdue;
                case 'today':
                  return isTodayEvent;
                case 'high':
                  return priority === 'high';
                case 'medium':
                  return priority === 'medium';
                case 'low':
                  return priority === 'low';
                default:
                  return true;
              }
            })}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            views={['month', 'week', 'day']}
            eventPropGetter={eventPropGetter}
            onSelectEvent={(event) => {
              if (!event.resource.completed) {
                if (window.confirm('Mark this reminder as completed?')) {
                  handleCompleteReminder(event.id);
                }
              }
            }}
            tooltipAccessor={(event) => {
              const contact = event.resource.contact?.name || 'No contact';
              const status = event.resource.completed ? 'Completed' : 
                            event.resource.isOverdue ? 'Overdue' : 'Pending';
              return `${event.title}\nDue: ${formatDate(event.start)}\nContact: ${contact}\nStatus: ${status}\nPriority: ${event.resource.priority}`;
            }}
          />
        </CalendarContainer>
      )}

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Create Reminder</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Contact</Label>
                <Select 
                  name="contact" 
                  value={formData.contact}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a contact</option>
                  {contacts.map(contact => (
                    <option key={contact._id} value={contact._id}>
                      {contact.name} {contact.currentCompany ? `(${contact.currentCompany})` : ''}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Due Date</Label>
                <Input 
                  type="date" 
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Due Time</Label>
                <Input 
                  type="time" 
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What needs to be done?"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Priority</Label>
                <Select 
                  name="priority" 
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormGroup>
              <ButtonGroup>
                <Button type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" primary>Create</Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </RemindersContainer>
  );
};

export default Reminders;