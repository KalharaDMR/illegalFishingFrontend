// src/components/PublicLayout.jsx
import { Link, useNavigate } from "react-router-dom";
import React from "react";

export default function PublicLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // remove token and role
    navigate("/login"); // redirect to login page
  };

  return (
    <div>
      <nav className="bg-cyan-900 text-white p-4 flex gap-4 items-center">
        <span className="font-bold">OceanWatch</span>
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="ml-auto bg-red-600 px-3 py-1 rounded hover:bg-red-800"
        >
          Logout
        </button>
      </nav>

      <div>{children}</div>
    </div>
  );
}
