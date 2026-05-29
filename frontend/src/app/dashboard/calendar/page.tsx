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
    <div className="space-y-8 text-[#1C1E21] dark:text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight">Calendar</h1>
          <p className="text-[#5D6C7B] dark:text-[#8595A4] text-sm font-semibold">Track your project deadlines and team milestones.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-[#1C1E21] rounded-xl border border-[#DEE3E9] dark:border-charcoal p-1 shadow-sm">
            <button className="p-2 hover:bg-[#F1F4F7] dark:hover:bg-charcoal rounded-lg transition-colors text-[#5D6C7B] dark:text-[#8595A4] hover:text-[#1C1E21] dark:hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
            <div className="px-4 font-bold text-sm text-[#1C1E21] dark:text-white">{currentMonth} {currentYear}</div>
            <button className="p-2 hover:bg-[#F1F4F7] dark:hover:bg-charcoal rounded-lg transition-colors text-[#5D6C7B] dark:text-[#8595A4] hover:text-[#1C1E21] dark:hover:text-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0064E0] hover:bg-[#0457CB] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#0064E0]/20 active:scale-95"
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
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#31A24C] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-[#31A24C]/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Event Added Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal rounded-[32px] overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-[#DEE3E9] dark:border-charcoal bg-[#FAF8FF] dark:bg-[#1C1E21]/50">
          {days.map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 grid-rows-5 h-[600px] divide-x divide-y divide-[#DEE3E9] dark:divide-charcoal border-b border-r border-[#DEE3E9] dark:border-charcoal">
          {Array.from({ length: 35 }).map((_, i) => (
            <div 
              key={i} 
              className={`p-4 transition-colors hover:bg-[#F1F4F7]/30 dark:hover:bg-[#0A1317]/30 relative group`}
            >
              <span className={`text-sm font-bold ${(i % 31) + 1 === 15 ? 'bg-[#0064E0] text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md shadow-[#0064E0]/15' : 'text-[#5D6C7B] dark:text-[#8595A4]'}`}>
                {(i % 31) + 1}
              </span>
              
              <div className="mt-2 space-y-1">
                {events.filter(e => e.day === (i % 31) + 1).map(event => (
                  <motion.div 
                    key={event.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-2 border rounded-lg text-[11px] font-bold ${
                      event.color === 'indigo' 
                        ? 'bg-[#0064E0]/10 border-[#0064E0]/20 text-[#0064E0] dark:bg-[#0064E0]/20 dark:border-[#0064E0]/30 dark:text-[#0091FF]' 
                        : 'bg-[#31A24C]/10 border-[#31A24C]/20 text-[#31A24C] dark:bg-[#31A24C]/20 dark:border-[#31A24C]/30 dark:text-[#31A24C]'
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
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-[#F1F4F7] dark:hover:bg-charcoal rounded transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-[#5D6C7B] dark:text-[#8595A4]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal rounded-[32px] shadow-2xl overflow-hidden text-[#1C1E21] dark:text-white"
            >
              <div className="p-6 border-b border-[#DEE3E9] dark:border-charcoal flex items-center justify-between bg-[#FAF8FF] dark:bg-[#1C1E21]/50">
                <h3 className="font-heading font-black text-lg text-[#1C1E21] dark:text-white">Add New Event</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#5D6C7B] dark:text-[#8595A4] hover:text-[#1C1E21] dark:hover:text-white transition-colors text-2xl font-bold p-1">
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Event Name</label>
                  <input 
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="e.g. Weekly Sync"
                    className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all text-[#1C1E21] dark:text-white font-semibold text-sm h-11"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Day</label>
                    <input 
                      type="number"
                      min="1"
                      max="31"
                      value={newEvent.day}
                      onChange={(e) => setNewEvent({...newEvent, day: parseInt(e.target.value)})}
                      className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all text-[#1C1E21] dark:text-white font-semibold text-sm h-11"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Color Theme</label>
                    <select 
                      value={newEvent.color}
                      onChange={(e) => setNewEvent({...newEvent, color: e.target.value})}
                      className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all text-[#1C1E21] dark:text-white font-semibold text-sm h-11 cursor-pointer"
                    >
                      <option value="indigo" className="dark:bg-[#1C1E21]">Cobalt (Primary)</option>
                      <option value="emerald" className="dark:bg-[#1C1E21]">Green (Success)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[#DEE3E9] dark:border-charcoal mt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-[#5D6C7B] hover:text-[#1C1E21] dark:hover:text-white font-bold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#0064E0] hover:bg-[#0457CB] text-white px-8 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-[#0064E0]/20"
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
