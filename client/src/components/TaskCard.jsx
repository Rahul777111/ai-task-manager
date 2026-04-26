import React from 'react';
import { FiTrash2, FiEdit2, FiClock, FiTag } from 'react-icons/fi';
import { format, isPast } from 'date-fns';
import { useTasks } from '../context/TaskContext';

const priorityColors = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusColors = {
  'todo': 'bg-slate-500/20 text-slate-400',
  'in-progress': 'bg-blue-500/20 text-blue-400',
  'completed': 'bg-green-500/20 text-green-400',
};

export default function TaskCard({ task, onEdit }) {
  const { deleteTask, updateTask } = useTasks();
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed';

  const toggleStatus = () => {
    const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'todo';
    updateTask(task._id, { status: nextStatus });
  };

  return (
    <div className={`glass rounded-xl p-4 transition-all hover:border-primary-500/50 ${
      isOverdue ? 'border-red-500/50' : 'border-slate-700/50'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>{task.priority}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>{task.status}</span>
            {task.aiGenerated && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">✨ AI</span>}
          </div>
          <h3 className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
            {task.title}
          </h3>
          {task.description && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{task.description}</p>}
          {task.dueDate && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
              <FiClock className="shrink-0" />
              <span>{isOverdue ? '⚠ Overdue: ' : ''}{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
            </div>
          )}
          {task.tags?.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <FiTag className="text-slate-500 text-xs" />
              {task.tags.map(tag => (
                <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">#{tag}</span>
              ))}
            </div>
          )}
          {task.subtasks?.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-slate-400 mb-1">{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks</div>
              <div className="w-full bg-slate-700 rounded-full h-1">
                <div className="bg-primary-500 h-1 rounded-full transition-all" style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button onClick={toggleStatus} className="p-1.5 rounded-lg hover:bg-primary-500/20 text-primary-400 transition-colors" title="Cycle status">
            <FiCheckSquare className="text-sm" />
          </button>
          <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg hover:bg-slate-600 text-slate-400 transition-colors">
            <FiEdit2 className="text-sm" />
          </button>
          <button onClick={() => deleteTask(task._id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
