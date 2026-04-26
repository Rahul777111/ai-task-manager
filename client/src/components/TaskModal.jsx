import React, { useState, useEffect } from 'react';
import { FiX, FiZap, FiLoader } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import { breakdownTask, prioritizeTask } from '../services/aiService';
import toast from 'react-hot-toast';

export default function TaskModal({ task, onClose }) {
  const { createTask, updateTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', tags: '', subtasks: []
  });

  useEffect(() => {
    if (task) setForm({ ...task, tags: task.tags?.join(', ') || '', dueDate: task.dueDate ? task.dueDate.split('T')[0] : '' });
  }, [task]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAIBreakdown = async () => {
    if (!form.title) return toast.error('Enter a title first');
    setAiLoading(true);
    try {
      const { data } = await breakdownTask(form.title, form.description);
      setForm(prev => ({ ...prev, subtasks: data.subtasks }));
      toast.success('AI generated subtasks!');
    } catch { toast.error('AI failed'); } finally { setAiLoading(false); }
  };

  const handleAIPriority = async () => {
    if (!form.title) return toast.error('Enter a title first');
    setAiLoading(true);
    try {
      const { data } = await prioritizeTask(form.title, form.description, form.dueDate);
      setForm(prev => ({ ...prev, priority: data.priority }));
      toast.success(`AI suggests: ${data.priority} priority - ${data.reason}`);
    } catch { toast.error('AI failed'); } finally { setAiLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      if (task) await updateTask(task._id, payload);
      else await createTask(payload);
      onClose();
    } catch { toast.error('Failed to save task'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors"><FiX className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Priority</label>
              <div className="flex items-center gap-2">
                <select name="priority" value={form.priority} onChange={handleChange}
                  className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500">
                  {['low','medium','high','critical'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button type="button" onClick={handleAIPriority} className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors" title="AI suggest priority">
                  {aiLoading ? <FiLoader className="animate-spin" /> : <FiZap />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500">
                {['todo','in-progress','completed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Tags (comma-separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="react, fullstack, urgent"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500" />
          </div>
          {form.subtasks?.length > 0 && (
            <div>
              <label className="block text-sm text-slate-400 mb-2">Subtasks</label>
              <div className="space-y-2">
                {form.subtasks.map((subtask, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" checked={subtask.completed}
                      onChange={(e) => setForm(prev => ({ ...prev, subtasks: prev.subtasks.map((s, j) => j === i ? { ...s, completed: e.target.checked } : s) }))}
                      className="accent-primary-500" />
                    {subtask.title}
                  </label>
                ))}
              </div>
            </div>
          )}
          <button type="button" onClick={handleAIBreakdown} disabled={aiLoading}
            className="w-full flex items-center justify-center gap-2 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm transition-colors border border-purple-500/30">
            {aiLoading ? <FiLoader className="animate-spin" /> : <FiZap />}
            AI Break Down into Subtasks
          </button>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-slate-600 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium">
              {loading ? 'Saving...' : task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
