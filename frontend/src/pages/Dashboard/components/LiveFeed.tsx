import { useState } from 'react';
import { BellRinging, FileText, User, ShieldWarning, Gear, Briefcase, CaretDown, CaretUp } from '@phosphor-icons/react';
import { ActivityItem } from '../types';

export default function LiveFeed({ feed }: { feed: ActivityItem[] }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayedFeed = isExpanded ? feed : feed.slice(0, 4);

    const getIcon = (cat: string) => {
        switch(cat) {
            case 'finance': return <FileText weight="fill" className="text-emerald-500" />;
            case 'compliance': return <ShieldWarning weight="fill" className="text-rose-500" />;
            case 'system': return <Gear weight="fill" className="text-slate-500" />;
            case 'hiring': return <Briefcase weight="fill" className="text-amber-500" />;
            default: return <User weight="fill" className="text-indigo-500" />;
        }
    };

    return (
        <div className={`glass-card flex flex-col transition-all duration-500 ease-in-out ${isExpanded ? 'row-span-2' : ''}`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--text-main)]">
                    <BellRinging className="text-amber-500" size={24} weight="duotone" />
                    Live Pulse
                </h3>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase opacity-50">Real-time</span>
                </div>
            </div>

            <div className="flex-1 space-y-3">
                {displayedFeed.map((item, idx) => (
                    <div 
                        key={item.id} 
                        className="flex gap-4 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition duration-200 border border-transparent hover:border-gray-200 dark:hover:border-white/5 cursor-default group animate-fade-in"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <div className="mt-1 p-2 rounded-lg bg-gray-100 dark:bg-white/5 shadow-sm h-fit shrink-0 relative">
                            {item.priority === 'high' && <div className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#1e293b]"></div>}
                            {getIcon(item.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold uppercase opacity-50 tracking-wider bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded">{item.category}</span>
                                <span className="text-[10px] font-mono opacity-40">{item.time}</span>
                            </div>
                            <div className="text-sm font-medium mt-1 truncate">
                                <span className="font-bold text-[var(--text-main)]">{item.user}</span> <span className="opacity-70">{item.action.toLowerCase()}</span> <span className="font-bold text-indigo-500">{item.target}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {feed.length > 4 && (
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 w-full py-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-gray-200 dark:border-white/5"
                >
                    {isExpanded ? <>Show Less <CaretUp weight="bold" /></> : <>Expand Feed <CaretDown weight="bold" /></>}
                </button>
            )}
        </div>
    );
}