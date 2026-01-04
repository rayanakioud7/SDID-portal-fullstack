import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => { 
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    const interval = setInterval(syncUser, 1000);
    return () => {
      window.removeEventListener('storage', syncUser);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("storage")); 
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    if (role === 'ADMINISTRATEUR') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (role === 'INSTRUCTEUR') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  };

  return (
    <nav className="relative z-[100] flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
          S
        </div>
        <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
          SDID <span className="text-cyan-400 group-hover:text-white transition-colors uppercase text-sm tracking-widest ml-1">Portal</span>
        </span>
      </Link>

      {/* Dynamic Actions */}
      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white tracking-tight">{user.prenom} {user.nom}</p>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>

            {user.role === 'ADMINISTRATEUR' ? (
              <button 
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/30 font-bold text-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <i className="fas fa-sign-out-alt"></i> Exit Dashboard
              </button>
            ) : (
              <ProfileDropdown user={user} onLogout={handleLogout} />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Log In</Link>
            <Link to="/register" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-900/40 transition-all transform hover:scale-105">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;