import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaUser, FaEnvelope, FaLock, FaSun, FaMoon } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  padding: 1.5rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-light);
  }
`;

const ProfileCard = styled.div`
  background-color: var(--background-light);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow-color);
  padding: 2rem;
  max-width: 600px;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
`;

const UserInfo = styled.div`
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-light);
    margin: 0;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--background-color);
    color: var(--text-color);
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.2);
    }
  }
`;

const IconInput = styled.div`
  position: relative;
  
  input {
    padding-left: 2.5rem;
  }
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-light);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
  }
`;

const SettingsSection = styled.div`
  margin-top: 2rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: ${props => props.theme === props.value ? 'var(--primary-color)' : 'var(--background-color)'};
    color: ${props => props.theme === props.value ? 'white' : 'var(--text-color)'};
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background-color: ${props => props.theme === props.value ? 'var(--primary-dark)' : 'var(--background-dark)'};
    }
  }
`;

const FormError = styled.p`
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Load user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any errors for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.newPassword && formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.newPassword && !formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required to set a new password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Create profile update data
      const profileData = {
        name: formData.name,
        email: formData.email
      };
      
      // Add password update if provided
      if (formData.newPassword) {
        profileData.currentPassword = formData.currentPassword;
        profileData.newPassword = formData.newPassword;
      }
      
      const success = await updateProfile(profileData);
      
      if (success) {
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };
  
  // Get first letter of name for avatar
  const getInitial = () => {
    return user && user.name ? user.name.charAt(0).toUpperCase() : 'U';
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <h1>Profile Settings</h1>
        <p>Update your personal information and settings</p>
      </PageHeader>
      
      <ProfileCard>
        <AvatarSection>
          <Avatar>{getInitial()}</Avatar>
          <UserInfo>
            <h2>{user?.name || 'User'}</h2>
            <p>{user?.email || 'email@example.com'}</p>
          </UserInfo>
        </AvatarSection>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="name">Full Name</label>
            <IconInput>
              <FaUser />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </IconInput>
            {errors.name && <FormError>{errors.name}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="email">Email Address</label>
            <IconInput>
              <FaEnvelope />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
              />
            </IconInput>
            {errors.email && <FormError>{errors.email}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="currentPassword">Current Password</label>
            <IconInput>
              <FaLock />
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Required to change password"
              />
            </IconInput>
            {errors.currentPassword && <FormError>{errors.currentPassword}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="newPassword">New Password</label>
            <IconInput>
              <FaLock />
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </IconInput>
            {errors.newPassword && <FormError>{errors.newPassword}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <IconInput>
              <FaLock />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
              />
            </IconInput>
            {errors.confirmPassword && <FormError>{errors.confirmPassword}</FormError>}
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
        
        <SettingsSection>
          <h3>Display Settings</h3>
          
          <ThemeToggle theme={theme} value="light">
            <button type="button" onClick={() => handleThemeChange('light')}>
              <FaSun /> Light Mode
            </button>
            <button type="button" onClick={() => handleThemeChange('dark')}>
              <FaMoon /> Dark Mode
            </button>
          </ThemeToggle>
        </SettingsSection>
      </ProfileCard>
    </PageContainer>
  );
};

export default Profile;