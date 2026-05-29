'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      login(data, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex items-center justify-center p-6 relative overflow-hidden text-[#1C1E21] font-sans">
      {/* Stark subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#dee3e9_1px,transparent_1px),linear-gradient(to_bottom,#dee3e9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
      
      {/* Soft background glow */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#0064E0]/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#DEE3E9] rounded-[32px] p-8 relative z-10 shadow-2xl"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#0A1317] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <span className="font-heading font-black text-lg text-white">FS</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-[#1C1E21]">FlowSphere</span>
          </Link>
        </div>

        <h2 className="text-3xl font-heading font-black text-center text-[#1C1E21] tracking-tight mb-2">Create an account</h2>
        <p className="text-[#5D6C7B] text-center mb-8 text-sm font-semibold">Join thousands of teams already using FlowSphere</p>

        {error && (
          <div className="mb-6 p-4 bg-[#E41E3F]/10 border border-[#E41E3F]/20 text-[#E41E3F] rounded-xl text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5D6C7B] uppercase tracking-wider pl-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white border border-[#CED0D4] rounded-xl px-4 py-3 text-[#1C1E21] placeholder-[#8595A4] focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all font-semibold text-sm h-11"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5D6C7B] uppercase tracking-wider pl-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-[#CED0D4] rounded-xl px-4 py-3 text-[#1C1E21] placeholder-[#8595A4] focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all font-semibold text-sm h-11"
              placeholder="you@company.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5D6C7B] uppercase tracking-wider pl-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-white border border-[#CED0D4] rounded-xl px-4 py-3 text-[#1C1E21] placeholder-[#8595A4] focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0] transition-all font-semibold text-sm h-11"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full group flex items-center justify-center gap-2.5 bg-[#0064E0] hover:bg-[#0457CB] text-white px-4 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-[#0064E0]/20 transition-all disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#5D6C7B] font-semibold">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0064E0] hover:underline font-bold transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
