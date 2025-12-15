import React from 'react';
import './index.css';

function App() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '40px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚀 Prompt2Support
        </h1>
        
        <p style={{ fontSize: '20px', color: '#666', marginBottom: '30px' }}>
          Autonomous Multi-Agent Customer Support System for MSMEs
        </p>

        <div style={{
          background: '#f0f4ff',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>✅ Backend Status</h2>
          <p>Backend is running on port 5001</p>
          <p>5 AI Agents ready to process queries</p>
        </div>

        <div style={{
          background: '#fff4e6',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>🎯 Next Steps</h2>
          <ol style={{ paddingLeft: '20px' }}>
            <li>Upload demo documents</li>
            <li>Test queries</li>
            <li>Watch agents work together</li>
          </ol>
        </div>

        <button 
          onClick={() => alert('Demo functionality - connect to backend')}
          style={{
            marginTop: '30px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Test Backend Connection
        </button>
      </div>
    </div>
  );
}

export default App;
