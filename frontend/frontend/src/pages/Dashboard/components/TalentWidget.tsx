import { UsersThree, ArrowRight } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { PipelineStat } from '../types';

export default function TalentWidget({ pipeline }: { pipeline: PipelineStat[] }) {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate('/hiring')}
            className="glass-card flex flex-col h-full bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] text-white relative overflow-hidden border border-white/10 cursor-pointer group hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300"
        >
            {/* Artistic Background */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
            
            <div className="relative z-10 mb-6 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                    <UsersThree weight="duotone" className="text-indigo-400" /> Talent Pipeline
                </h3>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-300">
                    <ArrowRight weight="bold" size={14} />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-5 relative z-10">
                {pipeline.map((p, i) => (
                    <div key={i} className="group/item">
                        <div className="flex justify-between text-xs font-bold mb-2 opacity-80 group-hover/item:opacity-100 transition">
                            <span className="uppercase tracking-wider">{p.stage}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded-full">{p.count}</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all duration-1000 group-hover/item:shadow-[0_0_12px_rgba(129,140,248,0.8)]" 
                                style={{ width: `${(p.count / 5) * 100}%` }}
                            ></div>
                        </div>
                        
                        {/* Candidates Preview */}
                        <div className="mt-1 flex -space-x-2 overflow-hidden h-6 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                            {p.candidates.slice(0, 3).map((c, idx) => (
                                <div key={idx} title={c.name} className="inline-block h-5 w-5 rounded-full ring-2 ring-[#0f172a] bg-indigo-500 flex items-center justify-center text-[8px] font-bold shadow-lg">
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