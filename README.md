# Prompt2Support – Autonomous Multi-Agent Customer Support System for MSMEs

Prompt2Support is an AI-powered multi-agent system that automates customer support for MSMEs by understanding queries, retrieving information from documents, generating accurate responses, and verifying correctness.

### 🚀 Why This Project?
MSMEs struggle because:
- Customer support is slow and inconsistent
- Information is scattered across PDFs, invoices, manuals, emails
- Staff manually search for answers

This system solves it using 5 AI agents:
1. **Understanding Agent** – Classifies intent and extracts entities
2. **Retrieval Agent** – Performs semantic search over documents
3. **Reasoning Agent** – Generates accurate customer response
4. **Verification Agent** – Ensures it's grounded & hallucination-free
5. **Action Agent** – Creates tickets, drafts emails, schedules callbacks

### 🧠 Core Features
- Multi-agent pipeline (Agentic AI)
- PDF/Doc/TXT ingestion & automatic chunking
- Vector search with embeddings
- Real-time workflow visualization
- Scalable across industries

---

## 📦 Tech Stack
**Backend**
- Node.js / Express
- Multi-agent orchestration
- PDF & DOCX parsers
- Custom embedding + vector search

**Frontend**
- React + Tailwind
- Upload documents
- Query interface
- Agent workflow visualizer

---

## 🛠 Installation

### Backend
```bash
cd backend
npm ci
npm run dev
import React from 'react';

const AgentWorkflowVisualizer = ({ workflow }) => {
  const agents = [
    {
      id: 'understanding',
      name: 'Understanding Agent',
      icon: '🧠',
      description: 'Analyzing query intent'
    },
    {
      id: 'retrieval',
      name: 'Retrieval Agent',
      icon: '🔍',
      description: 'Searching documents'
    },
    {
      id: 'reasoning',
      name: 'Reasoning Agent',
      icon: '💡',
      description: 'Generating answer'
    },
    {
      id: 'verification',
      name: 'Verification Agent',
      icon: '✅',
      description: 'Checking accuracy'
    },
    {
      id: 'action',
      name: 'Action Agent',
      icon: '⚡',
      description: 'Taking actions'
    }
  ];

  const getAgentStatus = (agentId) => {
    if (!workflow?.steps) return 'pending';
    const step = workflow.steps.find(s => s.agent === agentId);
    return step?.status || 'pending';
  };

  const getAgentOutput = (agentId) => {
    if (!workflow?.steps) return null;
    const step = workflow.steps.find(s => s.agent === agentId);
    return step?.output;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">🤖 Agent Workflow</h3>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 z-0"></div>

        {/* Agent Cards */}
        <div className="grid grid-cols-5 gap-4 relative z-10">
          {agents.map((agent, idx) => {
            const status = getAgentStatus(agent.id);
            const output = getAgentOutput(agent.id);

            return (
              <div key={agent.id} className="flex flex-col items-center">
                {/* Agent Icon */}
                <div
                  className={`w-20 h-20 rounded-full ${getStatusColor(status)}
                    flex items-center justify-center text-3xl mb-2 shadow-lg
                    transition-all duration-300 transform hover:scale-110`}
                >
                  {agent.icon}
                </div>

                {/* Agent Name */}
                <h4 className="text-sm font-semibold text-center mb-1">
                  {agent.name}
                </h4>

                {/* Status Badge */}
                <div className={`text-xs px-2 py-1 rounded-full mb-2 ${
                  status === 'completed' ? 'bg-green-100 text-green-800' :
                  status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {status}
                </div>

                {/* Output Summary */}
                {output && status === 'completed' && (
                  <div className="text-xs text-gray-600 text-center mt-2 max-w-full">
                    {agent.id === 'understanding' && output.intent && (
                      <span className="bg-purple-100 px-2 py-1 rounded">
                        Intent: {output.intent}
                      </span>
                    )}
                    {agent.id === 'retrieval' && output.documentsFound && (
                      <span className="bg-blue-100 px-2 py-1 rounded">
                        Found: {output.documentsFound} docs
                      </span>
                    )}
                    {agent.id === 'verification' && output.confidence && (
                      <span className="bg-green-100 px-2 py-1 rounded">
                        Confidence: {Math.round(output.confidence * 100)}%
                      </span>
                    )}
                    {agent.id === 'action' && output.actions && (
                      <span className="bg-orange-100 px-2 py-1 rounded">
                        Actions: {output.actions.length}
                      </span>
                    )}
                  </div>
                )}

                {/* Arrow */}
                {idx < agents.length - 1 && (
                  <div className="absolute top-12 text-gray-400 text-2xl"
                    style={{ left: `${(idx + 1) * 20}%` }}>
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Output (Expandable) */}
      {workflow?.steps && workflow.steps.length > 0 && (
        <details className="mt-6 bg-gray-50 rounded p-4">
          <summary className="cursor-pointer font-semibold text-gray-700">
            📋 View Detailed Logs
          </summary>
          <div className="mt-4 space-y-3 text-sm">
            {workflow.steps.map((step, idx) => (
              <div key={idx} className="border-l-4 border-purple-500 pl-4">
                <div className="font-semibold text-gray-800 capitalize">
                  {step.agent} Agent
                </div>
                <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(step.output, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default AgentWorkflowVisualizer;