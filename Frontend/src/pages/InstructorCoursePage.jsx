import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MoroccanPattern from '../components/MoroccanPattern';
import Navbar from '../components/Navbar';

// grading modal
const GradingModal = ({ isOpen, onClose, submission, onSubmitGrade }) => {
  const [grade, setGrade] = useState(submission?.note || '');
  const [feedback, setFeedback] = useState(submission?.commentairesInstructeur || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (submission) {
      setGrade(submission.note || '');
      setFeedback(submission.commentairesInstructeur || '');
    }
  }, [submission]);

  const handleSubmit = async () => {
    if (!grade || !submission) return;

    setIsLoading(true);
    try {
      await onSubmitGrade(submission.id, grade, feedback);
      onClose();
    } catch (error) {
      console.error('Error submitting grade:', error);
      alert('Failed to submit grade');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-6 border-b border-white/10 bg-slate-800/50">
          <h3 className="text-xl font-bold text-white">Grade Submission</h3>
          <p className="text-sm text-blue-200/60">{submission.etudiant?.nom} • {submission.projet?.titre}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Grade (/20)</label>
            <input
              type="number"
              min="0"
              max="20"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none transition-colors"
              placeholder="16"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none h-32 resize-none"
              placeholder="Great work, but..."
            ></textarea>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
          >
            {isLoading ? 'Submitting...' : 'Submit Grade'}
          </button>
        </div>
      </div>
    </div>
  );
};

// create project modal
const CreateProjectModal = ({ isOpen, onClose, courseId, onSubmit }) => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titre.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({ titre, description, dateLimite: deadline });
      setTitre('');
      setDescription('');
      setDeadline('');
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        <div className="p-6 border-b border-white/10 bg-slate-800/50">
          <h3 className="text-xl font-bold text-white">Create New Project</h3>
        </div>
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Project Title</label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none transition-colors"
                  placeholder="Mini-Projet: ETL Pipeline"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none h-32 resize-none"
                  placeholder="Project requirements and objectives..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Deadline</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const InstructorCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submissions');
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("All Projects");
  const [newMessage, setNewMessage] = useState("");


  const [course, setCourse] = useState(null);
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (id && user) {
      fetchCourseData();
    }
  }, [id, user]);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {

      const courseRes = await fetch(`${import.meta.env.VITE_API_URL}/courses/${id}`);
      if (courseRes.ok) {
        const courseData = await courseRes.json();
        setCourse(courseData);

        await fetchProjects();

        await fetchComments();

        await fetchSubmissions();
      } else {
        console.error("Failed to fetch course:", courseRes.status);
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
      } else {
        console.error("Failed to fetch projects:", response.status);
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
      } else {
        console.error("Failed to fetch comments:", response.status);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const projectsResponse = await fetch(`${import.meta.env.VITE_API_URL}/projects/course/${id}`);
      if (!projectsResponse.ok) return;

      const projectsData = await projectsResponse.json();

      const allSubmissions = [];
      for (const project of projectsData) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/submissions/project/${project.id}`);
          if (response.ok) {
            const projectSubmissions = await response.json();
            allSubmissions.push(...projectSubmissions.map(sub => ({
              ...sub,
              projet: project
            })));
          }
        } catch (error) {
          console.error(`Error fetching submissions for project ${project.id}:`, error);
        }
      }

      setSubmissions(allSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      return date.toLocaleDateString();
    } catch (e) {
      return 'Unknown date';
    }
  };

  const handleCreateProject = async (projectData) => {
    if (!user || !id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/projects/course/${id}/instructor/${user.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        }
      );

      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject]);
        alert('Project created successfully!');
        return newProject;
      } else {
        const error = await response.text();
        throw new Error(error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error.message || 'Failed to create project');
      throw error;
    }
  };

  // Handle grade submission
  const handleSubmitGrade = async (submissionId, grade, feedback) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/submissions/${submissionId}/grade?note=${grade}&commentairesInstructeur=${encodeURIComponent(feedback)}`,
        {
          method: 'PUT',
        }
      );

      if (response.ok) {
        alert('Grade submitted successfully!');
        fetchSubmissions();
      } else {
        throw new Error('Failed to submit grade');
      }
    } catch (error) {
      console.error('Error submitting grade:', error);
      throw error;
    }
  };

  // Handle posting a new comment
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
          role: 'instructor',
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

  const openGrading = (sub) => {
    setSelectedSubmission(sub);
    setIsGradingOpen(true);
  };

  const filteredSubmissions = selectedProjectFilter === "All Projects"
    ? submissions
    : submissions.filter(sub => sub.projet?.titre === selectedProjectFilter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
          <p>Loading Management Panel...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-2">Course Not Found</h2>
          <p className="text-gray-400 mb-4">Course ID: {id}</p>
          <button
            onClick={() => navigate('/professor-dashboard')}
            className="text-cyan-400 hover:text-cyan-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 font-sans text-white selection:bg-cyan-500 relative overflow-hidden">
      <MoroccanPattern rotate={false} />
      <Navbar />

      <div className="relative z-10 container mx-auto px-6 pt-8 pb-20">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 animate-fadeIn">
          <div>
            <button
              onClick={() => navigate('/professor-dashboard')}
              className="text-gray-500 hover:text-cyan-400 mb-4 flex items-center gap-2 transition-colors text-sm"
            >
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-2 uppercase tracking-wider">
              Management Panel
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{course.titre}</h1>
            <p className="text-gray-400 text-sm italic">{course.code} • Academic Year 2025-2026</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 flex items-center gap-2 transition-transform active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Create Project
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex space-x-8 mb-8 border-b border-white/10 pb-1 overflow-x-auto">
          {['submissions', 'discussion'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-lg font-medium transition-all relative capitalize whitespace-nowrap ${activeTab === tab ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
              {tab === 'submissions' ? 'Student Projects' : 'Class Stream'}
              {activeTab === tab && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]"></span>}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">

          {/* --- TAB 1: SUBMISSIONS --- */}
          {activeTab === 'submissions' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <div className="relative">
                  <select
                    value={selectedProjectFilter}
                    onChange={(e) => setSelectedProjectFilter(e.target.value)}
                    className="appearance-none bg-slate-800 border border-white/10 text-white py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
                  >
                    <option value="All Projects">All Projects</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.titre}>{project.titre}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                <span className="text-sm text-cyan-400 font-medium">
                  {filteredSubmissions.filter(s => !s.note).length} Pending Grading
                </span>
              </div>

              <div className="grid gap-3">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((sub) => (
                    <div key={sub.id} className="group flex items-center justify-between p-4 bg-slate-800/40 border border-white/5 rounded-xl hover:bg-slate-800/60 transition-all hover:border-cyan-500/30">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-gray-300 border border-white/10">
                          {sub.etudiant?.nom?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-200">{sub.etudiant?.nom || 'Unknown Student'}</h4>
                          <p className="text-xs text-gray-500">
                            {sub.projet?.titre || 'Unknown Project'} • {formatDate(sub.dateSoumission)}
                          </p>
                          {sub.fichierUrl && (
                            <a
                              href={sub.fichierUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 inline-block"
                            >
                              View Submission
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {sub.note ? (
                          <div className="px-4 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm">
                            {sub.note}/20
                          </div>
                        ) : (
                          <button
                            onClick={() => openGrading(sub)}
                            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-900/20"
                          >
                            Grade
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500 italic">
                    {projects.length === 0
                      ? "No projects created yet. Click 'Create Project' to add your first assignment!"
                      : "No submissions found. Students will appear here once they submit their work."}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- TAB 2: DISCUSSION --- */}
          {activeTab === 'discussion' && (
            <div className="max-w-3xl mx-auto animate-fadeIn">
              {/* Comment Input Box */}
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 mb-8 focus-within:border-cyan-500/50 transition-colors shadow-lg">
                <form onSubmit={handlePostComment}>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Post an announcement or reply to students..."
                    className="w-full bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none min-h-[80px]"
                  ></textarea>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                    <button type="button" className="text-gray-400 hover:text-cyan-400 transition-colors">
                      <i className="fas fa-paperclip"></i>
                    </button>
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

              {/* Comments Feed */}
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                      <div className="flex-shrink-0 pt-1">
                        {comment.role === 'instructor' ? (
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg border border-white/10">
                            {comment.user?.charAt(0) || 'I'}
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center font-bold text-gray-400">
                            {comment.user?.charAt(0) || 'S'}
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-bold text-sm ${comment.role === 'instructor' ? 'text-cyan-400' : 'text-slate-300'}`}>
                            {comment.user}
                          </span>
                          {comment.role === 'instructor' && (
                            <span className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-[10px] uppercase font-bold text-cyan-400 rounded">
                              Instructor
                            </span>
                          )}
                          <span className="text-xs text-gray-600 ml-1">{comment.date}</span>
                        </div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${comment.role === 'instructor'
                          ? 'bg-blue-900/20 border-blue-500/20 text-blue-100 rounded-tl-none'
                          : 'bg-slate-800/80 border-white/5 text-gray-300 rounded-tl-none'
                          }`}>
                          {comment.text}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-gray-500 italic">
                    No comments yet. Start the discussion by posting a message!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <GradingModal
        isOpen={isGradingOpen}
        onClose={() => setIsGradingOpen(false)}
        submission={selectedSubmission}
        onSubmitGrade={handleSubmitGrade}
      />

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        courseId={id}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default InstructorCoursePage;