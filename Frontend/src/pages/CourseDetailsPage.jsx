import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SubmitAssignmentModal from '../components/SubmitAssignmentModal';
import FeedbackModal from '../components/FeedbackModal';
import MoroccanPattern from '../components/MoroccanPattern'; 
import Navbar from '../components/Navbar';

const CourseDetailsPage = () => {
  // ... (All state and helper functions remain the same)
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('materials');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const handleOpenSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  const handleOpenFeedbackModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsFeedbackModalOpen(true);
  };

  const getGradePercentage = (gradeStr) => {
    if (!gradeStr) return 0;
    const parts = gradeStr.split('/');
    if (parts.length === 2) return (parseInt(parts[0]) / parseInt(parts[1])) * 100;
    return 0;
  };

  // Mock Data
  const courseData = {
    // ... (same mock data)
    title: "Data Warehousing",
    instructor: "Prof. El Amrani",
    description: "Master the concepts of ETL, OLAP, and Star Schemas for enterprise data management.",
    files: [
      { id: 1, name: "Chapter 1: Intro to DW", date: "Oct 12, 2025", size: "2.4 MB" },
      { id: 2, name: "Chapter 2: ETL Processes", date: "Oct 20, 2025", size: "1.8 MB" },
    ],
    assignments: [
      { 
        id: 101, 
        title: "Mini-Projet: ETL Pipeline", 
        dueDate: "Dec 15, 2025", 
        status: "Submitted", 
        grade: "16/20",
        feedback: "Excellent work on the Talend job design. Your error handling was very robust. However, the documentation for the Star Schema was a bit brief. Try to elaborate more on the dimension choices next time.",
        feedbackDate: "Dec 18, 2025"
      },
      { id: 102, title: "Star Schema Design", dueDate: "Jan 20, 2026", status: "Pending", grade: null },
    ],
    comments: [
      { id: 1, user: "Prof. El Amrani", role: "instructor", text: "Welcome. Please ensure you install Talend Open Studio before the next lab.", date: "Oct 10, 2025" },
      { id: 2, user: "You", role: "student", text: "Professor, is the Oracle DB version 19c required?", date: "Oct 11, 2025" },
    ]
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    courseData.comments.push({ id: Date.now(), user: "You", role: "student", text: newMessage, date: "Just now" });
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 font-sans text-white selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      
      <MoroccanPattern rotate={false} />

      {/* Navbar - UPDATED with full profile section */}
      <Navbar role="student" />

      <div className="relative z-10 container mx-auto px-6 pt-8 pb-20">
        {/* ... (Rest of the page content remains identical) */}
        <Link to="/modules" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors group text-sm font-medium">
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Modules
        </Link>

        <div className="relative overflow-hidden bg-slate-900/50 border border-white/10 rounded-3xl p-8 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8 backdrop-blur-md shadow-xl">
           <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
           <div className="relative z-10">
            <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-blue-500 to-cyan-400">
              <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${courseData.instructor}`} alt="Instructor" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div className="text-center md:text-left z-10">
            <h1 className="text-4xl font-bold mb-2 text-white tracking-tight">{courseData.title}</h1>
            <p className="text-blue-200/80 mb-4 text-sm uppercase tracking-widest font-semibold">
              Instructor: <span className="text-white">{courseData.instructor}</span>
            </p>
            <p className="text-slate-300 max-w-2xl leading-relaxed">{courseData.description}</p>
          </div>
        </div>

        <div className="flex space-x-8 mb-8 border-b border-white/10 pb-1 overflow-x-auto">
          {['materials', 'assignments', 'discussion'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-lg font-medium transition-all relative capitalize whitespace-nowrap ${activeTab === tab ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
              {tab === 'discussion' ? 'Class Stream' : tab.replace('materials', 'Course Materials').replace('assignments', 'Assignments')}
              {activeTab === tab && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]"></span>}
            </button>
          ))}
        </div>

        <div className="min-h-[300px] animate-fadeIn">
          {activeTab === 'materials' && (
             <div className="space-y-4">
               {courseData.files.map((file) => (
                  <div key={file.id} className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-800/40 border border-white/5 rounded-xl hover:bg-slate-800/60 transition-all hover:border-cyan-500/30">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0 relative z-10">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div>
                         <h4 className="font-semibold text-gray-100">{file.name}</h4>
                         <p className="text-xs text-gray-500 uppercase tracking-wide">{file.date} • {file.size}</p>
                      </div>
                    </div>
                    <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium">Download</button>
                  </div>
              ))}
             </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {courseData.assignments.map((assignment) => (
                <div key={assignment.id} className="group relative p-6 bg-slate-800/40 border border-white/5 rounded-xl hover:bg-slate-800/60 transition-all hover:border-cyan-500/30">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-white group-hover:text-cyan-100">{assignment.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded border ${assignment.status === 'Submitted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">Due: <span className="text-gray-200 font-medium">{assignment.dueDate}</span></p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                       {assignment.status === 'Submitted' ? (
                          <div 
                            onClick={() => handleOpenFeedbackModal(assignment)} 
                            className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-lg border border-white/5 cursor-pointer hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all group/score"
                          >
                            <div className="relative h-12 w-12 flex items-center justify-center">
                               <svg className="h-full w-full overflow-visible" viewBox="0 0 36 36">
                                 <path className="text-slate-700" fill="none" stroke="currentColor" strokeWidth="2.5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                 <path className="text-green-500 drop-shadow-[0_0_4px_rgba(34,197,94,0.6)]" strokeDasharray={`${getGradePercentage(assignment.grade)}, 100`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                               </svg>
                               <span className="absolute text-[10px] font-bold text-green-400">{Math.round(getGradePercentage(assignment.grade))}%</span>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold group-hover/score:text-cyan-400 transition-colors">Feedback</p>
                              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">{assignment.grade}</p>
                            </div>
                          </div>
                       ) : (
                          <button onClick={() => handleOpenSubmitModal(assignment)} className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m-4 4v12" /></svg>
                            Submit Project
                          </button>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'discussion' && (
             <div className="max-w-3xl mx-auto">
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 mb-8 focus-within:border-cyan-500/50 transition-colors shadow-lg">
                 <form onSubmit={handleSendMessage}>
                    <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Share something with your class..." className="w-full bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none min-h-[80px]"></textarea>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                       <button type="button" className="text-gray-400 hover:text-cyan-400 transition-colors"><i className="fas fa-paperclip"></i></button>
                       <button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-1.5 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Post</button>
                    </div>
                 </form>
              </div>
              <div className="space-y-6">
                 {courseData.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 animate-fadeIn">
                       <div className="flex-shrink-0 pt-1">
                          {comment.role === 'instructor' ? (<div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">P</div>) : (<div className="w-10 h-10 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center font-bold text-gray-400">S</div>)}
                       </div>
                       <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                             <span className={`font-bold text-sm ${comment.role === 'instructor' ? 'text-cyan-400' : 'text-slate-300'}`}>{comment.user}</span>
                             <span className="text-xs text-gray-600">{comment.date}</span>
                          </div>
                          <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${comment.role === 'instructor' ? 'bg-blue-900/20 border-blue-500/20 text-blue-100 rounded-tl-none' : 'bg-slate-800/80 border-white/5 text-gray-300 rounded-tl-none'}`}>{comment.text}</div>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <SubmitAssignmentModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
        assignmentTitle={selectedAssignment?.title} 
      />

      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
        assignment={selectedAssignment}
      />

    </div>
  );
};

export default CourseDetailsPage;