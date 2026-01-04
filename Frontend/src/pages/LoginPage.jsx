// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MoroccanPattern from '../components/MoroccanPattern';
import authService from '../services/auth'; // Import the auth service

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use the auth service for login
      const userData = await authService.login(email, password);
      
      // Login successful - redirect based on role
      if (userData.role === 'ADMINISTRATEUR') {
        navigate('/admin-dashboard');
      } else if (userData.role === 'INSTRUCTEUR') {
        navigate('/professor-dashboard');
      } else {
        navigate('/modules');
      }
      
    } catch (error) {
      console.error("Login Error:", error);
      
      // Handle specific error cases
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 403) {
          setError("⚠️ Access Denied: " + (error.response.data?.message || "Your account is pending approval or has been suspended"));
        } else if (error.response.status === 401) {
          setError("❌ Invalid email or password");
        } else if (error.response.status === 404) {
          setError("❌ User not found");
        } else if (error.response.status === 422) {
          setError("❌ Validation error: " + (error.response.data?.message || "Please check your input"));
        } else {
          setError("❌ Error: " + (error.response.data?.message || "Login failed"));
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("⚠️ Could not connect to server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request
        setError("❌ An unexpected error occurred: " + error.message);
      }
    } finally {
      setIsLoading(false);
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
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">SDID Portal</h2>
        <p className="text-center text-blue-200/60 mb-8">Enter your credentials to continue.</p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

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
              disabled={isLoading}
            />
          </div>
          
          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition-all"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transform hover:scale-[1.01] transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : 'Sign In'}
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