import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MoroccanPattern from '../components/MoroccanPattern';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [user, setUser] = useState(null);
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: ''
  });

  // 1. LOAD REAL USER DATA
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      // Initialize form with database values
      setFormData({
        prenom: storedUser.prenom || '',
        nom: storedUser.nom || '',
        email: storedUser.email || ''
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // 2. HANDLE SAVE (Placeholder for PUT request)
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    console.log("Saving new data to /api/users/", user.id, formData);
    alert("Profile settings logic is ready for the PUT endpoint!");
  };

  if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Settings...</div>;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white relative overflow-hidden">
      <MoroccanPattern rotate={false} />
      <Navbar role={user.role?.toLowerCase()} />
      
      <div className="relative z-10 container mx-auto px-6 pt-12 pb-20">
        <h1 className="text-3xl font-bold mb-8 max-w-4xl mx-auto tracking-tight">Settings</h1>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
           
           {/* Sidebar */}
           <div className="w-full md:w-64 space-y-2">
              {[
                { id: 'account', label: 'Account', icon: 'fa-user' },
                { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
                { id: 'security', label: 'Security', icon: 'fa-shield-alt' }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                    activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <i className={`fas ${tab.icon} text-xs opacity-70`}></i>
                  {tab.label}
                </button>
              ))}
           </div>

           {/* Content Panel */}
           <div className="flex-grow bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-md min-h-[400px] shadow-2xl">
              
              {/* --- ACCOUNT SETTINGS --- */}
              {activeTab === 'account' && (
                 <form onSubmit={handleSaveAccount} className="space-y-6 animate-fadeIn">
                    <h2 className="text-xl font-bold mb-4 text-cyan-400">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">First Name</label>
                          <input 
                            type="text" 
                            value={formData.prenom} 
                            onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none transition-all" 
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Last Name</label>
                          <input 
                            type="text" 
                            value={formData.nom} 
                            onChange={(e) => setFormData({...formData, nom: e.target.value})}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none transition-all" 
                          />
                       </div>
                       <div className="md:col-span-2">
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none transition-all" 
                          />
                       </div>
                    </div>
                    <div className="pt-4 flex items-center justify-between">
                       <p className="text-xs text-gray-500 italic">User ID: {user.id}</p>
                       <button type="submit" className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-cyan-900/20">
                          Save Changes
                       </button>
                    </div>
                 </form>
              )}

              {/* --- NOTIFICATIONS (UI Only) --- */}
              {activeTab === 'notifications' && (
                 <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-xl font-bold mb-4 text-cyan-400">Email Preferences</h2>
                    <div className="space-y-4">
                       {['New Assignment Posted', 'Grade Released', 'Instructor Announcement'].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-white/5">
                             <span className="text-gray-200 text-sm">{item}</span>
                             <div className="relative inline-block w-10 h-6">
                                <input type="checkbox" defaultChecked={true} className="sr-only peer" id={`toggle-${i}`} />
                                <label htmlFor={`toggle-${i}`} className="block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer peer-checked:bg-cyan-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4"></label>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {/* --- SECURITY (Placeholder) --- */}
              {activeTab === 'security' && (
                 <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-xl font-bold mb-4 text-red-400">Security Management</h2>
                    <div className="space-y-4 max-w-md">
                       <input type="password" placeholder="Current Password" className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none" />
                       <input type="password" placeholder="New Password" className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none" />
                    </div>
                    <button className="px-6 py-2.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/30 font-bold rounded-lg transition-all">
                       Update Password
                    </button>
                 </div>
              )}

           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;