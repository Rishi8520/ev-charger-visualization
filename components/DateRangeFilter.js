import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export function DateRangeFilter({ onFilterChange, initialRange = '7d' }) {
  const [selectedRange, setSelectedRange] = React.useState(initialRange);

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    onFilterChange(range);
    console.log('Filter changed to:', range); // Add logging for debugging
  };

  return (
    <View style={styles.container}>
      <Text style={styles.filterTitle}>Filter by Date Range</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedRange === '7d' && styles.activeFilterButton
          ]}
          onPress={() => handleRangeChange('7d')}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedRange === '7d' && styles.activeFilterButtonText
            ]}
          >
            Last 7 Days
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedRange === '14d' && styles.activeFilterButton
          ]}
          onPress={() => handleRangeChange('14d')}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedRange === '14d' && styles.activeFilterButtonText
            ]}
          >
            Last 14 Days
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedRange === '30d' && styles.activeFilterButton
          ]}
          onPress={() => handleRangeChange('30d')}
        >
          <Text 
            style={[
              styles.filterButtonText,
              selectedRange === '30d' && styles.activeFilterButtonText
            ]}
          >
            Last 30 Days
          </Text>
        </TouchableOpacity>
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
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 8,
    minWidth: 100,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#2089dc',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterButtonText: {
    color: 'white',
  },
});