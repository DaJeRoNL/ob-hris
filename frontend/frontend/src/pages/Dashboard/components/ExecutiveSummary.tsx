import { useNavigate } from 'react-router-dom';
import { Users, CurrencyDollar, ShieldCheck, Briefcase, TrendUp, TrendDown, CaretRight } from '@phosphor-icons/react';
import { MetricItem } from '../types';

const ICONS: Record<string, any> = {
    'indigo': Users,
    'emerald': CurrencyDollar,
    'rose': ShieldCheck,
    'blue': ShieldCheck,
    'amber': Briefcase
};

export default function ExecutiveSummary({ metrics }: { metrics: MetricItem[] }) {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m, i) => {
                const Icon = ICONS[m.color] || Users;
                const isPositive = m.trend >= 0;

                return (
                    <div 
                        key={i} 
                        onClick={() => m.linkTo && navigate(m.linkTo)}
                        className="glass-card relative overflow-hidden group cursor-pointer transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-indigo-500/10 border border-white/10"
                    >
                        {/* Ambient Glow */}
                        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-${m.color}-500/10 blur-[50px] group-hover:bg-${m.color}-500/20 transition-all duration-500`} />
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl bg-${m.color}-500/10 flex items-center justify-center text-${m.color}-500 text-xl shadow-inner border border-${m.color}-500/20 transition-transform group-hover:scale-110 duration-300`}>
                                <Icon weight="duotone" />
                            </div>
                            
                            {/* Trend Pill */}
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${isPositive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                {isPositive ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
                                {Math.abs(m.trend)}%
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-1">
                                <div className="text-3xl font-bold font-['Montserrat'] tracking-tight text-[var(--text-main)]">
                                    {m.isCurrency && '$'}{m.value}
                                </div>
                            </div>
                            <div className="text-xs font-bold uppercase opacity-50 tracking-wider mb-2 flex items-center gap-2">
                                {m.label}
                                <CaretRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-500" />
                            </div>
                            <div className="text-[10px] opacity-40 font-mono">
                                {isPositive ? '▲' : '▼'} {m.trendLabel}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}