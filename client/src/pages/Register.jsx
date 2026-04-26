import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try { await register(form.name, form.email, form.password); }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600/20 mb-4">
            <FiZap className="text-primary-400 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-1">Start managing tasks with AI</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ icon: FiUser, name: 'name', label: 'Full Name', type: 'text' },
            { icon: FiMail, name: 'email', label: 'Email', type: 'email' },
            { icon: FiLock, name: 'password', label: 'Password', type: 'password' }].map(({ icon: Icon, name, label, type }) => (
            <div key={name}>
              <label className="block text-sm text-slate-400 mb-1">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={type} value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))} required
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500" />
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-primary-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
