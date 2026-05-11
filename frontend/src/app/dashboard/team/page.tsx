'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Shield, MoreHorizontal, UserPlus, Search, Send, X } from 'lucide-react';

const teamMembers = [
  { id: 1, name: 'Demo Admin', role: 'Admin', email: 'admin@flow.com', status: 'Active', avatar: 'A' },
  { id: 2, name: 'Demo Member', role: 'Member', email: 'member@flow.com', status: 'Online', avatar: 'M' },
  { id: 3, name: 'Sarah Wilson', role: 'Designer', email: 'sarah@flow.com', status: 'Offline', avatar: 'S' },
  { id: 4, name: 'Alex Rivera', role: 'Developer', email: 'alex@flow.com', status: 'Active', avatar: 'A' },
];

export default function TeamPage() {
  const [activeChat, setActiveChat] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([
    { id: 1, text: 'Hey! How can I help you with the project today?', isMe: false }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const newMsg = { id: Date.now(), text: message, isMe: true };
    setChatHistory(prev => [...prev, newMsg]);
    setMessage('');

    // Mock response after 1 second
    setTimeout(() => {
      const responses = [
        "Got it! I'll look into that right away.",
        "That sounds like a great plan. 🚀",
        "Sure thing, I'm on it!",
        "Let me check the latest updates on that."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { id: Date.now() + 1, text: randomResponse, isMe: false }]);
    }, 1500);
  };

  return (
    <div className="space-y-8 relative min-h-[calc(100vh-200px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
          <p className="text-slate-400">Manage your workspace members and their access levels.</p>
        </div>
        <button 
          onClick={() => {
            const email = window.prompt('Enter email address to invite:');
            if (email) window.alert(`Invitation sent to ${email}! 🚀`);
          }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <UserPlus className="w-5 h-5" /> Invite Member
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search members by name or email..." 
          className="w-full bg-[#0F172A] border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-[#0F172A] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
          >
            <div className="absolute top-4 right-4">
              <button className="p-1 hover:bg-white/5 rounded-md text-slate-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-2xl font-bold mb-4 relative">
                {member.avatar}
                <div className={`absolute bottom-0 right-1 w-4 h-4 rounded-full border-2 border-[#0F172A] ${member.status === 'Active' || member.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
              </div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{member.role}</p>
              
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-slate-300 border border-white/5 mb-6">
                <Shield className="w-3 h-3 text-indigo-400" />
                {member.role === 'Admin' ? 'Workspace Owner' : 'Standard Access'}
              </div>

              <button 
                onClick={() => {
                  setActiveChat(member);
                  setChatHistory([{ id: 1, text: `Hey! How can I help you with the project today?`, isMe: false }]);
                }}
                className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border border-indigo-500/20 active:scale-95"
              >
                <Mail className="w-4 h-4" /> Message
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Chat Overlay */}
      <AnimatePresence>
        {activeChat && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 w-80 bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 bg-indigo-500 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  {activeChat.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{activeChat.name}</p>
                  <p className="text-[10px] text-indigo-100 uppercase font-bold tracking-widest">{activeChat.status}</p>
                </div>
              </div>
              <button onClick={() => setActiveChat(null)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-72 p-4 overflow-y-auto bg-[#020617]/50 space-y-3 scrollbar-hide">
              {chatHistory.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: msg.isMe ? 20 : -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  key={msg.id}
                  className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.isMe 
                      ? 'bg-indigo-500 text-white rounded-br-none shadow-lg shadow-indigo-500/20' 
                      : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-indigo-500 p-2 rounded-lg text-white hover:bg-indigo-600 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
