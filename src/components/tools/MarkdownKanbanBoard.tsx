import React, { useState } from 'react';
import { FileText, Plus, Sparkles, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const MarkdownKanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Design quantum fractal shader', status: 'todo', priority: 'high' },
    { id: '2', title: 'Implement OAuth2 PKCE validation', status: 'in_progress', priority: 'urgent' },
    { id: '3', title: 'Optimize SVG vector path minifier', status: 'done', priority: 'medium' },
    { id: '4', title: 'Write BIP39 test suite', status: 'todo', priority: 'low' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), title: newTaskTitle, status: 'todo', priority: 'medium' }]);
    setNewTaskTitle('');
  };

  const moveTask = (id: string, newStatus: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const columns = [
    { id: 'todo', title: 'To Do', icon: Clock },
    { id: 'in_progress', title: 'In Progress', icon: Sparkles },
    { id: 'done', title: 'Completed', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <h1 className="text-2xl font-bold text-slate-100">Markdown Kanban Board & Task Flow Matrix</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Transform task lists into an interactive Kanban board with status columns and priority tracking.
            </p>
          </div>
          <form onSubmit={handleAddTask} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="New task title..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {columns.map((col) => {
            const Icon = col.icon;
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <Icon className="w-4 h-4 text-indigo-400" /> {col.title}
                  </div>
                  <span className="px-2 py-0.5 bg-slate-900 text-slate-400 rounded-lg text-xs font-mono">{colTasks.length}</span>
                </div>

                <div className="space-y-3">
                  {colTasks.map((t) => (
                    <div key={t.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 shadow">
                      <div className="text-sm font-medium text-slate-200">{t.title}</div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                        <span className="px-2 py-0.5 bg-slate-950 text-indigo-300 rounded font-medium uppercase tracking-wider text-[10px]">
                          {t.priority}
                        </span>
                        <div className="flex items-center gap-1">
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => moveTask(t.id, col.id === 'done' ? 'in_progress' : 'todo')}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]"
                            >
                              ← Prev
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => moveTask(t.id, col.id === 'todo' ? 'in_progress' : 'done')}
                              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px]"
                            >
                              Next →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-600">No tasks in column</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
