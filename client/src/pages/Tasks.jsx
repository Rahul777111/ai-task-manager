import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

export default function Tasks() {
  const { tasks, fetchTasks } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });

  useEffect(() => { fetchTasks(filters); }, [filters]);

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Tasks</h1>
          <p className="text-slate-400 mt-1">{filtered.length} tasks</p>
        </div>
        <button onClick={() => { setEditTask(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
          <FiPlus /> New Task
        </button>
      </div>

      {/* Search & Filter */}
      <div className="glass rounded-xl p-4 mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-48 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-primary-500 placeholder-slate-500" />
        </div>
        <select value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
          <option value="">All Status</option>
          {['todo','in-progress','completed'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.priority} onChange={e => setFilters(p => ({ ...p, priority: e.target.value }))}
          className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
          <option value="">All Priority</option>
          {['low','medium','high','critical'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-slate-400">No tasks found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(task => <TaskCard key={task._id} task={task} onEdit={(t) => { setEditTask(t); setShowModal(true); }} />)}
        </div>
      )}

      {showModal && <TaskModal task={editTask} onClose={() => { setShowModal(false); setEditTask(null); }} />}
    </div>
  );
}
