import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [backendData, setBackendData] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [query, setQuery] = useState('');
  const [processing, setProcessing] = useState(false);
  const [workflow, setWorkflow] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    checkBackend();
    fetchStats();
  }, []);

  const checkBackend = () => {
    fetch('http://localhost:5001/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus('✅ Connected');
        setBackendData(data);
      })
      .catch(err => {
        setBackendStatus('❌ Not Connected');
        console.error(err);
      });
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/documents/stats');
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage('');
  };

  const uploadDocument = async () => {
    if (!file) {
      setUploadMessage('❌ Please select a file first');
      return;
    }

    setUploading(true);
    setUploadMessage('');

    const formData = new FormData();
    formData.append('document', file);
    formData.append('category', 'support_docs');

    try {
      const response = await fetch('http://localhost:5001/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setUploadMessage(`✅ Uploaded! ${data.data.chunks} chunks indexed`);
        setFile(null);
        fetchStats();
        document.getElementById('fileInput').value = '';
      } else {
        setUploadMessage('❌ Upload failed: ' + data.error);
      }
    } catch (error) {
      setUploadMessage('❌ Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const processQuery = async () => {
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }

    setProcessing(true);
    setWorkflow(null);

    try {
      const response = await fetch('http://localhost:5001/api/queries/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          generateActions: true
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setWorkflow(data.data);
        console.log('Full workflow:', data.data);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const sampleQueries = [
    "What is your return policy?",
    "I bought TechPhone X Pro, what's the warranty?",
    "Can I get EMI on a ₹15,000 laptop?",
    "How do I track my order?"
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '30px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h1 style={{ 
          fontSize: '42px', 
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚀 Prompt2Support
        </h1>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Autonomous Multi-Agent Customer Support System
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Backend Status */}
        <div style={{
          background: backendStatus.includes('✅') ? '#d4edda' : '#f8d7da',
          padding: '20px',
          borderRadius: '12px',
          border: `2px solid ${backendStatus.includes('✅') ? '#28a745' : '#dc3545'}`
        }}>
          <h3 style={{ marginBottom: '10px' }}>Backend: {backendStatus}</h3>
          {backendData && (
            <div style={{ fontSize: '14px' }}>
              <p>✅ Port {backendData.port || 5001}</p>
              <p>✅ Gemini AI: {backendData.geminiKeyLoaded ? 'Ready' : 'Missing'}</p>
            </div>
          )}
        </div>

        {/* Document Stats */}
        <div style={{
          background: '#e3f2fd',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #2196f3'
        }}>
          <h3 style={{ marginBottom: '10px' }}>📚 Documents</h3>
          {stats && (
            <div style={{ fontSize: '14px' }}>
              <p>📄 Indexed: {stats.documentsIndexed} files</p>
              <p>📊 Chunks: {stats.totalVectors}</p>
            </div>
          )}
        </div>
      </div>

      {/* Document Upload */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '30px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>📤 Upload Documents</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <input 
            id="fileInput"
            type="file" 
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            style={{ 
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              flex: 1
            }}
          />
          <button 
            onClick={uploadDocument}
            disabled={uploading || !file}
            style={{
              background: uploading ? '#ccc' : '#667eea',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: uploading ? 'wait' : 'pointer',
              fontWeight: '600'
            }}
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload'}
          </button>
        </div>
        {uploadMessage && (
          <div style={{ 
            padding: '10px', 
            background: uploadMessage.includes('✅') ? '#d4edda' : '#f8d7da',
            borderRadius: '8px',
            marginTop: '10px'
          }}>
            {uploadMessage}
          </div>
        )}
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          💡 Tip: Upload your warranty_policy.pdf, return_policy.pdf, product_catalog.pdf, faq.pdf
        </p>
      </div>

      {/* Query Interface */}
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '30px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>💬 Ask a Question</h2>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your customer support query here..."
          style={{
            width: '100%',
            padding: '15px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'inherit',
            minHeight: '100px',
            marginBottom: '10px'
          }}
        />
        <button 
          onClick={processQuery}
          disabled={processing || !query.trim()}
          style={{
            width: '100%',
            background: processing ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '18px',
            fontWeight: '600',
            cursor: processing ? 'wait' : 'pointer'
          }}
        >
          {processing ? '⏳ Processing with 5 AI Agents...' : '🚀 Process Query'}
        </button>

        {/* Sample Queries */}
        <div style={{ marginTop: '15px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            💡 Try these sample queries:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {sampleQueries.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(sq)}
                style={{
                  padding: '10px',
                  background: '#f0f4ff',
                  border: '1px solid #667eea',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px'
                }}
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Results */}
      {workflow && (
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '30px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>
            🤖 Agent Workflow ({workflow.duration}ms)
          </h2>

          {/* Agent Steps */}
          {workflow.steps.map((step, idx) => (
            <div 
              key={idx}
              style={{
                borderLeft: '4px solid #667eea',
                padding: '15px',
                marginBottom: '15px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}
            >
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>
                {idx + 1}. {step.agent} Agent - {step.status}
              </h3>
              <pre style={{ 
                background: 'white', 
                padding: '10px', 
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {JSON.stringify(step.result, null, 2)}
              </pre>
            </div>
          ))}

          {/* Final Answer */}
          {workflow.finalResponse && (
            <div style={{
              background: '#d4edda',
              padding: '20px',
              borderRadius: '12px',
              marginTop: '20px',
              border: '2px solid #28a745'
            }}>
              <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>✅ Final Answer:</h3>
              <p style={{ fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {workflow.finalResponse.answer}
              </p>
              <div style={{ marginTop: '15px', fontSize: '14px' }}>
                <strong>Confidence:</strong> {workflow.finalResponse.confidence}
                <br />
                <strong>Sources:</strong> {workflow.finalResponse.sources.join(', ')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
