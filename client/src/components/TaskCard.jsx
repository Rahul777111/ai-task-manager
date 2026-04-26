import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiClock, FiZap, FiCheckCircle, FiCircle, FiMoreVertical } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import toast from 'react-hot-toast';

const priorityConfig = {
  high: { class: 'badge-high', dot: 'bg-red-400', label: 'High', bar: 'from-red-500 to-rose-400' },
  medium: { class: 'badge-medium', dot: 'bg-yellow-400', label: 'Med', bar: 'from-yellow-500 to-amber-400' },
  low: { class: 'badge-low', dot: 'bg-green-400', label: 'Low', bar: 'from-green-500 to-emerald-400' },
};

const statusConfig = {
  'todo': { class: 'badge-todo', label: 'To Do', icon: FiCircle },
  'in-progress': { class: 'badge-inprogress', label: 'In Progress', icon: FiClock },
  'completed': { class: 'badge-completed', label: 'Done', icon: FiCheckCircle },
};

export default function TaskCard({ task, onEdit }) {
  const { updateTask, deleteTask } = useTasks();
  const [menuOpen, setMenuOpen] = useState(false);
  const [completing, setCompleting] = useState(false);

  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const status = statusConfig[task.status] || statusConfig['todo'];
  const StatusIcon = status.icon;
  const isCompleted = task.status === 'completed';

  const toggleComplete = async () => {
    setCompleting(true);
    await updateTask(task._id, { status: isCompleted ? 'todo' : 'completed' });
    toast.success(isCompleted ? 'Task reopened' : '✅ Task completed!');
    setCompleting(false);
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    await deleteTask(task._id);
    toast.success('Task deleted');
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;
  const dueFormatted = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;

  return (
    <div className={`glass card-hover rounded-2xl overflow-hidden group relative transition-all ${
      isCompleted ? 'opacity-60' : ''
    } ${isOverdue ? 'border-red-500/30' : ''}`}>

      {/* Priority accent bar */}
      <div className={`h-0.5 w-full bg-gradient-to-r ${priority.bar}`} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={toggleComplete}
              disabled={completing}
              className="mt-0.5 flex-shrink-0 transition-all hover:scale-110 active:scale-95"
            >
              {completing
                ? <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                : isCompleted
                  ? <FiCheckCircle className="text-green-400 text-xl" />
                  : <FiCircle className="text-slate-600 hover:text-indigo-400 text-xl transition-colors" />
              }
            </button>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm leading-snug ${
                isCompleted ? 'line-through text-slate-500' : 'text-white'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
              )}
            </div>
          </div>

          {/* Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <FiMoreVertical className="text-sm" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 glass-strong rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50 min-w-[120px]">
                <button onClick={() => { onEdit(task); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                  <FiEdit2 className="text-xs" /> Edit
                </button>
                <button onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all">
                  <FiTrash2 className="text-xs" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 flex-wrap mt-4 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${priority.class}`}>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${priority.dot} mr-1`} />
              {priority.label}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${status.class} flex items-center gap-1`}>
              <StatusIcon className="text-xs" /> {status.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {task.aiGenerated && (
              <span className="text-xs text-purple-400 flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                <FiZap className="text-xs" /> AI
              </span>
            )}
            {dueFormatted && (
              <span className={`text-xs flex items-center gap-1 px-2 py-0.5 rounded-lg ${
                isOverdue
                  ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                  : 'text-slate-500 bg-slate-800/60'
              }`}>
                <FiClock className="text-xs" />{dueFormatted}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
