import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MoroccanPattern from '../components/MoroccanPattern';
import Navbar from '../components/Navbar';

const ModulesPage = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("All Professors");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`);
      if (response.ok) {
        const coursesData = await response.json();

        const formattedModules = coursesData.map((course, index) => ({
          id: course.id,
          title: course.titre,
          instructor: course.instructeur?.nom || 'Unknown Instructor',
          description: course.description,
          count: "Active",
          icon: ["database", "code", "brain", "server"][index % 4],
          color: ["text-cyan-400", "text-blue-400", "text-purple-400", "text-indigo-400"][index % 4],
          bg: ["bg-cyan-500/10", "bg-blue-500/10", "bg-purple-500/10", "bg-indigo-500/10"][index % 4],
          code: course.code
        }));

        setModules(formattedModules);
        setFilteredModules(formattedModules);

        const uniqueInstructors = ["All Professors", ...new Set(formattedModules.map(m => m.instructor))];
        setInstructors(uniqueInstructors);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleFilterChange = (instructorName) => {
    setSelectedInstructor(instructorName);
    if (instructorName === "All Professors") {
      setFilteredModules(modules);
    } else {
      setFilteredModules(modules.filter(m => m.instructor === instructorName));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 font-bold animate-pulse">Syncing Academic Modules...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 font-sans text-white relative overflow-hidden">
      <MoroccanPattern rotate={false} />
      <Navbar role="student" />

      <div className="relative z-10 container mx-auto px-6 pt-12 pb-20">

        {/* Header with Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 animate-fadeIn">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Modules</span>
            </h1>
            <p className="text-lg text-blue-100/70 max-w-xl leading-relaxed">
              Browse through your curriculum. Use the filter to view modules by a specific instructor.
            </p>
          </div>

          {/* PROFESSOR FILTER DROPDOWN */}
          <div className="relative w-full md:w-auto">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Filter by Instructor</label>
            <div className="relative">
              <select
                value={selectedInstructor}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="appearance-none w-full md:w-64 bg-slate-900/50 border border-white/10 text-white py-3 px-4 pr-10 rounded-xl focus:outline-none focus:border-cyan-500/50 cursor-pointer backdrop-blur-md transition-all font-medium"
              >
                {instructors.map((name) => (
                  <option key={name} value={name} className="bg-slate-900 text-white">{name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-cyan-500">
                <i className="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.length > 0 ? filteredModules.map((module) => (
            <div
              key={module.id}
              onClick={() => navigate(`/course/${module.id}`)}
              className="group relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`h-14 w-14 ${module.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/5 shadow-inner`}>
                  <i className={`fas fa-${module.icon} text-xl ${module.color}`}></i>
                </div>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-cyan-400 transition-colors">
                  {module.count}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-1 text-white group-hover:text-cyan-300 transition-colors capitalize">{module.title}</h3>
                <p className="text-sm text-blue-200/50 font-medium">Pr. {module.instructor}</p>
                <p className="text-xs text-gray-500 mt-4 line-clamp-2 leading-relaxed">
                  {module.description || "Access lecture notes and project assignments for this module."}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">{module.code}</span>
                <span className="text-sm text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Open <i className="fas fa-arrow-right text-[10px]"></i>
                </span>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-24 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
              <div className="text-4xl mb-4 opacity-50">🔍</div>
              <h3 className="text-xl font-bold text-gray-400">No modules found for this professor</h3>
              <button
                onClick={() => handleFilterChange("All Professors")}
                className="mt-4 text-cyan-400 hover:underline underline-offset-4 text-sm font-bold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModulesPage;