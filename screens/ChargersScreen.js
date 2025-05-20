import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, RefreshControl } from 'react-native';
import { ChargerUsageChart } from '../components/ChargerUsageChart';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { SummaryStatistics } from '../components/SummaryStatistics';
import { AIInsights } from '../components/AIInsights';
import { PredictiveAnalysis } from '../components/PredictiveAnalysis';
import { dailyUsageData, hourlyUsageData, stationUsageData } from '../data/mockChargerData';

export default function ChargersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [dateFilter, setDateFilter] = useState('7d');
  const [filteredDailyData, setFilteredDailyData] = useState([]);
  const [filteredDailyChartData, setFilteredDailyChartData] = useState([]);
  const [filteredEnergyChartData, setFilteredEnergyChartData] = useState([]);
  const [dataForAI, setDataForAI] = useState({});
  
  // Format hourly data - this doesn't change with date filtering
  const formatHourlyData = hourlyUsageData.map(item => ({
    x: item.hour,
    y: item.sessions,
    label: `${item.hour}\nSessions: ${item.sessions}`
  }));
  
  // Filter data based on date range
  const filterDataByDateRange = useCallback((data, range) => {
    console.log(`Filtering data with range: ${range}`);
    
    // Defensive check - if data is empty or undefined, return empty array
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No data to filter');
      return [];
    }
    
    try {
      // Create a new date object for comparison
      const today = new Date();
      let daysToSubtract = 7; // default to 7 days
      
      if (range === '14d') daysToSubtract = 14;
      if (range === '30d') daysToSubtract = 30;
      
      const cutoffDate = new Date();
      cutoffDate.setDate(today.getDate() - daysToSubtract);
      
      console.log(`Cutoff date: ${cutoffDate.toISOString()}`);
      
      // Since our mock data might have dates that are not recent enough,
      // adjust the filter to work with the available data
      if (Array.isArray(data) && data.length > 0) {
        // Get the most recent date in the data
        const mostRecentDate = new Date(Math.max(...data.map(item => new Date(item.date))));
        console.log(`Most recent date in data: ${mostRecentDate.toISOString()}`);
        
        // Adjust cutoff date relative to the most recent date in our data
        const adjustedCutoffDate = new Date(mostRecentDate);
        adjustedCutoffDate.setDate(mostRecentDate.getDate() - daysToSubtract);
        console.log(`Adjusted cutoff date: ${adjustedCutoffDate.toISOString()}`);
        
        const filtered = data.filter(item => new Date(item.date) >= adjustedCutoffDate);
        
        // If filtering resulted in empty array, return all data
        if (filtered.length === 0) {
          console.warn('Filter returned no results, using all data instead');
          return data;
        }
        
        console.log(`Filtered data count: ${filtered.length}`);
        return filtered;
      }
      
      return data;
    } catch (error) {
      console.error('Error filtering data:', error);
      return data; // On error, return the original data
    }
  }, []);
  
  // Transform filtered data for charts
  const transformFilteredData = useCallback((data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No data to transform');
      return [];
    }
    
    try {
      return data.map(item => ({
        x: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        y: item.sessions,
        label: `${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}\nSessions: ${item.sessions}`
      }));
    } catch (error) {
      console.error('Error transforming data:', error);
      return [];
    }
  }, []);
  
  // Transform energy data for charts
  const transformEnergyData = useCallback((data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No energy data to transform');
      return [];
    }
    
    try {
      return data.map(item => ({
        x: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        y: item.energyDelivered,
        label: `${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}\nEnergy: ${item.energyDelivered} kWh`
      }));
    } catch (error) {
      console.error('Error transforming energy data:', error);
      return [];
    }
  }, []);
  
  // Update filtered data when date filter changes
  useEffect(() => {
    try {
      const filtered = filterDataByDateRange(dailyUsageData, dateFilter);
      setFilteredDailyData(filtered);
      
      const chartData = transformFilteredData(filtered);
      setFilteredDailyChartData(chartData);
      
      const energyData = transformEnergyData(filtered);
      setFilteredEnergyChartData(energyData);
      
      setDataForAI({
        dailyUsage: filtered,
        hourlyUsage: hourlyUsageData,
        stationUsage: stationUsageData
      });
      
      console.log(`Data updated for filter: ${dateFilter}`);
    } catch (error) {
      console.error('Error updating filtered data:', error);
      // Fallback to all data if there's an error
      setFilteredDailyData(dailyUsageData);
      setFilteredDailyChartData(transformFilteredData(dailyUsageData));
      setFilteredEnergyChartData(transformEnergyData(dailyUsageData));
    }
  }, [dateFilter, filterDataByDateRange, transformFilteredData, transformEnergyData]);
  
  // Initial data load
  useEffect(() => {
    // Trigger the filtering effect on initial load
    setDateFilter(dateFilter);
  }, []);
  
  // Refresh control callback
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Reset the date filter to trigger a data refresh
    const currentFilter = dateFilter;
    setDateFilter('refresh_trigger');
    setTimeout(() => {
      setDateFilter(currentFilter);
      setRefreshing(false);
    }, 1000);
  }, [dateFilter]);

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>EV Charger Statistics</Text>
          <Text style={styles.subtitle}>Visualizing charging station usage data</Text>
        </View>
        
        {/* Date Range Filter */}
        <DateRangeFilter onFilterChange={setDateFilter} initialRange={dateFilter} />
        
        {/* Summary Statistics */}
        <SummaryStatistics data={filteredDailyData} />
        
        {/* AI Insights */}
        <AIInsights data={dataForAI} />
        
        {/* Charts Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Usage Analytics</Text>
          
          <ChargerUsageChart 
            data={filteredDailyChartData.length > 0 ? filteredDailyChartData : [{ x: "No Data", y: 0 }]} 
            title="Daily Charging Sessions" 
            xAxisLabel="Date"
            yAxisLabel="Number of Sessions"
          />
          
          <ChargerUsageChart 
            data={filteredEnergyChartData.length > 0 ? filteredEnergyChartData : [{ x: "No Data", y: 0 }]} 
            title="Daily Energy Delivered" 
            chartType="line"
            xAxisLabel="Date"
            yAxisLabel="Energy (kWh)"
          />
          
          <ChargerUsageChart 
            data={formatHourlyData} 
            title="Hourly Usage Distribution" 
            xAxisLabel="Hour of Day"
            yAxisLabel="Number of Sessions"
          />
        </View>
        
        {/* Predictive Analysis Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Predictions & Forecasts</Text>
          <PredictiveAnalysis dailyUsageData={filteredDailyData.length > 0 ? filteredDailyData : dailyUsageData} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  sectionContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
});