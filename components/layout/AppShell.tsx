

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UploadCloud,
  FileText,
  Users2,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  ChevronRight,
  LogOut,
  Command,
  Activity,
  ShieldCheck,
  Cpu,
  BookOpen,
  Pill,
  Map,
  BadgeDollarSign,
  Box,
  TrendingUp,
  Heart,
  Brain,
  ShoppingCart,
  Database,
  Siren
} from 'lucide-react';

import { AppRoute } from '../../types';
import InteractiveAvatar from '../InteractiveAvatar';

interface AppShellProps {
  children: React.ReactNode;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const AppShell: React.FC<AppShellProps> = ({ children, currentRoute, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: AppRoute.DASHBOARD, label: 'Analytics Hub', icon: LayoutDashboard },
    { id: AppRoute.PATIENTS, label: 'Patient Registry', icon: Users },
    { id: AppRoute.SCAN, label: 'Diagnostic Engine', icon: UploadCloud },
    { id: AppRoute.RESULTS, label: 'Review Center', icon: FileText },
    { id: AppRoute.MEDICINE_ORDER, label: 'Arbitrage Meds', icon: ShoppingCart },
    { id: AppRoute.PHARMACY_MAP, label: 'Live Pharma Map', icon: Map },
    { id: AppRoute.TUMOR_3D, label: '3D Reconstruction', icon: Box },
    { id: AppRoute.AMBULANCE, label: 'Emergency Transit', icon: Siren },
    { id: AppRoute.GROWTH_PREDICTION, label: 'Growth AI', icon: TrendingUp },
    { id: AppRoute.NEURO_ANALYSIS, label: 'Aggression Score', icon: Brain },
    { id: AppRoute.CAREGIVER_DASHBOARD, label: 'Family Portal', icon: Heart },
    { id: AppRoute.CLINICIAN_DASHBOARD, label: 'Clinician Cockpit', icon: ShieldCheck },
    { id: AppRoute.KNOWLEDGE_BASE, label: 'Knowledge Base', icon: Database },
    { id: AppRoute.COLLABORATION, label: 'Consult Room', icon: Users2 },
    { id: AppRoute.ANALYTICS, label: 'Model Metrics', icon: BarChart3 },
    { id: AppRoute.SETTINGS, label: 'Architecture', icon: Settings },
  ];

  return (
    <div className="flex h-screen text-gray-900 overflow-hidden selection:bg-[#4CC9F0]/30 selection:text-gray-900">
      {/* Animated Background */}
      <div className="animated-bg" />

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-80' : 'w-24'
          } bg-white/95 backdrop-blur-xl h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-50 border-r border-gray-200 shadow-xl`}
      >
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#2A9D8F] to-[#4CC9F0] rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-teal-500/20">NV</div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-xl font-black tracking-tight leading-none text-gray-900">NeuroVision</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Enterprise AI</span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${currentRoute === item.id
                ? 'bg-blue-50 text-[#0A2463] shadow-md border border-blue-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <div className={currentRoute === item.id ? 'text-[#0A2463]' : 'group-hover:scale-110 transition-transform'}>
                <item.icon size={22} strokeWidth={2.5} />
              </div>
              {sidebarOpen && <span className="font-bold text-sm tracking-wide whitespace-nowrap">{item.label}</span>}
              {sidebarOpen && currentRoute === item.id && (
                <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 bg-[#4CC9F0] rounded-full shadow-[0_0_10px_#4CC9F0]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 space-y-6">
          {sidebarOpen && (
            <div className="p-5 bg-black/20 rounded-3xl space-y-4 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Compute Node</span>
                <Cpu size={14} className="text-[#4CC9F0]" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>GPU Utilization</span>
                  <span className="text-[#2A9D8F] animate-pulse">98%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} className="h-full bg-gradient-to-r from-[#2A9D8F] to-[#4CC9F0]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Global Header */}
        <header className="h-24 px-12 z-40 flex items-center justify-between">
          <div className="flex items-center gap-8 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 bg-white text-gray-600 rounded-2xl hover:text-gray-900 hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
            >
              <Menu size={20} />
            </button>
            <div className="relative w-full max-w-lg hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="text"
                placeholder="Global Registry Search..."
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#4CC9F0]/50 placeholder:text-gray-400 font-medium text-sm transition-all text-gray-900 shadow-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">
                <Command size={10} /> K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-6 px-8 border-r border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#2A9D8F]" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-[#4CC9F0]" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live</span>
              </div>
            </div>

            {/* Voice Assistant Button */}
            <button
              onClick={() => {
                const voiceBtn = document.querySelector('[title="Start voice command"]') as HTMLButtonElement;
                if (voiceBtn) voiceBtn.click();
              }}
              className="relative p-3 bg-gradient-to-r from-[#4CC9F0] to-[#2A9D8F] text-white rounded-2xl hover:scale-105 transition-all shadow-lg"
              title="Voice Assistant - Click to activate"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            <button className="relative p-3 bg-white text-gray-600 rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-all border border-gray-200 shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black shadow-[0_0_10px_red]"></span>
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900">Developed by Rajdeep</p>
                <p className="text-[10px] font-bold text-[#4CC9F0] uppercase tracking-widest leading-none mt-1">Full Stack Developer</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2A9D8F] to-[#4CC9F0] p-[2px] shadow-lg shadow-[#4CC9F0]/20 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-full h-full rounded-[0.9rem] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200&h=200" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {/* Content Fade at Top */}
          <div className="sticky top-0 h-8 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AppShell;

