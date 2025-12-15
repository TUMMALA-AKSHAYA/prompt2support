import React from 'react';
import { Brain, Search, Lightbulb, CheckCircle, Zap, Clock } from 'lucide-react';

const AgentWorkflow = ({ workflow }) => {
  const agentIcons = {
    Understanding: Brain,
    Retrieval: Search,
    Reasoning: Lightbulb,
    Verification: CheckCircle,
    Action: Zap,
  };

  const agentColors = {
    Understanding: 'bg-blue-500',
    Retrieval: 'bg-green-500',
    Reasoning: 'bg-purple-500',
    Verification: 'bg-yellow-500',
    Action: 'bg-red-500',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Agent Workflow</h2>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>{workflow.duration}ms</span>
        </div>
      </div>

      <div className="space-y-4">
        {workflow.steps.map((step, idx) => {
          const Icon = agentIcons[step.agent];
          const colorClass = agentColors[step.agent];

          return (
            <div
              key={idx}
              className="agent-step agent-animation border-l-4"
              style={{
                animationDelay: `${idx * 0.1}s`,
                borderColor: colorClass.replace('bg-', '#'),
              }}
            >
              <div className="flex items-start space-x-4">
                <div className={`${colorClass} p-3 rounded-lg flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">{step.agent} Agent</h3>
                    <span className="badge bg-green-100 text-green-800">
                      {step.status}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    {renderAgentResult(step.agent, step.result)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const renderAgentResult = (agentName, result) => {
  switch (agentName) {
    case 'Understanding':
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Intent:</span> {result.intent}
            </div>
            <div>
              <span className="font-semibold">Priority:</span>{' '}
              <span
                className={`badge ${
                  result.priority === 'high' || result.priority === 'critical'
                    ? 'bg-red-100 text-red-800'
                    : result.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {result.priority}
              </span>
            </div>
            <div>
              <span className="font-semibold">Sentiment:</span> {result.sentiment}
            </div>
            <div>
              <span className="font-semibold">Category:</span> {result.category}
            </div>
          </div>
          {Object.keys(result.entities).length > 0 && (
            <div>
              <span className="font-semibold">Entities:</span>{' '}
              {JSON.stringify(result.entities)}
            </div>
          )}
        </div>
      );

    case 'Retrieval':
      return (
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Retrieved Chunks:</span> {result.totalFound}
          </div>
          <div>
            <span className="font-semibold">Sources:</span>{' '}
            {result.sources.join(', ')}
          </div>
          <div>
            <span className="font-semibold">Avg Relevance:</span>{' '}
            {(
              result.relevanceScores.reduce((a, b) => a + b, 0) /
              result.relevanceScores.length
            ).toFixed(2)}
          </div>
        </div>
      );

    case 'Reasoning':
      return (
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Confidence:</span>{' '}
            <span
              className={`badge ${
                result.confidence === 'high'
                  ? 'bg-green-100 text-green-800'
                  : result.confidence === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {result.confidence}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Answer generated from {result.sourcesUsed.length} source(s)
          </div>
        </div>
      );

    case 'Verification':
      return (
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Accurate:</span>{' '}
            {result.isAccurate ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <span className="font-semibold">Verdict:</span>{' '}
            <span
              className={`badge ${
                result.finalVerdict === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : result.finalVerdict === 'escalate_to_human'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {result.finalVerdict}
            </span>
          </div>
          {result.issues.length > 0 && (
            <div className="text-sm text-red-600">
              Issues: {result.issues.join(', ')}
            </div>
          )}
        </div>
      );

    case 'Action':
      return (
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Recommended Actions:</span>{' '}
            {result.recommendedActions.length}
          </div>
          <ul className="list-disc list-inside text-sm space-y-1">
            {result.recommendedActions.map((action, idx) => (
              <li key={idx}>{action.type.replace('_', ' ')}</li>
            ))}
          </ul>
        </div>
      );

    default:
      return <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>;
  }
};

export default AgentWorkflow;
