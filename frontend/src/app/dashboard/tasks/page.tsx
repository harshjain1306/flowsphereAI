'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Calendar, MessageSquare, Plus, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

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
  { id: 'Todo', title: 'To Do', color: 'border-[#5D6C7B] dark:border-[#8595A4]' },
  { id: 'In Progress', title: 'In Progress', color: 'border-[#0064E0]' },
  { id: 'Review', title: 'Review', color: 'border-[#DEE3E9] dark:border-charcoal' },
  { id: 'Completed', title: 'Completed', color: 'border-[#31A24C]' },
];

export default function KanbanBoard() {
  const queryClient = useQueryClient();
  const router = useRouter();
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
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
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
      case 'Urgent': return 'bg-[#E41E3F]/10 text-[#E41E3F] border-[#E41E3F]/20';
      case 'High': return 'bg-[#0064E0]/10 text-[#0064E0] border-[#0064E0]/20';
      case 'Medium': return 'bg-[#F2A918]/10 text-[#F2A918] border-[#F2A918]/20';
      case 'Low': return 'bg-[#31A24C]/10 text-[#31A24C] border-[#31A24C]/20';
      default: return 'bg-[#5D6C7B]/10 text-[#5D6C7B] border-[#5D6C7B]/20';
    }
  };

  // Prevent SSR issues with drag-and-drop
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="h-full flex flex-col space-y-6 relative text-[#1C1E21] dark:text-white">
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

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-heading font-black text-3xl tracking-tight">Board View</h1>
          <p className="text-[#5D6C7B] dark:text-[#8595A4] text-sm font-semibold">Drag and drop tasks to update their status.</p>
        </div>
        <Link 
          href={`/dashboard/tasks/new?projectId=${projectId || ''}`} 
          className="bg-[#0064E0] hover:bg-[#0457CB] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-[#0064E0]/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Task
        </Link>
      </div>

      {!projectId && !isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-[#DEE3E9] dark:border-charcoal rounded-3xl bg-white dark:bg-[#1C1E21] p-12">
          <div className="text-center space-y-4 max-w-sm">
            <h3 className="font-heading font-bold text-xl text-[#1C1E21] dark:text-white">No Projects Found</h3>
            <p className="text-[#5D6C7B] dark:text-[#8595A4] text-sm">Create a project to start adding tasks.</p>
            <Link 
              href="/dashboard/projects/new" 
              className="inline-block bg-[#0064E0] hover:bg-[#0457CB] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-[#0064E0]/20 transition-all"
            >
              Create Project
            </Link>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-220px)] scrollbar-hide">
            {columns.map((column) => {
              const columnTasks = tasks.filter((t) => t.status === column.id);

              return (
                <div key={column.id} className="flex flex-col w-80 shrink-0">
                  <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color}`}>
                    <h3 className="font-bold text-[#1C1E21] dark:text-white flex items-center gap-2">
                      {column.title}
                      <span className="bg-[#F1F4F7] dark:bg-[#1C1E21] text-[#1C1E21] dark:text-white border border-[#DEE3E9] dark:border-charcoal text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {columnTasks.length}
                      </span>
                    </h3>
                    <button className="text-[#5D6C7B] dark:text-[#8595A4] hover:text-[#1C1E21] dark:hover:text-white transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 rounded-2xl p-2 min-h-[150px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-[#F1F4F7]/40 dark:bg-[#1C1E21]/40' : 'bg-transparent'
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-4 p-5 rounded-2xl border ${
                                  snapshot.isDragging
                                    ? 'border-[#0064E0] bg-white dark:bg-[#1C1E21] shadow-2xl rotate-2'
                                    : 'border-[#DEE3E9] dark:border-charcoal bg-white dark:bg-[#1C1E21] hover:border-[#0064E0] dark:hover:border-[#0064E0]'
                                } transition-all cursor-pointer group`}
                                onClick={() => setSelectedTask(task)}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                  <button className="opacity-0 group-hover:opacity-100 text-[#5D6C7B] dark:text-[#8595A4] hover:text-[#1C1E21] dark:hover:text-white transition-opacity">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                </div>
                                <h4 className="font-bold text-[#1C1E21] dark:text-white mb-1 group-hover:text-[#0064E0] dark:group-hover:text-[#0064E0] transition-colors">
                                  {task.title}
                                </h4>
                                {task.description && (
                                  <p className="text-xs text-[#5D6C7B] dark:text-[#8595A4] line-clamp-2 mb-3 leading-relaxed font-semibold">
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#DEE3E9]/50 dark:border-charcoal/50">
                                  <div className="flex items-center gap-3 text-[#5D6C7B] dark:text-[#8595A4] text-xs">
                                    {task.dueDate && (
                                      <div className="flex items-center gap-1 font-semibold">
                                        <Calendar className="w-3 h-3 text-[#0064E0]" />
                                        <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1 font-semibold">
                                      <MessageSquare className="w-3 h-3" />
                                      <span>0</span>
                                    </div>
                                  </div>
                                  <div className="w-6 h-6 rounded-full bg-[#0064E0] flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                                    {user?.name?.charAt(0)}
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
                      <label className="text-xs font-bold text-[#5D6C7B] uppercase tracking-wider pl-1">Task Title</label>
                      <input 
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/50 transition-all text-[#1C1E21] dark:text-white font-semibold text-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#5D6C7B] uppercase tracking-wider pl-1">Description</label>
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
                    onClick={handleEditTask}
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
