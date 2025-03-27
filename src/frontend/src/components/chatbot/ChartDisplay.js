import React from 'react';
import styled from 'styled-components';
import { Bar, Pie, Line } from 'react-chartjs-2';
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
} from 'chart.js';

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
  LineElement
);

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
  box-shadow: 0 1px 3px var(--shadow-color);
  width: 100%;
  max-width: 100%;
`;

const ChartTitle = styled.h4`
  margin: 0 0 10px 0;
  font-size: 16px;
  text-align: center;
`;

const getChartColors = () => {
  return {
    backgroundColor: [
      'rgba(74, 111, 165, 0.6)',
      'rgba(40, 199, 183, 0.6)',
      'rgba(243, 156, 18, 0.6)',
      'rgba(231, 76, 60, 0.6)',
      'rgba(142, 68, 173, 0.6)',
      'rgba(52, 152, 219, 0.6)',
      'rgba(46, 204, 113, 0.6)',
      'rgba(230, 126, 34, 0.6)',
      'rgba(149, 165, 166, 0.6)',
      'rgba(41, 128, 185, 0.6)',
    ],
    borderColor: [
      'rgba(74, 111, 165, 1)',
      'rgba(40, 199, 183, 1)',
      'rgba(243, 156, 18, 1)',
      'rgba(231, 76, 60, 1)',
      'rgba(142, 68, 173, 1)',
      'rgba(52, 152, 219, 1)',
      'rgba(46, 204, 113, 1)',
      'rgba(230, 126, 34, 1)',
      'rgba(149, 165, 166, 1)',
      'rgba(41, 128, 185, 1)',
    ],
    borderWidth: 1,
  };
};

const ChartDisplay = ({ type, data, labels, title }) => {
  const colors = getChartColors();
  
  // Common chart options
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  
  // Generate chart configuration
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        ...colors,
      },
    ],
  };
  
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'line':
        return <Line data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };
  
  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      {renderChart()}
    </ChartContainer>
  );
};

export default ChartDisplay;
