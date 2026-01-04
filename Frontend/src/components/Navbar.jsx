import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const Navbar = ({ role = "guest" }) => {
  // Logic to determine where the Logo clicks to
  const getHomeLink = () => {
    switch (role) {
      case 'admin': return '/admin-dashboard';
      case 'instructor': return '/professor-dashboard';
      case 'student': return '/modules';
      default: return '/';
    }
  };

  // Logic to determine Logo Color based on Role
  const getLogoStyles = () => {
    switch (role) {
      case 'admin': return 'bg-red-600 shadow-red-500/30';
      case 'instructor': return 'bg-amber-600 shadow-amber-500/30';
      case 'student': return 'bg-blue-600 shadow-blue-500/30';
      default: return 'bg-slate-700/50 border border-white/10'; // Guest style
    }
  };

  const getTextColor = () => {
    switch (role) {
      case 'admin': return 'text-red-500';
      case 'instructor': return 'text-amber-400';
      case 'student': return 'text-cyan-400';
      default: return 'text-white';
    }
  };

  return (
    <nav className="relative z-50 w-full px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/10 bg-slate-900/40 transition-all">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        
        {/* --- BRAND LOGO --- */}
        <div className="flex items-center">
          <Link to={getHomeLink()} className="flex-shrink-0 flex items-center group">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-white mr-3 shadow-lg transition-transform group-hover:scale-110 ${getLogoStyles()}`}>
              {role === 'guest' ? 'S' : role.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-xl text-white tracking-wide">
              SDID <span className={getTextColor()}>Portal</span>
            </span>
          </Link>
        </div>

        {/* --- RIGHT SIDE ACTIONS --- */}
        <div className="flex items-center space-x-4">
          
          {role === 'guest' ? (
            // STATE 1: GUEST (Show Login Buttons)
            <>
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-slate-900 hover:bg-gray-200 font-bold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-white/10"
              >
                Get Started
              </Link>
            </>
          ) : (
            // STATE 2: LOGGED IN (Show Profile Dropdown)
            <ProfileDropdown />
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;