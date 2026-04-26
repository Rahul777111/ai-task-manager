import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiCheckCircle, FiLogOut, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <FiZap className="text-primary-400 text-xl" />
            <span className="text-white font-bold text-lg">AI Task Manager</span>
          </div>
          <div className="flex items-center space-x-1">
            <Link to="/" className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/') ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}>
              <FiHome /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/tasks" className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/tasks') ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}>
              <FiCheckCircle /> <span className="hidden sm:inline">Tasks</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 text-sm hidden sm:block">{user?.name}</span>
            <button onClick={logout} className="flex items-center space-x-1 px-3 py-2 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors">
              <FiLogOut />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
