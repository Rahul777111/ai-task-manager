import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiZap, FiLoader, FiPlus } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import { suggestTasks } from '../services/aiService';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { tasks, stats, fetchTasks, fetchStats, createTask } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [aiGoal, setAiGoal] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => { fetchTasks(); fetchStats(); }, []);

  const getStatCount = (status) => stats?.stats?.find(s => s._id === status)?.count || 0;

  const handleAISuggest = async () => {
    if (!aiGoal.trim()) return toast.error('Enter a goal');
    setAiLoading(true);
    try {
      const { data } = await suggestTasks(aiGoal);
      for (const task of data.tasks) await createTask({ ...task, aiGenerated: true });
      setAiGoal('');
      toast.success(`${data.tasks.length} AI tasks created!`);
    } catch { toast.error('AI suggestion failed'); } finally { setAiLoading(false); }
  };

  const recentTasks = tasks.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Your productivity overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[{
          label: 'Total', value: tasks.length, icon: FiCheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10'
        }, {
          label: 'In Progress', value: getStatCount('in-progress'), icon: FiClock, color: 'text-yellow-400', bg: 'bg-yellow-500/10'
        }, {
          label: 'Completed', value: getStatCount('completed'), icon: FiCheckCircle, color: 'text-green-400', bg: 'bg-green-500/10'
        }, {
          label: 'Overdue', value: stats?.overdue || 0, icon: FiAlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10'
        }].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{label}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
              </div>
              <div className={`p-3 rounded-xl ${bg}`}><Icon className={`text-xl ${color}`} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Suggestion */}
      <div className="glass rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FiZap className="text-purple-400" /> AI Task Generator</h2>
        <div className="flex gap-3">
          <input value={aiGoal} onChange={e => setAiGoal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAISuggest()}
            placeholder="Enter your goal (e.g., 'Build a React portfolio website')..."
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 placeholder-slate-500" />
          <button onClick={handleAISuggest} disabled={aiLoading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            {aiLoading ? <><FiLoader className="animate-spin" /> Generating...</> : <><FiZap /> Generate</>}
          </button>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Tasks</h2>
        <button onClick={() => { setEditTask(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors">
          <FiPlus /> New Task
        </button>
      </div>

      {recentTasks.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <FiCheckCircle className="text-slate-600 text-4xl mx-auto mb-3" />
          <p className="text-slate-400">No tasks yet. Create one or use AI to generate tasks!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTasks.map(task => <TaskCard key={task._id} task={task} onEdit={(t) => { setEditTask(t); setShowModal(true); }} />)}
        </div>
      )}

      {showModal && <TaskModal task={editTask} onClose={() => { setShowModal(false); setEditTask(null); }} />}
    </div>
  );
}
