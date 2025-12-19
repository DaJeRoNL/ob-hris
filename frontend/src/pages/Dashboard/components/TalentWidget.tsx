import { UsersThree, ArrowRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { PipelineStat } from '../types';

export default function TalentWidget({ pipeline }: { pipeline: PipelineStat[] }) {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate('/hiring')}
            className="glass-card flex flex-col h-full bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden border border-[var(--color-border)] cursor-pointer group hover:shadow-xl hover:border-[var(--color-primary)]/30 transition-all duration-300"
        >
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[var(--color-primary)]/20 transition-colors duration-500"></div>
            
            <div className="relative z-10 mb-6 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]">
                    <UsersThree weight="duotone" className="text-[var(--color-primary)]" /> Talent Pipeline
                </h3>
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg)]/50 border border-[var(--color-border)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                    <ArrowRight weight="bold" size={14} />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-5 relative z-10">
                {pipeline.map((p, i) => (
                    <div key={i} className="group/item">
                        <div className="flex justify-between text-xs font-bold mb-2 opacity-80 group-hover/item:opacity-100 transition text-[var(--color-text)]">
                            <span className="uppercase tracking-wider">{p.stage}</span>
                            <span className="bg-[var(--color-bg)]/50 border border-[var(--color-border)] px-2 py-0.5 rounded-full">{p.count}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--color-bg)] rounded-full overflow-hidden backdrop-blur-sm border border-[var(--color-border)]/50">
                            <div 
                                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full transition-all duration-1000" 
                                style={{ width: `${(p.count / 5) * 100}%` }}
                            ></div>
                        </div>
                        
                        <div className="mt-1 flex -space-x-2 overflow-hidden h-6 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                            {p.candidates.slice(0, 3).map((c, idx) => (
                                <div key={idx} title={c.name} className="inline-block h-5 w-5 rounded-full ring-2 ring-[var(--color-surface)] bg-[var(--color-primary)] text-white flex items-center justify-center text-[8px] font-bold shadow-lg">
                                    {c.name.charAt(0)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}