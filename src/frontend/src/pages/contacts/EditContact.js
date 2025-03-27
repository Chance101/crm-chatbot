import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaPlus, FaTimes } from 'react-icons/fa';
import api from '../../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: var(--text-light);
  cursor: pointer;
  margin-right: 15px;
  
  &:hover {
    color: var(--text-color);
  }
  
  svg {
    margin-right: 5px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const FormContainer = styled.form`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 1px 3px var(--shadow-color);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const FullWidthGroup = styled(FormGroup)`
  grid-column: 1 / -1;
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
  }
`;

const SectionDivider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 30px 0;
`;

const DynamicFieldArray = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DynamicField = styled.div`
  display: flex;
  gap: 10px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  position: relative;
`;

const RemoveFieldButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  
  &:hover {
    color: var(--danger-color);
  }
`;

const AddFieldButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  cursor: pointer;
  color: var(--text-light);
  margin-top: 10px;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  gap: 15px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  background-color: ${props => props.primary ? 'var(--primary-color)' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : 'var(--text-color)'};
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : '#e0e0e0'};
  }
`;

const RequiredMark = styled.span`
  color: var(--danger-color);
  margin-left: 3px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    team: '',
    role: '',
    timeInRole: '',
    timeAtCompany: '',
    currentCompany: '',
    previousCompanies: [],
    accomplishments: [],
    temperature: 'cold',
    overlapPoints: [],
    notes: '',
    email: '',
    phone: '',
    socialProfiles: {
      linkedin: '',
      twitter: '',
      github: '',
      other: ''
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await api.get(`/api/contacts/${id}`);
        const contact = response.data;
        
        // Format the date values in accomplishments
        const formattedAccomplishments = contact.accomplishments.map(acc => ({
          ...acc,
          date: acc.date ? new Date(acc.date).toISOString().split('T')[0] : ''
        }));
        
        setFormData({
          ...contact,
          accomplishments: formattedAccomplishments,
          // Ensure socialProfiles exists even if it's not in the response
          socialProfiles: contact.socialProfiles || {
            linkedin: '',
            twitter: '',
            github: '',
            other: ''
          }
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load contact. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContact();
  }, [id]);

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested social profiles
    if (name.startsWith('social_')) {
      const socialField = name.split('_')[1];
      setFormData({
        ...formData,
        socialProfiles: {
          ...formData.socialProfiles,
          [socialField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle previous companies
  const addPreviousCompany = () => {
    setFormData({
      ...formData,
      previousCompanies: [
        ...formData.previousCompanies,
        { name: '', role: '', duration: '' }
      ]
    });
  };

  const updatePreviousCompany = (index, field, value) => {
    const updatedCompanies = [...formData.previousCompanies];
    updatedCompanies[index] = {
      ...updatedCompanies[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      previousCompanies: updatedCompanies
    });
  };

  const removePreviousCompany = (index) => {
    const updatedCompanies = [...formData.previousCompanies];
    updatedCompanies.splice(index, 1);
    
    setFormData({
      ...formData,
      previousCompanies: updatedCompanies
    });
  };

  // Handle accomplishments
  const addAccomplishment = () => {
    setFormData({
      ...formData,
      accomplishments: [
        ...formData.accomplishments,
        { title: '', description: '', date: '' }
      ]
    });
  };

  const updateAccomplishment = (index, field, value) => {
    const updatedAccomplishments = [...formData.accomplishments];
    updatedAccomplishments[index] = {
      ...updatedAccomplishments[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      accomplishments: updatedAccomplishments
    });
  };

  const removeAccomplishment = (index) => {
    const updatedAccomplishments = [...formData.accomplishments];
    updatedAccomplishments.splice(index, 1);
    
    setFormData({
      ...formData,
      accomplishments: updatedAccomplishments
    });
  };

  // Handle overlap points
  const addOverlapPoint = () => {
    setFormData({
      ...formData,
      overlapPoints: [
        ...formData.overlapPoints,
        { category: '', description: '' }
      ]
    });
  };

  const updateOverlapPoint = (index, field, value) => {
    const updatedOverlapPoints = [...formData.overlapPoints];
    updatedOverlapPoints[index] = {
      ...updatedOverlapPoints[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      overlapPoints: updatedOverlapPoints
    });
  };

  const removeOverlapPoint = (index) => {
    const updatedOverlapPoints = [...formData.overlapPoints];
    updatedOverlapPoints.splice(index, 1);
    
    setFormData({
      ...formData,
      overlapPoints: updatedOverlapPoints
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Clean up empty arrays to avoid database issues
      const dataToSubmit = { ...formData };
      
      // Convert string numbers to actual numbers
      if (dataToSubmit.timeInRole) {
        dataToSubmit.timeInRole = parseInt(dataToSubmit.timeInRole, 10);
      }
      
      if (dataToSubmit.timeAtCompany) {
        dataToSubmit.timeAtCompany = parseInt(dataToSubmit.timeAtCompany, 10);
      }
      
      // Convert duration strings to numbers in previous companies
      if (dataToSubmit.previousCompanies.length > 0) {
        dataToSubmit.previousCompanies = dataToSubmit.previousCompanies.map(company => ({
          ...company,
          duration: company.duration ? parseInt(company.duration, 10) : undefined
        }));
      }
      
      // Remove the _id field to avoid MongoDB errors
      delete dataToSubmit._id;
      delete dataToSubmit.__v;
      delete dataToSubmit.createdAt;
      delete dataToSubmit.updatedAt;
      delete dataToSubmit.daysSinceLastContacted;
      
      await api.put(`/api/contacts/${id}`, dataToSubmit);
      toast.success('Contact updated successfully');
      navigate(`/contacts/${id}`);
    } catch (err) {
      toast.error('Failed to update contact');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/contacts/${id}`);
  };

  if (loading) {
    return <LoadingSpinner>Loading contact data...</LoadingSpinner>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(`/contacts/${id}`)}>
          <FaArrowLeft /> Back to Contact
        </BackButton>
        <Title>Edit Contact</Title>
      </Header>

      <FormContainer onSubmit={handleSubmit}>
        <SectionTitle>Basic Information</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>Name<RequiredMark>*</RequiredMark></Label>
            <Input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input 
              type="email" 
              name="email" 
              value={formData.email || ''} 
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Phone</Label>
            <Input 
              type="text" 
              name="phone" 
              value={formData.phone || ''} 
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Current Company</Label>
            <Input 
              type="text" 
              name="currentCompany" 
              value={formData.currentCompany || ''} 
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Role</Label>
            <Input 
              type="text" 
              name="role" 
              value={formData.role || ''} 
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Team</Label>
            <Input 
              type="text" 
              name="team" 
              value={formData.team || ''} 
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Time in Role (months)</Label>
            <Input 
              type="number" 
              name="timeInRole" 
              value={formData.timeInRole || ''} 
              onChange={handleChange}
              min="0"
            />
          </FormGroup>
          <FormGroup>
            <Label>Time at Company (months)</Label>
            <Input 
              type="number" 
              name="timeAtCompany" 
              value={formData.timeAtCompany || ''} 
              onChange={handleChange}
              min="0"
            />
          </FormGroup>
          <FormGroup>
            <Label>Temperature</Label>
            <Select 
              name="temperature" 
              value={formData.temperature} 
              onChange={handleChange}
            >
              <option value="cold">Cold</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
            </Select>
          </FormGroup>
        </FormGrid>

        <SectionDivider />

        <SectionTitle>Social Profiles</SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>LinkedIn</Label>
            <Input 
              type="url" 
              name="social_linkedin" 
              value={formData.socialProfiles?.linkedin || ''} 
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </FormGroup>
          <FormGroup>
            <Label>Twitter</Label>
            <Input 
              type="url" 
              name="social_twitter" 
              value={formData.socialProfiles?.twitter || ''} 
              onChange={handleChange}
              placeholder="https://twitter.com/username"
            />
          </FormGroup>
          <FormGroup>
            <Label>GitHub</Label>
            <Input 
              type="url" 
              name="social_github" 
              value={formData.socialProfiles?.github || ''} 
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </FormGroup>
          <FormGroup>
            <Label>Other</Label>
            <Input 
              type="url" 
              name="social_other" 
              value={formData.socialProfiles?.other || ''} 
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </FormGroup>
        </FormGrid>

        <SectionDivider />

        <SectionTitle>Previous Companies</SectionTitle>
        <DynamicFieldArray>
          {formData.previousCompanies && formData.previousCompanies.map((company, index) => (
            <DynamicField key={index}>
              <FormGroup style={{ flex: 1 }}>
                <Label>Company Name</Label>
                <Input 
                  type="text" 
                  value={company.name || ''} 
                  onChange={(e) => updatePreviousCompany(index, 'name', e.target.value)}
                />
              </FormGroup>
              <FormGroup style={{ flex: 1 }}>
                <Label>Role</Label>
                <Input 
                  type="text" 
                  value={company.role || ''} 
                  onChange={(e) => updatePreviousCompany(index, 'role', e.target.value)}
                />
              </FormGroup>
              <FormGroup style={{ width: '150px' }}>
                <Label>Duration (months)</Label>
                <Input 
                  type="number" 
                  value={company.duration || ''} 
                  onChange={(e) => updatePreviousCompany(index, 'duration', e.target.value)}
                  min="0"
                />
              </FormGroup>
              <RemoveFieldButton 
                type="button"
                onClick={() => removePreviousCompany(index)}
              >
                <FaTimes />
              </RemoveFieldButton>
            </DynamicField>
          ))}
        </DynamicFieldArray>
        <AddFieldButton type="button" onClick={addPreviousCompany}>
          <FaPlus /> Add Previous Company
        </AddFieldButton>

        <SectionDivider />

        <SectionTitle>Accomplishments</SectionTitle>
        <DynamicFieldArray>
          {formData.accomplishments && formData.accomplishments.map((accomplishment, index) => (
            <DynamicField key={index}>
              <FormGroup style={{ flex: 1 }}>
                <Label>Title</Label>
                <Input 
                  type="text" 
                  value={accomplishment.title || ''} 
                  onChange={(e) => updateAccomplishment(index, 'title', e.target.value)}
                />
              </FormGroup>
              <FormGroup style={{ width: '150px' }}>
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={accomplishment.date || ''} 
                  onChange={(e) => updateAccomplishment(index, 'date', e.target.value)}
                />
              </FormGroup>
              <RemoveFieldButton 
                type="button"
                onClick={() => removeAccomplishment(index)}
              >
                <FaTimes />
              </RemoveFieldButton>
              <FullWidthGroup style={{ marginTop: '10px', marginBottom: '0' }}>
                <Label>Description</Label>
                <Textarea 
                  value={accomplishment.description || ''} 
                  onChange={(e) => updateAccomplishment(index, 'description', e.target.value)}
                  style={{ minHeight: '60px' }}
                />
              </FullWidthGroup>
            </DynamicField>
          ))}
        </DynamicFieldArray>
        <AddFieldButton type="button" onClick={addAccomplishment}>
          <FaPlus /> Add Accomplishment
        </AddFieldButton>

        <SectionDivider />

        <SectionTitle>Overlap Points</SectionTitle>
        <DynamicFieldArray>
          {formData.overlapPoints && formData.overlapPoints.map((point, index) => (
            <DynamicField key={index}>
              <FormGroup style={{ width: '200px' }}>
                <Label>Category</Label>
                <Input 
                  type="text" 
                  value={point.category || ''} 
                  onChange={(e) => updateOverlapPoint(index, 'category', e.target.value)}
                  placeholder="e.g. Interest, Background, Education"
                />
              </FormGroup>
              <FormGroup style={{ flex: 1 }}>
                <Label>Description</Label>
                <Input 
                  type="text" 
                  value={point.description || ''} 
                  onChange={(e) => updateOverlapPoint(index, 'description', e.target.value)}
                />
              </FormGroup>
              <RemoveFieldButton 
                type="button"
                onClick={() => removeOverlapPoint(index)}
              >
                <FaTimes />
              </RemoveFieldButton>
            </DynamicField>
          ))}
        </DynamicFieldArray>
        <AddFieldButton type="button" onClick={addOverlapPoint}>
          <FaPlus /> Add Overlap Point
        </AddFieldButton>

        <SectionDivider />

        <SectionTitle>Additional Notes</SectionTitle>
        <FormGroup>
          <Textarea 
            name="notes" 
            value={formData.notes || ''} 
            onChange={handleChange}
            placeholder="Add any additional notes or context about this contact..."
          />
        </FormGroup>

        <ActionButtons>
          <Button type="button" onClick={handleCancel}>Cancel</Button>
          <Button type="submit" primary disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </ActionButtons>
      </FormContainer>
    </Container>
  );
};

export default EditContact;