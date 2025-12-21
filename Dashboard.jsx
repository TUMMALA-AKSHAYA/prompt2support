import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { queryAPI, documentAPI } from '../services/api';

const Dashboard = () => {
  const [queryHistory, setQueryHistory] = useState([]);
  const [docStats, setDocStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [historyRes, statsRes] = await Promise.all([
        queryAPI.getHistory(20).catch(() => ({ data: [] })),
        documentAPI.getStats().catch(() => ({ data: { totalVectors: 0, documentsIndexed: 0 } }))
      ]);
      
      setQueryHistory(historyRes.data || []);
      setDocStats(statsRes.data || { totalVectors: 0, documentsIndexed: 0 });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
      setQueryHistory([]);
      setDocStats({ totalVectors: 0, documentsIndexed: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-yellow-50 p-6">
          <p className="text-yellow-800">{error}</p>
          <button onClick={fetchData} className="mt-4 btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const metrics = {
    totalQueries: queryHistory.length,
    avgResponseTime: queryHistory.length > 0 
      ? Math.round(queryHistory.reduce((sum, q) => sum + (q.result?.duration || 0), 0) / queryHistory.length)
      : 0,
    successRate: queryHistory.length > 0
      ? ((queryHistory.filter(q => q.result?.status === 'completed').length / queryHistory.length) * 100).toFixed(1)
      : 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600 text-lg">Real-time insights into your support system</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Queries</h3>
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.totalQueries}</p>
          <p className="text-sm text-gray-500 mt-2">All time</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Response Time</h3>
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.avgResponseTime}ms</p>
          <p className="text-sm text-green-600 mt-2">✓ Fast responses</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
            <CheckCircle className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.successRate}%</p>
          <p className="text-sm text-gray-500 mt-2">Completed queries</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Documents</h3>
            <TrendingUp className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{docStats?.documentsIndexed || 0}</p>
          <p className="text-sm text-gray-500 mt-2">{docStats?.totalVectors || 0} chunks indexed</p>
        </div>
      </div>

      {/* Recent Queries */}
      {queryHistory.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Recent Queries</h3>
          <div className="space-y-3">
            {queryHistory.slice(0, 10).map((item, idx) => {
              const understanding = item.result?.finalResponse?.understanding;
              
              return (
                <div key={idx} className="border-l-4 border-primary bg-gray-50 p-4 rounded-r-lg">
                  <p className="font-medium text-gray-900 mb-2">{item.query}</p>
                  <div className="flex flex-wrap gap-2">
                    {understanding && (
                      <>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {understanding.intent}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                          {understanding.priority}
                        </span>
                      </>
                    )}
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {queryHistory.length === 0 && (
        <div className="card text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Queries Yet</h3>
          <p className="text-gray-600">Process some queries to see analytics here!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
