import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ModulesPage from './pages/ModulesPage';             
import CourseDetailsPage from './pages/CourseDetailsPage'; 
import ProfessorDashboard from './pages/ProfessorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserProfilePage from './pages/UserProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/modules" element={<ModulesPage />} />      
      <Route path="/course/:id" element={<CourseDetailsPage />} /> 
      <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;