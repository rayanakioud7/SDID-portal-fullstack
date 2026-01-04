import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Glowing Avatar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-[2px] transition-all duration-300 shadow-lg ${isOpen ? 'scale-110 shadow-cyan-500/40' : 'hover:scale-105 shadow-blue-500/20'}`}
      >
        <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-sm font-black text-white uppercase tracking-tighter">
          {user?.prenom?.charAt(0)}
        </div>
      </button>

      {/* The Menu with High Z-Index */}
      {isOpen && (
        <>
          {/* Overlay to close when clicking outside */}
          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 mt-4 w-72 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-[120] overflow-hidden animate-fadeIn origin-top-right">
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-gradient-to-br from-blue-900/20 to-transparent">
              <h4 className="text-white font-bold text-lg leading-tight">{user?.prenom} {user?.nom}</h4>
              <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">{user?.role}</p>
            </div>

            {/* Actions */}
            <div className="p-2">
              <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <i className="fas fa-user-circle opacity-50"></i> My Profile
              </Link>
              <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <i className="fas fa-cog opacity-50"></i> Settings
              </Link>
              <div className="h-px bg-white/5 my-2 mx-2"></div>
              <button 
                onClick={() => { setIsOpen(false); onLogout(); }} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold"
              >
                <i className="fas fa-sign-out-alt"></i> Log Out Session
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;