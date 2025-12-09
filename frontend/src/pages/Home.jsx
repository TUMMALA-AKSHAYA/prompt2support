import React from 'react';
import { Zap, Sparkles, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="gradient-bg text-white rounded-lg p-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to Prompt2Support</h1>
          <p className="text-xl mb-6">
            AI-powered document analysis and query system with intelligent agents
          </p>
          <button className="btn-primary">Get Started</button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <Zap className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Fast Processing</h3>
          <p className="text-gray-600">
            Get instant answers from your documents using advanced AI agents
          </p>
        </div>

        <div className="card">
          <Sparkles className="w-12 h-12 text-purple-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Smart Analysis</h3>
          <p className="text-gray-600">
            Multi-agent architecture for comprehensive document understanding
          </p>
        </div>

        <div className="card">
          <Shield className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Verified Answers</h3>
          <p className="text-gray-600">
            Confidence scoring and source verification for reliable responses
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="space-y-4">
          {[
            { step: 1, title: 'Upload Documents', desc: 'Add PDF, DOCX, or TXT files' },
            { step: 2, title: 'Ask Questions', desc: 'Query the documents naturally' },
            { step: 3, title: 'Get Answers', desc: 'Receive AI-powered responses with confidence scores' },
            { step: 4, title: 'View Analysis', desc: 'Explore detailed agent workflows and analytics' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                {step}
              </div>
              <div>
                <h4 className="font-semibold">{title}</h4>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
