import { useState } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { Sparkle, HouseLine, ArrowRight } from '@phosphor-icons/react';

// Components
import ExecutiveSummary from './components/ExecutiveSummary';
import RevenueWidget from './components/RevenueWidget';
import LiveFeed from './components/LiveFeed';
import TalentWidget from './components/TalentWidget';

export default function Dashboard() {
    const { metrics, pipeline, activityFeed, financialTrends, clientName } = useDashboardData();
    const [viewMode, setViewMode] = useState<'Executive' | 'Manager'>('Executive');

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="p-8 animate-fade-in text-[var(--color-text)] min-h-full flex flex-col relative overflow-x-hidden">
            
            {/* -- HEADER -- */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 shrink-0">
                <div className="relative">
                    <div className="flex items-center gap-2 text-xs font-bold opacity-50 uppercase tracking-widest mb-2 text-[var(--color-text-muted)]">
                        <HouseLine weight="fill" className="text-[var(--color-primary)]" /> {clientName} HQ
                    </div>
                    <h1 className="text-4xl font-black font-['Montserrat'] flex items-center gap-3 tracking-tight text-[var(--color-text)]">
                        Dashboard
                        <span className="text-xs bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white px-3 py-1 rounded-full font-bold shadow-lg shadow-[var(--color-primary)]/20 uppercase tracking-widest">
                            Live
                        </span>
                    </h1>
                    <p className="text-sm opacity-60 mt-1 font-medium text-[var(--color-text-muted)]">{currentDate}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-[var(--color-surface)]/50 p-1.5 rounded-xl flex text-xs font-bold border border-[var(--color-border)] backdrop-blur-sm">
                        <button 
                            onClick={() => setViewMode('Executive')}
                            className={`px-6 py-2.5 rounded-lg transition-all duration-300 ${viewMode === 'Executive' ? 'bg-[var(--color-surface)] shadow-lg shadow-[var(--color-shadow)] text-[var(--color-primary)] scale-105' : 'opacity-60 hover:opacity-100 hover:bg-[var(--color-bg)] text-[var(--color-text-muted)]'}`}
                        >
                            Executive
                        </button>
                        <button 
                            onClick={() => setViewMode('Manager')}
                            className={`px-6 py-2.5 rounded-lg transition-all duration-300 ${viewMode === 'Manager' ? 'bg-[var(--color-surface)] shadow-lg shadow-[var(--color-shadow)] text-[var(--color-primary)] scale-105' : 'opacity-60 hover:opacity-100 hover:bg-[var(--color-bg)] text-[var(--color-text-muted)]'}`}
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
                            <RevenueWidget data={financialTrends} />
                        </div>
                        <div className="h-[400px]">
                            <TalentWidget pipeline={pipeline} />
                        </div>
                        
                        {/* AI Insight Box (Span Full Width of Left Col) */}
                        <div className="md:col-span-2 glass-card bg-[var(--color-surface)] border-[var(--color-border)] border flex items-center gap-6 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                             {/* Gradient Ambient */}
                             <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-surface)] pointer-events-none" />
                             
                             <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:bg-[var(--color-primary)]/20 transition-colors"></div>
                             
                             <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[var(--color-primary)]/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <Sparkle size={32} weight="fill" className="animate-pulse" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="font-bold text-lg mb-1 flex items-center gap-2 text-[var(--color-text)]">
                                    AI Insight Generated 
                                    <span className="text-[10px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 px-2 py-0.5 rounded font-bold uppercase">New</span>
                                </h4>
                                <p className="text-sm opacity-70 leading-relaxed max-w-2xl text-[var(--color-text-muted)]">
                                    Workforce efficiency is up <strong className="text-[var(--color-success)]">12%</strong> compared to last quarter. However, <strong>Engineering</strong> retention risk has increased slightly. Suggested action: Review compensation bands for Senior levels.
                                </p>
                            </div>
                            <button className="ml-auto p-3 rounded-xl bg-[var(--color-bg)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 text-[var(--color-primary)] border border-[var(--color-border)] relative z-10">
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