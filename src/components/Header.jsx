import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-blue-300 transition duration-300">
            OceanWatch
          </Link>
        </div>
        <nav className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Signup
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;