import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChartDisplay from './ChartDisplay';
import { renderWithProviders, mockChartData } from '../../tests/testUtils';

// Mock Chart.js components since they use canvas which isn't available in JSDOM
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart" />,
  Pie: () => <div data-testid="pie-chart" />,
  Line: () => <div data-testid="line-chart" />,
}));

describe('ChartDisplay', () => {
  it('renders the chart title correctly', () => {
    renderWithProviders(
      <ChartDisplay 
        type={mockChartData.type} 
        data={mockChartData.data} 
        labels={mockChartData.labels} 
        title={mockChartData.title} 
      />
    );
    
    // Check that the chart title is displayed
    expect(screen.getByText(mockChartData.title)).toBeInTheDocument();
  });
  
  it('renders bar chart when type is bar', () => {
    renderWithProviders(
      <ChartDisplay 
        type="bar"
        data={mockChartData.data} 
        labels={mockChartData.labels} 
        title={mockChartData.title} 
      />
    );
    
    // Check that bar chart is rendered
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
  
  it('renders pie chart when type is pie', () => {
    renderWithProviders(
      <ChartDisplay 
        type="pie"
        data={mockChartData.data} 
        labels={mockChartData.labels} 
        title={mockChartData.title} 
      />
    );
    
    // Check that pie chart is rendered
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });
  
  it('renders line chart when type is line', () => {
    renderWithProviders(
      <ChartDisplay 
        type="line"
        data={mockChartData.data} 
        labels={mockChartData.labels} 
        title={mockChartData.title} 
      />
    );
    
    // Check that line chart is rendered
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
  
  it('defaults to bar chart when type is invalid', () => {
    renderWithProviders(
      <ChartDisplay 
        type="unknown"
        data={mockChartData.data} 
        labels={mockChartData.labels} 
        title={mockChartData.title} 
      />
    );
    
    // Check that bar chart is rendered as fallback
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});