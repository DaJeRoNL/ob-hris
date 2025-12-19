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
            className="glass-card flex flex-col h-full relative overflow-hidden group border border-[var(--color-border)] hover:border-[var(--color-success)]/20 transition-all duration-500 bg-[var(--color-surface)]/40 cursor-pointer"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-6 z-20 relative">
                <div>
                    <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)] group-hover:text-[var(--color-success)] transition-colors">
                        <CurrencyDollar className="text-[var(--color-success)]" size={24} weight="duotone" />
                        Financial Overview
                    </h3>
                    <p className="text-xs opacity-50 mt-1 uppercase tracking-widest font-bold text-[var(--color-text-muted)]">Revenue vs Expenses (7D)</p>
                </div>
                
                <div className="flex gap-2">
                    <button className="p-2 bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] rounded-lg transition text-[var(--color-text)] border border-[var(--color-border)]">
                        <DownloadSimple size={16} />
                    </button>
                    <button className="p-2 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-lg hover:bg-[var(--color-success)] hover:text-[var(--color-bg)] transition border border-[var(--color-success)]/20">
                        <ArrowUpRight size={16} weight="bold" />
                    </button>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 relative z-10 mx-2 mb-2">
                
                {/* Expense Line Layer (Red Curve) - Using CSS Vars in SVG */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-danger)" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="var(--color-danger)" stopOpacity="0" />
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
                        stroke="var(--color-danger)" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        className="drop-shadow-md transition-all duration-700" 
                        vectorEffect="non-scaling-stroke" 
                    />
                </svg>

                {/* Revenue Bars Layer (Green Bars) */}
                <div className="absolute inset-0 w-full h-full flex justify-between items-end z-10 px-4">
                    {data.map((d, i) => (
                        <div key={i} className="relative flex flex-col items-center group/bar w-full h-full">
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-6 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-[9px] font-bold px-3 py-2 rounded z-50 whitespace-nowrap pointer-events-none shadow-xl transform translate-y-1 text-center">
                                <div className="text-[var(--color-success)] mb-0.5">REV: ${d.revenue.toFixed(1)}k</div>
                                <div className="text-[var(--color-danger)]">EXP: ${d.expense.toFixed(1)}k</div>
                            </div>

                            {/* Bar */}
                            <div 
                                className="w-2.5 rounded-t-sm transition-all duration-700 ease-out bg-gradient-to-t from-[var(--color-success)]/20 to-[var(--color-success)] hover:brightness-125 relative"
                                style={{ height: `${100 - getY(d.revenue)}%` }}
                            >
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--color-success)]/50"></div>
                            </div>

                            {/* Label */}
                            <div className="absolute bottom-[-20px] text-[9px] font-bold opacity-30 uppercase tracking-wider text-[var(--color-text-muted)]">
                                {d.day}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Ambient Background Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[var(--color-success)]/5 via-transparent to-transparent pointer-events-none" />
        </div>
    );
}