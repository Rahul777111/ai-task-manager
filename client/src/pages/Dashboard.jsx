import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiZap, FiLoader, FiPlus, FiTrendingUp, FiTarget, FiAward, FiActivity } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import { suggestTasks } from '../services/aiService';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon: Icon, color, bg, gradient, delay }) => (
  <div className={`glass card-hover rounded-2xl p-5 animate-fade-in-up delay-${delay} overflow-hidden relative`}>
    <div className={`absolute inset-0 opacity-5 ${gradient}`} />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${bg}`}>
          <Icon className={`text-lg ${color}`} />
        </div>
        <div className="pulse-dot" style={{ background: color.includes('blue') ? '#60a5fa' : color.includes('yellow') ? '#facc15' : color.includes('green') ? '#4ade80' : '#f87171' }} />
      </div>
      <p className="stat-value text-3xl font-black text-white tracking-tight">{value}</p>
      <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { tasks, stats, fetchTasks, fetchStats, createTask } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [aiGoal, setAiGoal] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => { fetchTasks(); fetchStats(); }, []);

  const getStatCount = (status) => stats?.stats?.find(s => s._id === status)?.count || 0;
  const completedCount = getStatCount('completed');
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAISuggest = async () => {
    if (!aiGoal.trim()) return toast.error('Enter a goal first');
    setAiLoading(true);
    try {
      const { data } = await suggestTasks(aiGoal);
      for (const task of data.tasks) await createTask({ ...task, aiGenerated: true });
      setAiGoal('');
      toast.success(`🚀 ${data.tasks.length} AI tasks generated!`);
    } catch { toast.error('AI suggestion failed'); }
    finally { setAiLoading(false); }
  };

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return t.status !== 'completed';
    if (activeFilter === 'done') return t.status === 'completed';
    if (activeFilter === 'ai') return t.aiGenerated;
    return true;
  }).slice(0, 9);

  const filters = ['all', 'active', 'done', 'ai'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />
          <h1 className="text-3xl font-black text-white tracking-tight">Mission Control</h1>
        </div>
        <p className="text-slate-500 ml-5 font-medium">Your AI-powered productivity hub</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tasks" value={totalCount} icon={FiTarget} color="text-blue-400" bg="bg-blue-500/10" gradient="bg-blue-500" delay={100} />
        <StatCard label="In Progress" value={getStatCount('in-progress')} icon={FiActivity} color="text-yellow-400" bg="bg-yellow-500/10" gradient="bg-yellow-500" delay={200} />
        <StatCard label="Completed" value={completedCount} icon={FiCheckCircle} color="text-green-400" bg="bg-green-500/10" gradient="bg-green-500" delay={300} />
        <StatCard label="Overdue" value={stats?.overdue || 0} icon={FiAlertTriangle} color="text-red-400" bg="bg-red-500/10" gradient="bg-red-500" delay={400} />
      </div>

      {/* Progress + AI Row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">

        {/* Completion rate */}
        <div className="glass card-hover rounded-2xl p-5 animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiAward className="text-purple-400 text-lg" />
              <span className="text-sm font-semibold text-slate-300">Completion Rate</span>
            </div>
            <span className="gradient-text font-black text-2xl">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${completionRate}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee)' }}
            />
          </div>
          <p className="text-slate-500 text-xs mt-2">{completedCount} of {totalCount} tasks done</p>
        </div>

        {/* AI Generator */}
        <div className="glass-strong card-hover rounded-2xl p-5 lg:col-span-2 animate-fade-in-up delay-300 neon-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-purple-500/15">
              <FiZap className="text-purple-400 text-lg" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">AI Task Generator</h2>
              <p className="text-xs text-slate-500">Describe your goal, get instant tasks</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              value={aiGoal}
              onChange={e => setAiGoal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAISuggest()}
              placeholder="e.g. Build a SaaS landing page in React..."
              className="flex-1 bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm input-glow placeholder-slate-600 transition-all"
            />
            <button
              onClick={handleAISuggest}
              disabled={aiLoading}
              className="btn-gradient px-5 py-3 text-white rounded-xl font-semibold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {aiLoading ? <><FiLoader className="animate-spin" /> Thinking...</> : <><FiZap /> Generate</>}
            </button>
          </div>
        </div>
      </div>

      {/* Tasks section */}
      <div className="animate-fade-in-up delay-400">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Tasks</h2>
            <p className="text-slate-500 text-xs">{filteredTasks.length} showing</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filter pills */}
            <div className="flex gap-1 bg-slate-900/60 rounded-xl p-1">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeFilter === f
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f === 'ai' ? '🤖 AI' : f}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setEditTask(null); setShowModal(true); }}
              className="btn-gradient flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-semibold"
            >
              <FiPlus className="text-base" /> New Task
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <div className="text-6xl mb-4 animate-float">🎯</div>
            <p className="text-white font-semibold text-lg">No tasks here</p>
            <p className="text-slate-500 text-sm mt-1">Create one manually or let AI generate them for you</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task, i) => (
              <div key={task._id} className={`animate-fade-in-up`} style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}>
                <TaskCard task={task} onEdit={(t) => { setEditTask(t); setShowModal(true); }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <TaskModal task={editTask} onClose={() => { setShowModal(false); setEditTask(null); }} />}
    </div>
  );
}
