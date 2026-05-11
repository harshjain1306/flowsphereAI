'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Lock, Globe, Save, Users, Mail, Shield, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function SettingsPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('General');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Settings Saved Successfully!');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [notificationStates, setNotificationStates] = useState([true, false, true, true]);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSave = (message: any = 'Settings Saved Successfully!') => {
    const finalMessage = typeof message === 'string' ? message : 'Settings Saved Successfully!';
    setSuccessMessage(finalMessage);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event: any) => {
          setLogoPreview(event.target.result);
          handleSave('Logo Updated Successfully! ✨');
          
          // Redirect to General tab after a delay
          setTimeout(() => {
            setActiveTab('General');
          }, 1500);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const toggleNotification = (index: number) => {
    const newStates = [...notificationStates];
    newStates[index] = !newStates[index];
    setNotificationStates(newStates);
  };

  const handleSecurityUpdate = () => {
    handleSave('Password Updated! Logging out for security... 🔒');
    
    // Logout and redirect after a delay
    setTimeout(() => {
      logout();
      router.push('/login');
    }, 2000);
  };

  const tabs = [
    { name: 'General', icon: User },
    { name: 'Notifications', icon: Bell },
    { name: 'Members', icon: Users },
    { name: 'Security', icon: Lock },
    { name: 'Workspace', icon: Globe },
  ];

  const teamMembers = [
    { id: 1, name: 'Demo Admin', role: 'Admin', email: 'admin@flow.com', status: 'Active' },
    { id: 2, name: 'Demo Member', role: 'Member', email: 'member@flow.com', status: 'Active' },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and workspace configuration.</p>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="flex flex-col gap-2">
          {tabs.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.name 
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'General' && (
              <motion.div 
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 rounded-2xl bg-[#0F172A] border border-white/5 space-y-6 shadow-xl"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue="Demo Admin"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="admin@flow.com"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={handleSave}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    <Save className="w-5 h-5" /> Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'Members' && (
              <motion.div 
                key="members"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 rounded-2xl bg-[#0F172A] border border-white/5 space-y-6 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Workspace Members</h3>
                  <button 
                    onClick={() => {
                      const email = window.prompt('Enter email address to add:');
                      if (email) window.alert(`Member ${email} has been invited to the workspace! ✉️`);
                    }}
                    className="text-sm bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-lg font-bold border border-indigo-500/20 hover:bg-indigo-500/20 transition-all active:scale-95"
                  >
                    + Add Member
                  </button>
                </div>
                
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{member.name}</p>
                          <p className="text-sm text-slate-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                          <Shield className="w-3 h-3 text-indigo-400" />
                          {member.role}
                        </div>
                        <button className="p-2 text-slate-600 hover:text-white transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'Notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 rounded-2xl bg-[#0F172A] border border-white/5 space-y-6 shadow-xl"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Notification Preferences</h3>
                  <p className="text-sm text-slate-400">Choose how you want to be notified about project updates.</p>
                  
                  <div className="space-y-4 pt-4">
                    {[
                      { title: 'Email Notifications', desc: 'Receive daily digests and immediate task alerts.' },
                      { title: 'Desktop Alerts', desc: 'Get real-time browser notifications for mentions.' },
                      { title: 'Task Assignments', desc: 'Notify me when I am assigned to a new task.' },
                      { title: 'Project Milestones', desc: 'Alert me when a project reaches a major goal.' }
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => toggleNotification(i)}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-all"
                      >
                        <div>
                          <p className="font-bold text-slate-200">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 border ${notificationStates[i] ? 'bg-indigo-500/30 border-indigo-500/50' : 'bg-slate-700/30 border-white/10'}`}>
                          <motion.div 
                            initial={false}
                            animate={{ x: notificationStates[i] ? 24 : 4 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={`absolute top-1 w-4 h-4 rounded-full shadow-lg ${notificationStates[i] ? 'bg-indigo-400' : 'bg-slate-500'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={handleSave}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    <Save className="w-5 h-5" /> Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'Security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 rounded-2xl bg-[#0F172A] border border-white/5 space-y-8 shadow-xl"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-400" /> Password Management
                  </h3>
                  <div className="grid grid-cols-1 gap-4 max-w-md">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white pr-12" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Password</label>
                      <div className="relative">
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white pr-12" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" /> Two-Factor Authentication
                  </h3>
                  <div 
                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                    className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 cursor-pointer group hover:bg-emerald-500/10 transition-all"
                  >
                    <div>
                      <p className="font-bold text-slate-200">Enable 2FA</p>
                      <p className="text-xs text-slate-500">Secure your account with an extra layer of protection.</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 border ${is2FAEnabled ? 'bg-emerald-500/30 border-emerald-500/50' : 'bg-slate-700/30 border-white/10'}`}>
                      <motion.div 
                        initial={false}
                        animate={{ x: is2FAEnabled ? 24 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`absolute top-1 w-4 h-4 rounded-full shadow-lg ${is2FAEnabled ? 'bg-emerald-400' : 'bg-slate-500'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={handleSecurityUpdate} 
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    Update Security
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'Workspace' && (
              <motion.div 
                key="workspace"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 rounded-2xl bg-[#0F172A] border border-white/5 space-y-8 shadow-xl"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="space-y-4 flex-1">
                    <h3 className="text-xl font-bold">Workspace Configuration</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workspace Name</label>
                        <input type="text" defaultValue="FlowSphere AI Team" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workspace URL</label>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-sm">flowsphere.ai/</span>
                          <input type="text" defaultValue="main-team" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workspace Logo</h3>
                    <div 
                      onClick={handleLogoUpload}
                      className="w-32 h-32 rounded-2xl bg-indigo-500/10 border-2 border-dashed border-indigo-500/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-indigo-500/20 transition-all group active:scale-95 overflow-hidden"
                    >
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Globe className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-indigo-400">Upload Logo</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button onClick={handleSave} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20">
                    Save Workspace Settings
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
