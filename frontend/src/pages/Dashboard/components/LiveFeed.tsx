import { useState } from 'react';
import { BellRinging, FileText, User, ShieldWarning, Gear, Briefcase, CaretDown, CaretUp } from '@phosphor-icons/react';
import { ActivityItem } from '../types';

export default function LiveFeed({ feed }: { feed: ActivityItem[] }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayedFeed = isExpanded ? feed : feed.slice(0, 4);

    const getIcon = (cat: string) => {
        switch(cat) {
            case 'finance': return <FileText weight="fill" className="text-[var(--color-success)]" />;
            case 'compliance': return <ShieldWarning weight="fill" className="text-[var(--color-danger)]" />;
            case 'system': return <Gear weight="fill" className="text-[var(--color-text-muted)]" />;
            case 'hiring': return <Briefcase weight="fill" className="text-[var(--color-warning)]" />;
            default: return <User weight="fill" className="text-[var(--color-primary)]" />;
        }
    };

    return (
        <div className={`glass-card flex flex-col transition-all duration-500 ease-in-out border border-[var(--color-border)] ${isExpanded ? 'row-span-2' : ''}`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]">
                    <BellRinging className="text-[var(--color-warning)]" size={24} weight="duotone" />
                    Live Pulse
                </h3>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-warning)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-warning)]"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase opacity-50 text-[var(--color-text-muted)]">Real-time</span>
                </div>
            </div>

            <div className="flex-1 space-y-3">
                {displayedFeed.map((item, idx) => (
                    <div 
                        key={item.id} 
                        className="flex gap-4 p-3 rounded-xl hover:bg-[var(--color-bg)] transition duration-200 border border-transparent hover:border-[var(--color-border)] cursor-default group animate-fade-in"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <div className="mt-1 p-2 rounded-lg bg-[var(--color-bg)] shadow-sm h-fit shrink-0 relative border border-[var(--color-border)]">
                            {item.priority === 'high' && <div className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 rounded-full bg-[var(--color-danger)] ring-2 ring-[var(--color-surface)]"></div>}
                            {getIcon(item.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold uppercase opacity-50 tracking-wider bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)] px-1.5 py-0.5 rounded">{item.category}</span>
                                <span className="text-[10px] font-mono opacity-40 text-[var(--color-text-muted)]">{item.time}</span>
                            </div>
                            <div className="text-sm font-medium mt-1 truncate text-[var(--color-text)]">
                                <span className="font-bold">{item.user}</span> <span className="opacity-70 text-[var(--color-text-muted)]">{item.action.toLowerCase()}</span> <span className="font-bold text-[var(--color-primary)]">{item.target}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {feed.length > 4 && (
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 w-full py-2 bg-[var(--color-bg)]/50 hover:bg-[var(--color-bg)] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                    {isExpanded ? <>Show Less <CaretUp weight="bold" /></> : <>Expand Feed <CaretDown weight="bold" /></>}
                </button>
            )}
        </div>
    );
}