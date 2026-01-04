import React from 'react';
import Navbar from '../components/Navbar';
import MoroccanPattern from '../components/MoroccanPattern';

const UserProfilePage = () => {
  // Mock User Data
  const user = {
    name: "Rayan Student",
    email: "rayan.student@fst.ac.ma",
    id: "20250042",
    major: "Data Science & BI",
    joined: "Oct 2025",
    stats: {
      gpa: "16.4",
      credits: 42,
      projects: 8
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white relative overflow-hidden">
      <MoroccanPattern rotate={false} />
      
      {/* We assume role="student" for now. Later this comes from the backend */}
      <Navbar role="student" />
      
      <div className="relative z-10 container mx-auto px-6 pt-12 pb-20">
        
        {/* Profile Header Card */}
        <div className="max-w-4xl mx-auto bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-md mb-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
           {/* Avatar */}
           <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-[3px] shadow-lg shadow-cyan-500/20">
                 <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-4xl font-bold text-white">
                    R
                 </div>
              </div>
              <div className="absolute bottom-1 right-1 h-8 w-8 bg-slate-900 rounded-full flex items-center justify-center border border-white/10">
                 <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
           </div>

           {/* Text Info */}
           <div className="text-center md:text-left flex-grow">
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-cyan-400 font-medium text-lg mb-4">{user.major}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                 <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <i className="fas fa-id-card"></i> ID: {user.id}
                 </span>
                 <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <i className="fas fa-envelope"></i> {user.email}
                 </span>
                 <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <i className="fas fa-calendar-alt"></i> Joined {user.joined}
                 </span>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl text-center hover:border-cyan-500/30 transition-colors">
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Current GPA</p>
              <p className="text-4xl font-bold text-white">{user.stats.gpa}</p>
           </div>
           <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl text-center hover:border-blue-500/30 transition-colors">
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Credits Earned</p>
              <p className="text-4xl font-bold text-blue-400">{user.stats.credits}</p>
           </div>
           <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl text-center hover:border-purple-500/30 transition-colors">
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Projects Done</p>
              <p className="text-4xl font-bold text-purple-400">{user.stats.projects}</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfilePage;