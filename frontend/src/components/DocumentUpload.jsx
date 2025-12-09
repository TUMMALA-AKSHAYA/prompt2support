import React, { useState } from 'react';
import { Upload, File, Loader } from 'lucide-react';

const DocumentUpload = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    setIsLoading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        await onUpload(formData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-primary bg-blue-50'
            : 'border-gray-300 hover:border-primary'
        }`}
      >
        {isLoading ? (
          <>
            <Loader className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
            <p className="text-gray-600">Processing documents...</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
            <p className="text-lg font-semibold mb-2">
              Drag and drop files here
            </p>
            <p className="text-gray-600 mb-4">
              or click to select files (PDF, DOCX, TXT)
            </p>
            <input
              type="file"
              multiple
              onChange={(e) => handleFiles(Array.from(e.target.files || []))}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="btn-primary cursor-pointer">
              Select Files
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
