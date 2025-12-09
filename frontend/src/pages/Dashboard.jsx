import React, { useState, useEffect } from 'react';
import Analytics from '../components/Analytics';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalQueries: 0,
    avgConfidence: 0,
    avgResponseTime: 0,
    recentQueries: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Analytics stats={stats} />
    </div>
  );
};

export default Dashboard;
