'use client';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-6xl font-extrabold mb-4 tracking-tight">
        FlowSphere <span className="text-indigo-400">AI</span>
      </h1>
      <p className="text-xl text-slate-400 mb-10 max-w-md leading-relaxed">
        Premium AI-inspired task management for modern engineering teams.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-indigo-500/20">
          Sign In <ArrowRight className="w-5 h-5" />
        </Link>
        <Link href="/signup" className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-8 py-3 rounded-full font-bold transition-all">
          Register
        </Link>
      </div>
      
      <div className="mt-20 pt-10 border-t border-white/5 text-slate-500 text-sm">
        Everything is ready. Log in to start managing your flow.
      </div>
    </div>
  );
}
