'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { BarChart, Activity, Clock, CheckCircle2, Sparkles, X, Send, Calendar, TrendingUp } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // States for Task Details
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Fetch projects
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data;
    },
  });

  const projectId = projects?.[0]?._id;

  // Fetch Tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data;
    },
  });

  // Update Task Content Mutation
  const updateTaskContentMutation = useMutation({
    mutationFn: async ({ id, title, description }: { id: string; title: string; description: string }) => {
      const res = await api.put(`/tasks/${id}`, { title, description });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditing(false);
      setSelectedTask(null);
      setShowSuccess(true);
      setSaveError('');
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/dashboard');
        // If already on dashboard, just force a data refresh
        queryClient.invalidateQueries();
      }, 1500);
    },
    onError: (err: any) => {
      setSaveError(err.response?.data?.message || 'Failed to save task. Check your permissions.');
    }
  });

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (selectedTask) {
      updateTaskContentMutation.mutate({
        id: selectedTask._id,
        title: editTitle,
        description: editDescription
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight"
        >
          Good morning, {user?.name?.split(' ')[0]} 👋
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400"
        >
          Here's what's happening with your projects today.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <button 
          onClick={() => setFilterStatus(null)}
          className={`p-6 rounded-2xl bg-[#0F172A] border transition-all text-left group active:scale-95 ${!filterStatus ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-white/5 hover:border-white/10'}`}
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-indigo-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Total Tasks</p>
          <p className="text-3xl font-bold">{tasks.length}</p>
        </button>

        <button 
          onClick={() => setFilterStatus('Completed')}
          className={`p-6 rounded-2xl bg-[#0F172A] border transition-all text-left group active:scale-95 ${filterStatus === 'Completed' ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-white/5 hover:border-white/10'}`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Completed</p>
          <p className="text-3xl font-bold">{tasks.filter((t: any) => t.status === 'Completed').length}</p>
        </button>

        <button 
          onClick={() => setFilterStatus('In Progress')}
          className={`p-6 rounded-2xl bg-[#0F172A] border transition-all text-left group active:scale-95 ${filterStatus === 'In Progress' ? 'border-amber-500 shadow-lg shadow-amber-500/10' : 'border-white/5 hover:border-white/10'}`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium">In Progress</p>
          <p className="text-3xl font-bold">{tasks.filter((t: any) => t.status === 'In Progress').length}</p>
        </button>

        <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/5 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Productivity</p>
          <p className="text-3xl font-bold">
            {tasks.length > 0 
              ? Math.round((tasks.filter((t: any) => t.status === 'Completed').length / tasks.length) * 100) 
              : 0}%
          </p>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0F172A] flex flex-col"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {filterStatus ? `${filterStatus} Tasks` : 'Recent Tasks'}
            </h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
          </div>
          <div className="p-6 flex-1 flex flex-col min-h-[300px]">
            {tasks.filter((t: any) => !filterStatus || t.status === filterStatus).length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
                <p>You're all caught up!</p>
                <p className="text-sm">No pending tasks for today.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks
                  .filter((t: any) => !filterStatus || t.status === filterStatus)
                  .slice(0, 5)
                  .map((task: any) => (
                    <div 
                      key={task._id} 
                      onClick={() => setSelectedTask(task)}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${task.priority === 'High' || task.priority === 'Urgent' ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                        <div>
                          <p className="font-medium text-slate-200">{task.title}</p>
                          <p className="text-xs text-slate-500">{task.status} • {task.priority}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-400 group-hover:text-white transition-colors">Details</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-white/5 bg-gradient-to-b from-[#0F172A] to-[#020617] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="p-6 border-b border-white/5">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              AI Insights
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-sm text-slate-300 leading-relaxed">
                You've completed <span className="text-white font-bold">15% more tasks</span> this week compared to last week. Keep up the momentum! 🚀
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-medium">Suggestion:</span> You have 2 high-priority tasks pending in the "Frontend Rebuild" project.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Changes Saved Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border bg-indigo-500/10 text-indigo-400 border-indigo-500/20`}>
                    {selectedTask.priority}
                  </span>
                  <span className="text-slate-500 text-sm">{selectedTask.status}</span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedTask(null);
                    setIsEditing(false);
                  }}
                  className="text-slate-400 hover:text-white transition-colors text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="p-8 space-y-6">
                {saveError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-medium text-center">
                    {saveError}
                  </div>
                )}
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Task Title</label>
                      <input 
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white font-bold text-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                      <textarea 
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-300 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedTask.title}</h2>
                    <p className="text-slate-400 leading-relaxed">
                      {selectedTask.description || "No description provided for this task."}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</p>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <span>{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'No date set'}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignee</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">U</div>
                      <span className="text-slate-200">{user?.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setSelectedTask(null);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Close'}
                </button>
                {isEditing ? (
                  <button 
                    onClick={handleSaveEdit}
                    disabled={updateTaskContentMutation.isPending}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded-lg font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {updateTaskContentMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEditTask(selectedTask)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Edit Task
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
