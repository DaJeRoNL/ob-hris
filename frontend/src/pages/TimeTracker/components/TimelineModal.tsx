import { useState } from 'react';
import { X, FirstAid, Smiley, User, Info } from '@phosphor-icons/react';
import { TimeEntry } from '../../../types';
import { LeaveRequest } from '../types';
import { getSecondsFromTime, calculateDuration } from '../utils';

interface Props {
    date: Date;
    entries: TimeEntry[];
    leaveRequests: LeaveRequest[];
    currentClientId: string;
    onClose: () => void;
}

export default function TimelineModal({ date, entries, leaveRequests, currentClientId, onClose }: Props) {
    const [hoveredEntryId, setHoveredEntryId] = useState<string | null>(null);
    const dateStr = date.toLocaleDateString('en-CA');

    const dayEntries: any[] = entries.filter(e => e.date === dateStr && e.clientId === currentClientId);
    const activeLeaves = leaveRequests.filter(l => dateStr >= l.startDate && dateStr <= l.endDate);
    
    activeLeaves.forEach(leave => {
        let sStart = "00:00:00";
        let sEnd = "23:59:59";
        if (leave.type === 'Sick') {
            if (dateStr === leave.startDate && leave.reportedAt) sStart = leave.reportedAt;
            if (dateStr === leave.endDate && leave.returnedAt) sEnd = leave.returnedAt;
        } else {
            if (dateStr === leave.startDate && leave.startTime) sStart = leave.startTime;
            if (dateStr === leave.endDate && leave.endTime) sEnd = leave.endTime;
        }
        dayEntries.push({
            id: `leave-${leave.id}`,
            startTime: sStart,
            endTime: sEnd,
            isVirtualLeave: true,
            leaveType: leave.type
        });
    });

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--color-surface)] w-full max-w-2xl rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden flex flex-col max-h-[90vh] mt-[-10vh]" onClick={e => e.stopPropagation()}>
                <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] shrink-0 z-20">
                    <div className="p-4 flex justify-between items-center text-[var(--color-text)]">
                        <h2 className="text-lg font-bold font-['Montserrat']">Timeline: {date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</h2>
                        <button onClick={onClose} className="hover:text-[var(--color-danger)] transition"><X size={20} /></button>
                    </div>
                    <div className="px-6 pb-4">
                        <div className="flex justify-between text-[10px] opacity-50 uppercase font-bold mb-1 text-[var(--color-text)]"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
                        <div className="h-4 bg-[var(--color-bg)] rounded-full relative overflow-hidden flex">
                            {dayEntries.map((e, idx) => {
                                if (e.isVirtualLeave) return null; 
                                const leftPct = (getSecondsFromTime(e.startTime) / 86400) * 100;
                                const widthPct = ((getSecondsFromTime(e.endTime) - getSecondsFromTime(e.startTime)) / 86400) * 100;
                                const isHovered = hoveredEntryId === e.id;
                                return <div key={idx} onMouseEnter={() => e.id && setHoveredEntryId(e.id)} onMouseLeave={() => setHoveredEntryId(null)} className={`absolute h-full border-r-2 border-white/30 transition-colors duration-200 cursor-pointer ${isHovered ? 'bg-[var(--color-primary)]/70' : 'bg-[var(--color-primary)]'}`} style={{ left: `${leftPct}%`, width: `${widthPct}%` }} title={`${e.startTime} - ${e.endTime}`} />;
                            })}
                            
                            {dayEntries.filter(e => e.isVirtualLeave).map(e => {
                                const lType = e.leaveType;
                                let colorClass = 'bg-[var(--color-text-muted)]/40 border-[var(--color-text-muted)]';
                                if (lType === 'Sick') colorClass = 'bg-[var(--color-danger)]/40 border-[var(--color-danger)]';
                                else if (lType === 'Vacation') colorClass = 'bg-[var(--color-success)]/40 border-[var(--color-success)]';
                                else if (lType === 'Personal') colorClass = 'bg-[var(--color-primary)]/40 border-[var(--color-primary)]';

                                return <div key={e.id} onMouseEnter={() => e.id && setHoveredEntryId(e.id)} onMouseLeave={() => setHoveredEntryId(null)} className={`absolute h-full ${colorClass} border-l`} style={{ left: `${(getSecondsFromTime(e.startTime) / 86400) * 100}%`, width: `${((getSecondsFromTime(e.endTime) - getSecondsFromTime(e.startTime)) / 86400) * 100}%` }} title={`${lType} Leave`} />;
                            })}
                        </div>
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto relative">
                    <div className="relative pl-4 ml-2 flex flex-col gap-6 border-l-2 border-dashed border-[var(--color-border)] pb-6">
                        {dayEntries.sort((a,b) => a.startTime.localeCompare(b.startTime)).map((e, idx) => {
                             const isHovered = hoveredEntryId === e.id;
                             if (e.isVirtualLeave) {
                                const lType = e.leaveType;
                                let color = 'text-[var(--color-text-muted)]'; let bg = 'bg-[var(--color-text-muted)]/10'; let border = 'border-[var(--color-text-muted)]/50'; let Icon = Info;
                                if (lType === 'Sick') { color = 'text-[var(--color-danger)]'; bg = 'bg-[var(--color-danger)]/10'; border = 'border-[var(--color-danger)]/50'; Icon = FirstAid; }
                                else if (lType === 'Vacation') { color = 'text-[var(--color-success)]'; bg = 'bg-[var(--color-success)]/10'; border = 'border-[var(--color-success)]/50'; Icon = Smiley; }
                                else if (lType === 'Personal') { color = 'text-[var(--color-primary)]'; bg = 'bg-[var(--color-primary)]/10'; border = 'border-[var(--color-primary)]/50'; Icon = User; }

                                return (
                                    <div key={e.id} className="relative pl-6">
                                        <div className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-4 border-[var(--color-bg)] ${color.replace('text', 'bg')}`}></div>
                                        <div onMouseEnter={() => setHoveredEntryId(e.id || null)} onMouseLeave={() => setHoveredEntryId(null)} className={`glass-card !p-4 !${bg} !border-${border.split('-')[1]} transition duration-200 cursor-pointer ${isHovered ? 'scale-[1.01] shadow-lg' : ''}`}>
                                            <div className={`flex items-center gap-2 mb-2 font-bold ${color}`}><Icon weight="fill" /> {lType} Leave</div>
                                            <div className="text-xs opacity-80 text-[var(--color-text)]">Automatic Entry • {e.startTime} - {e.endTime}</div>
                                        </div>
                                    </div>
                                );
                             }
                             return (
                                <div key={idx} className="relative pl-6">
                                    <div className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-4 border-[var(--color-bg)] transition-colors ${isHovered ? 'bg-[var(--color-primary)]/70' : 'bg-[var(--color-primary)]'}`}></div>
                                    <div onMouseEnter={() => setHoveredEntryId(e.id || null)} onMouseLeave={() => setHoveredEntryId(null)} className={`glass-card !p-4 !bg-[var(--color-bg)]/50 transition duration-200 cursor-pointer ${isHovered ? 'ring-2 ring-[var(--color-primary)] shadow-lg scale-[1.01]' : ''}`}>
                                        <div className="flex justify-between items-start mb-2"><div className="flex items-center gap-2"><span className="font-bold text-sm text-[var(--color-primary)]">{e.startTime} - {e.endTime}</span><span className="text-[10px] font-bold opacity-40 text-[var(--color-text)]">#{idx + 1}</span></div><span className="text-xs font-mono opacity-60 bg-[var(--color-surface)] px-2 py-0.5 rounded text-[var(--color-text)]">{calculateDuration(e.startTime, e.endTime)}</span></div>
                                        <div className="text-xs opacity-80 whitespace-pre-wrap text-[var(--color-text)]">{e.notes || "No notes provided."}</div>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}