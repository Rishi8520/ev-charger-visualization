import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// Days of the week
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Hours (simplified for display)
const HOURS = ['12a', '3a', '6a', '9a', '12p', '3p', '6p', '9p'];

export function WeeklyHeatmap({ data, hourlyData, title }) {
  // Create a 2D array to store the heatmap data
  // Format: [day][hour] -> value
  const heatmapData = Array(7).fill().map(() => Array(24).fill(0));
  
  // Process data to fill the heatmap
  data.forEach(item => {
    const date = new Date(item.date);
    const day = date.getDay(); // 0-6
    
    // For this example, we'll use the hourly data and distribute it across days
    hourlyData.forEach(hourData => {
      const hour = parseInt(hourData.hour.split(':')[0], 10);
      // Distribute sessions across days, with more sessions on weekdays
      const factor = (day === 0 || day === 6) ? 0.7 : 1.2; // Less on weekends
      heatmapData[day][hour] = Math.round(hourData.sessions * factor);
    });
  });
  
  const getColorForValue = (value) => {
    // Color scale from light to dark blue
    if (value === 0) return '#f0f0f0';
    if (value < 3) return '#d1e6f9';
    if (value < 6) return '#a7d1f4';
    if (value < 10) return '#76b9f0';
    if (value < 15) return '#4a9eea';
    return '#2089dc';
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <div style={styles.scrollableContainer}>
        <View style={styles.heatmapContainer}>
          {/* Column headers (hours) */}
          <View style={styles.headerRow}>
            <View style={styles.cornerCell}></View>
            {HOURS.map((hour, index) => (
              <View key={`hour-${index}`} style={styles.headerCell}>
                <Text style={styles.headerText}>{hour}</Text>
              </View>
            ))}
          </View>
          
          {/* Heatmap rows */}
          {DAYS.map((day, dayIndex) => (
            <View key={`day-${dayIndex}`} style={styles.row}>
              {/* Row header (day) */}
              <View style={styles.rowHeaderCell}>
                <Text style={styles.headerText}>{day}</Text>
              </View>
              
              {/* Heatmap cells for this day */}
              {HOURS.map((_, hourIndex) => {
                const actualHourIndex = hourIndex * 3; // Map 8 display hours to 24 actual hours
                return Array(3).fill().map((_, offset) => {
                  const hour = actualHourIndex + offset;
                  const value = heatmapData[dayIndex][hour] || 0;
                  return (
                    <View 
                      key={`cell-${dayIndex}-${hour}`} 
                      style={[
                        styles.cell,
                        { backgroundColor: getColorForValue(value) }
                      ]}
                    >
                      {value > 0 && (
                        <Text style={styles.cellText}>{value}</Text>
                      )}
                    </View>
                  );
                });
              })}
            </View>
          ))}
        </View>
      </div>
      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>Charging Sessions:</Text>
        <View style={styles.legendItems}>
          <View style={[styles.legendItem, { backgroundColor: '#d1e6f9' }]}>
            <Text style={styles.legendItemText}>1-2</Text>
          </View>
          <View style={[styles.legendItem, { backgroundColor: '#a7d1f4' }]}>
            <Text style={styles.legendItemText}>3-5</Text>
          </View>
          <View style={[styles.legendItem, { backgroundColor: '#76b9f0' }]}>
            <Text style={styles.legendItemText}>6-9</Text>
          </View>
          <View style={[styles.legendItem, { backgroundColor: '#4a9eea' }]}>
            <Text style={styles.legendItemText}>10-14</Text>
          </View>
          <View style={[styles.legendItem, { backgroundColor: '#2089dc' }]}>
            <Text style={styles.legendItemText}>15+</Text>
          </View>
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  scrollableContainer: {
    overflowX: 'auto',
    width: '100%'
  },
  heatmapContainer: {
    marginBottom: 16,
    minWidth: 700,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cornerCell: {
    width: 40,
  },
  headerCell: {
    width: 75, // Each header cell represents 3 hours
    alignItems: 'center',
  },
  headerText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  rowHeaderCell: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    margin: 0.5,
  },
  cellText: {
    fontSize: 10,
    color: '#333',
    fontWeight: '500',
  },
  legendContainer: {
    marginTop: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    width: 50,
    padding: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  legendItemText: {
    fontSize: 10,
    color: '#333',
  },
});