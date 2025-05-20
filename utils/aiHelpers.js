/**
 * Local data analysis utilities for generating insights and predictions
 * No API keys required - all processing done client-side
 */

/**
 * Generates insights based on the charging data
 */
export async function fetchInsightsFromAI(data) {
  try {
    // Generate insights locally from the data
    return {
      text: generateDataDrivenInsights(data),
      source: 'local-analysis'
    };
  } catch (error) {
    console.error("Error generating insights:", error);
    return {
      text: "Unable to analyze data at this time.",
      source: 'error'
    };
  }
}

/**
 * Generates usage predictions for future days
 */
export async function generatePredictions(dailyUsageData) {
  try {
    return generateLocalPredictions(dailyUsageData);
  } catch (error) {
    console.error("Error generating predictions:", error);
    return {
      predictions: [],
      insight: "Unable to generate predictions at this time.",
      source: 'error'
    };
  }
}

/**
 * Generates insights based on actual patterns in the data
 */
function generateDataDrivenInsights(data) {
  // Extract key metrics
  const dailyData = data.dailyUsage || [];
  const hourlyData = data.hourlyUsage || [];
  const stationData = data.stationUsage || [];
  
  // Guard against empty data
  if (!dailyData.length) return "No data available for analysis.";
  
  const daysCount = dailyData.length;
  const dateRange = `${daysCount} days`;
  const startDate = new Date(dailyData[0].date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  const endDate = new Date(dailyData[dailyData.length-1].date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  
  // Calculate total sessions and energy
  const totalSessions = dailyData.reduce((sum, day) => sum + day.sessions, 0);
  const totalEnergy = dailyData.reduce((sum, day) => sum + day.energyDelivered, 0).toFixed(1);
  const avgSessionsPerDay = (totalSessions / daysCount).toFixed(1);
  const avgEnergyPerSession = (totalEnergy / totalSessions).toFixed(1);
  
  // Find peak usage day
  const peakDay = dailyData.reduce((max, day) => day.sessions > max.sessions ? day : max, dailyData[0]);
  const peakDayName = new Date(peakDay.date).toLocaleDateString('en-US', {weekday: 'long'});
  const peakDayDate = new Date(peakDay.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  
  // Check for weekday vs weekend patterns
  const weekdayData = dailyData.filter(day => {
    const dayOfWeek = new Date(day.date).getDay();
    return dayOfWeek > 0 && dayOfWeek < 6; // Monday-Friday
  });
  
  const weekendData = dailyData.filter(day => {
    const dayOfWeek = new Date(day.date).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  });
  
  const avgWeekdaySessions = weekdayData.reduce((sum, day) => sum + day.sessions, 0) / weekdayData.length;
  const avgWeekendSessions = weekendData.reduce((sum, day) => sum + day.sessions, 0) / weekendData.length;
  const weekdayWeekendDiff = (((avgWeekdaySessions - avgWeekendSessions) / avgWeekendSessions) * 100).toFixed(0);
  
  // Find busiest hours if hourly data is available
  let peakHour = "N/A";
  if (hourlyData.length > 0) {
    const peakHourData = hourlyData.reduce((max, hour) => hour.sessions > max.sessions ? hour : max, hourlyData[0]);
    peakHour = peakHourData.hour;
  }
  
  // Find top station if station data is available
  let topStation = "N/A";
  let bottomStation = "N/A";
  if (stationData.length > 0) {
    const topStationData = stationData.reduce((max, station) => station.sessions > max.sessions ? station : max, stationData[0]);
    const bottomStationData = stationData.reduce((min, station) => station.sessions < min.sessions ? station : min, stationData[0]);
    topStation = topStationData.stationId;
    bottomStation = bottomStationData.stationId;
  }
  
  // Generate insights based on analyzed data
  return `• Over the ${dateRange} analyzed (${startDate} to ${endDate}), there were ${totalSessions} charging sessions with an average of ${avgSessionsPerDay} sessions per day.

• Peak usage occurred on ${peakDayName}, ${peakDayDate} with ${peakDay.sessions} sessions, and the busiest time of day was around ${peakHour}.

• Weekday usage is ${weekdayWeekendDiff}% higher than weekend usage, suggesting an opportunity to implement weekend discount promotions.

• ${topStation} has the highest utilization while ${bottomStation} is underutilized, indicating potential for load balancing between stations.`;
}

/**
 * Generate predictions based on historical data patterns
 */
function generateLocalPredictions(dailyUsageData) {
  if (!dailyUsageData || dailyUsageData.length === 0) {
    return {
      predictions: [],
      insight: "Insufficient data for predictions",
      source: 'local-analysis'
    };
  }
  
  // Calculate averages and trends
  const totalDays = dailyUsageData.length;
  const avgSessions = dailyUsageData.reduce((sum, item) => sum + item.sessions, 0) / totalDays;
  const avgEnergy = dailyUsageData.reduce((sum, item) => sum + item.energyDelivered, 0) / totalDays;
  
  // Calculate trend (are sessions increasing or decreasing?)
  let trend = 0;
  if (totalDays >= 3) {
    const firstHalf = dailyUsageData.slice(0, Math.floor(totalDays/2));
    const secondHalf = dailyUsageData.slice(Math.floor(totalDays/2));
    
    const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.sessions, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.sessions, 0) / secondHalf.length;
    
    trend = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  }
  
  // Get patterns by day of week if we have enough data
  const dayOfWeekPatterns = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
  const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0];
  
  dailyUsageData.forEach(item => {
    const date = new Date(item.date);
    const dayOfWeek = date.getDay();
    dayOfWeekPatterns[dayOfWeek] += item.sessions;
    dayOfWeekCounts[dayOfWeek]++;
  });
  
  // Average by day of week
  for (let i = 0; i < 7; i++) {
    if (dayOfWeekCounts[i] > 0) {
      dayOfWeekPatterns[i] = dayOfWeekPatterns[i] / dayOfWeekCounts[i];
    }
  }
  
  // Start from the day after the last date in the data
  const lastDate = new Date(dailyUsageData[dailyUsageData.length - 1].date);
  
  // Generate predictions for the next 7 days
  const predictions = [];
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + i);
    
    const dayOfWeek = nextDate.getDay();
    
    // Use day of week pattern if available, otherwise use average with trend
    let predictedSessions;
    if (dayOfWeekCounts[dayOfWeek] > 0) {
      // Day of week pattern with slight random variation
      predictedSessions = Math.round(dayOfWeekPatterns[dayOfWeek] * (0.9 + Math.random() * 0.2));
    } else {
      // Average with trend and slight random variation
      const trendFactor = 1 + (trend / 100) * (i / 7); // Apply trend progressively
      predictedSessions = Math.round(avgSessions * trendFactor * (0.9 + Math.random() * 0.2));
    }
    
    // Energy is proportional to sessions
    const sessionToEnergyRatio = avgEnergy / avgSessions;
    const predictedEnergy = +(predictedSessions * sessionToEnergyRatio).toFixed(1);
    
    predictions.push({
      date: nextDate.toISOString().split('T')[0],
      predictedSessions: predictedSessions,
      predictedEnergy: predictedEnergy
    });
  }
  
  // Generate insight text based on the predictions and trends
  let insightText = "";
  if (trend > 5) {
    insightText = `Based on ${dailyUsageData.length} days of data, usage is trending upward (${trend.toFixed(1)}%). Expect continued growth in the coming week.`;
  } else if (trend < -5) {
    insightText = `Based on ${dailyUsageData.length} days of data, usage is trending downward (${trend.toFixed(1)}%). Consider promotional activities to boost utilization.`;
  } else {
    insightText = `Based on ${dailyUsageData.length} days of data, usage is relatively stable. Expect similar patterns in the coming week.`;
  }
  
  return {
    predictions,
    insight: insightText,
    source: 'local-analysis'
  };
}