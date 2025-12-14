import { RocketLaunch, Target, Trophy, ChartLineUp, Check, Lightning } from '@phosphor-icons/react';

export default function Growth() {
  const objectives = [
    { 
        title: "Scale ARR to $2M", 
        progress: 78, 
        color: "emerald",
        keyResults: [
            { label: "Close 5 Enterprise Deals", val: "4/5", done: false },
            { label: "Increase Net Retention to 110%", val: "108%", done: false },
            { label: "Launch Self-Serve Plan", val: "Done", done: true }
        ]
    },
    { 
        title: "Expand Engineering Team", 
        progress: 40, 
        color: "blue",
        keyResults: [
            { label: "Hire 2 Senior Backend Devs", val: "1/2", done: false },
            { label: "Onboard new CTO", val: "Sourcing", done: false }
        ]
    },
    { 
        title: "Product Reliability", 
        progress: 92, 
        color: "indigo",
        keyResults: [
            { label: "Reduce downtime to < 1hr/yr", val: "On Track", done: true },
            { label: "Automate QA Pipeline", val: "95%", done: true }
        ]
    }
  ];

  return (
    <div className="p-8 text-[var(--text-main)] animate-fade-in h-full overflow-y-auto custom-scrollbar">
      <header className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-500 mb-4 shadow-lg shadow-indigo-500/20 border border-indigo-500/20">
            <RocketLaunch size={32} weight="fill" />
        </div>
        <h1 className="text-4xl font-black font-['Montserrat'] tracking-tight mb-2">Company Growth Goals</h1>
        <p className="opacity-60 text-lg">Q4 2024 Objectives & Key Results (OKRs)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {objectives.map((obj, i) => (
            <div key={i} className="glass-card flex flex-col h-full border-t-4 border-t-transparent hover:border-t-indigo-500 transition-all duration-300 group hover:-translate-y-2">
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl bg-${obj.color}-500/10 text-${obj.color}-500`}>
                        <Target size={24} weight="duotone" />
                    </div>
                    <span className="text-2xl font-bold font-mono opacity-80">{obj.progress}%</span>
                </div>
                
                <h3 className="text-xl font-bold mb-6 font-['Montserrat']">{obj.title}</h3>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 mb-8 overflow-hidden">
                    <div 
                        className={`h-full rounded-full bg-gradient-to-r from-${obj.color}-400 to-${obj.color}-600 transition-all duration-1000 ease-out relative`} 
                        style={{ width: `${obj.progress}%` }}
                    >
                        <div className="absolute top-0 right-0 w-full h-full bg-white/20 animate-pulse-fast"></div>
                    </div>
                </div>

                <div className="space-y-4 flex-1">
                    {obj.keyResults.map((kr, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-indigo-500/20 transition-colors">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${kr.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-400 opacity-30'}`}>
                                {kr.done && <Check size={12} weight="bold" />}
                            </div>
                            <div className="flex-1 text-sm font-medium">{kr.label}</div>
                            <div className="text-xs font-bold font-mono opacity-60 bg-black/5 dark:bg-white/10 px-2 py-1 rounded">{kr.val}</div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>

      {/* Velocity Chart Area */}
      <div className="max-w-7xl mx-auto mt-12 glass-card bg-gradient-to-br from-indigo-900 to-[#0f172a] text-white p-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
         
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
                <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Lightning weight="fill" className="text-yellow-400" /> Velocity Tracker
                </h3>
                <p className="text-white/60 mt-2 max-w-lg">Team output has increased by <strong className="text-white">24%</strong> since the introduction of the new AI tools in Q3.</p>
            </div>
            
            <div className="flex gap-8 text-center">
                <div>
                    <div className="text-3xl font-black mb-1">142</div>
                    <div className="text-[10px] uppercase font-bold opacity-50 tracking-widest">Tasks Shipped</div>
                </div>
                <div className="w-px bg-white/20 h-12"></div>
                <div>
                    <div className="text-3xl font-black mb-1 text-emerald-400">12ms</div>
                    <div className="text-[10px] uppercase font-bold opacity-50 tracking-widest">Avg Latency</div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}