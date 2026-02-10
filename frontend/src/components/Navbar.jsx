import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="p-4 flex justify-between items-center bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white">
      <h1 className="text-xl font-bold">Excel Analytics</h1>
      <div className="space-x-6 flex items-center">
        <Link to="/dashboard" className="hover:opacity-90">Dashboard</Link>
        <Link to="/upload" className="hover:opacity-90">Upload</Link>
        <Link to="/reports" className="hover:opacity-90">Reports</Link>
      </div>
    </nav>
  );
};

export default Navbar;