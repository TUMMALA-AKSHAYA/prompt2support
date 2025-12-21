import React, { useState, useEffect } from 'react';
import Analytics from '../components/Analytics';

const Dashboard = () => {
  // ---------- EXISTING STATS ----------
  const [stats, setStats] = useState({
    totalQueries: 0,
    avgConfidence: 0,
    avgResponseTime: 0,
    recentQueries: [],
  });

  // ---------- GOOGLE CONNECTION STATUS ----------
  const [googleConnected, setGoogleConnected] = useState(false);

  // ---------- ACTIONS FOR APPROVAL ----------
  const [pendingActions, setPendingActions] = useState([]);

  // ---------- FETCH ANALYTICS & GOOGLE STATUS ----------
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

    const fetchGoogleStatus = async () => {
      try {
        const res = await fetch('/auth/status');
        const data = await res.json();
        setGoogleConnected(data.connected);
      } catch (error) {
        console.error('Failed to fetch Google status:', error);
      }
    };

    const fetchPendingActions = async () => {
      try {
        const res = await fetch('/actions/pending');
        const data = await res.json();
        setPendingActions(data);
      } catch (error) {
        console.error('Failed to fetch pending actions:', error);
      }
    };

    // Initial fetch
    fetchAnalytics();
    fetchGoogleStatus();
    fetchPendingActions();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAnalytics();
      fetchGoogleStatus();
      fetchPendingActions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ---------- APPROVE ACTION ----------
  const approveAction = async (action) => {
    try {
      await fetch('/actions/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });
      // Remove approved action from list
      setPendingActions((prev) => prev.filter((a) => a.id !== action.id));
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* ---------- GOOGLE CONNECT BUTTON ---------- */}
      <div className="mb-4">
        {googleConnected ? (
          <span className="text-green-600 font-semibold">
            Google Account Connected
          </span>
        ) : (
          <button
            onClick={() =>
              (window.location.href = 'http://localhost:5000/auth/google')
            }
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Connect Google Account
          </button>
        )}
      </div>

      {/* ---------- PENDING ACTIONS ---------- */}
      {pendingActions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Pending Actions</h2>
          {pendingActions.map((action) => (
            <div
              key={action.id}
              className="border p-3 mb-2 rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <p>
                  <b>Type:</b> {action.type}
                </p>
                {action.data.title && <p><b>Title:</b> {action.data.title}</p>}
                {action.data.subject && <p><b>Subject:</b> {action.data.subject}</p>}
                {action.data.body && <p><b>Body:</b> {action.data.body}</p>}
              </div>
              <button
                onClick={() => approveAction(action)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------- EXISTING ANALYTICS ---------- */}
      <Analytics stats={stats} />
    </div>
  );
};

export default Dashboard;z