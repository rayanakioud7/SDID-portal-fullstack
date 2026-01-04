// src/components/FeedbackModal.jsx
import React from 'react';

const FeedbackModal = ({ isOpen, onClose, assignment }) => {
  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn scale-100">
        
        {/* Header with Grade Badge */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-slate-800/50">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Instructor Feedback</h3>
            <p className="text-sm text-blue-200/60">{assignment.title}</p>
          </div>
          
          {/* Grade Badge */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Grade</span>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              {assignment.grade}
            </div>
          </div>
        </div>

        {/* Body: The Feedback Text */}
        <div className="p-8">
           <div className="flex gap-4">
              {/* Professor Avatar (Small) */}
              <div className="flex-shrink-0">
                 <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg border border-white/10">
                    P
                 </div>
              </div>
              
              {/* The Comment Bubble */}
              <div className="flex-grow">
                 <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-5 text-gray-300 leading-relaxed text-sm">
                    {assignment.feedback ? (
                        <>
                          <p>{assignment.feedback}</p>
                          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span>Posted on {assignment.feedbackDate || "Dec 16, 2025"}</span>
                          </div>
                        </>
                    ) : (
                        <p className="italic text-gray-500">No written feedback provided.</p>
                    )}
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg shadow-blue-900/20"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default FeedbackModal;