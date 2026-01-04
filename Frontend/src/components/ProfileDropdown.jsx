import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Mock Data for the Dropdown
  const user = {
    name: "Rayan Student",
    role: "Student", // or "Instructor", "Admin"
    status: "Active",
    joined: "Oct 12, 2025",
    avatar: "R"
  };

  // Mock Notifications (Missed Submissions)
  const notifications = [
    { id: 1, text: "Missed: Python Basics", time: "2 days ago", type: "alert" },
    { id: 2, text: "Grade Posted: ETL Lab", time: "1 hour ago", type: "success" }
  ];

  const handleLogout = () => {
    // In the future: clear backend tokens here
    navigate('/login');
  };

  return (
    <div className="relative z-50">
      
      {/* 1. The Trigger (Avatar) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none"
      >
        <div className="text-right hidden md:block">
           <p className="text-xs text-blue-200/60 uppercase tracking-wider font-semibold">Academic Year 2025-2026</p>
           <p className="text-sm font-medium text-white">Welcome, <span className="text-cyan-400">{user.name}</span></p>
        </div>
        <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20 transition-transform ${isOpen ? 'scale-110' : ''}`}>
           <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">
             {user.avatar}
           </div>
        </div>
      </button>

      {/* 2. The Transparent Backdrop (Closes menu when clicking outside) */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
      )}

      {/* 3. The Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn z-50 origin-top-right">
          
          {/* Header Section */}
          <div className="p-5 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-slate-900/20">
             <div className="flex justify-between items-start">
                <div>
                   <h4 className="text-white font-bold text-lg">{user.name}</h4>
                   <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">{user.role}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase">
                  {user.status}
                </span>
             </div>
             <p className="text-gray-500 text-xs mt-2">Member since {user.joined}</p>
          </div>

          {/* Notifications Section */}
          <div className="p-4 border-b border-white/5">
             <p className="text-xs text-gray-400 uppercase font-bold mb-3 tracking-wider">Updates</p>
             <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif.id} className="flex gap-3 items-start">
                       <div className={`mt-0.5 h-2 w-2 rounded-full ${notif.type === 'alert' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                       <div>
                          <p className={`text-sm leading-tight ${notif.type === 'alert' ? 'text-red-200' : 'text-gray-300'}`}>{notif.text}</p>
                          <p className="text-[10px] text-gray-600">{notif.time}</p>
                       </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No new notifications</p>
                )}
             </div>
          </div>

          {/* Menu Links */}
          <div className="p-2">
             <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                <i className="fas fa-user-circle mr-2 w-5"></i> My Profile
             </Link>
             <Link to="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                <i className="fas fa-cog mr-2 w-5"></i> Settings
             </Link>
             <div className="h-[1px] bg-white/5 my-1 mx-2"></div>
             <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <i className="fas fa-sign-out-alt mr-2 w-5"></i> Log Out
             </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;