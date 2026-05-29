'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Activity, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  MoreVertical,
  ArrowRightLeft,
  Receipt,
  Landmark,
  Car,
  Info,
  Laptop,
  Coins,
  Phone,
  Trash2,
  Edit2,
  CheckCircle,
  FileText,
  BarChart,
  Layers,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import { useState } from 'react';
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

  // Calculations for dynamic stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t: any) => t.status === 'In Progress').length;
  
  const completedPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // SVG Donut Calculations
  const radius = 15.9155;

  // Priority Breakdown
  const highCount = tasks.filter((t: any) => t.priority === 'High' || t.priority === 'Urgent').length;
  const medCount = tasks.filter((t: any) => t.priority === 'Medium').length;
  const lowCount = tasks.filter((t: any) => t.priority === 'Low').length;
  const prioTotal = highCount + medCount + lowCount || 1;
  const highPct = Math.round((highCount / prioTotal) * 100);
  const medPct = Math.round((medCount / prioTotal) * 100);
  const lowPct = Math.round((lowCount / prioTotal) * 100);

  // Overdue / Attention tasks
  const attentionCount = tasks.filter((t: any) => t.status !== 'Completed' && (t.priority === 'Urgent' || t.priority === 'High')).length;

  return (
    <div className="space-y-8 text-[#1C1E21] dark:text-white">
      {/* Greetings Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading font-black text-4xl tracking-tight text-[#1C1E21] dark:text-white">
            Greetings! 👋
          </h1>
          <p className="text-[#5D6C7B] dark:text-[#8595A4] text-sm font-semibold">
            Start your day with {user?.name?.split(' ')[0]} • Enterprise Overview
          </p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal text-[#1C1E21] dark:text-white rounded-xl font-bold text-sm hover:bg-[#F1F4F7] transition-all duration-200 active:scale-95"
          >
            Export Report
          </button>
          <Link
            href="/dashboard/tasks"
            className="px-5 py-2.5 bg-[#0A1317] dark:bg-white text-white dark:text-[#0A1317] rounded-xl font-bold text-sm hover:opacity-90 transition-all duration-200 active:scale-95 flex items-center gap-1.5"
          >
            Board Settings
          </Link>
        </div>
      </div>

      {/* 4-Column Stats Row (From Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Completion Donut Card */}
        <div className="bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal rounded-[32px] p-6 flex flex-col justify-between h-full hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="font-bold text-xs text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider">Completion</span>
            <span className="text-[#31A24C] p-1.5 rounded-lg bg-[#31A24C]/10"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div className="flex items-center justify-center py-3">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r={radius} fill="none" stroke="#F1F4F7" strokeWidth="3" />
                <circle 
                  cx="18" cy="18" r={radius} fill="none" stroke="#0064E0" strokeWidth="3" 
                  strokeDasharray={`${completedPercentage} 100`} 
                  strokeLinecap="round" 
                  className="transition-all duration-500 origin-center -rotate-90"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading font-black text-2xl text-[#1C1E21] dark:text-white">{completedPercentage}%</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-[#5D6C7B] dark:text-[#8595A4] font-semibold">{completedTasks} of {totalTasks} tasks completed</p>
        </div>

        {/* Weekly Velocity Bar Chart Card */}
        <div className="bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal rounded-[32px] p-6 flex flex-col justify-between h-full hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="font-bold text-xs text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider">Velocity</span>
            <span className="text-[#0064E0] p-1.5 rounded-lg bg-[#0064E0]/10"><BarChart className="w-4 h-4" /></span>
          </div>
          <div className="flex items-end justify-between h-28 gap-2.5 px-2">
            <div className="w-3.5 bg-[#F1F4F7] dark:bg-[#0A1317] rounded-full h-[40%] hover:opacity-85 transition-opacity" />
            <div className="w-3.5 bg-[#0091FF] rounded-full h-[65%] hover:opacity-85 transition-opacity" />
            <div className="w-3.5 bg-[#F1F4F7] dark:bg-[#0A1317] rounded-full h-[45%] hover:opacity-85 transition-opacity" />
            <div className="w-3.5 bg-[#0064E0] rounded-full h-[90%] hover:opacity-85 transition-opacity" />
            <div className="w-3.5 bg-[#F1F4F7] dark:bg-[#0A1317] rounded-full h-[55%] hover:opacity-85 transition-opacity" />
            <div className="w-3.5 bg-[#0091FF] rounded-full h-[70%] hover:opacity-85 transition-opacity" />
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="font-heading font-black text-2xl text-[#1C1E21] dark:text-white">
              {totalTasks > 0 ? (completedTasks * 8.5).toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-[#5D6C7B] dark:text-[#8595A4] font-bold ml-1.5">pts / week average</span>
          </div>
        </div>

        {/* Priority Breakdown Stacked Progress Card */}
        <div className="bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal rounded-[32px] p-6 flex flex-col justify-between h-full hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="font-bold text-xs text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider">Priority Breakdown</span>
            <span className="text-[#F2A918] p-1.5 rounded-lg bg-[#F2A918]/10"><Layers className="w-4 h-4" /></span>
          </div>
          <div className="space-y-4">
            <div className="h-6 w-full flex rounded-full overflow-hidden border border-[#DEE3E9] dark:border-charcoal bg-[#FAF8FF]">
              {highPct > 0 && <div className="h-full bg-[#E41E3F]" style={{ width: `${highPct}%` }} />}
              {medPct > 0 && <div className="h-full bg-[#F7B928]" style={{ width: `${medPct}%` }} />}
              {lowPct > 0 && <div className="h-full bg-[#0064E0]" style={{ width: `${lowPct}%` }} />}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center text-[10px] text-[#5D6C7B] dark:text-[#8595A4] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E41E3F]" />
                  <span>High</span>
                </div>
                <p className="font-bold text-xs mt-0.5">{highCount}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center text-[10px] text-[#5D6C7B] dark:text-[#8595A4] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F7B928]" />
                  <span>Med</span>
                </div>
                <p className="font-bold text-xs mt-0.5">{medCount}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center text-[10px] text-[#5D6C7B] dark:text-[#8595A4] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0064E0]" />
                  <span>Low</span>
                </div>
                <p className="font-bold text-xs mt-0.5">{lowCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attention Required Card (Overdue/Urgent) */}
        <div className="bg-white dark:bg-[#1C1E21] border border-[#E41E3F]/30 dark:border-[#E41E3F]/50 rounded-[32px] p-6 flex flex-col justify-between h-full hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E41E3F]" />
          <div className="flex justify-between items-start mb-4">
            <span className="font-bold text-xs text-[#E41E3F] uppercase tracking-wider">Attention Required</span>
            <span className="text-[#E41E3F] p-1.5 rounded-lg bg-[#E41E3F]/10"><AlertTriangle className="w-4 h-4" /></span>
          </div>
          <div>
            <span className="font-heading font-black text-5xl leading-tight text-[#E41E3F]">
              {String(attentionCount).padStart(2, '0')}
            </span>
            <p className="text-xs text-[#5D6C7B] dark:text-[#8595A4] font-semibold mt-1">High urgency pending tasks</p>
          </div>
          <button 
            onClick={() => {
              setFilterStatus(null);
              router.push('/dashboard/tasks');
            }}
            className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#E41E3F] group hover:underline text-left"
          >
            Review Board Tasks
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Main Grid: 2/3 Content, 1/3 Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Cards, Actions, Recent Sales/Tasks (col-span-2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Cards Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-black text-2xl text-[#1C1E21] dark:text-white">Financial & Work Cards</h2>
              <button 
                onClick={() => setFilterStatus(null)} 
                className="text-xs font-bold text-[#0064E0] hover:underline"
              >
                Reset layout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Ink-Deep Card */}
              <div className="bg-[#0A1317] dark:bg-[#1C1E21] text-white p-6 rounded-[24px] shadow-xl relative overflow-hidden flex flex-col justify-between h-48 group hover:scale-[1.01] transition-all duration-300 border border-[#1C1E21]">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#0064E0]/15 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[#8595A4] text-xs font-bold tracking-wider">TOTAL PRODUCTIVITY VALUE</p>
                    <p className="font-heading font-black text-3xl tracking-tight text-white">
                      $ {totalTasks * 1000 + completedTasks * 120}.00
                    </p>
                  </div>
                  <button className="text-[#8595A4] hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="font-mono text-sm tracking-widest text-[#8595A4]">
                      •••• {user?.role === 'Admin' ? '1810' : '2345'}
                    </p>
                    <p className="text-[10px] text-[#8595A4] font-bold uppercase tracking-wider">
                      ACTIVE TASKS / {totalTasks - completedTasks}
                    </p>
                  </div>
                  <span className="font-heading italic font-extrabold text-xl tracking-wider text-white/90">
                    VISA
                  </span>
                </div>
              </div>

              {/* Card 2: Cobalt Blue Card */}
              <div className="bg-[#0064E0] text-white p-6 rounded-[24px] relative overflow-hidden flex flex-col justify-between h-48 group hover:scale-[1.01] transition-all duration-300 shadow-xl shadow-[#0064E0]/15">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-white/70 text-xs font-bold tracking-wider">COMPLETED VALUE</p>
                    <p className="font-heading font-black text-3xl tracking-tight text-white">
                      ₴ {completedTasks * 5000 + 424}.00
                    </p>
                  </div>
                  <button className="text-white/70 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="font-mono text-sm tracking-widest text-white/70">
                      •••• 1423
                    </p>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider">
                      COMPLETED SPRINT TASKS / {completedTasks}
                    </p>
                  </div>
                  <div className="flex -space-x-3 items-center">
                    <div className="w-7 h-7 rounded-full bg-white/20 border border-white/10" />
                    <div className="w-7 h-7 rounded-full bg-white/40 border border-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions / Filters Section */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-[#1C1E21] dark:text-white pl-1">Status Filters</h2>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => setFilterStatus(null)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  filterStatus === null
                    ? 'bg-[#0A1317] dark:bg-white text-white dark:text-[#0A1317] shadow-md'
                    : 'bg-white dark:bg-[#1C1E21] text-[#1C1E21] dark:text-white border border-[#DEE3E9] dark:border-charcoal hover:bg-[#F1F4F7]'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> All Tasks
              </button>
              <button
                onClick={() => setFilterStatus('Todo')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  filterStatus === 'Todo'
                    ? 'bg-[#0A1317] dark:bg-white text-white dark:text-[#0A1317] shadow-md'
                    : 'bg-white dark:bg-[#1C1E21] text-[#1C1E21] dark:text-white border border-[#DEE3E9] dark:border-charcoal hover:bg-[#F1F4F7]'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" /> To Do
              </button>
              <button
                onClick={() => setFilterStatus('In Progress')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  filterStatus === 'In Progress'
                    ? 'bg-[#0A1317] dark:bg-white text-white dark:text-[#0A1317] shadow-md'
                    : 'bg-white dark:bg-[#1C1E21] text-[#1C1E21] dark:text-white border border-[#DEE3E9] dark:border-charcoal hover:bg-[#F1F4F7]'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" /> In Progress
              </button>
              <button
                onClick={() => setFilterStatus('Completed')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  filterStatus === 'Completed'
                    ? 'bg-[#0A1317] dark:bg-white text-white dark:text-[#0A1317] shadow-md'
                    : 'bg-white dark:bg-[#1C1E21] text-[#1C1E21] dark:text-white border border-[#DEE3E9] dark:border-charcoal hover:bg-[#F1F4F7]'
                }`}
              >
                <Car className="w-3.5 h-3.5" /> Completed
              </button>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="bg-white dark:bg-[#1C1E21] rounded-[24px] border border-[#DEE3E9] dark:border-charcoal overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-[#DEE3E9] dark:border-charcoal flex justify-between items-center bg-[#FAF8FF] dark:bg-[#1C1E21]/50">
              <h2 className="font-heading font-bold text-lg text-[#1C1E21] dark:text-white">
                {filterStatus ? `${filterStatus} Tasks` : 'Recent Workspace Tasks'}
              </h2>
              <Link 
                href="/dashboard/tasks" 
                className="text-xs font-bold text-[#0064E0] hover:underline flex items-center gap-1"
              >
                Open Board <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#DEE3E9] dark:border-charcoal text-xs font-bold uppercase tracking-wider text-[#5D6C7B] dark:text-[#8595A4] bg-[#FAF8FF] dark:bg-[#1C1E21]">
                    <th className="px-6 py-4">Task Details</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Estimate Load</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEE3E9] dark:divide-charcoal">
                  {tasks
                    .filter((t: any) => !filterStatus || t.status === filterStatus)
                    .slice(0, 5)
                    .map((task: any) => {
                      // Determine status colors matching guide
                      let statusBg = 'bg-[#EDE5DB] text-[#5D6C7B]';
                      let statusLabel = task.status;
                      if (task.status === 'Completed') {
                        statusBg = 'bg-[#31A24C]/10 text-[#31A24C] border border-[#31A24C]/20';
                        statusLabel = 'Success';
                      } else if (task.status === 'In Progress') {
                        statusBg = 'bg-[#0064E0]/10 text-[#0064E0] border border-[#0064E0]/20';
                        statusLabel = 'Process';
                      } else {
                        statusBg = 'bg-[#E41E3F]/10 text-[#E41E3F] border border-[#E41E3F]/20';
                        statusLabel = 'Failed';
                      }

                      // Estimate load
                      let timeLoad = '-8.0 hrs';
                      if (task.priority === 'High' || task.priority === 'Urgent') {
                        timeLoad = '-16.0 hrs';
                      } else if (task.priority === 'Low') {
                        timeLoad = '-4.0 hrs';
                      }

                      return (
                        <tr 
                          key={task._id} 
                          onClick={() => setSelectedTask(task)}
                          className="hover:bg-[#FAF8FF] dark:hover:bg-[#0A1317]/50 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#0064E0]/10 flex items-center justify-center font-bold text-xs text-[#0064E0]">
                              {user?.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#1C1E21] dark:text-white group-hover:text-[#0064E0] transition-colors">
                                {task.title}
                              </p>
                              <p className="text-xs text-[#5D6C7B] dark:text-[#8595A4] font-semibold">{user?.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#1C1E21] dark:text-white">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date set'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusBg}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {statusLabel}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-sm text-[#1C1E21] dark:text-white">
                            {timeLoad}
                          </td>
                        </tr>
                      );
                    })}
                  
                  {tasks.filter((t: any) => !filterStatus || t.status === filterStatus).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-[#5D6C7B]">
                        <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30 text-[#0064E0]" />
                        <p className="font-bold">No tasks found</p>
                        <p className="text-xs">There are no tasks matching the filter selection.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Statistics & Activity Panel (col-span-1) */}
        <div className="space-y-8">
          
          {/* Statistics Card */}
          <div className="bg-white dark:bg-[#1C1E21] rounded-[32px] p-6 border border-[#DEE3E9] dark:border-charcoal space-y-6 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-[#DEE3E9] dark:border-charcoal">
              <h3 className="font-heading font-black text-xl flex items-center gap-2">
                Sprint Summary
                <Info className="w-4 h-4 text-[#8595A4]" />
              </h3>
              <select className="bg-transparent border-0 text-xs font-bold text-[#5D6C7B] focus:ring-0 cursor-pointer">
                <option>Active Sprint</option>
                <option>Next Sprint</option>
              </select>
            </div>

            {/* Circular Donut Graph */}
            <div className="relative flex justify-center items-center py-4">
              <svg className="w-44 h-44 transform -rotate-90">
                <circle cx="88" cy="88" r="50" stroke="#F1F4F7" strokeWidth="16" fill="transparent" />
                {completedTasks > 0 && (
                  <circle
                    cx="88" cy="88" r="50" stroke="#0064E0" strokeWidth="16" fill="transparent"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 - (completedTasks / totalTasks) * (2 * Math.PI * 50)}
                    strokeLinecap="round"
                  />
                )}
                {inProgressTasks > 0 && (
                  <circle
                    cx="88" cy="88" r="50" stroke="#0A1317" strokeWidth="16" fill="transparent"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 - (inProgressTasks / totalTasks) * (2 * Math.PI * 50)}
                    strokeLinecap="round"
                    className="origin-center rotate-45"
                  />
                )}
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#5D6C7B]">Active Sprints</span>
                <span className="font-heading font-black text-xl tracking-tight text-[#1C1E21] dark:text-white">
                  ${completedTasks * 800 + inProgressTasks * 400 + 4810}.00
                </span>
              </div>

              <div className="absolute top-2 right-4 bg-[#0A1317] dark:bg-white text-white dark:text-[#0A1317] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                ${completedTasks * 640 + 9560}.0
              </div>
            </div>

            <div className="flex justify-center gap-4 text-xs font-bold py-2 border-b border-[#DEE3E9] dark:border-charcoal">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#0A1317]" />
                <span className="text-[#1C1E21] dark:text-white">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#0064E0]" />
                <span className="text-[#5D6C7B] dark:text-[#8595A4]">Pending</span>
              </div>
            </div>

            {/* Activity List */}
            <div className="space-y-4 pt-2">
              {[
                { name: 'Spotify AI Assistant', time: '11 minutes ago', amount: '-$320.00', type: 'PAYMENT', icon: Sparkles, iconBg: 'bg-[#FAF8FF]' },
                { name: 'Apple UI Redesign', time: '32 minutes ago', amount: '-$552.00', type: 'PAYMENT', icon: Laptop, iconBg: 'bg-[#FAF8FF]' },
                { name: 'Bitcoin Database Server', time: '1 hour ago', amount: '-$123.00', type: 'TRADE', icon: Coins, iconBg: 'bg-[#FAF8FF]' },
                { name: 'Apple Auth Integration', time: '3 hours ago', amount: '-$242.00', type: 'STORE', icon: Phone, iconBg: 'bg-[#FAF8FF]' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F1F4F7] dark:bg-[#0A1317] flex items-center justify-center text-[#0064E0] shadow-sm">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#1C1E21] dark:text-white group-hover:text-[#0064E0] transition-colors">{item.name}</p>
                      <p className="text-xs text-[#5D6C7B] font-semibold">{item.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm text-[#1C1E21] dark:text-white">{item.amount}</p>
                    <p className="text-[9px] font-extrabold text-[#5D6C7B] tracking-wider uppercase">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="bg-[#FAF8FF] dark:bg-[#1C1E21] rounded-[24px] border border-[#DEE3E9] dark:border-charcoal p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg flex items-center gap-2 text-[#1C1E21] dark:text-white">
              <Sparkles className="w-5 h-5 text-[#0064E0]" />
              AI Insights
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal text-sm text-[#1C1E21] dark:text-white font-semibold">
                You've completed <span className="font-extrabold text-[#0064E0]">{completedTasks > 0 ? completedPercentage : '0'}% of all tasks</span> this week compared to last week. Great progress! 🚀
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal text-sm text-[#1C1E21] dark:text-white font-semibold">
                <span className="font-bold text-[#E41E3F]">Suggestion:</span> High priority tasks in board are due soon. Adjust developer workload to meet deadlines.
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#31A24C] text-white px-6 py-3.5 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-[#31A24C]/10"
          >
            <CheckCircle2 className="w-5 h-5" /> Changes Saved Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal rounded-[32px] shadow-2xl overflow-hidden text-[#1C1E21] dark:text-white"
            >
              <div className="p-6 border-b border-[#DEE3E9] dark:border-charcoal flex items-center justify-between bg-[#FAF8FF] dark:bg-[#1C1E21]/50">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border bg-[#0064E0]/10 text-[#0064E0] border-[#0064E0]/20`}>
                    {selectedTask.priority}
                  </span>
                  <span className="text-[#5D6C7B] dark:text-[#8595A4] text-sm font-bold">{selectedTask.status}</span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedTask(null);
                    setIsEditing(false);
                  }}
                  className="text-[#5D6C7B] hover:text-[#1C1E21] dark:hover:text-white transition-colors text-2xl font-bold p-1"
                >
                  &times;
                </button>
              </div>

              <div className="p-8 space-y-6">
                {saveError && (
                  <div className="p-3 bg-[#E41E3F]/10 border border-[#E41E3F]/20 text-[#E41E3F] rounded-lg text-xs font-semibold text-center">
                    {saveError}
                  </div>
                )}
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#5D6C7B] uppercase tracking-wider">Task Title</label>
                      <input 
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/50 transition-all text-[#1C1E21] dark:text-white font-semibold text-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#5D6C7B] uppercase tracking-wider">Description</label>
                      <textarea 
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                        className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/50 transition-all text-[#1C1E21] dark:text-white resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-3xl font-heading font-black text-[#1C1E21] dark:text-white mb-3">{selectedTask.title}</h2>
                    <p className="text-[#5D6C7B] dark:text-[#8595A4] leading-relaxed whitespace-pre-wrap font-semibold">
                      {selectedTask.description || "No description provided for this task."}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#DEE3E9] dark:border-charcoal">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#5D6C7B] uppercase tracking-wider">Due Date</p>
                    <div className="flex items-center gap-2 text-[#1C1E21] dark:text-white font-semibold">
                      <Calendar className="w-4 h-4 text-[#0064E0]" />
                      <span>{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'No date set'}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#5D6C7B] uppercase tracking-wider">Assignee</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0064E0] flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                        {user?.name?.charAt(0)}
                      </div>
                      <span className="text-[#1C1E21] dark:text-white font-semibold">{user?.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#FAF8FF] dark:bg-[#1C1E21]/50 border-t border-[#DEE3E9] dark:border-charcoal flex justify-end gap-3">
                <button 
                  onClick={() => {
                    setSelectedTask(null);
                    setIsEditing(false);
                  }}
                  className="px-5 py-2.5 text-[#5D6C7B] hover:text-[#1C1E21] dark:hover:text-white font-bold text-sm transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Close'}
                </button>
                {isEditing ? (
                  <button 
                    onClick={handleSaveEdit}
                    disabled={updateTaskContentMutation.isPending}
                    className="bg-[#0064E0] hover:bg-[#0457CB] text-white px-8 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-[#0064E0]/20 disabled:opacity-50"
                  >
                    {updateTaskContentMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleEditTask(selectedTask)}
                    className="bg-[#0064E0] hover:bg-[#0457CB] text-white px-8 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-[#0064E0]/20"
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
