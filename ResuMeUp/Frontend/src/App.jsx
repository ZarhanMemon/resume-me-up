// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import './index.css';

function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-dark">
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #8b5cf6'
            }
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={!token ? <Auth /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/builder/:id?" element={token ? <ResumeBuilder /> : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;