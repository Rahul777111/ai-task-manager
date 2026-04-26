import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiZap, FiGrid, FiList, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', icon: FiGrid, label: 'Dashboard' },
    { to: '/tasks', icon: FiList, label: 'Tasks' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <FiZap className="text-white text-sm" />
              </div>
              <div className="absolute inset-0 rounded-xl btn-gradient opacity-0 group-hover:opacity-50 blur-md transition-opacity" />
            </div>
            <span className="font-black text-lg gradient-text tracking-tight">TaskFlow<span className="text-white"> AI</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="text-sm" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2.5 bg-white/5 rounded-xl px-3 py-2 border border-white/8">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <FiUser className="text-white text-xs" />
              </div>
              <span className="text-sm font-medium text-slate-300">{user?.name || user?.email?.split('@')[0]}</span>
              <div className="pulse-dot" />
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
            >
              <FiLogOut className="text-sm" />
              <span className="hidden md:inline">Logout</span>
            </button>
            {/* Mobile toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-strong border-t border-white/5 px-4 py-3 flex flex-col gap-2">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === to
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <Icon />{label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
