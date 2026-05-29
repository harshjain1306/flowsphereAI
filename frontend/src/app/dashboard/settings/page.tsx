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
    <div className="space-y-8 max-w-5xl text-[#1C1E21] dark:text-white">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-[#5D6C7B] dark:text-[#8595A4] font-semibold">Manage your account preferences and workspace configuration.</p>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#31A24C] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-[#31A24C]/20 flex items-center gap-2"
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.name 
                  ? 'bg-[#0064E0] text-white shadow-lg shadow-[#0064E0]/20' 
                  : 'text-[#5D6C7B] dark:text-[#8595A4] hover:text-[#1C1E21] dark:hover:text-white bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal hover:bg-[#FAF8FF] dark:hover:bg-[#0A1317]'
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
                className="p-8 rounded-[32px] bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal space-y-6 shadow-sm"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue="Demo Admin"
                        className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all text-[#1C1E21] dark:text-white font-semibold text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="admin@flow.com"
                        className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all text-[#1C1E21] dark:text-white font-semibold text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#DEE3E9] dark:border-charcoal flex justify-end">
                  <button 
                    onClick={() => handleSave()}
                    className="bg-[#0064E0] hover:bg-[#0457CB] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#0064E0]/20 active:scale-95"
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
                className="p-8 rounded-[32px] bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal space-y-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Workspace Members</h3>
                  <button 
                    onClick={() => {
                      const email = window.prompt('Enter email address to add:');
                      if (email) window.alert(`Member ${email} has been invited to the workspace! ✉️`);
                    }}
                    className="text-sm bg-[#0064E0]/10 text-[#0064E0] px-4 py-2 rounded-xl font-bold border border-[#0064E0]/20 hover:bg-[#0064E0]/20 transition-all active:scale-95"
                  >
                    + Add Member
                  </button>
                </div>
                
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal group hover:bg-[#F1F4F7] dark:hover:bg-charcoal/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#0064E0]/20 flex items-center justify-center font-bold text-[#0064E0]">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#1C1E21] dark:text-white">{member.name}</p>
                          <p className="text-sm text-[#5D6C7B] dark:text-[#8595A4] font-semibold">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#5D6C7B] dark:text-[#8595A4]">
                          <Shield className="w-3 h-3 text-[#0064E0]" />
                          {member.role}
                        </div>
                        <button className="p-2 text-[#8595A4] hover:text-[#0064E0] transition-colors">
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
                className="p-8 rounded-[32px] bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal space-y-6 shadow-sm"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Notification Preferences</h3>
                  <p className="text-sm text-[#5D6C7B] dark:text-[#8595A4] font-semibold">Choose how you want to be notified about project updates.</p>
                  
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
                        className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal cursor-pointer hover:bg-[#F1F4F7] dark:hover:bg-charcoal/50 transition-all"
                      >
                        <div>
                          <p className="font-bold text-[#1C1E21] dark:text-white">{item.title}</p>
                          <p className="text-xs text-[#5D6C7B] dark:text-[#8595A4] font-semibold">{item.desc}</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 border ${notificationStates[i] ? 'bg-[#0064E0]/30 border-[#0064E0]/50' : 'bg-slate-200 dark:bg-charcoal border-[#DEE3E9] dark:border-charcoal'}`}>
                          <motion.div 
                            initial={false}
                            animate={{ x: notificationStates[i] ? 24 : 4 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={`absolute top-1 w-4 h-4 rounded-full shadow-lg ${notificationStates[i] ? 'bg-[#0064E0]' : 'bg-slate-500'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#DEE3E9] dark:border-charcoal flex justify-end">
                  <button 
                    onClick={() => handleSave()}
                    className="bg-[#0064E0] hover:bg-[#0457CB] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#0064E0]/20 active:scale-95"
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
                className="p-8 rounded-[32px] bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal space-y-8 shadow-sm"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#0064E0]" /> Password Management
                  </h3>
                  <div className="grid grid-cols-1 gap-4 max-w-md">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all text-[#1C1E21] dark:text-white pr-12 text-sm font-semibold" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5D6C7B] dark:text-[#8595A4] hover:text-[#1C1E21] dark:hover:text-white transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">New Password</label>
                      <div className="relative">
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all text-[#1C1E21] dark:text-white pr-12 text-sm font-semibold" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5D6C7B] dark:text-[#8595A4] hover:text-[#1C1E21] dark:hover:text-white transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#DEE3E9] dark:border-charcoal space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#31A24C]" /> Two-Factor Authentication
                  </h3>
                  <div 
                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#31A24C]/5 border border-[#31A24C]/20 cursor-pointer group hover:bg-[#31A24C]/10 transition-all"
                  >
                    <div>
                      <p className="font-bold text-[#1C1E21] dark:text-white">Enable 2FA</p>
                      <p className="text-xs text-[#5D6C7B] dark:text-[#8595A4] font-semibold">Secure your account with an extra layer of protection.</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 border ${is2FAEnabled ? 'bg-[#31A24C]/30 border-[#31A24C]/30' : 'bg-slate-200 dark:bg-charcoal border-[#DEE3E9] dark:border-charcoal'}`}>
                      <motion.div 
                        initial={false}
                        animate={{ x: is2FAEnabled ? 24 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`absolute top-1 w-4 h-4 rounded-full shadow-lg ${is2FAEnabled ? 'bg-[#31A24C]' : 'bg-slate-500'}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#DEE3E9] dark:border-charcoal flex justify-end">
                  <button 
                    onClick={handleSecurityUpdate} 
                    className="bg-[#0064E0] hover:bg-[#0457CB] text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-[#0064E0]/20 active:scale-95"
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
                className="p-8 rounded-[32px] bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal space-y-8 shadow-sm"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="space-y-4 flex-1">
                    <h3 className="text-xl font-bold">Workspace Configuration</h3>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Workspace Name</label>
                        <input type="text" defaultValue="FlowSphere AI Team" className="w-full bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all text-[#1C1E21] dark:text-white font-semibold text-sm h-11" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Workspace URL</label>
                        <div className="flex items-center gap-2">
                          <span className="text-[#5D6C7B] dark:text-[#8595A4] font-bold text-sm">flowsphere.ai/</span>
                          <input type="text" defaultValue="main-team" className="flex-1 bg-[#FAF8FF] dark:bg-[#0A1317] border border-[#DEE3E9] dark:border-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all text-[#1C1E21] dark:text-white font-semibold text-sm h-11" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-[#5D6C7B] dark:text-[#8595A4] uppercase tracking-wider pl-1">Workspace Logo</h3>
                    <div 
                      onClick={handleLogoUpload}
                      className="w-32 h-32 rounded-2xl bg-[#0064E0]/10 border-2 border-dashed border-[#DEE3E9] dark:border-charcoal flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#0064E0]/20 transition-all group active:scale-95 overflow-hidden"
                    >
                      {logoPreview ? (
                        <img src={logoPreview} alt="Workspace Logo Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Globe className="w-8 h-8 text-[#0064E0] group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-[#0064E0]">Upload Logo</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#DEE3E9] dark:border-charcoal flex justify-end">
                  <button onClick={() => handleSave('Workspace Settings Saved!')} className="bg-[#0064E0] hover:bg-[#0457CB] text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-[#0064E0]/20">
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
