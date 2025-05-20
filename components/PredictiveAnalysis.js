import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { ChargerUsageChart } from './ChargerUsageChart';
import { generatePredictions } from '../utils/aiHelpers';

export function PredictiveAnalysis({ dailyUsageData }) {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        setLoading(true);
        console.log(`Generating predictions based on ${dailyUsageData.length} days of data`);
        const result = await generatePredictions(dailyUsageData);
        setPredictions(result);
      } catch (err) {
        setError('Failed to generate predictions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, [dailyUsageData]);

  // Format prediction data for the chart
  const getPredictionChartData = () => {
    if (!predictions || !predictions.predictions) return [];
    
    return predictions.predictions.map(item => ({
      x: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      y: item.predictedSessions,
      label: `${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}\nPredicted: ${item.predictedSessions} sessions`
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Usage Predictions</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2089dc" />
          <Text style={styles.loadingText}>Generating predictions...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          <ChargerUsageChart
            data={getPredictionChartData()}
            title="7-Day Usage Forecast"
            chartType="line"
            xAxisLabel="Date"
            yAxisLabel="Predicted Sessions"
          />
          
          {predictions && predictions.insight && (
            <View style={styles.insightContainer}>
              <Text style={styles.insightText}>
                {predictions.insight}
              </Text>
              <Text style={styles.dataRangeText}>
                Based on {dailyUsageData.length} days of historical data
              </Text>
            </View>
          )}
        </>
      )}
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
  headerContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#ff3b30',
    textAlign: 'center',
  },
  insightContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f7ff',
    borderRadius: 6,
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  dataRangeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  }
});