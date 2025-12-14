import { CurrencyDollar, DownloadSimple, ArrowUpRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export default function RevenueWidget() {
    const navigate = useNavigate();
    // Simplified elegant chart data
    const dataPoints = [40, 65, 55, 80, 72, 95, 88];

    return (
        <div 
            onClick={() => navigate('/finance')}
            className="glass-card flex flex-col h-full relative overflow-hidden cursor-pointer group hover:border-emerald-500/30 transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-8 z-10">
                <div>
                    <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--text-main)]">
                        <CurrencyDollar className="text-emerald-500" size={24} weight="duotone" />
                        Financial Overview
                    </h3>
                    <p className="text-xs opacity-60 mt-1">Net Revenue (YTD)</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition text-[var(--text-main)]">
                        <DownloadSimple size={18} />
                    </button>
                    <button className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition">
                        <ArrowUpRight size={18} weight="bold" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-3 px-2 relative z-10">
                {dataPoints.map((val, i) => (
                    <div key={i} className="w-full flex flex-col items-center gap-2 group/bar">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/bar:translate-y-0 text-[10px] font-bold bg-gray-900 text-white px-2 py-1 rounded absolute -mt-10 shadow-xl z-20">
                            ${val}k
                        </div>
                        
                        {/* Bar */}
                        <div className="w-full h-full flex items-end">
                            <div 
                                className="w-full rounded-t-lg transition-all duration-1000 ease-out group-hover/bar:brightness-125 relative overflow-hidden"
                                style={{ 
                                    height: `${val}%`,
                                    background: 'linear-gradient(to top, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.8))'
                                }}
                            >
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-400 opacity-50"></div>
                            </div>
                        </div>
                        
                        <div className="text-[10px] opacity-40 font-bold uppercase">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Background Glow */}
            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
        </div>
    );
}