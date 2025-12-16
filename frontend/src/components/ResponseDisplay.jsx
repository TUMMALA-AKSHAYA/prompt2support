import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const ResponseDisplay = ({ response, isLoading }) => {
  if (!response) return null;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Response</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Clock className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Answer Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Answer
            </h3>
            <p className="text-gray-700">{response.answer}</p>
          </div>

          {/* Confidence Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              Confidence
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${(response.confidence || 0) * 100}%`,
                  }}
                />
              </div>
              <span className="font-semibold">
                {((response.confidence || 0) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Sources Section */}
          {response.sources && response.sources.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Sources</h3>
              <ul className="space-y-2">
                {response.sources.map((source, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    • {source}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Processing Time */}
          <div className="text-sm text-gray-500">
            Processed in {response.processingTime}ms
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
