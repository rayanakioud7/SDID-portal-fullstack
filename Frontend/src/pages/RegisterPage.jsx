import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MoroccanPattern from '../components/MoroccanPattern';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  // 1. UPDATED STATE: Split name into firstName (prenom) and lastName (nom)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Prepare data (Same as before)
    const payload = {
      prenom: formData.firstName,
      nom: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role === "student" ? "ETUDIANT" : "INSTRUCTEUR"
    };

    try {
      // 2. Send to Spring Boot
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // 3. Parse the JSON response
      const data = await response.json();

      if (response.ok) {
        // SUCCESS
        alert("Account created! Please log in.");
        navigate('/login');
      } else {
        // 🚨 FAILURE: This is the new "Bridge" logic
        
        // Check if Java sent a specific password error
        if (data.password) {
            alert("❌ Password Error: " + data.password);
        } 
        // Check if Java sent a specific email error (that bypassed the browser)
        else if (data.email) {
            alert("❌ Email Error: " + data.email);
        } 
        // Fallback for other errors (like "User already exists")
        else {
            alert("Error: " + (data.message || "Registration failed"));
        }
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Could not connect to the server. Is Spring Boot running?");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white relative overflow-hidden flex items-center justify-center">
      <MoroccanPattern rotate={true} />
      
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold mb-2">Create Account</h1>
           <p className="text-gray-400">Join the SDID academic portal</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
           
           {/* 3. NEW INPUTS: Two columns for names */}
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">First Name</label>
               <input 
                 type="text" 
                 name="firstName" 
                 value={formData.firstName} 
                 onChange={handleChange}
                 required 
                 className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 focus:border-cyan-500 outline-none transition-colors"
                 placeholder="Rayan"
               />
             </div>
             <div>
               <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Last Name</label>
               <input 
                 type="text" 
                 name="lastName" 
                 value={formData.lastName} 
                 onChange={handleChange}
                 required 
                 className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 focus:border-cyan-500 outline-none transition-colors"
                 placeholder="Student"
               />
             </div>
           </div>

           <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                required 
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 focus:border-cyan-500 outline-none transition-colors"
                placeholder="rayan@fst.ac.ma"
              />
           </div>

           <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange}
                required 
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 focus:border-cyan-500 outline-none transition-colors"
                placeholder="••••••••"
              />
           </div>

           <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">I am a...</label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 focus:border-cyan-500 outline-none"
              >
                <option value="ETUDIANT">Student</option>
                <option value="INSTRUCTEUR">Professor</option>
              </select>
           </div>

           <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02] mt-2">
             Sign Up
           </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
           Already have an account? <Link to="/login" className="text-cyan-400 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;