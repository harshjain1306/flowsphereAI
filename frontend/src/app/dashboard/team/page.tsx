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
    <div className="space-y-8 relative min-h-[calc(100vh-200px)] text-[#1C1E21] dark:text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight">Team Members</h1>
          <p className="text-[#5D6C7B] dark:text-[#8595A4] text-sm font-semibold">Manage your workspace members and their access levels.</p>
        </div>
        <button 
          onClick={() => {
            const email = window.prompt('Enter email address to invite:');
            if (email) window.alert(`Invitation sent to ${email}! 🚀`);
          }}
          className="bg-[#0064E0] hover:bg-[#0457CB] text-white px-6 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0064E0]/20 active:scale-95 text-sm"
        >
          <UserPlus className="w-5 h-5" /> Invite Member
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5D6C7B] dark:text-[#8595A4]" />
        <input 
          type="text" 
          placeholder="Search members by name or email..." 
          className="w-full bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all placeholder:text-[#8595A4] text-sm font-semibold h-11 text-[#1C1E21] dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[32px] bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal relative overflow-hidden group hover:border-[#0064E0] dark:hover:border-[#0064E0] hover:shadow-lg transition-all"
          >
            <div className="absolute top-4 right-4">
              <button className="p-1 hover:bg-[#F1F4F7] dark:hover:bg-charcoal rounded-md text-[#5D6C7B] dark:text-[#8595A4] hover:text-[#1C1E21] dark:hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0064E0]/15 to-[#0064E0]/5 border border-[#DEE3E9] dark:border-charcoal flex items-center justify-center text-2xl font-black text-[#0064E0] mb-4 relative">
                {member.avatar}
                <div className={`absolute bottom-0 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#1C1E21] ${member.status === 'Active' || member.status === 'Online' ? 'bg-[#31A24C]' : 'bg-slate-300'}`} />
              </div>
              <h3 className="font-bold text-lg text-[#1C1E21] dark:text-white">{member.name}</h3>
              <p className="text-sm text-[#5D6C7B] dark:text-[#8595A4] font-semibold mb-4">{member.role}</p>
              
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8FF] dark:bg-[#0A1317] text-xs font-bold text-[#1C1E21] dark:text-white border border-[#DEE3E9] dark:border-charcoal mb-6">
                <Shield className="w-3 h-3 text-[#0064E0]" />
                {member.role === 'Admin' ? 'Workspace Owner' : 'Standard Access'}
              </div>

              <button 
                onClick={() => {
                  setActiveChat(member);
                  setChatHistory([{ id: 1, text: `Hey! How can I help you with the project today?`, isMe: false }]);
                }}
                className="w-full py-2.5 bg-[#0064E0]/10 hover:bg-[#0064E0]/20 text-[#0064E0] rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border border-[#0064E0]/20 active:scale-95"
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
            className="fixed bottom-8 right-8 w-80 bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal rounded-2xl shadow-2xl z-50 overflow-hidden text-[#1C1E21] dark:text-white"
          >
            <div className="p-4 bg-[#0064E0] flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  {activeChat.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{activeChat.name}</p>
                  <p className="text-[10px] text-white/80 uppercase font-bold tracking-widest">{activeChat.status}</p>
                </div>
              </div>
              <button onClick={() => setActiveChat(null)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-72 p-4 overflow-y-auto bg-[#FAF8FF] dark:bg-[#0A1317] space-y-3 scrollbar-hide">
              {chatHistory.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: msg.isMe ? 20 : -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  key={msg.id}
                  className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                    msg.isMe 
                      ? 'bg-[#0064E0] text-white rounded-br-none shadow-md shadow-[#0064E0]/15' 
                      : 'bg-white dark:bg-[#1C1E21] text-[#1C1E21] dark:text-white rounded-tl-none border border-[#DEE3E9] dark:border-charcoal'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-[#DEE3E9] dark:border-charcoal bg-white dark:bg-[#1C1E21] flex gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white dark:bg-[#0A1317] border border-[#CED0D4] dark:border-charcoal rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0064E0] transition-all text-[#1C1E21] dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-[#0064E0] p-2 rounded-lg text-white hover:bg-[#0457CB] transition-colors disabled:opacity-50"
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
