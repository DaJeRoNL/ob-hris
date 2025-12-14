import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from './hooks/useDashboardData';
import { Sparkle, HouseLine, ArrowRight } from '@phosphor-icons/react';
import { useSystemSettings } from '../../hooks/useSystemSettings'; // New hook

// Components
import ExecutiveSummary from './components/ExecutiveSummary';
import RevenueWidget from './components/RevenueWidget';
import LiveFeed from './components/LiveFeed';
import TalentWidget from './components/TalentWidget';
import GlobalContextWidget from './components/GlobalContextWidget';

export default function Dashboard() {
    const navigate = useNavigate();
    const { metrics, pipeline, activityFeed, clientName, financialTrends, countryStats, layoutConfig } = useDashboardData();
    const { formatDate } = useSystemSettings();
    const [viewMode, setViewMode] = useState<'Executive' | 'Manager'>('Executive');

    const formattedDate = formatDate(new Date());

    return (
        <div className="p-8 animate-fade-in text-[var(--text-main)] min-h-full flex flex-col relative overflow-x-hidden bg-[#f3f4f6] dark:bg-[#020617] transition-colors duration-700">
            <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#2e1065]/40 via-[#1e1b4b]/20 to-transparent pointer-events-none mix-blend-screen opacity-60 dark:opacity-100 transition-opacity duration-700"></div>
            
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 shrink-0 relative z-10">
                <div className="relative">
                    <div className="flex items-center gap-2 text-xs font-bold opacity-50 uppercase tracking-widest mb-2">
                        <HouseLine weight="fill" className="text-indigo-500" /> {clientName} HQ
                    </div>
                    <h1 className="text-4xl font-black font-['Montserrat'] flex items-center gap-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Dashboard
                        <span className="text-[10px] bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-2 py-0.5 rounded border border-white/10 font-bold shadow-lg shadow-indigo-500/20 uppercase tracking-widest self-start mt-2">Live</span>
                    </h1>
                    <p className="text-sm opacity-60 mt-1 font-medium">{formattedDate}</p>
                </div>
            </header>

            <div className="flex-1 space-y-8 pb-8 relative z-10">
                <ExecutiveSummary metrics={metrics} />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {layoutConfig.revenue && <div className="h-[420px] md:col-span-1 animate-fade-in-up"><RevenueWidget data={financialTrends} /></div>}
                        {layoutConfig.talent && <div className="h-[420px] md:col-span-1 animate-fade-in-up"><TalentWidget pipeline={pipeline} /></div>}
                        {layoutConfig.ai && <div className="md:col-span-2 glass-card bg-gradient-to-r from-indigo-50/50 to-white/50 dark:from-[#1e1b4b]/40 dark:to-[#0f172a]/40 border-indigo-200 dark:border-indigo-500/20 flex items-center gap-6 p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 animate-fade-in-up">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:bg-indigo-500/20 transition-colors"></div>
                             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/20"><Sparkle size={32} weight="fill" className="animate-pulse" /></div>
                            <div className="relative z-10"><h4 className="font-bold text-lg mb-1 flex items-center gap-2 text-[var(--text-main)]">AI Insight Generated <span className="text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded font-bold uppercase border border-indigo-500/20">New</span></h4><p className="text-sm opacity-70 leading-relaxed max-w-2xl">Workforce efficiency is up <strong className="text-emerald-500">12%</strong> compared to last quarter. However, <strong>Engineering</strong> retention risk has increased slightly. Suggested action: Review compensation bands for Senior levels.</p></div>
                            <button onClick={() => navigate('/growth')} className="ml-auto p-3 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-indigo-500 hover:text-white transition-all duration-300 border border-white/10 shadow-sm"><ArrowRight weight="bold" /></button>
                        </div>}
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-8">{layoutConfig.feed && <div className="animate-fade-in-up"><LiveFeed feed={activityFeed} /></div>}</div>
                </div>
                {layoutConfig.global && <div className="animate-fade-in-up"><GlobalContextWidget countryStats={countryStats} /></div>}
            </div>
        </div>
    );
}