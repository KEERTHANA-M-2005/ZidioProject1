import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 via-white to-pink-50">
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800">Excel Analytics Platform</h1>
          <p className="mt-4 text-gray-700">Upload Excel files, generate interactive charts, and gain insights from your data quickly.</p>

          <ul className="mt-6 space-y-2 text-gray-600">
            <li>• Fast Excel parsing with SheetJS</li>
            <li>• Interactive charts and 3D visualizations</li>
            <li>• Role-based access and admin controls</li>
          </ul>

          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate('/auth')} className="px-5 py-3 bg-indigo-600 text-white rounded shadow">Login / Signup</button>
            <button onClick={() => navigate('/auth')} className="px-5 py-3 bg-white border border-indigo-200 rounded">Get Started</button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md p-6 rounded-lg bg-gradient-to-br from-white to-indigo-50 shadow-lg">
            <svg viewBox="0 0 200 120" className="w-full h-48" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="20" width="192" height="86" rx="6" fill="#eef2ff" />
              <g fill="#c7b8ff">
                <rect x="14" y="32" width="28" height="12" rx="2" />
                <rect x="48" y="32" width="28" height="12" rx="2" />
                <rect x="82" y="32" width="28" height="12" rx="2" />
              </g>
              <g fill="#8b5cf6">
                <rect x="14" y="52" width="40" height="10" rx="2" />
                <rect x="60" y="52" width="80" height="10" rx="2" />
              </g>
              <g transform="translate(8,76)">
                <rect x="0" y="0" width="24" height="16" rx="2" fill="#34d399" />
                <rect x="28" y="0" width="24" height="10" rx="2" fill="#60a5fa" />
                <rect x="56" y="0" width="24" height="6" rx="2" fill="#f97316" />
              </g>
            </svg>
            <p className="mt-4 text-sm text-gray-600">Quickly analyze spreadsheets, preview charts, and export insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
