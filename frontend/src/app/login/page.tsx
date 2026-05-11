'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Member'>('Admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    if (selectedRole === 'Admin') {
      setEmail('admin@flow.com');
    } else {
      setEmail('member@flow.com');
    }
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            FlowSphere<span className="text-indigo-400">AI</span>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Welcome back</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Enter your credentials to access your workspace</p>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div className="mb-8 p-1 bg-white/5 rounded-xl border border-white/10 flex relative">
          <motion.div 
            className="absolute inset-1 bg-indigo-500 rounded-lg shadow-lg"
            animate={{ x: selectedRole === 'Admin' ? 0 : '100%' }}
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: 'calc(50% - 4px)' }}
          />
          <button 
            onClick={() => setSelectedRole('Admin')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold relative z-10 transition-colors ${selectedRole === 'Admin' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> Workspace Admin
            </div>
          </button>
          <button 
            onClick={() => setSelectedRole('Member')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold relative z-10 transition-colors ${selectedRole === 'Member' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" /> Team Member
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1E293B] border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1E293B] border border-white/5 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center text-sm py-2">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input type="checkbox" className="rounded border-white/10 bg-[#1E293B] text-indigo-500" />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Instant Demo Access</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={async () => {
                setIsLoading(true);
                try {
                  const { data } = await api.post('/auth/login', { email: 'admin@flow.com', password: 'password123' });
                  login(data, data.token);
                  router.push('/dashboard');
                } catch (err) {
                  setError('Demo login failed');
                  setIsLoading(false);
                }
              }}
              className="w-full px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" /> Continue as Workspace Admin
            </button>
            <button
              onClick={async () => {
                setIsLoading(true);
                try {
                  const { data } = await api.post('/auth/login', { email: 'member@flow.com', password: 'password123' });
                  login(data, data.token);
                  router.push('/dashboard');
                } catch (err) {
                  setError('Demo login failed');
                  setIsLoading(false);
                }
              }}
              className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" /> Continue as Team Member
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
