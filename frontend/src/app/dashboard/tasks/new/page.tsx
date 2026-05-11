'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';

function NewTaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) {
      router.push('/dashboard/tasks');
    }
  }, [projectId, router]);

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: any) => {
      const res = await api.post('/tasks', newTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      router.push('/dashboard/tasks');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && projectId) {
      createTaskMutation.mutate({ 
        title, 
        description, 
        priority, 
        projectId, 
        dueDate: dueDate || undefined 
      });
    }
  };

  if (!projectId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/tasks"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create New Task</h1>
          <p className="text-slate-400 text-sm">Add a new item to your Kanban board.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0F172A] border border-white/5 rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            placeholder="e.g. Design Homepage Hero"
            className="w-full bg-[#1E293B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any relevant details, links, or sub-tasks..."
            rows={4}
            className="w-full bg-[#1E293B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-[#1E293B] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#1E293B] border border-white/5 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
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
            disabled={createTaskMutation.isPending}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 rounded-xl font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {createTaskMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default function NewTaskPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Loading...</div>}>
      <NewTaskForm />
    </Suspense>
  );
}
