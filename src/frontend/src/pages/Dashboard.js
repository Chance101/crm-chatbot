import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FaUserPlus, FaBell, FaUsers, FaThermometerHalf, FaClock, 
  FaChartPie, FaChartBar, FaChartLine, FaEnvelope, FaPhone,
  FaHandshake, FaMapMarkerAlt
} from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Bar, Pie, Line, Doughnut, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
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

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 10px var(--shadow-color);
  overflow: hidden;
`;

const TabNav = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
`;

const TabButton = styled.button`
  padding: 15px 20px;
  background-color: ${props => props.active ? 'var(--background-color)' : 'transparent'};
  border: none;
  border-bottom: 3px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-color)'};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: var(--background-color);
    color: var(--primary-color);
  }
`;

const TabContent = styled.div`
  padding: 20px;
`;

const ChartSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`;

const ChartLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  
  .color-box {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background-color: ${props => props.color};
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

const TimeframeButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
`;

const TimeframeButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : '#e0e0e0'};
  }
`;

const KPIRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

const KPICard = styled.div`
  flex: 1;
  min-width: 150px;
  background-color: var(--background-color);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  
  .kpi-value {
    font-size: 24px;
    font-weight: 600;
    color: ${props => props.highlighted ? 'var(--primary-color)' : 'var(--text-color)'};
  }
  
  .kpi-label {
    font-size: 14px;
    color: var(--text-light);
    margin-top: 5px;
  }
`;

const ReminderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
`;

const ReminderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background-color: var(--background-color);
  border-radius: 8px;
  border-left: 4px solid ${props => {
    if (props.priority === 'high') return 'var(--hot-temp)';
    if (props.priority === 'medium') return 'var(--warm-temp)';
    return 'var(--cold-temp)';
  }};
  
  .reminder-content {
    flex: 1;
    
    .reminder-title {
      font-weight: 500;
      margin-bottom: 3px;
    }
    
    .reminder-date {
      font-size: 13px;
      color: var(--text-light);
    }
  }
  
  .reminder-contact {
    font-size: 13px;
    background-color: var(--white);
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
  }
`;

const LoadingSkeleton = styled.div`
  height: ${props => props.height || '200px'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const CommunicationMetricCard = styled.div`
  display: flex;
  background-color: var(--background-color);
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
`;

const MetricIcon = styled.div`
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color || 'var(--primary-color)'};
  color: white;
`;

const MetricContent = styled.div`
  flex: 1;
  padding: 15px;
  
  .metric-title {
    font-size: 14px;
    color: var(--text-light);
    margin-bottom: 5px;
  }
  
  .metric-value {
    font-size: 22px;
    font-weight: 600;
  }
  
  .metric-change {
    font-size: 13px;
    color: ${props => props.positive ? 'var(--success-color)' : 'var(--error-color)'};
    display: flex;
    align-items: center;
    gap: 3px;
    margin-top: 3px;
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('temperature');
  const [temperatureTimeframe, setTemperatureTimeframe] = useState('month');
  const [communicationTimeframe, setCommunicationTimeframe] = useState('month');
  const [reminderTimeframe, setReminderTimeframe] = useState('week');
  
  const [stats, setStats] = useState({
    totalContacts: 0,
    upcomingReminders: 0,
    coldContacts: 0,
    hotContacts: 0
  });
  
  const [temperatureData, setTemperatureData] = useState({
    current: {
      labels: ['Cold', 'Warm', 'Hot'],
      data: [0, 0, 0]
    },
    byTeam: {
      labels: [],
      datasets: []
    },
    trend: {
      labels: [],
      datasets: []
    }
  });
  
  const [communicationData, setCommunicationData] = useState({
    frequency: {
      labels: [],
      datasets: []
    },
    byType: {
      labels: ['Email', 'Phone', 'Meeting', 'Social', 'Other'],
      data: [0, 0, 0, 0, 0]
    },
    responseRate: {
      rate: 0,
      trend: []
    },
    byTeam: {
      labels: [],
      datasets: []
    }
  });
  
  const [reminderData, setReminderData] = useState({
    upcoming: {
      labels: [],
      data: []
    },
    status: {
      labels: ['Completed', 'Pending', 'Overdue'],
      data: [0, 0, 0]
    },
    byContact: {
      labels: [],
      data: []
    }
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch this data from your backend
        // For now, we'll use more detailed mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock stats
        setStats({
          totalContacts: 48,
          upcomingReminders: 8,
          coldContacts: 12,
          hotContacts: 15
        });
        
        // Temperature Distribution Data
        setTemperatureData({
          current: {
            labels: ['Cold', 'Warm', 'Hot'],
            data: [12, 21, 15]
          },
          byTeam: {
            labels: ['Marketing', 'Sales', 'Engineering', 'Finance', 'HR'],
            datasets: [
              {
                label: 'Cold',
                data: [4, 3, 2, 2, 1],
                backgroundColor: 'rgba(52, 152, 219, 0.6)'
              },
              {
                label: 'Warm',
                data: [6, 8, 3, 2, 2],
                backgroundColor: 'rgba(243, 156, 18, 0.6)'
              },
              {
                label: 'Hot',
                data: [3, 7, 2, 1, 2],
                backgroundColor: 'rgba(231, 76, 60, 0.6)'
              }
            ]
          },
          trend: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Cold',
                data: [18, 16, 14, 13, 12, 12],
                borderColor: 'rgba(52, 152, 219, 1)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: 'Warm',
                data: [12, 14, 16, 18, 20, 21],
                borderColor: 'rgba(243, 156, 18, 1)',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: 'Hot',
                data: [8, 10, 12, 14, 15, 15],
                borderColor: 'rgba(231, 76, 60, 1)',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                tension: 0.4,
                fill: true
              }
            ]
          }
        });
        
        // Communication Analytics Data
        setCommunicationData({
          frequency: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                label: 'This Week',
                data: [8, 12, 9, 14, 10, 3, 1],
                backgroundColor: 'rgba(74, 111, 165, 0.6)',
                borderColor: 'rgba(74, 111, 165, 1)',
                borderWidth: 1
              },
              {
                label: 'Last Week',
                data: [7, 10, 8, 11, 9, 2, 0],
                backgroundColor: 'rgba(149, 165, 166, 0.6)',
                borderColor: 'rgba(149, 165, 166, 1)',
                borderWidth: 1
              }
            ]
          },
          byType: {
            labels: ['Email', 'Phone', 'Meeting', 'Social', 'Other'],
            data: [45, 28, 15, 8, 4]
          },
          responseRate: {
            rate: 72,
            trend: [65, 67, 70, 68, 72, 75]
          },
          byTeam: {
            labels: ['Marketing', 'Sales', 'Engineering', 'Finance', 'HR'],
            datasets: [
              {
                label: 'Number of Communications',
                data: [32, 48, 20, 15, 10],
                backgroundColor: [
                  'rgba(74, 111, 165, 0.6)',
                  'rgba(231, 76, 60, 0.6)',
                  'rgba(46, 204, 113, 0.6)',
                  'rgba(52, 152, 219, 0.6)',
                  'rgba(243, 156, 18, 0.6)'
                ],
                borderColor: [
                  'rgba(74, 111, 165, 1)',
                  'rgba(231, 76, 60, 1)',
                  'rgba(46, 204, 113, 1)',
                  'rgba(52, 152, 219, 1)',
                  'rgba(243, 156, 18, 1)'
                ],
                borderWidth: 1
              }
            ]
          }
        });
        
        // Reminder Analytics Data
        setReminderData({
          upcoming: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [2, 3, 1, 4, 2, 0, 0]
          },
          status: {
            labels: ['Completed', 'Pending', 'Overdue'],
            data: [25, 8, 3]
          },
          byContact: {
            labels: ['John Smith', 'Sarah Johnson', 'Mike Williams', 'Alex Brown', 'Lisa Davis'],
            data: [4, 3, 3, 2, 2]
          }
        });
        
        // Recent Activity Data
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
        
        // Upcoming Reminders
        setUpcomingReminders([
          {
            id: 1,
            description: 'Follow up on proposal',
            contact: { name: 'John Smith' },
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            priority: 'high'
          },
          {
            id: 2,
            description: 'Schedule kickoff meeting',
            contact: { name: 'Sarah Johnson' },
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            priority: 'medium'
          },
          {
            id: 3,
            description: 'Send contract for review',
            contact: { name: 'Mike Williams' },
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            priority: 'high'
          },
          {
            id: 4,
            description: 'Check on project status',
            contact: { name: 'Alex Brown' },
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            priority: 'low'
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
  
  // Update data based on selected timeframes
  useEffect(() => {
    // In a real application, you would fetch data based on timeframe
    // For the mock, we'll just simulate different data
    
    // Temperature trend data for different timeframes
    if (temperatureTimeframe === 'week') {
      setTemperatureData(prev => ({
        ...prev,
        trend: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Cold',
              data: [13, 12, 12, 12, 12, 12, 12],
              borderColor: 'rgba(52, 152, 219, 1)',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Warm',
              data: [20, 20, 21, 21, 21, 21, 21],
              borderColor: 'rgba(243, 156, 18, 1)',
              backgroundColor: 'rgba(243, 156, 18, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Hot',
              data: [15, 15, 15, 15, 15, 15, 15],
              borderColor: 'rgba(231, 76, 60, 1)',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        }
      }));
    } else if (temperatureTimeframe === 'month') {
      setTemperatureData(prev => ({
        ...prev,
        trend: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Cold',
              data: [18, 16, 14, 13, 12, 12],
              borderColor: 'rgba(52, 152, 219, 1)',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Warm',
              data: [12, 14, 16, 18, 20, 21],
              borderColor: 'rgba(243, 156, 18, 1)',
              backgroundColor: 'rgba(243, 156, 18, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Hot',
              data: [8, 10, 12, 14, 15, 15],
              borderColor: 'rgba(231, 76, 60, 1)',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        }
      }));
    } else if (temperatureTimeframe === 'year') {
      setTemperatureData(prev => ({
        ...prev,
        trend: {
          labels: ['2022 Q3', '2022 Q4', '2023 Q1', '2023 Q2'],
          datasets: [
            {
              label: 'Cold',
              data: [24, 20, 16, 12],
              borderColor: 'rgba(52, 152, 219, 1)',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Warm',
              data: [8, 12, 16, 21],
              borderColor: 'rgba(243, 156, 18, 1)',
              backgroundColor: 'rgba(243, 156, 18, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Hot',
              data: [4, 8, 12, 15],
              borderColor: 'rgba(231, 76, 60, 1)',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        }
      }));
    }
    
    // Communication frequency data for different timeframes
    if (communicationTimeframe === 'week') {
      setCommunicationData(prev => ({
        ...prev,
        frequency: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'This Week',
              data: [8, 12, 9, 14, 10, 3, 1],
              backgroundColor: 'rgba(74, 111, 165, 0.6)',
              borderColor: 'rgba(74, 111, 165, 1)',
              borderWidth: 1
            },
            {
              label: 'Last Week',
              data: [7, 10, 8, 11, 9, 2, 0],
              backgroundColor: 'rgba(149, 165, 166, 0.6)',
              borderColor: 'rgba(149, 165, 166, 1)',
              borderWidth: 1
            }
          ]
        }
      }));
    } else if (communicationTimeframe === 'month') {
      setCommunicationData(prev => ({
        ...prev,
        frequency: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'This Month',
              data: [42, 48, 57, 53],
              backgroundColor: 'rgba(74, 111, 165, 0.6)',
              borderColor: 'rgba(74, 111, 165, 1)',
              borderWidth: 1
            },
            {
              label: 'Last Month',
              data: [38, 44, 50, 48],
              backgroundColor: 'rgba(149, 165, 166, 0.6)',
              borderColor: 'rgba(149, 165, 166, 1)',
              borderWidth: 1
            }
          ]
        }
      }));
    } else if (communicationTimeframe === 'year') {
      setCommunicationData(prev => ({
        ...prev,
        frequency: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'This Year',
              data: [180, 190, 210, 200, 220, 200],
              backgroundColor: 'rgba(74, 111, 165, 0.6)',
              borderColor: 'rgba(74, 111, 165, 1)',
              borderWidth: 1
            },
            {
              label: 'Last Year',
              data: [150, 160, 170, 180, 190, 175],
              backgroundColor: 'rgba(149, 165, 166, 0.6)',
              borderColor: 'rgba(149, 165, 166, 1)',
              borderWidth: 1
            }
          ]
        }
      }));
    }
    
    // Reminder data for different timeframes
    if (reminderTimeframe === 'week') {
      setReminderData(prev => ({
        ...prev,
        upcoming: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [2, 3, 1, 4, 2, 0, 0]
        }
      }));
    } else if (reminderTimeframe === 'month') {
      setReminderData(prev => ({
        ...prev,
        upcoming: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [8, 12, 6, 10]
        }
      }));
    } else if (reminderTimeframe === 'quarter') {
      setReminderData(prev => ({
        ...prev,
        upcoming: {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          data: [36, 42, 38]
        }
      }));
    }
  }, [temperatureTimeframe, communicationTimeframe, reminderTimeframe]);
  
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
  
  // Format date for reminders
  const formatReminderDate = (date) => {
    const now = new Date();
    const reminderDate = new Date(date);
    const diffTime = reminderDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `In ${diffDays} days`;
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
  
  // Temperature distribution chart data
  const temperaturePieChartData = {
    labels: temperatureData.current.labels,
    datasets: [
      {
        data: temperatureData.current.data,
        backgroundColor: [
          'rgba(52, 152, 219, 0.8)',
          'rgba(243, 156, 18, 0.8)',
          'rgba(231, 76, 60, 0.8)'
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
  
  // Temperature by team chart data
  const temperatureByTeamChartData = {
    labels: temperatureData.byTeam.labels,
    datasets: temperatureData.byTeam.datasets,
  };
  
  // Temperature trend chart data
  const temperatureTrendChartData = {
    labels: temperatureData.trend.labels,
    datasets: temperatureData.trend.datasets,
  };
  
  // Communication frequency chart data
  const communicationFrequencyChartData = {
    labels: communicationData.frequency.labels,
    datasets: communicationData.frequency.datasets,
  };
  
  // Communication by type chart data
  const communicationByTypeChartData = {
    labels: communicationData.byType.labels,
    datasets: [
      {
        data: communicationData.byType.data,
        backgroundColor: [
          'rgba(52, 152, 219, 0.8)',
          'rgba(46, 204, 113, 0.8)',
          'rgba(155, 89, 182, 0.8)',
          'rgba(52, 73, 94, 0.8)',
          'rgba(149, 165, 166, 0.8)'
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(155, 89, 182, 1)',
          'rgba(52, 73, 94, 1)',
          'rgba(149, 165, 166, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Response rate trend chart data
  const responseRateTrendChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Response Rate',
        data: communicationData.responseRate.trend,
        borderColor: 'rgba(46, 204, 113, 1)',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };
  
  // Communication by team chart data
  const communicationByTeamChartData = {
    labels: communicationData.byTeam.labels,
    datasets: communicationData.byTeam.datasets,
  };
  
  // Upcoming reminders chart data
  const upcomingRemindersChartData = {
    labels: reminderData.upcoming.labels,
    datasets: [
      {
        label: 'Upcoming Reminders',
        data: reminderData.upcoming.data,
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
      }
    ],
  };
  
  // Reminder status chart data
  const reminderStatusChartData = {
    labels: reminderData.status.labels,
    datasets: [
      {
        data: reminderData.status.data,
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(52, 152, 219, 0.8)',
          'rgba(231, 76, 60, 0.8)'
        ],
        borderColor: [
          'rgba(46, 204, 113, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(231, 76, 60, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Reminder by contact chart data
  const reminderByContactChartData = {
    labels: reminderData.byContact.labels,
    datasets: [
      {
        label: 'Reminders',
        data: reminderData.byContact.data,
        backgroundColor: 'rgba(155, 89, 182, 0.8)',
        borderColor: 'rgba(155, 89, 182, 1)',
        borderWidth: 1,
      }
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
          <ActionButton to="/reports">
            <FaChartPie /> View Reports
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
      
      {/* Tabbed Analytics Section */}
      <TabContainer>
        <TabNav>
          <TabButton 
            active={activeTab === 'temperature'} 
            onClick={() => setActiveTab('temperature')}
          >
            <FaThermometerHalf /> Contact Temperature
          </TabButton>
          <TabButton 
            active={activeTab === 'communication'} 
            onClick={() => setActiveTab('communication')}
          >
            <FaEnvelope /> Communication Analytics
          </TabButton>
          <TabButton 
            active={activeTab === 'reminders'} 
            onClick={() => setActiveTab('reminders')}
          >
            <FaBell /> Reminder Analytics
          </TabButton>
        </TabNav>
        
        <TabContent>
          {/* Temperature Dashboard */}
          {activeTab === 'temperature' && (
            <>
              <TimeframeButtons>
                <TimeframeButton 
                  active={temperatureTimeframe === 'week'}
                  onClick={() => setTemperatureTimeframe('week')}
                >
                  Week
                </TimeframeButton>
                <TimeframeButton 
                  active={temperatureTimeframe === 'month'}
                  onClick={() => setTemperatureTimeframe('month')}
                >
                  Month
                </TimeframeButton>
                <TimeframeButton 
                  active={temperatureTimeframe === 'year'}
                  onClick={() => setTemperatureTimeframe('year')}
                >
                  Year
                </TimeframeButton>
              </TimeframeButtons>
              
              <ChartSection>
                <ChartCard>
                  <h3><FaChartPie /> Contact Temperature Distribution</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <Doughnut data={temperaturePieChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                  )}
                  <ChartLegend>
                    <LegendItem color="rgba(52, 152, 219, 0.8)">
                      <div className="color-box"></div>
                      <span>Cold ({temperatureData.current.data[0]})</span>
                    </LegendItem>
                    <LegendItem color="rgba(243, 156, 18, 0.8)">
                      <div className="color-box"></div>
                      <span>Warm ({temperatureData.current.data[1]})</span>
                    </LegendItem>
                    <LegendItem color="rgba(231, 76, 60, 0.8)">
                      <div className="color-box"></div>
                      <span>Hot ({temperatureData.current.data[2]})</span>
                    </LegendItem>
                  </ChartLegend>
                </ChartCard>
                
                <ChartCard>
                  <h3><FaChartLine /> Temperature Trends Over Time</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <Line 
                      data={temperatureTrendChartData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: true,
                        scales: {
                          y: {
                            beginAtZero: true,
                            stacked: false,
                            ticks: {
                              precision: 0
                            }
                          }
                        }
                      }} 
                    />
                  )}
                </ChartCard>
                
                <ChartCard>
                  <h3><FaChartBar /> Temperature Distribution by Team</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <Bar 
                      data={temperatureByTeamChartData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: true,
                        scales: {
                          x: {
                            stacked: true,
                          },
                          y: {
                            stacked: true,
                            beginAtZero: true,
                            ticks: {
                              precision: 0
                            }
                          }
                        }
                      }} 
                    />
                  )}
                </ChartCard>
                
                <ChartCard>
                  <h3><FaMapMarkerAlt /> Temperature Geographic Distribution</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <Radar 
                      data={{
                        labels: ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'],
                        datasets: [
                          {
                            label: 'Cold',
                            data: [3, 2, 4, 1, 2],
                            backgroundColor: 'rgba(52, 152, 219, 0.2)',
                            borderColor: 'rgba(52, 152, 219, 1)',
                            pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                          },
                          {
                            label: 'Warm',
                            data: [4, 5, 3, 6, 3],
                            backgroundColor: 'rgba(243, 156, 18, 0.2)',
                            borderColor: 'rgba(243, 156, 18, 1)',
                            pointBackgroundColor: 'rgba(243, 156, 18, 1)',
                          },
                          {
                            label: 'Hot',
                            data: [2, 4, 3, 3, 3],
                            backgroundColor: 'rgba(231, 76, 60, 0.2)',
                            borderColor: 'rgba(231, 76, 60, 1)',
                            pointBackgroundColor: 'rgba(231, 76, 60, 1)',
                          }
                        ]
                      }}
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: true,
                        scales: {
                          r: {
                            angleLines: {
                              display: true
                            },
                            suggestedMin: 0
                          }
                        }
                      }}
                    />
                  )}
                </ChartCard>
              </ChartSection>
            </>
          )}
          
          {/* Communication Analytics Dashboard */}
          {activeTab === 'communication' && (
            <>
              <TimeframeButtons>
                <TimeframeButton 
                  active={communicationTimeframe === 'week'}
                  onClick={() => setCommunicationTimeframe('week')}
                >
                  Week
                </TimeframeButton>
                <TimeframeButton 
                  active={communicationTimeframe === 'month'}
                  onClick={() => setCommunicationTimeframe('month')}
                >
                  Month
                </TimeframeButton>
                <TimeframeButton 
                  active={communicationTimeframe === 'year'}
                  onClick={() => setCommunicationTimeframe('year')}
                >
                  Year
                </TimeframeButton>
              </TimeframeButtons>
              
              <KPIRow>
                <KPICard highlighted>
                  <div className="kpi-value">124</div>
                  <div className="kpi-label">Total Communications</div>
                </KPICard>
                <KPICard>
                  <div className="kpi-value">72%</div>
                  <div className="kpi-label">Response Rate</div>
                </KPICard>
                <KPICard>
                  <div className="kpi-value">8.5h</div>
                  <div className="kpi-label">Avg. Response Time</div>
                </KPICard>
                <KPICard>
                  <div className="kpi-value">18</div>
                  <div className="kpi-label">Unique Contacts</div>
                </KPICard>
              </KPIRow>
              
              <ChartSection>
                <ChartCard>
                  <h3><FaChartBar /> Communication Frequency</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <Bar 
                      data={communicationFrequencyChartData} 
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
                  )}
                </ChartCard>
                
                <ChartCard>
                  <h3><FaChartPie /> Communication by Type</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <Pie data={communicationByTypeChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                  )}
                  <ChartLegend>
                    <LegendItem color="rgba(52, 152, 219, 0.8)">
                      <div className="color-box"></div>
                      <span>Email ({communicationData.byType.data[0]})</span>
                    </LegendItem>
                    <LegendItem color="rgba(46, 204, 113, 0.8)">
                      <div className="color-box"></div>
                      <span>Phone ({communicationData.byType.data[1]})</span>
                    </LegendItem>
                    <LegendItem color="rgba(155, 89, 182, 0.8)">
                      <div className="color-box"></div>
                      <span>Meeting ({communicationData.byType.data[2]})</span>
                    </LegendItem>
                  </ChartLegend>
                </ChartCard>
                
                <ChartCard>
                  <h3><FaChartLine /> Response Rate Trend</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <Line 
                      data={responseRateTrendChartData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: true,
                        scales: {
                          y: {
                            min: 50,
                            max: 100,
                            ticks: {
                              callback: function(value) {
                                return value + '%';
                              }
                            }
                          }
                        }
                      }} 
                    />
                  )}
                </ChartCard>
                
                <ChartCard>
                  <h3><FaUsers /> Communication by Team</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <Doughnut 
                      data={communicationByTeamChartData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: true
                      }} 
                    />
                  )}
                </ChartCard>
              </ChartSection>
              
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ marginBottom: '15px' }}>Key Metrics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                  <CommunicationMetricCard>
                    <MetricIcon color="rgba(52, 152, 219, 1)">
                      <FaEnvelope />
                    </MetricIcon>
                    <MetricContent positive>
                      <div className="metric-title">Email Open Rate</div>
                      <div className="metric-value">68%</div>
                      <div className="metric-change">↑ 4% from last month</div>
                    </MetricContent>
                  </CommunicationMetricCard>
                  
                  <CommunicationMetricCard>
                    <MetricIcon color="rgba(46, 204, 113, 1)">
                      <FaPhone />
                    </MetricIcon>
                    <MetricContent positive>
                      <div className="metric-title">Call Answer Rate</div>
                      <div className="metric-value">42%</div>
                      <div className="metric-change">↑ 2% from last month</div>
                    </MetricContent>
                  </CommunicationMetricCard>
                  
                  <CommunicationMetricCard>
                    <MetricIcon color="rgba(231, 76, 60, 1)">
                      <FaHandshake />
                    </MetricIcon>
                    <MetricContent>
                      <div className="metric-title">Meeting Acceptance</div>
                      <div className="metric-value">85%</div>
                      <div className="metric-change" positive={false}>↓ 3% from last month</div>
                    </MetricContent>
                  </CommunicationMetricCard>
                </div>
              </div>
            </>
          )}
          
          {/* Reminder Analytics Dashboard */}
          {activeTab === 'reminders' && (
            <>
              <TimeframeButtons>
                <TimeframeButton 
                  active={reminderTimeframe === 'week'}
                  onClick={() => setReminderTimeframe('week')}
                >
                  Week
                </TimeframeButton>
                <TimeframeButton 
                  active={reminderTimeframe === 'month'}
                  onClick={() => setReminderTimeframe('month')}
                >
                  Month
                </TimeframeButton>
                <TimeframeButton 
                  active={reminderTimeframe === 'quarter'}
                  onClick={() => setReminderTimeframe('quarter')}
                >
                  Quarter
                </TimeframeButton>
              </TimeframeButtons>
              
              <KPIRow>
                <KPICard highlighted>
                  <div className="kpi-value">36</div>
                  <div className="kpi-label">Total Reminders</div>
                </KPICard>
                <KPICard>
                  <div className="kpi-value">25</div>
                  <div className="kpi-label">Completed</div>
                </KPICard>
                <KPICard>
                  <div className="kpi-value">8</div>
                  <div className="kpi-label">Pending</div>
                </KPICard>
                <KPICard>
                  <div className="kpi-value">3</div>
                  <div className="kpi-label">Overdue</div>
                </KPICard>
              </KPIRow>
              
              <ChartSection>
                <ChartCard>
                  <h3><FaChartBar /> Upcoming Reminders</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <Bar 
                      data={upcomingRemindersChartData} 
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
                  )}
                </ChartCard>
                
                <ChartCard>
                  <h3><FaChartPie /> Reminder Status</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <Doughnut data={reminderStatusChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                  )}
                  <ChartLegend>
                    <LegendItem color="rgba(46, 204, 113, 0.8)">
                      <div className="color-box"></div>
                      <span>Completed ({reminderData.status.data[0]})</span>
                    </LegendItem>
                    <LegendItem color="rgba(52, 152, 219, 0.8)">
                      <div className="color-box"></div>
                      <span>Pending ({reminderData.status.data[1]})</span>
                    </LegendItem>
                    <LegendItem color="rgba(231, 76, 60, 0.8)">
                      <div className="color-box"></div>
                      <span>Overdue ({reminderData.status.data[2]})</span>
                    </LegendItem>
                  </ChartLegend>
                </ChartCard>
                
                <ChartCard>
                  <h3><FaChartBar /> Top Contacts with Reminders</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <Bar 
                      data={reminderByContactChartData} 
                      options={{ 
                        responsive: true, 
                        maintainAspectRatio: true,
                        indexAxis: 'y',
                        scales: {
                          x: {
                            beginAtZero: true,
                            ticks: {
                              precision: 0
                            }
                          }
                        }
                      }} 
                    />
                  )}
                </ChartCard>
                
                <ChartCard>
                  <h3><FaClock /> Upcoming Reminders</h3>
                  {loading ? (
                    <LoadingSkeleton height="300px" />
                  ) : (
                    <div>
                      <ReminderList>
                        {upcomingReminders.map((reminder) => (
                          <ReminderItem 
                            key={reminder.id}
                            priority={reminder.priority}
                          >
                            <div className="reminder-content">
                              <div className="reminder-title">{reminder.description}</div>
                              <div className="reminder-date">{formatReminderDate(reminder.dueDate)}</div>
                            </div>
                            <div className="reminder-contact">{reminder.contact.name}</div>
                          </ReminderItem>
                        ))}
                      </ReminderList>
                    </div>
                  )}
                </ChartCard>
              </ChartSection>
            </>
          )}
        </TabContent>
      </TabContainer>
      
      <RecentActivity>
        <h3>Recent Activity</h3>
        
        {loading ? (
          <LoadingSkeleton height="250px" />
        ) : recentActivity.length === 0 ? (
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