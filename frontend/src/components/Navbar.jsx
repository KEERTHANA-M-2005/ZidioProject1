import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-purple-700 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Excel Analytics</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-yellow-300">Dashboard</Link>
        <Link to="/upload" className="hover:text-yellow-300">Upload</Link>
      </div>
    </nav>
  );
};

export default Navbar;