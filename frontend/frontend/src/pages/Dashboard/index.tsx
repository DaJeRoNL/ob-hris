import { useState } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { Sparkle, CalendarBlank, SlidersHorizontal, HouseLine } from '@phosphor-icons/react';

// Components
import ExecutiveSummary from './components/ExecutiveSummary';
import RevenueWidget from './components/RevenueWidget';
import LiveFeed from './components/LiveFeed';
import TalentWidget from './components/TalentWidget';

export default function Dashboard() {
    const { metrics, pipeline, activityFeed, people, clientName } = useDashboardData();
    const [viewMode, setViewMode] = useState<'Executive' | 'Manager'>('Executive');

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="p-8 animate-fade-in text-[var(--text-main)] min-h-full flex flex-col relative overflow-x-hidden">
            
            {/* -- HEADER -- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 shrink-0">
                <div className="relative">
                    <div className="flex items-center gap-2 text-xs font-bold opacity-50 uppercase tracking-widest mb-2">
                        <HouseLine weight="fill" className="text-indigo-500" /> {clientName} HQ
                    </div>
                    <h1 className="text-4xl font-black font-['Montserrat'] flex items-center gap-3 tracking-tight">
                        Dashboard
                        <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full font-bold shadow-lg shadow-indigo-500/20 uppercase tracking-widest">
                            Live
                        </span>
                    </h1>
                    <p className="text-sm opacity-60 mt-1 font-medium">{currentDate}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/50 dark:bg-black/20 p-1.5 rounded-xl flex text-xs font-bold border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                        <button 
                            onClick={() => setViewMode('Executive')}
                            className={`px-6 py-2.5 rounded-lg transition-all duration-300 ${viewMode === 'Executive' ? 'bg-white dark:bg-[#1e293b] shadow-lg shadow-black/5 text-indigo-600 dark:text-indigo-400 scale-105' : 'opacity-60 hover:opacity-100 hover:bg-black/5'}`}
                        >
                            Executive
                        </button>
                        <button 
                            onClick={() => setViewMode('Manager')}
                            className={`px-6 py-2.5 rounded-lg transition-all duration-300 ${viewMode === 'Manager' ? 'bg-white dark:bg-[#1e293b] shadow-lg shadow-black/5 text-indigo-600 dark:text-indigo-400 scale-105' : 'opacity-60 hover:opacity-100 hover:bg-black/5'}`}
                        >
                            Manager
                        </button>
                    </div>
                </div>
            </header>

            {/* -- MAIN CONTENT -- */}
            <div className="flex-1 space-y-8 pb-8">
                
                {/* 1. HERO STATS */}
                <ExecutiveSummary metrics={metrics} />

                {/* 2. MAIN WIDGET GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column (Charts & Widgets) */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="h-[400px]">
                            <RevenueWidget />
                        </div>
                        <div className="h-[400px]">
                            <TalentWidget pipeline={pipeline} />
                        </div>
                        
                        {/* AI Insight Box (Span Full Width of Left Col) */}
                        <div className="md:col-span-2 glass-card bg-gradient-to-r from-indigo-50/50 to-white/50 dark:from-[#1e1b4b]/40 dark:to-[#0f172a]/40 border-indigo-200 dark:border-indigo-500/20 flex items-center gap-6 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:bg-indigo-500/20 transition-colors"></div>
                             
                             <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                                <Sparkle size={32} weight="fill" className="animate-pulse" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                                    AI Insight Generated 
                                    <span className="text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded font-bold uppercase">New</span>
                                </h4>
                                <p className="text-sm opacity-70 leading-relaxed max-w-2xl">
                                    Workforce efficiency is up <strong className="text-emerald-500">12%</strong> compared to last quarter. However, <strong>Engineering</strong> retention risk has increased slightly. Suggested action: Review compensation bands for Senior levels.
                                </p>
                            </div>
                            <button className="ml-auto p-3 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-indigo-500 hover:text-white transition-all duration-300">
                                <ArrowRight weight="bold" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column (Live Feed - Variable Height) */}
                    <div className="lg:col-span-4">
                        <LiveFeed feed={activityFeed} />
                    </div>
                </div>
            </div>
        </div>
    );
}