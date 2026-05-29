'use client';
import { ArrowRight, Sparkles, Shield, Zap, Globe, Layers, ArrowUpRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#1C1E21] font-sans antialiased overflow-x-hidden selection:bg-[#0064E0]/10 selection:text-[#0064E0]">
      
      {/* Premium Header / Navigation */}
      <header className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-md border-b border-[#DEE3E9] z-50 transition-all">
        <div className="max-w-7xl mx-auto h-full px-6 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#0A1317] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <span className="font-heading font-black text-lg text-white">FS</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-[#1C1E21]">
              FlowSphere <span className="text-[#0064E0] font-medium">AI</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#5D6C7B]">
            <a href="#features" className="hover:text-[#1C1E21] transition-colors">Features</a>
            <a href="#workflow" className="hover:text-[#1C1E21] transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-[#1C1E21] transition-colors">Enterprise</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-[#1C1E21] hover:text-[#0064E0] text-sm font-bold px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="bg-[#0064E0] hover:bg-[#0457CB] text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-[#0064E0]/20 transition-all hover:scale-105 active:scale-95"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-b from-[#FAF8FF] to-[#FFFFFF]">
        {/* Stark subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#dee3e9_1px,transparent_1px),linear-gradient(to_bottom,#dee3e9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        {/* Soft background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0091FF]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center relative z-10">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8FF] border border-[#DEE3E9] text-xs font-bold text-[#0064E0] mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" /> Introducing FlowSphere AI 2.0
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-black tracking-tight text-[#1C1E21] leading-[1.08] mb-6 max-w-4xl mx-auto"
          >
            Premium Task Management <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0064E0] via-[#0091FF] to-[#A121CE]">
              Driven by Intelligence.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[#5D6C7B] font-medium leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Streamline your engineering team's output. Seamless priority calculations, high-performance Kanban boards, and realtime team synchronization.
          </motion.p>

          {/* Dual CTA Hero buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link 
              href="/login" 
              className="w-full sm:w-auto bg-[#0A1317] hover:bg-[#1C1E21] text-white px-8 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              Start Managing Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/signup" 
              className="w-full sm:w-auto bg-transparent text-[#1C1E21] border-2 border-[#1C1E21] px-8 py-3.5 rounded-full font-bold text-sm flex items-center justify-center transition-all hover:bg-[#F1F4F7] hover:scale-105 active:scale-95"
            >
              Sign Up for Demo
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Preview / Mock Visual Card */}
        <div className="max-w-6xl mx-auto px-6 md:px-8 mt-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-[32px] border border-[#DEE3E9] shadow-2xl p-4 md:p-6 overflow-hidden"
          >
            {/* Header bar of simulated app */}
            <div className="flex items-center justify-between pb-4 border-b border-[#DEE3E9] mb-6">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-[#E41E3F]" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#F7B928]" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#31A24C]" />
                <span className="text-xs font-semibold text-[#8595A4] ml-2">FlowSphere Application Dashboard</span>
              </div>
              <div className="w-32 h-6 rounded-full bg-[#F1F4F7] flex items-center justify-center text-[10px] font-bold text-[#8595A4]">
                Active Project
              </div>
            </div>

            {/* Grid preview of the real dashboard style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Card feature */}
              <div className="p-6 rounded-[24px] bg-[#FAF8FF] border border-[#DEE3E9] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#5D6C7B] uppercase tracking-wider">Productivity Load</span>
                  <Activity className="w-4 h-4 text-[#0064E0]" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold font-number text-[#1C1E21]">$ 12,850.00</p>
                  <p className="text-xs text-[#31A24C] font-bold">↑ 18.2% Increase this week</p>
                </div>
                <div className="w-full bg-[#DEE3E9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0064E0] h-full w-[80%]" />
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-[#FAF8FF] border border-[#DEE3E9] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#5D6C7B] uppercase tracking-wider">Active Sprints</span>
                  <Zap className="w-4 h-4 text-[#0091FF]" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Database Refactor</span>
                    <span className="text-[#0064E0]">Urgent</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span>Redesign PDP Checkout</span>
                    <span className="text-[#A121CE]">High</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-[#FAF8FF] border border-[#DEE3E9] flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0064E0]/10 flex items-center justify-center font-bold text-[#0064E0] text-sm">A</div>
                  <div>
                    <p className="text-sm font-bold">Workspace Owner</p>
                    <p className="text-xs text-[#8595A4]">admin@flow.com</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#DEE3E9] flex justify-between items-center">
                  <span className="text-xs font-bold text-[#8595A4]">DEMO IS ACTIVE</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#31A24C] animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white border-t border-[#DEE3E9]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0064E0] mb-4">Enterprise Infrastructure</h2>
            <p className="text-3xl md:text-5xl font-heading font-black tracking-tight">Built to optimize high-performance engineering flows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-[24px] bg-white border border-[#DEE3E9] hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F4F7] flex items-center justify-center text-[#0064E0] mb-6 group-hover:bg-[#0064E0] group-hover:text-white transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Priority Boarding</h3>
              <p className="text-[#5D6C7B] text-sm leading-relaxed">
                Task items automatically classify into interactive urgency states. Drag and drop items smoothly on our high-performance board.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-[24px] bg-white border border-[#DEE3E9] hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F4F7] flex items-center justify-center text-[#0064E0] mb-6 group-hover:bg-[#0064E0] group-hover:text-white transition-colors">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sync Milestones</h3>
              <p className="text-[#5D6C7B] text-sm leading-relaxed">
                Keep the entire workspace synchronized globally in real-time. Schedule, track deadlines, and trigger instant system updates.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-[24px] bg-white border border-[#DEE3E9] hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F4F7] flex items-center justify-center text-[#0064E0] mb-6 group-hover:bg-[#0064E0] group-hover:text-white transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Workspace Shield</h3>
              <p className="text-[#5D6C7B] text-sm leading-relaxed">
                Roles and privileges managed elegantly. Enterprise security with role-based dashboard access ensures zero data leaks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-20 bg-[#0A1317] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#0064e0_0%,transparent_50%)] opacity-35" />
        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight">Everything is set. Access your flow.</h2>
          <p className="text-[#8595A4] max-w-xl mx-auto text-sm md:text-base">
            No setup fees, no complex integrations. Log in to start managing task workflows and teams instantly.
          </p>
          <div className="pt-4">
            <Link 
              href="/login" 
              className="bg-[#0064E0] hover:bg-[#0457CB] text-white px-8 py-4 rounded-full font-bold text-sm inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#0064E0]/20"
            >
              Access Your Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#DEE3E9] py-12 text-center text-[#8595A4] text-xs font-medium">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p>© 2026 FlowSphere AI. Redesigned with premium Optimistic Commerce style.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#1C1E21]">Privacy Policy</a>
            <a href="#" className="hover:text-[#1C1E21]">Terms of Service</a>
            <a href="#" className="hover:text-[#1C1E21]">Contact Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
