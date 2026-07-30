import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import JobDescriptions from './pages/JobDescriptions';
import TailorStudio from './pages/TailorStudio';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="p-8 text-center text-slate-400">Loading AI Studio...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/resumes" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><JobDescriptions /></ProtectedRoute>} />
          <Route path="/tailor" element={<ProtectedRoute><TailorStudio /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
      </main>
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        AI Resume Tailoring Application • Built with React, Tailwind CSS, Express, MongoDB & OpenAI
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
