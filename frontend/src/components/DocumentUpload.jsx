import React, { useState } from 'react';
import { Upload, Loader } from 'lucide-react';
import './DocumentUpload.css'; // make sure this file exists

const DocumentUpload = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileCount, setFileCount] = useState(0);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (!files.length) return;
    setFileCount(files.length);
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
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-orange-500 bg-orange-500/5'
            : 'border-gray-600 hover:border-orange-500'
        }`}
      >
        {isLoading ? (
          <>
            <Loader className="w-12 h-12 mx-auto mb-4 text-orange-500 animate-spin" />
            <p className="text-gray-400">Processing documents…</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-orange-500" />

            <p className="text-lg font-semibold mb-1">
              Drag and drop files here
            </p>

            <p className="text-sm text-gray-400 mb-4">
              Supported: PDF, DOCX, TXT
            </p>

            {/* ✅ FIXED FILE ROW */}
            <div className="file-row">
              <input
                type="file"
                id="file-input"
                multiple
                onChange={(e) =>
                  handleFiles(Array.from(e.target.files || []))
                }
                className="hidden-file-input"
              />

              <label htmlFor="file-input" className="select-btn">
                Select Files
              </label>

              <span className="file-name">
                {fileCount > 0
                  ? `${fileCount} file(s) selected`
                  : 'No file selected'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
