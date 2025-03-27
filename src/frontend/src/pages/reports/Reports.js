import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { 
  FaDownload, FaFileExport, FaFilter, FaChartPie, 
  FaChartBar, FaChartLine, FaCalendarAlt
} from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import api from '../../services/api';
import ChartDisplay from '../../components/chatbot/ChartDisplay';

const ReportsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
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

const ControlsBar = styled.div`
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Select = styled.select`
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
`;

const DateInput = styled.input`
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px var(--shadow-color);
  display: flex;
  flex-direction: column;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ChartTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--background-color);
  }
`;

const ReportSummary = styled.p`
  margin: 15px 0 0 0;
  font-size: 14px;
  color: var(--text-light);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: var(--text-light);
`;

const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px var(--shadow-color);
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
  }
  
  p {
    color: var(--text-light);
    text-align: center;
    max-width: 400px;
  }
`;

const Reports = () => {
  const [reportType, setReportType] = useState('temperature');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeframe, setTimeframe] = useState('all');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Set default date range based on timeframe
  useEffect(() => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    
    let start;
    switch (timeframe) {
      case 'week':
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        start = lastWeek.toISOString().split('T')[0];
        break;
      case 'month':
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        start = lastMonth.toISOString().split('T')[0];
        break;
      case 'quarter':
        const lastQuarter = new Date(today);
        lastQuarter.setMonth(today.getMonth() - 3);
        start = lastQuarter.toISOString().split('T')[0];
        break;
      case 'year':
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);
        start = lastYear.toISOString().split('T')[0];
        break;
      default:
        // Default to all data (no specific date range)
        start = '';
    }
    
    setStartDate(start);
    setEndDate(timeframe === 'all' ? '' : end);
  }, [timeframe]);
  
  // Generate reports
  useEffect(() => {
    const generateReports = async () => {
      try {
        setLoading(true);
        
        // Collect parameters
        const params = {
          type: reportType
        };
        
        // Add date range if specified
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        
        // Make API request
        const response = await api.get('/api/reports/generate', { params });
        
        setReports(Array.isArray(response.data) ? response.data : [response.data]);
        setError(null);
      } catch (err) {
        console.error('Error generating reports:', err);
        setError('Failed to generate reports. Please try again.');
        toast.error('Failed to generate reports');
      } finally {
        setLoading(false);
      }
    };
    
    generateReports();
  }, [reportType, startDate, endDate]);
  
  // Prepare CSV data for export
  const prepareCSVData = (report) => {
    // Simple case for most chart types
    const data = [
      ['Label', 'Value'],
      ...report.labels.map((label, index) => [label, report.data[index]])
    ];
    
    return data;
  };
  
  // Get chart type based on report type
  const getChartType = (type) => {
    switch (type) {
      case 'temperature':
        return 'pie';
      case 'engagement':
        return 'bar';
      case 'activity':
        return 'line';
      case 'team':
        return 'bar';
      default:
        return 'bar';
    }
  };
  
  // Get report title based on type
  const getReportTitle = (type) => {
    switch (type) {
      case 'temperature':
        return 'Contact Temperature Distribution';
      case 'engagement':
        return 'Engagement Frequency';
      case 'activity':
        return 'Recent Activity';
      case 'team':
        return 'Team Distribution';
      default:
        return 'Report';
    }
  };

  return (
    <ReportsContainer>
      <Header>
        <Title>Reports & Analytics</Title>
      </Header>
      
      <ControlsBar>
        <FilterGroup>
          <Label>Report Type:</Label>
          <Select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="temperature">Contact Temperature</option>
            <option value="team">Team Distribution</option>
            <option value="engagement">Engagement Frequency</option>
            <option value="activity">Recent Activity</option>
          </Select>
        </FilterGroup>
        
        <FilterGroup>
          <Label>Timeframe:</Label>
          <Select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="custom">Custom Range</option>
          </Select>
        </FilterGroup>
        
        {timeframe === 'custom' && (
          <>
            <FilterGroup>
              <Label>From:</Label>
              <DateInput 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FilterGroup>
            
            <FilterGroup>
              <Label>To:</Label>
              <DateInput 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FilterGroup>
          </>
        )}
      </ControlsBar>
      
      {loading ? (
        <LoadingContainer>Generating reports...</LoadingContainer>
      ) : error ? (
        <NoDataMessage>
          <h3>Error Loading Reports</h3>
          <p>{error}</p>
        </NoDataMessage>
      ) : reports.length === 0 ? (
        <NoDataMessage>
          <h3>No Data Available</h3>
          <p>There is not enough data to generate reports. Try adding more contacts or selecting a different timeframe.</p>
        </NoDataMessage>
      ) : (
        <ChartsContainer>
          {reports.map((report, index) => (
            <ChartCard key={index}>
              <ChartHeader>
                <ChartTitle>{report.title || getReportTitle(reportType)}</ChartTitle>
                <CSVLink 
                  data={prepareCSVData(report)} 
                  filename={`${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`}
                  className="btn btn-primary"
                >
                  <ExportButton>
                    <FaFileExport /> Export
                  </ExportButton>
                </CSVLink>
              </ChartHeader>
              
              <ChartDisplay 
                type={report.chartType || getChartType(reportType)} 
                data={report.data} 
                labels={report.labels} 
                title={report.title || getReportTitle(reportType)} 
              />
              
              {report.summary && (
                <ReportSummary>{report.summary}</ReportSummary>
              )}
            </ChartCard>
          ))}
        </ChartsContainer>
      )}
    </ReportsContainer>
  );
};

export default Reports;