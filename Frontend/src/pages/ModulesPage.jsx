import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MoroccanPattern from '../components/MoroccanPattern'; 
import Navbar from '../components/Navbar';

const ModulesPage = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user and courses
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === 'ETUDIANT') {
      setUser(storedUser);
      fetchStudentCourses();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchStudentCourses = async () => {
    try {
      // Assuming students can see all courses (or you need to implement enrollment)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`);
      if (response.ok) {
        const coursesData = await response.json();
        // Map backend courses to frontend format
        const formattedModules = coursesData.map((course, index) => ({
          id: course.id,
          title: course.titre,
          instructor: course.instructeur?.nom || 'Unknown Instructor',
          description: course.description,
          count: "0 Files", // You might want to fetch actual file count
          icon: ["database", "code", "brain", "server"][index % 4],
          color: ["text-cyan-400", "text-blue-400", "text-purple-400", "text-indigo-400"][index % 4],
          bg: ["bg-cyan-500/10", "bg-blue-500/10", "bg-purple-500/10", "bg-indigo-500/10"][index % 4],
          code: course.code
        }));
        setModules(formattedModules);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-cyan-400">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 font-sans text-white selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      
      <MoroccanPattern rotate={false} />
      <Navbar role="student" />
      
      <div className="relative z-10 container mx-auto px-6 pt-12 pb-20">
        
        {/* Header */}
        <div className="mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Modules</span>
          </h1>
          <p className="text-lg text-blue-100/70 max-w-2xl leading-relaxed">
            Select a module to access course materials, lecture notes, and assignments uploaded by your professors.
          </p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.length > 0 ? modules.map((module) => (
            <div 
              key={module.id}
              onClick={() => navigate(`/course/${module.id}`)}
              className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/10"
            >
              {/* Card Header: Icon & Title */}
              <div className="flex justify-between items-start mb-6">
                 <div className={`h-14 w-14 ${module.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/5`}>
                    <svg className={`w-7 h-7 ${module.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                 </div>
                 {/* Notification Badge */}
                 <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-colors">
                    {module.count}
                 </span>
              </div>

              {/* Card Body */}
              <div>
                 <h3 className="text-xl font-bold mb-1 text-white group-hover:text-cyan-300 transition-colors">{module.title}</h3>
                 <p className="text-sm text-blue-200/50">{module.instructor}</p>
                 <p className="text-xs text-gray-500 mt-2 line-clamp-2">{module.description}</p>
              </div>
              
              {/* Card Footer: "Open" Link */}
              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                 <span className="text-xs text-gray-500 font-mono">CODE: {module.code}</span>
                 <span className="text-sm text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Open Module <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                 </span>
              </div>

            </div>
          )) : (
            <div className="col-span-3 text-center py-20">
              <div className="text-gray-400 text-lg mb-4">No courses available yet</div>
              <p className="text-gray-500">Check back later or contact your administrator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModulesPage;