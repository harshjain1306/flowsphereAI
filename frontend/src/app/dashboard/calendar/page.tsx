'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, CheckCircle2 } from 'lucide-react';

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [events, setEvents] = useState([
    { id: 1, day: 15, title: 'Project Launch 🚀', color: 'indigo' },
    { id: 2, day: 12, title: 'API Review', color: 'emerald' },
  ]);
  const [newEvent, setNewEvent] = useState({ title: '', day: 15, color: 'indigo' });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date();
  const currentMonth = date.toLocaleString('default', { month: 'long' });
  const currentYear = date.getFullYear();

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setIsModalOpen(false);
      setNewEvent({ title: '', day: 15, color: 'indigo' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-slate-400">Track your project deadlines and team milestones.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 rounded-lg border border-white/5 p-1">
            <button className="p-2 hover:bg-white/5 rounded-md transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <div className="px-4 font-medium">{currentMonth} {currentYear}</div>
            <button className="p-2 hover:bg-white/5 rounded-md transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Event Added Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#0F172A] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.02]">
          {days.map(day => (
            <div key={day} className="py-4 text-center text-sm font-semibold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 grid-rows-5 h-[600px]">
          {Array.from({ length: 35 }).map((_, i) => (
            <div 
              key={i} 
              className={`border-r border-b border-white/5 p-4 transition-colors hover:bg-white/[0.02] relative group ${i % 7 === 6 ? 'border-r-0' : ''}`}
            >
              <span className={`text-sm font-medium ${(i % 31) + 1 === 15 ? 'bg-indigo-500 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-slate-500'}`}>
                {(i % 31) + 1}
              </span>
              
              <div className="mt-2 space-y-1">
                {events.filter(e => e.day === (i % 31) + 1).map(event => (
                  <motion.div 
                    key={event.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-2 border rounded-lg text-[11px] font-medium ${
                      event.color === 'indigo' 
                        ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' 
                        : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                    }`}
                  >
                    {event.title}
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => {
                  setNewEvent({ ...newEvent, day: (i % 31) + 1 });
                  setIsModalOpen(true);
                }}
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
              >
                <Plus className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">Add New Event</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Name</label>
                  <input 
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="e.g. Weekly Sync"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</label>
                    <input 
                      type="number"
                      min="1"
                      max="31"
                      value={newEvent.day}
                      onChange={(e) => setNewEvent({...newEvent, day: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Color Theme</label>
                    <select 
                      value={newEvent.color}
                      onChange={(e) => setNewEvent({...newEvent, color: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white appearance-none"
                    >
                      <option value="indigo">Indigo (Primary)</option>
                      <option value="emerald">Emerald (Success)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
