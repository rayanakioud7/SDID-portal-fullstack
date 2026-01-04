import React, { useState, useEffect } from 'react';
import MoroccanPattern from '../components/MoroccanPattern'; 
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [newCourse, setNewCourse] = useState({ titre: '', code: '', description: '' });

  // 1. INITIALIZE DASHBOARD
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === 'INSTRUCTEUR') {
      setUser(storedUser);
      fetchMyCourses(storedUser.id);
    } else {
      // Redirect if not logged in or not an instructor
      navigate('/login');
    }
  }, [navigate]);

  // 2. FETCH REAL COURSES FROM BACKEND
  const fetchMyCourses = async (instructorId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/instructeur/${instructorId}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. HANDLE COURSE CREATION
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/instructeur/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });

      if (response.ok) {
        setIsCreateModalOpen(false);
        setNewCourse({ titre: '', code: '', description: '' });
        fetchMyCourses(user.id); // Refresh list immediately
      } else {
        alert("Error creating course. Please check all fields.");
      }
    } catch (error) {
      console.error("Creation Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white relative overflow-hidden">
      <MoroccanPattern rotate={false} />
      <Navbar />

      <div className="relative z-10 container mx-auto px-6 pt-12 pb-20">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
           <div className="animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Instructor Portal
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">Professor Dashboard</h1>
              <p className="text-gray-400 text-lg">Welcome back, <span className="text-white font-semibold">Pr. {user?.nom}</span></p>
           </div>
           
           <button 
             onClick={() => setIsCreateModalOpen(true)}
             className="group px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-cyan-900/20 transition-all flex items-center gap-3"
           >
             <i className="fas fa-plus group-hover:rotate-90 transition-transform"></i>
             Create New Course
           </button>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Synchronizing with portal...</p>
          </div>
        ) : courses.length === 0 ? (
          
          /* EMPTY STATE (matches image_1cfb51.jpg) */
          <div className="text-center py-24 bg-slate-900/30 rounded-[2.5rem] border border-white/5 backdrop-blur-xl animate-fadeIn">
            <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
               <span className="text-6xl">📚</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No Courses Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
              You haven't initialized any modules for this academic year. Create your first module to start accepting submissions and posting materials.
            </p>
            <button 
               onClick={() => setIsCreateModalOpen(true)}
               className="text-cyan-400 hover:text-cyan-300 font-bold border-b-2 border-cyan-400/30 hover:border-cyan-400 transition-all pb-1"
            >
              Initialize Course Now
            </button>
          </div>
        ) : (
          
          /* REAL COURSES GRID (matches image_1d7012.jpg) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id} 
                onClick={() => navigate(`/instructor/course/${course.id}`)}
                className="group relative bg-slate-900/40 border border-white/10 rounded-3xl p-8 hover:bg-slate-900/60 hover:border-cyan-500/40 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                     <i className="fas fa-ellipsis-h text-sm"></i>
                   </div>
                </div>

                <div className="mb-8">
                   <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                     {course.code}
                   </span>
                   <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors leading-tight capitalize">
                    {course.titre}
                   </h3>
                   <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                    {course.description || "Establish your course objectives and begin student enrollment."}
                   </p>
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-6">
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold">U</div>
                        ))}
                     </div>
                     <span>Active Students</span>
                   </div>
                   <div className="text-xs text-cyan-500 font-black uppercase tracking-tighter flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                     Manage Module <i className="fas fa-chevron-right"></i>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- REFINED CREATE MODAL --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/70">
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2rem] p-10 shadow-2xl animate-slideUp">
            <h2 className="text-3xl font-bold text-white mb-2">Initialize Module</h2>
            <p className="text-gray-500 mb-8 text-sm">Fill in the technical details for your academic course.</p>
            
            <form onSubmit={handleCreateCourse} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Title</label>
                <input 
                  type="text" required value={newCourse.titre}
                  onChange={(e) => setNewCourse({...newCourse, titre: e.target.value})}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-5 py-4 focus:border-cyan-500/50 outline-none transition-all text-white placeholder-slate-700"
                  placeholder="e.g., Data Warehousing"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Internal Code</label>
                <input 
                  type="text" required value={newCourse.code}
                  onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-5 py-4 focus:border-cyan-500/50 outline-none transition-all text-white placeholder-slate-700 font-mono"
                  placeholder="e.g., LST-DW-01"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Syllabus Summary</label>
                <textarea 
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-5 py-4 focus:border-cyan-500/50 outline-none transition-all h-32 resize-none text-white placeholder-slate-700"
                  placeholder="Describe the learning objectives..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/5">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95">Create Module</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorDashboard;