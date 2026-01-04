import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SubmitAssignmentModal from '../components/SubmitAssignmentModal';
import FeedbackModal from '../components/FeedbackModal';
import MoroccanPattern from '../components/MoroccanPattern'; 
import Navbar from '../components/Navbar';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('materials');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [course, setCourse] = useState(null);
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [comments, setComments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Initialize user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Load course data
  useEffect(() => {
    if (id && user) {
      fetchCourseData();
    }
  }, [id, user]);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      // Fetch course details
      const courseRes = await fetch(`${import.meta.env.VITE_API_URL}/courses/${id}`);
      if (courseRes.ok) {
        const courseData = await courseRes.json();
        setCourse(courseData);
        
        // Fetch projects for this course
        await fetchProjects();
        
        // Fetch comments for this course
        await fetchComments();
        
        // Fetch student's submissions for this course
        await fetchSubmissions();
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/course/${id}`);
      if (response.ok) {
        const projectsData = await response.json();
        setProjects(projectsData);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/comments/course/${id}`);
      if (response.ok) {
        const commentsData = await response.json();
        const formattedComments = commentsData.map(comment => ({
          id: comment.id,
          user: comment.auteur?.nom || 'Unknown',
          role: comment.auteur?.role === 'INSTRUCTEUR' ? 'instructor' : 'student',
          text: comment.texte,
          date: formatDate(comment.dateCommentaire),
          auteur: comment.auteur
        }));
        setComments(formattedComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchSubmissions = async () => {
    if (!user) return;
    
    try {
      // Get student's submissions for this course
      // You need to add this endpoint in SubmissionController:
      // @GetMapping("/student/{studentId}/course/{courseId}")
      const response = await fetch(`${import.meta.env.VITE_API_URL}/submissions/student/${user.id}/course/${id}`);
      if (response.ok) {
        const submissionsData = await response.json();
        setSubmissions(submissionsData);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Unknown date';
    }
  };

  const handleOpenSubmitModal = (project) => {
    setSelectedAssignment(project);
    setIsSubmitModalOpen(true);
  };

  const handleOpenFeedbackModal = (project) => {
    setSelectedAssignment(project);
    setIsFeedbackModalOpen(true);
  };

  const getGradePercentage = (grade) => {
    if (!grade) return 0;
    return (grade / 20) * 100;
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/comments/course/${id}/author/${user.id}`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: newMessage,
        }
      );

      if (response.ok) {
        const newComment = await response.json();
        setComments(prev => [...prev, {
          id: newComment.id,
          user: user.nom,
          role: 'student',
          text: newMessage,
          date: 'Just now',
          auteur: user
        }]);
        setNewMessage("");
        alert('Comment posted successfully!');
      } else {
        alert('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    }
  };

  // Map projects to assignments format with submission status
  const assignments = projects.map(project => {
    const submission = submissions.find(sub => sub.projet?.id === project.id);
    return {
      id: project.id,
      title: project.titre,
      description: project.description,
      dueDate: project.dateLimite ? formatDate(project.dateLimite) : 'No deadline',
      status: submission ? 'Submitted' : 'Pending',
      grade: submission?.note,
      feedback: submission?.commentairesInstructeur,
      project: project,
      submission: submission
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-2">Course Not Found</h2>
          <button 
            onClick={() => navigate('/modules')}
            className="text-cyan-400 hover:text-cyan-300"
          >
            Return to Modules
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 font-sans text-white selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      
      <MoroccanPattern rotate={false} />
      <Navbar role="student" />

      <div className="relative z-10 container mx-auto px-6 pt-8 pb-20">
        <button 
          onClick={() => navigate('/modules')} 
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors group text-sm font-medium"
        >
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Modules
        </button>

        {/* Course Header */}
        <div className="relative overflow-hidden bg-slate-900/50 border border-white/10 rounded-3xl p-8 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8 backdrop-blur-md shadow-xl">
           <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
           <div className="relative z-10">
            <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-blue-500 to-cyan-400">
              <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${course.instructeur?.nom || 'Instructor'}`} 
                  alt="Instructor" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
          <div className="text-center md:text-left z-10">
            <h1 className="text-4xl font-bold mb-2 text-white tracking-tight">{course.titre}</h1>
            <p className="text-blue-200/80 mb-2 text-sm uppercase tracking-widest font-semibold">
              Instructor: <span className="text-white">{course.instructeur?.nom || 'Unknown'}</span>
            </p>
            <p className="text-gray-500 text-sm mb-4">Course Code: {course.code}</p>
            <p className="text-slate-300 max-w-2xl leading-relaxed">{course.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-white/10 pb-1 overflow-x-auto">
          {['materials', 'assignments', 'discussion'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`pb-3 text-lg font-medium transition-all relative capitalize whitespace-nowrap ${activeTab === tab ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
              {tab === 'discussion' ? 'Class Stream' : tab.replace('materials', 'Course Materials').replace('assignments', 'Assignments')}
              {activeTab === tab && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]"></span>}
            </button>
          ))}
        </div>

        <div className="min-h-[300px] animate-fadeIn">
          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              {materials.length > 0 ? materials.map((file) => (
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
              )) : (
                <div className="text-center py-20 text-gray-500 italic">
                  No course materials available yet. Check back later!
                </div>
              )}
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              {assignments.length > 0 ? assignments.map((assignment) => (
                <div key={assignment.id} className="group relative p-6 bg-slate-800/40 border border-white/5 rounded-xl hover:bg-slate-800/60 transition-all hover:border-cyan-500/30">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-white group-hover:text-cyan-100">{assignment.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded border ${assignment.status === 'Submitted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{assignment.description}</p>
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
                            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                              {assignment.grade ? `${assignment.grade}/20` : 'Not graded'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleOpenSubmitModal(assignment)} 
                          className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m-4 4v12" /></svg>
                          Submit Project
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 text-gray-500 italic">
                  No assignments posted yet. Check back later!
                </div>
              )}
            </div>
          )}

          {/* Discussion Tab */}
          {activeTab === 'discussion' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 mb-8 focus-within:border-cyan-500/50 transition-colors shadow-lg">
                <form onSubmit={handlePostComment}>
                  <textarea 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Share something with your class..." 
                    className="w-full bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none min-h-[80px]"
                  ></textarea>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                    <button type="button" className="text-gray-400 hover:text-cyan-400 transition-colors"><i className="fas fa-paperclip"></i></button>
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim()} 
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-1.5 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
              <div className="space-y-6">
                {comments.length > 0 ? comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 animate-fadeIn">
                    <div className="flex-shrink-0 pt-1">
                      {comment.role === 'instructor' ? (
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">I</div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center font-bold text-gray-400">S</div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold text-sm ${comment.role === 'instructor' ? 'text-cyan-400' : 'text-slate-300'}`}>
                          {comment.user}
                        </span>
                        {comment.role === 'instructor' && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 uppercase font-bold rounded">
                            Instructor
                          </span>
                        )}
                        <span className="text-xs text-gray-600">{comment.date}</span>
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                        comment.role === 'instructor' 
                          ? 'bg-blue-900/20 border-blue-500/20 text-blue-100 rounded-tl-none' 
                          : 'bg-slate-800/80 border-white/5 text-gray-300 rounded-tl-none'
                      }`}>
                        {comment.text}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 text-gray-500 italic">
                    No comments yet. Start the discussion!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <SubmitAssignmentModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
        assignment={selectedAssignment}
        studentId={user?.id}
        onSuccess={() => {
          fetchSubmissions(); // Refresh submissions after submission
          fetchCourseData(); // Refresh course data
        }}
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