import React from 'react';
import { PieChart, BarChart3, TrendingUp } from 'lucide-react';

const Analytics = ({ stats }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <TrendingUp className="w-6 h-6 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Total Queries</span>
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{stats.totalQueries || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Avg Confidence</span>
            <PieChart className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">
            {((stats.avgConfidence || 0) * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Avg Response Time</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{stats.avgResponseTime || 0}ms</p>
        </div>
      </div>

      {stats.recentQueries && stats.recentQueries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Queries</h3>
          <div className="space-y-2">
            {stats.recentQueries.map((query, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-sm text-gray-700">{query.text}</p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {((query.confidence || 0) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
