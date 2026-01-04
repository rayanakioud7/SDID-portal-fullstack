import React, { useState } from 'react';
import MoroccanPattern from '../components/MoroccanPattern'; 
import Navbar from '../components/Navbar';

// --- MOCK GRADING MODAL (Kept Functional) ---
const GradingModal = ({ isOpen, onClose, submission }) => {
  if (!isOpen || !submission) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-6 border-b border-white/10 bg-slate-800/50">
          <h3 className="text-xl font-bold text-white">Grade Submission</h3>
          <p className="text-sm text-blue-200/60">{submission.studentName} • {submission.projectTitle}</p>
        </div>
        <div className="p-6 space-y-4">
           <div>
             <label className="block text-sm font-medium text-gray-400 mb-1">Grade (/20)</label>
             <input type="number" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none transition-colors" placeholder="16" />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-400 mb-1">Feedback</label>
             <textarea className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none h-32 resize-none" placeholder="Great work, but..."></textarea>
           </div>
           <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20">
             Submit Grade
           </button>
        </div>
      </div>
    </div>
  );
};

const ProfessorDashboard = () => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  // State for the Project Dropdown Filter
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("All Projects");
  
  // State for Chat
  const [newMessage, setNewMessage] = useState("");

  // Mock Data
  const moduleData = {
    title: "Data Warehousing & ETL",
    code: "GINF-42",
    stats: { students: 42, submissions: 38, pending: 4 },
    // List of Projects for the Dropdown
    projectsList: ["All Projects", "Mini-Projet: ETL Pipeline", "Star Schema Design", "Oracle Optimization"],
    
    materials: [
       { id: 1, name: "Chapter 1: Intro to DW", downloads: 41, date: "Oct 12" },
       { id: 2, name: "Lab 1: Talend Basics", downloads: 38, date: "Oct 15" },
    ],
    submissions: [
      { id: 1, studentName: "Amine Tazi", projectTitle: "Mini-Projet: ETL Pipeline", date: "Dec 14", status: "Pending", grade: null, avatar: "A" },
      { id: 2, studentName: "Sarah Bennani", projectTitle: "Mini-Projet: ETL Pipeline", date: "Dec 15", status: "Graded", grade: "18/20", avatar: "S" },
      { id: 3, studentName: "Omar Kabbaj", projectTitle: "Star Schema Design", date: "Dec 16", status: "Pending", grade: null, avatar: "O" },
    ],
    comments: [
      { id: 1, user: "Sarah Bennani", role: "student", text: "Professor, regarding the Star Schema, should we normalize the dimensions?", date: "2h ago" },
      { id: 2, user: "Prof. El Amrani", role: "instructor", text: "Good question. Generally, we prefer denormalization in Star Schemas for performance.", date: "1h ago" },
    ]
  };

  // Filter Logic
  const filteredSubmissions = selectedProjectFilter === "All Projects" 
    ? moduleData.submissions 
    : moduleData.submissions.filter(sub => sub.projectTitle === selectedProjectFilter);

  const openGrading = (sub) => {
    setSelectedSubmission(sub);
    setIsGradingOpen(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // Add logic to push message to backend
    console.log("Posting:", newMessage);
    setNewMessage("");
  };

  return (
    // THEME: Back to "Cyber-Blue" (SDID Identity)
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 font-sans text-white selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      
      <MoroccanPattern rotate={false} />

      {/* Navbar */}
      <Navbar role="instructor" />

      <div className="relative z-10 container mx-auto px-6 pt-8 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
           <div>
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-2 uppercase tracking-wider">
                Current Module
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{moduleData.title}</h1>
              <div className="flex gap-6 text-sm text-gray-400">
                 <span><i className="fas fa-users text-cyan-500 mr-2"></i>{moduleData.stats.students} Students</span>
                 <span><i className="fas fa-file-alt text-cyan-500 mr-2"></i>{moduleData.stats.submissions} Submissions</span>
              </div>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-white/10 pb-1 overflow-x-auto">
          {['submissions', 'materials', 'discussion'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-lg font-medium transition-all relative capitalize whitespace-nowrap ${activeTab === tab ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
              {tab === 'submissions' ? 'Student Projects' : tab === 'materials' ? 'My Courses' : 'Class Stream'}
              {activeTab === tab && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]"></span>}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
            
            {/* --- TAB 1: SUBMISSIONS (With Dropdown) --- */}
            {activeTab === 'submissions' && (
            <div className="space-y-4 animate-fadeIn">
                
                {/* 1. Project Dropdown Filter */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative">
                        <select 
                            value={selectedProjectFilter}
                            onChange={(e) => setSelectedProjectFilter(e.target.value)}
                            className="appearance-none bg-slate-800 border border-white/10 text-white py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
                        >
                            {moduleData.projectsList.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        {/* Custom Arrow */}
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                    <span className="text-sm text-cyan-400 font-medium">{filteredSubmissions.filter(s => s.status === 'Pending').length} Pending Grading</span>
                </div>

                {/* Student List */}
                <div className="grid gap-3">
                    {filteredSubmissions.length > 0 ? (
                        filteredSubmissions.map((sub) => (
                            <div key={sub.id} className="group flex items-center justify-between p-4 bg-slate-800/40 border border-white/5 rounded-xl hover:bg-slate-800/60 transition-all hover:border-cyan-500/30">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-gray-300 border border-white/10">
                                        {sub.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-200">{sub.studentName}</h4>
                                        <p className="text-xs text-gray-500">{sub.projectTitle} • {sub.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {sub.status === 'Graded' ? (
                                        <div className="px-4 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm">
                                            {sub.grade}
                                        </div>
                                    ) : (
                                        <>
                                        <button className="text-sm text-gray-400 hover:text-white underline decoration-gray-600 underline-offset-4 mr-2">
                                            View PDF
                                        </button>
                                        <button 
                                            onClick={() => openGrading(sub)}
                                            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-900/20"
                                        >
                                            Grade
                                        </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500 italic">No submissions found for this filter.</div>
                    )}
                </div>
            </div>
            )}

            {/* --- TAB 2: MY COURSES (With Post Button) --- */}
            {activeTab === 'materials' && (
            <div className="space-y-4 animate-fadeIn">
                
                {/* 2. The "Post Course" Button (Contextual) */}
                <div className="flex justify-end mb-4">
                    <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 flex items-center gap-2 transition-transform active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Post New Chapter
                    </button>
                </div>

                {moduleData.materials.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-5 bg-slate-800/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-cyan-400 border border-white/10">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                                <h4 className="text-gray-200 font-medium">{file.name}</h4>
                                <p className="text-xs text-gray-500">{file.downloads} downloads • Posted {file.date}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-white p-2 transition-colors" title="Edit">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button className="text-gray-400 hover:text-red-400 p-2 transition-colors" title="Delete">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            )}

            {/* --- TAB 3: DISCUSSION (Fixed) --- */}
            {activeTab === 'discussion' && (
            <div className="max-w-3xl mx-auto animate-fadeIn">
                
                {/* 1. Comment Input Box */}
                <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 mb-8 focus-within:border-cyan-500/50 transition-colors shadow-lg">
                    <form onSubmit={handleSendMessage}>
                        <textarea 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Post an announcement or reply to students..." 
                            className="w-full bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none min-h-[80px]"
                        ></textarea>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                            <button type="button" className="text-gray-400 hover:text-cyan-400 transition-colors"><i className="fas fa-paperclip"></i></button>
                            <button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-1.5 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                Post
                            </button>
                        </div>
                    </form>
                </div>

                {/* 2. Feed */}
                <div className="space-y-6">
                    {moduleData.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 group">
                            <div className="flex-shrink-0 pt-1">
                                {comment.role === 'instructor' ? (
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg border border-white/10">P</div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center font-bold text-gray-400">S</div>
                                )}
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-bold text-sm ${comment.role === 'instructor' ? 'text-cyan-400' : 'text-slate-300'}`}>
                                        {comment.user}
                                    </span>
                                    {/* 3. The Instructor Badge */}
                                    {comment.role === 'instructor' && (
                                        <span className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-[10px] uppercase font-bold text-cyan-400 rounded">
                                            Instructor
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-600 ml-1">{comment.date}</span>
                                </div>
                                
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                                    comment.role === 'instructor' 
                                    ? 'bg-blue-900/20 border-blue-500/20 text-blue-100 rounded-tl-none' 
                                    : 'bg-slate-800/80 border-white/5 text-gray-300 rounded-tl-none'
                                }`}>
                                    {comment.text}
                                </div>

                                {/* 4. Reply Button */}
                                <button className="text-xs text-gray-500 font-medium mt-2 hover:text-cyan-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                    Reply
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}

        </div>
      </div>
      
      {/* Grading Modal */}
      <GradingModal 
        isOpen={isGradingOpen} 
        onClose={() => setIsGradingOpen(false)} 
        submission={selectedSubmission}
      />
    </div>
  );
};

export default ProfessorDashboard;