import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, CaretRight, MapPin } from '@phosphor-icons/react';

interface Props {
    countryStats: { name: string; count: number }[];
}

export default function GlobalContextWidget({ countryStats }: Props) {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        if (isExpanded) {
            navigate('/compliance');
        } else {
            setIsExpanded(true);
        }
    };

    return (
        <div 
            onClick={handleClick}
            className={`glass-card relative overflow-hidden group cursor-pointer transition-all duration-500 border border-white/5 hover:border-indigo-500/30 ${isExpanded ? 'h-auto p-6 bg-[#020617]/80' : 'h-24 px-8 flex items-center bg-black/20'}`}
        >
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700 bg-center pointer-events-none mix-blend-overlay"></div>
            
            {/* Collapsed View */}
            <div className={`relative z-10 flex items-center justify-between w-full transition-opacity duration-300 ${isExpanded ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                <div>
                    <h4 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                        <Globe size={20} weight="duotone" className="text-indigo-500" /> Global Presence
                    </h4>
                    <div className="text-xs opacity-60">Active in {countryStats.length} Regions</div>
                </div>
                <div className="flex gap-2">
                    {countryStats.slice(0, 5).map(c => (
                        <span key={c.name} className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10 font-bold opacity-60">{c.name}</span>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <CaretRight weight="bold" />
                    </div>
                </div>
            </div>

            {/* Expanded View */}
            <div className={`relative z-10 w-full transition-all duration-500 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 absolute top-0 pointer-events-none'}`}>
                <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
                    <div>
                        <h4 className="text-xl font-bold font-['Montserrat'] text-white">Active Regions</h4>
                        <p className="text-xs opacity-50 uppercase tracking-widest mt-1">Employee Distribution</p>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase animate-pulse">
                        Click again to view Compliance <CaretRight weight="bold" />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {countryStats.map((stat, i) => (
                        <div key={stat.name} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between group/card hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-black/30 rounded-lg text-indigo-400"><MapPin weight="fill" /></div>
                                <span className="font-bold text-sm text-gray-300 group-hover/card:text-white">{stat.name}</span>
                            </div>
                            <span className="text-xs font-mono font-bold bg-black/40 px-2 py-1 rounded text-white">{stat.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}