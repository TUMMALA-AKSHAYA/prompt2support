import React from 'react';
import './index.css';
import Hero from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <Hero />
      {/* keep other routes/sections below if needed */}
    </div>
  );
}

export default App;
