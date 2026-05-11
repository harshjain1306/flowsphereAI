'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Calendar, MessageSquare, Paperclip, Plus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

// Types
type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Completed';
type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
}

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'Todo', title: 'To Do', color: 'border-slate-500' },
  { id: 'In Progress', title: 'In Progress', color: 'border-amber-500' },
  { id: 'Review', title: 'Review', color: 'border-purple-500' },
  { id: 'Completed', title: 'Completed', color: 'border-emerald-500' },
];

export default function KanbanBoard() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  
  // Selection state for details modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // We'll mock a default projectId for now, or fetch the user's first project
  const [projectId, setProjectId] = useState<string | null>(null);

  // Fetch projects to get a projectId
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data;
    },
  });

  useEffect(() => {
    if (projects && projects.length > 0 && !projectId) {
      setProjectId(projects[0]._id);
    }
  }, [projects, projectId]);

  // Fetch Tasks
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const res = await api.get(`/tasks/project/${projectId}`);
      return res.data;
    },
    enabled: !!projectId,
  });

  // Update Task Status Mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const res = await api.put(`/tasks/${id}/status`, { status });
      return res.data;
    },
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', projectId]);
      
      queryClient.setQueryData<Task[]>(['tasks', projectId], (old) => {
        if (!old) return [];
        return old.map(t => t._id === newStatus.id ? { ...t, status: newStatus.status } : t);
      });
      
      return { previousTasks };
    },
    onError: (err, newStatus, context) => {
      queryClient.setQueryData(['tasks', projectId], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
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
      }, 1500);
    },
    onError: (err: any) => {
      setSaveError(err.response?.data?.message || 'Failed to save task. Check your permissions.');
    }
  });

  const handleEditTask = () => {
    if (selectedTask) {
      setEditTitle(selectedTask.title);
      setEditDescription(selectedTask.description || '');
      setIsEditing(true);
    }
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

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    updateTaskMutation.mutate({ id: draggableId, status: newStatus });
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'High': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Medium': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Low': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  // Prevent SSR issues with drag-and-drop
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Changes Saved Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Board View</h1>
          <p className="text-slate-400 text-sm">Drag and drop tasks to update their status.</p>
        </div>
        <Link href={`/dashboard/tasks/new?projectId=${projectId || ''}`} className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Task
        </Link>
      </div>

      {!projectId && !isLoading ? (
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          <div className="text-center">
            <h3 className="text-lg font-medium text-white mb-2">No Projects Found</h3>
            <p className="text-slate-400 mb-4">Create a project to start adding tasks.</p>
            <Link href="/dashboard/projects/new" className="inline-block bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-colors">
              Create Project
            </Link>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
            {columns.map((column) => {
              const columnTasks = tasks.filter((t) => t.status === column.id);

              return (
                <div key={column.id} className="flex flex-col w-80 shrink-0">
                  <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color}`}>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {column.title}
                      <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full">
                        {columnTasks.length}
                      </span>
                    </h3>
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 rounded-xl p-2 min-h-[150px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-white/5' : 'bg-transparent'
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 p-4 rounded-xl border ${
                                  snapshot.isDragging
                                    ? 'border-indigo-500 bg-[#1E293B] shadow-2xl rotate-2'
                                    : 'border-white/5 bg-[#0F172A] hover:border-white/10 hover:bg-[#1E293B]'
                                } transition-all cursor-pointer active:cursor-grabbing group`}
                                onClick={() => setSelectedTask(task)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                  <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                </div>
                                <h4 className="font-medium text-slate-100 mb-1">{task.title}</h4>
                                {task.description && (
                                  <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center gap-3 text-slate-500 text-xs">
                                    {task.dueDate && (
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <MessageSquare className="w-3 h-3" />
                                      <span>0</span>
                                    </div>
                                  </div>
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold border-2 border-[#0F172A]">
                                    U
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(selectedTask.priority)}`}>
                  {selectedTask.priority}
                </span>
                <span className="text-slate-500 text-sm">{selectedTask.status}</span>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
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
                  onClick={handleEditTask}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20"
                >
                  Edit Task
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
