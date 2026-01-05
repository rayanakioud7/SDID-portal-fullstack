import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MoroccanPattern from '../components/MoroccanPattern';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.id) {
      navigate('/login');
      return;
    }

    fetchUserData(storedUser.id);
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Profile...</div>;
  if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">User not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white relative overflow-hidden">
      <MoroccanPattern rotate={false} />

      {/* Dynamic Navbar based on actual role */}
      <Navbar role={user.role?.toLowerCase()} />

      <div className="relative z-10 container mx-auto px-6 pt-12 pb-20">

        {/* Profile Header Card */}
        <div className="max-w-4xl mx-auto bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-md mb-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-[3px] shadow-lg shadow-cyan-500/20">
              <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-4xl font-bold text-white uppercase">
                {user.prenom?.charAt(0)}{user.nom?.charAt(0)}
              </div>
            </div>
          </div>

          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold text-white mb-2">{user.prenom} {user.nom}</h1>
            <p className="text-cyan-400 font-medium text-lg mb-4 tracking-widest">{user.role}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                <i className="fas fa-id-card"></i> ID: {user.id}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                <i className="fas fa-envelope"></i> {user.email}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                <i className="fas fa-calendar-alt"></i> Joined {new Date(user.dateInscription).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Using real data where available, fallback to 0 if null */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl text-center hover:border-cyan-500/30 transition-colors">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Account Status</p>
            <p className={`text-2xl font-bold ${user.status === 'ACTIF' ? 'text-green-400' : 'text-amber-400'}`}>
              {user.status}
            </p>
          </div>
          {/* Add your project/grade stats here once you have those endpoints ready */}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;