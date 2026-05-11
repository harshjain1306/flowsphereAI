'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { AnimatePresence } from 'framer-motion';

export default function NewProjectPage() {
  const [name, setName] = useState('');
   const [description, setDescription] = useState('');
   const [showSuccess, setShowSuccess] = useState(false);
   const [error, setError] = useState('');
   const router = useRouter();
   const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (newProject: { name: string; description: string }) => {
      const res = await api.post('/projects', newProject);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create project. You might not have permission.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createProjectMutation.mutate({ name, description });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6 relative"
    >
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 whitespace-nowrap"
          >
            <CheckCircle2 className="w-5 h-5" /> Project Created Successfully! 🚀
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm text-center font-medium"
        >
          {error}
        </motion.div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/tasks"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create New Project</h1>
          <p className="text-slate-400 text-sm">Start a new workspace for your team.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0F172A] border border-white/5 rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            placeholder="e.g. Website Redesign"
            className="w-full bg-[#1E293B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description <span className="text-slate-500">(Optional)</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what this project is about..."
            rows={4}
            className="w-full bg-[#1E293B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
          />
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
          <Link
            href="/dashboard/tasks"
            className="px-6 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createProjectMutation.isPending}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white transition-all disabled:opacity-50 ${
              showSuccess ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90'
            }`}
          >
             {createProjectMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
             {showSuccess ? (
               <>
                 <CheckCircle2 className="w-4 h-4" /> Project Saved!
               </>
             ) : createProjectMutation.isPending ? (
               'Creating...'
             ) : (
               'Create Project'
             )}
           </button>
        </div>
      </form>
    </motion.div>
  );
}
