import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryTooltip, VictoryLine } from 'victory';

export function ChargerUsageChart({
  data,
  title,
  chartType = 'bar',
  xAxisLabel,
  yAxisLabel,
  style,
}) {
  const chartColor = '#2089dc';
  
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 20 }}
        padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
        height={300}
      >
        <VictoryAxis
          tickFormat={(tick) => tick}
          style={{
            axis: { stroke: '#757575' },
            ticks: { stroke: '#757575' },
            tickLabels: { fill: '#757575', fontSize: 10, angle: -45, textAnchor: 'end' }
          }}
          label={xAxisLabel}
          axisLabelComponent={<VictoryAxis.Label dy={25} style={{ fill: '#757575', fontSize: 12 }} />}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: '#757575' },
            ticks: { stroke: '#757575' },
            tickLabels: { fill: '#757575', fontSize: 10 }
          }}
          label={yAxisLabel}
          axisLabelComponent={<VictoryAxis.Label dy={-45} style={{ fill: '#757575', fontSize: 12 }} />}
        />
        
        {chartType === 'bar' ? (
          <VictoryBar
            data={data}
            style={{
              data: { fill: chartColor }
            }}
            labelComponent={
              <VictoryTooltip
                style={{ fill: '#333', fontSize: 10 }}
                flyoutStyle={{ fill: 'white', stroke: chartColor }}
              />
            }
          />
        ) : (
          <VictoryLine
            data={data}
            style={{
              data: { stroke: chartColor, strokeWidth: 3 }
            }}
            labelComponent={
              <VictoryTooltip
                style={{ fill: '#333', fontSize: 10 }}
                flyoutStyle={{ fill: 'white', stroke: chartColor }}
              />
            }
          />
        )}
      </VictoryChart>
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
  },
});