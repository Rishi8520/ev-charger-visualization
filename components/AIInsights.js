import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { fetchInsightsFromAI } from '../utils/aiHelpers';

export function AIInsights({ data }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisTimestamp, setAnalysisTimestamp] = useState(null);

  // Generate insights whenever the data changes
  useEffect(() => {
    const generateInsights = async () => {
      if (!data || !data.dailyUsage || data.dailyUsage.length === 0) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log("Generating insights from data:", data);
        const result = await fetchInsightsFromAI(data);
        
        setInsights(result.text);
        setAnalysisTimestamp(new Date());
      } catch (err) {
        console.error("Error generating insights:", err);
        setError('Unable to analyze data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Data-Driven Insights</Text>
      </View>
      
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2089dc" />
            <Text style={styles.loadingText}>Analyzing data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.insightsText}>{insights || "No insights available"}</Text>
            {analysisTimestamp && (
              <Text style={styles.dataRangeText}>
                Analysis of {data?.dailyUsage?.length || 0} days of data
              </Text>
            )}
          </>
        )}
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
  headerContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    minHeight: 150,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    color: '#ff3b30',
    textAlign: 'center',
  },
  insightsText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  dataRangeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    fontStyle: 'italic',
  }
});