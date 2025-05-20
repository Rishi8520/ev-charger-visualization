import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { VictoryPie, VictoryLegend } from 'victory';

export function StationUtilizationPie({ data, title }) {
  // Format data for pie chart
  const pieData = data.map(station => ({
    x: station.stationId,
    y: station.sessions,
    label: `${station.stationId}: ${station.sessions} sessions`
  }));
  
  // Generate colors for each slice
  const colorScale = ['#007AFF', '#34C759', '#5856D6', '#FF9500', '#FF3B30'];
  
  // Format data for legend
  const legendData = data.map((station, index) => ({
    name: `${station.stationId} (${station.sessions} sessions)`,
    symbol: { fill: colorScale[index % colorScale.length] }
  }));
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <div style={{ width: '100%', height: 300 }}>
        <VictoryPie
          data={pieData}
          colorScale={colorScale}
          width={350}
          height={300}
          padding={50}
          innerRadius={70}
          labelRadius={90}
          style={{
            labels: {
              fontSize: 0 // Hide the labels on the pie itself
            }
          }}
        />
      </div>
      <div style={{ width: '100%' }}>
        <VictoryLegend
          x={50}
          y={0}
          width={300}
          centerTitle
          orientation="horizontal"
          gutter={20}
          style={{ 
            labels: { fontSize: 12 }
          }}
          data={legendData}
        />
      </div>
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
    marginBottom: 8,
    textAlign: 'center',
  }
});