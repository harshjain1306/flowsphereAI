'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0F172A]/50 backdrop-blur-xl flex flex-col h-screen sticky top-0">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            FlowSphere<span className="text-indigo-400">AI</span>
          </Link>

          <nav className="space-y-1">
            {[
              { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
              { name: 'My Tasks', icon: CheckSquare, href: '/dashboard/tasks' },
              { name: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
              { name: 'Team', icon: Users, href: '/dashboard/team' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-1 border-t border-white/5">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* User Profile Snippet */}
        <div className="p-4 m-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.role}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-[#0F172A]/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-medium text-slate-200">Workspace</h2>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/tasks/new" className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
              <span className="text-lg leading-none">+</span> New Task
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
