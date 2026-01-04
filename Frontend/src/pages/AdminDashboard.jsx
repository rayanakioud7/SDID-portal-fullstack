import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. FETCH USERS
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. CHANGE STATUS (Approve / Ban)
  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      // NOTE: We send "BANNI" or "ACTIF" to match Java Enum
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/status?status=${newStatus}`, {
        method: 'PUT',
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 3. CHANGE ROLE (Student <-> Instructor)
  const handleRoleUpdate = async (userId, newRole) => {
    // 1. SAFETY CHECK: Ask for confirmation
    const confirmChange = window.confirm(`⚠️ Are you sure you want to change this user's role to ${newRole}?`);
    
    // If user clicks "Cancel", stop everything.
    if (!confirmChange) return; 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/role?role=${newRole}`, {
        method: 'PUT',
      });

      if (response.ok) {
        // Success! Update the UI instantly
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        alert("✅ Role updated successfully!");
      } else {
        alert("❌ Failed to update role. Check Backend logs.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white">
      <Navbar role="admin" />
      
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>

        <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  
                  {/* USER INFO */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-white">{user.prenom} {user.nom}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>

                  {/* ROLE DROPDOWN (The New Feature!) */}
                  <td className="px-6 py-4">
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                      className={`appearance-none px-3 py-1 rounded text-xs font-bold uppercase cursor-pointer outline-none border border-transparent focus:border-white/20 transition-colors ${
                        user.role === 'ADMINISTRATEUR' ? 'bg-red-500/20 text-red-400' :
                        user.role === 'INSTRUCTEUR' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      <option value="ETUDIANT" className="bg-slate-900 text-gray-300">Student</option>
                      <option value="INSTRUCTEUR" className="bg-slate-900 text-gray-300">Instructor</option>
                      <option value="ADMINISTRATEUR" className="bg-slate-900 text-gray-300">Admin</option>
                    </select>
                  </td>

                  {/* STATUS BADGE */}
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      user.status === 'ACTIF' ? 'bg-green-500/20 text-green-400' :
                      user.status === 'BANNI' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {user.status || 'EN_ATTENTE'}
                    </span>
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="px-6 py-4 text-right space-x-2">
                    
                    {/* APPROVE BUTTON */}
                    {user.status !== 'ACTIF' && (
                      <button 
                        onClick={() => handleStatusUpdate(user.id, 'ACTIF')}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded text-xs font-bold transition-colors shadow-lg shadow-green-900/20"
                      >
                        Approve
                      </button>
                    )}

                    {/* BAN BUTTON (Fixed "BANNI" string) */}
                    {user.status !== 'BANNI' && (
                      <button 
                        onClick={() => handleStatusUpdate(user.id, 'BANNI')}
                        className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded text-xs font-bold transition-colors"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {isLoading && <p className="text-center p-8 text-gray-500">Loading users...</p>}
          {!isLoading && users.length === 0 && <p className="text-center p-8 text-gray-500">No users found.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;