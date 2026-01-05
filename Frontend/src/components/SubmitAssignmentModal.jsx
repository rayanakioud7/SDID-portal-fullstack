import React, { useState } from 'react';

const SubmitAssignmentModal = ({ isOpen, onClose, assignment, studentId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen || !assignment) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !studentId || !assignment) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const fileUrl = await uploadResponse.text();

      const submitResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/submissions/student/${studentId}/project/${assignment.id}?fichierUrl=${encodeURIComponent(fileUrl)}`,
        {
          method: 'POST',
        }
      );

      if (submitResponse.ok) {
        alert("Project submitted successfully!");
        if (onSuccess) onSuccess();
        onClose();
        setFile(null);
      } else {
        throw new Error('Failed to submit project');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      alert(error.message || 'Failed to submit project');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn scale-100">

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-bold text-white">Submit Assignment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          <p className="text-blue-200 mb-4 text-sm">
            Uploading for: <span className="font-semibold text-white">{assignment.title}</span>
          </p>

          {/* Drag & Drop Zone */}
          {!file && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer ${isDragging
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/20 hover:border-blue-400 hover:bg-white/5'
                }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.zip,.rar,.doc,.docx,.ppt,.pptx,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer w-full h-full flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <p className="text-lg font-medium text-white mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-400">PDF, ZIP, DOCX, PPTX (Max 10MB)</p>
              </label>
            </div>
          )}

          {/* Selected File Display */}
          {file && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-400 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-300">Uploading...</span>
                <span className="text-white">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className={`px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20 ${!file || isUploading
                ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105'
              }`}
          >
            {isUploading ? 'Submitting...' : 'Submit Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitAssignmentModal;