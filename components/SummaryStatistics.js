import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export function SummaryStatistics({ data }) {
  // Check if data is empty or undefined
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Summary Statistics</Text>
        <Text style={styles.noDataText}>No data available for the selected period</Text>
      </View>
    );
  }

  // Calculate summary statistics
  const totalSessions = data.reduce((total, item) => total + item.sessions, 0);
  const totalEnergy = data.reduce((total, item) => total + item.energyDelivered, 0);
  const avgEnergyPerSession = totalSessions > 0 ? totalEnergy / totalSessions : 0;
  
  // Find peak usage - safely with default values if data is empty
  const peakUsageItem = data.length > 0 
    ? data.reduce((max, item) => item.sessions > max.sessions ? item : max, data[0])
    : { date: new Date().toISOString(), sessions: 0 };
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Summary Statistics</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalSessions}</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalEnergy.toFixed(1)} kWh</Text>
          <Text style={styles.statLabel}>Energy Delivered</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{avgEnergyPerSession.toFixed(1)} kWh</Text>
          <Text style={styles.statLabel}>Avg per Session</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {new Date(peakUsageItem.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
          <Text style={styles.statLabel}>Peak Usage Day</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  }
});