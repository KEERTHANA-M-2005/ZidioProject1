import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import AuthPage from "./pages/AuthPage";
import LandingPage from './pages/LandingPage';
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Add this
import './index.css';
import './chartjsSetup';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
