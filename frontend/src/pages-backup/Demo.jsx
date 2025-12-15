import React, { useState } from 'react';
import DocumentUpload from '../components/DocumentUpload';
import QueryInput from '../components/QueryInput';
import ResponseDisplay from '../components/ResponseDisplay';
import AgentWorkflow from '../components/AgentWorkflow';

const Demo = () => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workflow, setWorkflow] = useState(null);

  const handleUpload = async (formData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Document uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuery = async (query) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponse(data);
      setWorkflow(data.workflow);
    } catch (error) {
      console.error('Query error:', error);
      alert('Failed to process query');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DocumentUpload onUpload={handleUpload} />
      <QueryInput onSubmit={handleQuery} />
      <ResponseDisplay response={response} isLoading={isLoading} />
      {workflow && <AgentWorkflow workflow={workflow} />}
    </div>
  );
};

export default Demo;
