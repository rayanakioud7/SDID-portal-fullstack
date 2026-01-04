import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MoroccanPattern from '../components/MoroccanPattern';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white relative overflow-hidden">
      <MoroccanPattern rotate={false} />
      <Navbar role="student" />
      
      <div className="relative z-10 container mx-auto px-6 pt-12 pb-20">
        <h1 className="text-3xl font-bold mb-8 max-w-4xl mx-auto">Settings</h1>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
           
           {/* Sidebar */}
           <div className="w-full md:w-64 space-y-2">
              <button 
                onClick={() => setActiveTab('account')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'account' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                Account
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'notifications' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                Notifications
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                Security
              </button>
           </div>

           {/* Content Panel */}
           <div className="flex-grow bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-md min-h-[400px]">
              
              {activeTab === 'account' && (
                 <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                          <input type="text" defaultValue="Rayan Student" className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none" />
                       </div>
                       <div>
                          <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                          <input type="email" defaultValue="rayan.student@fst.ac.ma" className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none" />
                       </div>
                    </div>
                    <div className="pt-4">
                       <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors">Save Changes</button>
                    </div>
                 </div>
              )}

              {activeTab === 'notifications' && (
                 <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-xl font-bold mb-4">Email Preferences</h2>
                    <div className="space-y-4">
                       {['New Assignment Posted', 'Grade Released', 'Instructor Announcement', 'Weekly Summary'].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-white/5">
                             <span className="text-gray-200">{item}</span>
                             <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" defaultChecked={i < 3} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-6 checked:border-cyan-500" />
                                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer checked:bg-cyan-500"></label>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {activeTab === 'security' && (
                 <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-xl font-bold mb-4">Change Password</h2>
                    <div className="space-y-4 max-w-md">
                       <input type="password" placeholder="Current Password" className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none" />
                       <input type="password" placeholder="New Password" className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none" />
                       <input type="password" placeholder="Confirm New Password" className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none" />
                    </div>
                    <div className="pt-4">
                       <button className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors">Update Password</button>
                    </div>
                 </div>
              )}

           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;