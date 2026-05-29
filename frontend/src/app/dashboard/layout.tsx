'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'My Tasks', icon: CheckSquare, href: '/dashboard/tasks' },
    { name: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
    { name: 'Team', icon: Users, href: '/dashboard/team' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-[#0A1317] text-[#1C1E21] dark:text-white">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 px-6 py-5 border-b border-[#DEE3E9] dark:border-charcoal">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#0064E0] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
            <span className="font-heading font-black text-lg text-white">FS</span>
          </div>
          <div>
            <h2 className="font-bold text-base tracking-tight text-[#1C1E21] dark:text-white">FlowSphere AI</h2>
            <p className="text-[10px] text-[#8595A4] font-semibold uppercase tracking-wider">Enterprise Plan</p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-full font-bold text-sm transition-all duration-200 ${
                isActive 
                  ? 'bg-[#0A1317] text-white dark:bg-white dark:text-[#0A1317] shadow-md' 
                  : 'text-[#5D6C7B] hover:text-[#1C1E21] hover:bg-[#F1F4F7] dark:hover:bg-[#1C1E21]/50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white dark:text-[#0A1317]' : 'text-[#8595A4]'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 py-6 border-t border-[#DEE3E9] dark:border-charcoal space-y-1">
        <Link
          href="/dashboard/settings"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center gap-3.5 px-4 py-3.5 rounded-full font-bold text-sm transition-all duration-200 ${
            pathname === '/dashboard/settings' 
              ? 'bg-[#0A1317] text-white dark:bg-white dark:text-[#0A1317]' 
              : 'text-[#5D6C7B] hover:text-[#1C1E21] hover:bg-[#F1F4F7] dark:hover:bg-[#1C1E21]/50'
          }`}
        >
          <Settings className={`w-5 h-5 ${pathname === '/dashboard/settings' ? 'text-white dark:text-[#0A1317]' : 'text-[#8595A4]'}`} />
          <span>Settings</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-full font-bold text-sm text-[#E41E3F] hover:bg-[#E41E3F]/10 transition-all duration-200 text-left"
        >
          <LogOut className="w-5 h-5 text-[#E41E3F]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8FF] dark:bg-[#0A1317] text-[#1C1E21] dark:text-white flex font-sans">
      
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="w-64 bg-white dark:bg-[#0A1317] border-r border-[#DEE3E9] dark:border-charcoal h-screen fixed left-0 top-0 z-30 hidden md:block">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#0A1317] border-r border-[#DEE3E9] dark:border-charcoal z-50 md:hidden"
            >
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#5D6C7B] hover:text-[#1C1E21] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-64">
        
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-[#0A1317] border-b border-[#DEE3E9] dark:border-charcoal flex items-center justify-between px-6 md:px-8 sticky top-0 z-20">
          
          <div className="flex items-center gap-4 flex-1">
            {/* Hamburger button for mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-[#5D6C7B] hover:text-[#1C1E21] dark:hover:text-white rounded-lg md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search bar - surface soft */}
            <div className="relative w-full max-w-md hidden sm:block">
              <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-[#8595A4]" />
              </span>
              <input
                type="text"
                placeholder="Search projects or tasks..."
                className="w-full bg-[#F1F4F7] dark:bg-[#1C1E21] border-none rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#1C1E21] dark:text-white placeholder-[#8595A4] focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all font-semibold"
              />
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Notification Bell */}
            <button className="p-2.5 rounded-full hover:bg-[#F1F4F7] dark:hover:bg-[#1C1E21]/50 border border-[#DEE3E9] dark:border-charcoal transition-colors relative group">
              <Bell className="w-4.5 h-4.5 text-[#1C1E21] dark:text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#0064E0] rounded-full" />
            </button>

            {/* User Account Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 md:gap-3 bg-[#0A1317] text-white pl-4 pr-3 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity shadow-md"
              >
                <span>My account</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    {/* Backdrop to close */}
                    <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#1C1E21] border border-[#DEE3E9] dark:border-charcoal rounded-2xl p-4 shadow-2xl z-40 text-[#1C1E21] dark:text-white"
                    >
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#DEE3E9] dark:border-charcoal">
                        <div className="w-10 h-10 rounded-full bg-[#0064E0] flex items-center justify-center font-bold text-white shadow-inner">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-sm truncate text-[#1C1E21] dark:text-white">{user?.name}</p>
                          <p className="text-xs text-[#5D6C7B] dark:text-[#8595A4] truncate">{user?.email}</p>
                          <p className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 mt-1 inline-block bg-[#0064E0]/10 text-[#0064E0] rounded">
                            {user?.role}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-[#5D6C7B] dark:text-[#8595A4] hover:text-[#1C1E21] dark:hover:text-white hover:bg-[#F1F4F7] dark:hover:bg-[#0A1317] transition-colors"
                        >
                          <Settings className="w-4 h-4" /> Account Settings
                        </Link>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-[#E41E3F] hover:bg-[#E41E3F]/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
