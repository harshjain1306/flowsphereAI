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
      className="max-w-2xl mx-auto space-y-6 text-[#1C1E21] dark:text-white"
    >
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/tasks"
          className="p-2.5 rounded-full bg-[#F1F4F7] dark:bg-[#1C1E21] hover:bg-[#DEE3E9] dark:hover:bg-charcoal border border-[#DEE3E9] dark:border-charcoal text-[#5D6C7B] dark:text-[#8595A4] hover:text-[#1C1E21] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-heading font-black text-3xl tracking-tight">Create New Task</h1>
          <p className="text-[#5D6C7B] dark:text-[#8595A4] text-sm font-semibold">Add a new item to your Kanban board.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal rounded-[32px] p-8 space-y-6 shadow-sm">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            placeholder="e.g. Design Homepage Hero"
            className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 text-[#1C1E21] dark:text-white placeholder-[#8595A4] focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all font-semibold text-sm h-11"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any relevant details, links, or sub-tasks..."
            rows={4}
            className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 text-[#1C1E21] dark:text-white placeholder-[#8595A4] focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all font-semibold text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 text-[#1C1E21] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all font-semibold text-sm cursor-pointer h-11"
            >
              <option value="Low" className="dark:bg-[#1C1E21]">Low</option>
              <option value="Medium" className="dark:bg-[#1C1E21]">Medium</option>
              <option value="High" className="dark:bg-[#1C1E21]">High</option>
              <option value="Urgent" className="dark:bg-[#1C1E21]">Urgent</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 text-[#1C1E21] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all font-semibold text-sm h-11"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#DEE3E9] dark:border-charcoal flex justify-end gap-3">
          <Link
            href="/dashboard/tasks"
            className="px-6 py-2.5 rounded-full font-bold text-sm text-[#5D6C7B] hover:text-[#1C1E21] dark:hover:text-white transition-colors flex items-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createTaskMutation.isPending}
            className="flex items-center gap-2 bg-[#0064E0] hover:bg-[#0457CB] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-[#0064E0]/20 transition-all disabled:opacity-50"
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
    <Suspense fallback={<div className="text-[#1C1E21] text-center py-20 font-bold">Loading...</div>}>
      <NewTaskForm />
    </Suspense>
  );
}
