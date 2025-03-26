import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaBell, FaUsers, FaThermometerHalf, FaClock, FaChartPie } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const WelcomeSection = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px var(--shadow-color);
  
  h1 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 24px;
  }
  
  p {
    color: var(--text-light);
    margin-bottom: 20px;
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px var(--shadow-color);
  display: flex;
  flex-direction: column;
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    
    h3 {
      margin: 0;
      font-size: 16px;
      color: var(--text-light);
      font-weight: 500;
    }
    
    .icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: var(--background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-color);
    }
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .stat-description {
    color: var(--text-light);
    font-size: 14px;
  }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px var(--shadow-color);
  
  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    color: var(--text-color);
    text-align: center;
  }
`;

const RecentActivity = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px var(--shadow-color);
  
  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    color: var(--text-color);
  }
  
  .empty-state {
    text-align: center;
    padding: 30px;
    color: var(--text-light);
  }
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 15px;
  
  &:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--background-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
  }
  
  .activity-content {
    flex: 1;
    
    .activity-title {
      font-weight: 500;
      margin-bottom: 5px;
      
      a {
        color: var(--primary-color);
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    .activity-date {
      font-size: 14px;
      color: var(--text-light);
    }
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalContacts: 0,
    upcomingReminders: 0,
    coldContacts: 0,
    hotContacts: 0
  });
  const [temperatureData, setTemperatureData] = useState({
    labels: ['Cold', 'Warm', 'Hot'],
    data: [0, 0, 0]
  });
  const [teamData, setTeamData] = useState({
    labels: [],
    data: []
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch all this data from your backend
        // For now, we'll simulate it with mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setStats({
          totalContacts: 48,
          upcomingReminders: 5,
          coldContacts: 12,
          hotContacts: 15
        });
        
        setTemperatureData({
          labels: ['Cold', 'Warm', 'Hot'],
          data: [12, 21, 15]
        });
        
        setTeamData({
          labels: ['Marketing', 'Sales', 'Engineering', 'Finance', 'HR'],
          data: [10, 15, 7, 5, 3]
        });
        
        setRecentActivity([
          {
            id: 1,
            type: 'contact',
            title: 'Added new contact: John Smith',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            id: 2,
            type: 'reminder',
            title: 'Set reminder to contact Sarah Johnson',
            date: new Date(Date.now() - 5 * 60 * 60 * 1000)
          },
          {
            id: 3,
            type: 'communication',
            title: 'Logged call with Mike Williams',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          {
            id: 4,
            type: 'pdf',
            title: 'Uploaded resume: Alex Brown.pdf',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Format date for activity list
  const formatActivityDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };
  
  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'contact':
        return <FaUserPlus />;
      case 'reminder':
        return <FaBell />;
      case 'communication':
        return <FaUsers />;
      case 'pdf':
        return <FaChartPie />;
      default:
        return <FaUsers />;
    }
  };
  
  // Chart data
  const temperatureChartData = {
    labels: temperatureData.labels,
    datasets: [
      {
        data: temperatureData.data,
        backgroundColor: [
          'rgba(52, 152, 219, 0.6)',
          'rgba(243, 156, 18, 0.6)',
          'rgba(231, 76, 60, 0.6)'
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(243, 156, 18, 1)',
          'rgba(231, 76, 60, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const teamChartData = {
    labels: teamData.labels,
    datasets: [
      {
        label: 'Contacts by Team',
        data: teamData.data,
        backgroundColor: 'rgba(74, 111, 165, 0.6)',
        borderColor: 'rgba(74, 111, 165, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <DashboardContainer>
      <WelcomeSection>
        <h1>Welcome back, {user?.name || 'User'}!</h1>
        <p>Here's what's happening with your contacts today</p>
        
        <QuickActions>
          <ActionButton to="/contacts/add">
            <FaUserPlus /> Add Contact
          </ActionButton>
          <ActionButton to="/reminders">
            <FaBell /> View Reminders
          </ActionButton>
        </QuickActions>
      </WelcomeSection>
      
      <StatsGrid>
        <StatCard>
          <div className="stat-header">
            <h3>Total Contacts</h3>
            <div className="icon">
              <FaUsers />
            </div>
          </div>
          <div className="stat-value">{stats.totalContacts}</div>
          <div className="stat-description">Your network is growing!</div>
        </StatCard>
        
        <StatCard>
          <div className="stat-header">
            <h3>Upcoming Reminders</h3>
            <div className="icon">
              <FaClock />
            </div>
          </div>
          <div className="stat-value">{stats.upcomingReminders}</div>
          <div className="stat-description">Due in the next 7 days</div>
        </StatCard>
        
        <StatCard>
          <div className="stat-header">
            <h3>Cold Contacts</h3>
            <div className="icon">
              <FaThermometerHalf />
            </div>
          </div>
          <div className="stat-value">{stats.coldContacts}</div>
          <div className="stat-description">No engagement in 30+ days</div>
        </StatCard>
        
        <StatCard>
          <div className="stat-header">
            <h3>Hot Contacts</h3>
            <div className="icon">
              <FaThermometerHalf />
            </div>
          </div>
          <div className="stat-value">{stats.hotContacts}</div>
          <div className="stat-description">Active engagement</div>
        </StatCard>
      </StatsGrid>
      
      <ChartsSection>
        <ChartCard>
          <h3>Contact Temperature</h3>
          <Pie data={temperatureChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </ChartCard>
        
        <ChartCard>
          <h3>Contacts by Team</h3>
          <Bar 
            data={teamChartData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: true,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0
                  }
                }
              }
            }} 
          />
        </ChartCard>
      </ChartsSection>
      
      <RecentActivity>
        <h3>Recent Activity</h3>
        
        {recentActivity.length === 0 ? (
          <div className="empty-state">
            No recent activity to show
          </div>
        ) : (
          <ActivityList>
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id}>
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-date">{formatActivityDate(activity.date)}</div>
                </div>
              </ActivityItem>
            ))}
          </ActivityList>
        )}
      </RecentActivity>
    </DashboardContainer>
  );
};

export default Dashboard;