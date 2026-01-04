// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MoroccanPattern from '../components/MoroccanPattern';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: Save user info and redirect
        // Ideally, save to localStorage or Context here
        localStorage.setItem("user", JSON.stringify(data)); 
        
        // Redirect based on role
        if (data.role === 'ADMINISTRATEUR') navigate('/admin-dashboard');
        else if (data.role === 'INSTRUCTEUR') navigate('/professor-dashboard');
        else navigate('/modules');

      } else if (response.status === 403) {
        // BLOCKED: Pending or Banned
        alert("⚠️ Access Denied: " + data.message); 
      } else {
        // FAIL: Wrong password
        alert("❌ Error: " + (data.message || "Login failed"));
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Could not connect to server.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Pattern */}
      <MoroccanPattern />

      {/* Glass Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-fadeIn">
        
        {/* Logo Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">SDID Portal</h2>
        <p className="text-center text-blue-200/60 mb-8">Enter your credentials to continue.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition-all"
              placeholder="student@fst.ac.ma"
              required
            />
          </div>
          
          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transform hover:scale-[1.01] transition-all duration-200 mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          Need an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;