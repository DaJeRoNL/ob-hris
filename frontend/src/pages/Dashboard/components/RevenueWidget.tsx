import { CurrencyDollar, DownloadSimple, ArrowUpRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { FinancialMetric } from '../types';

interface Props {
    data: FinancialMetric[];
}

export default function RevenueWidget({ data }: Props) {
    const navigate = useNavigate();

    // Scaling
    const maxValue = Math.max(...data.map(d => Math.max(d.revenue, d.expense))) * 1.1; 
    const minValue = 0; 
    const range = maxValue - minValue;
    const getY = (val: number) => 100 - ((val - minValue) / range) * 100;

    // Line Path Generator
    const generateLinePath = (points: number[]) => {
        return points.map((val, i) => {
            const x = (i / (points.length - 1)) * 100;
            const y = getY(val);
            return `${x} ${y}`;
        }).join(' L ');
    };

    return (
        <div 
            onClick={() => navigate('/finance')}
            className="glass-card flex flex-col h-full relative overflow-hidden group border border-white/5 hover:border-emerald-500/20 transition-all duration-500 bg-[#020617]/40 cursor-pointer"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-6 z-20 relative">
                <div>
                    <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--text-main)] group-hover:text-emerald-400 transition-colors">
                        <CurrencyDollar className="text-emerald-500" size={24} weight="duotone" />
                        Financial Overview
                    </h3>
                    <p className="text-xs opacity-50 mt-1 uppercase tracking-widest font-bold">Revenue vs Expenses (7D)</p>
                </div>
                
                <div className="flex gap-2">
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition text-[var(--text-main)] border border-white/5">
                        <DownloadSimple size={16} />
                    </button>
                    <button className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition border border-emerald-500/20">
                        <ArrowUpRight size={16} weight="bold" />
                    </button>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 relative z-10 mx-2 mb-2">
                
                {/* Expense Line Layer (Red Curve) */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path 
                        d={`M 0 100 L ${generateLinePath(data.map(d => d.expense))} L 100 100 Z`} 
                        fill="url(#expenseGradient)" 
                        className="opacity-20 transition-all duration-700" 
                    />
                    <path 
                        d={`M ${generateLinePath(data.map(d => d.expense))}`} 
                        fill="none" 
                        stroke="#f43f5e" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(244,63,94,0.5)] transition-all duration-700" 
                        vectorEffect="non-scaling-stroke" 
                    />
                </svg>

                {/* Revenue Bars Layer (Green Bars) */}
                <div className="absolute inset-0 w-full h-full flex justify-between items-end z-10 px-4">
                    {data.map((d, i) => (
                        <div key={i} className="relative flex flex-col items-center group/bar w-full h-full">
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-6 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-black/90 border border-white/10 text-white text-[9px] font-bold px-3 py-2 rounded z-50 whitespace-nowrap pointer-events-none shadow-xl transform translate-y-1 text-center">
                                <div className="text-emerald-400 mb-0.5">REV: ${d.revenue.toFixed(1)}k</div>
                                <div className="text-rose-400">EXP: ${d.expense.toFixed(1)}k</div>
                            </div>

                            {/* Bar */}
                            <div 
                                className="w-2.5 rounded-t-sm transition-all duration-700 ease-out bg-gradient-to-t from-emerald-500/20 to-emerald-500 hover:brightness-125 relative"
                                style={{ height: `${100 - getY(d.revenue)}%` }}
                            >
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-300/50"></div>
                            </div>

                            {/* Label */}
                            <div className="absolute bottom-[-20px] text-[9px] font-bold opacity-30 uppercase tracking-wider text-[var(--text-main)]">
                                {d.day}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Ambient Background Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-emerald-900/10 via-transparent to-transparent pointer-events-none" />
        </div>
    );
}