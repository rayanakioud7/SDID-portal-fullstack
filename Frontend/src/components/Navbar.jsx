import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => { 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 1. CHECK IF LOGGED IN
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Clear state instantly
    navigate('/login');
  };

  // Helper for Badge Colors
  const getRoleBadgeColor = (userRole) => {
    if (userRole === 'ADMINISTRATEUR') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (userRole === 'INSTRUCTEUR') return 'bg-blue-500/10 text-cyan-400 border-cyan-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
      
      {/* LEFT: LOGO (Always Visible) */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
          S
        </div>
        <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
          SDID <span className="text-cyan-400 group-hover:text-white transition-colors">Portal</span>
        </span>
      </Link>

      {/* RIGHT: DYNAMIC SECTION */}
      {user ? (
        // --- SCENARIO A: USER IS LOGGED IN (Show Profile) ---
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                {user.prenom} {user.nom}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 group-hover:text-cyan-500/70 transition-colors">
                {user.role}
              </p>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400 font-bold shadow-lg group-hover:border-cyan-500/50 transition-colors">
              {user.prenom.charAt(0).toUpperCase()}
            </div>
          </button>

          {/* DROPDOWN MENU */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-4 w-72 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn origin-top-right">
              {/* User Header */}
              <div className="p-6 border-b border-white/5 bg-slate-800/30">
                <h3 className="font-bold text-white text-lg">
                  {user.prenom} {user.nom}
                </h3>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
                <p className="text-xs text-gray-500 mt-2">
                  Member since {new Date(user.dateInscription).toLocaleDateString()}
                </p>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {/* 1. MY PROFILE */}
                <Link 
                  to="/profile" 
                  className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                  onClick={() => setIsDropdownOpen(false)} // Close menu on click
                >
                  <i className="fas fa-user-circle"></i> My Profile
                </Link>

                {/* 2. SETTINGS (Restored!) */}
                <Link 
                  to="/settings" 
                  className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <i className="fas fa-cog"></i> Settings
                </Link>

                <div className="h-px bg-white/5 my-1"></div>
                
                {/* 3. LOGOUT */}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3 font-bold"
                >
                  <i className="fas fa-sign-out-alt"></i> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // --- SCENARIO B: NO USER (Show Login Buttons) ---
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link 
            to="/register" 
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-900/20 transition-all transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;