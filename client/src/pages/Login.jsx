import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiZap, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try { await login(form.email, form.password); }
    catch (err) { setError(err.response?.data?.message || 'Invalid credentials'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">

      {/* Background orbs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

      <div className="w-full max-w-md animate-fade-in-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl btn-gradient mb-4 shadow-2xl shadow-indigo-500/30 animate-float">
            <FiZap className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-black text-white">Welcome back</h1>
          <p className="text-slate-500 mt-2 text-sm">Sign in to your TaskFlow AI account</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 neon-border">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3.5 text-white text-sm input-glow placeholder-slate-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-12 py-3.5 text-white text-sm input-glow placeholder-slate-600 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showPass ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <><span>Sign In</span><FiArrowRight /></>}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            No account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
