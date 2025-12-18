import { useState, useRef, useEffect } from 'react';
import { 
    CheckCircle, Circle, CaretUp, CaretDown, 
    ArrowRight, ArrowDown, TreeStructure, CaretLeft, CaretRight, 
    UserPlus, ShieldCheck, CalendarCheck, User, Clock, 
    UsersThree, Plus, PaperPlaneRight, Chats, Check, Fire, Pulse,
    Link as LinkIcon, ShareNetwork
} from '@phosphor-icons/react';


interface Subtask {
    id: string;
    title: string;
    desc?: string;
    isCompleted: boolean;
    assignee?: string;
    isRequired?: boolean;
    completedAt?: string;
}

interface Note {
    id: string;
    user: string;
    text: string;
    timestamp: string;
}

interface Task {
    id: string;
    title: string;
    desc: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'New Tickets' | 'Ready' | 'In Progress' | 'Review' | 'Done';
    tags: string[];
    subtasks: Subtask[];
    notes?: Note[];
    deadline?: string;
    creator?: string;
    createdAt?: string;
    collaborators: string[];
    completedAt?: string;
    assignee: string | null;
    links?: string[]; // Flow Links
}


interface Props {
    task: Task | null;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
    onPickUpSubtask: (taskId: string, subtaskId: string) => void;
    onAddSubtask: (taskId: string) => void;
    onAddNote: (taskId: string, text: string) => void;
    onMoveTask: (taskId: string, column: string) => void;
    allTasks: Task[]; // Need this to show linked task details
}

export default function TaskFlowPanel({ task, isOpen, setIsOpen, onToggleSubtask, onPickUpSubtask, onAddSubtask, onAddNote, onMoveTask, allTasks }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const [noteInput, setNoteInput] = useState('');
    const [showCompleteMenu, setShowCompleteMenu] = useState(false);
    const scrollTimeout = useRef<number | null>(null);
    const [activeTab, setActiveTab] = useState<'workflow' | 'dependencies'>('workflow');

    useEffect(() => {
        if (task && isOpen) {
            setTimeout(() => {
                const firstUnfinished = task.subtasks.find(s => !s.isCompleted);
                if (firstUnfinished && scrollRef.current) {
                    const node = nodesRef.current.get(firstUnfinished.id);
                    if (node) {
                        node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    }
                }
            }, 300);
        }
    }, [task?.id, isOpen]);

    const scroll = (dir: 'left' | 'right') => {
        if (scrollRef.current) {
            const amount = dir === 'left' ? -300 : 300;
            scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (!isOpen) return;
        if (e.deltaY < -30) {
            if (!scrollTimeout.current) {
                scrollTimeout.current = window.setTimeout(() => {
                    setIsOpen(false);
                    scrollTimeout.current = null;
                }, 50);
            }
        }
    };

    const handleSendNote = () => {
        if (!task || !noteInput.trim()) return;
        onAddNote(task.id, noteInput);
        setNoteInput('');
    };

    if (!task) return null;

    const completedCount = task.subtasks?.filter((s) => s.isCompleted).length || 0;
    const requiredCount = task.subtasks?.filter((s) => s.isRequired).length || 0;
    const requiredCompleted = task.subtasks?.filter((s) => s.isRequired && s.isCompleted).length || 0;
    const totalCount = task.subtasks?.length || 0;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const canComplete = requiredCompleted === requiredCount && requiredCount > 0;
    
    // Dependency counts
    const upstreamTasks = allTasks.filter(t => t.links?.includes(task.id)); // Tasks that block this one
    const downstreamTasks = (task.links?.map(id => allTasks.find(t => t.id === id)).filter((t): t is Task => t !== undefined)) || []; // Tasks this blocks
    const hasDependencies = upstreamTasks.length > 0 || downstreamTasks.length > 0;
    
    // Header Health Status
    const isCritical = task.priority === 'Critical';
    const isUrgent = task.deadline && (new Date(task.deadline).getTime() - new Date().getTime()) < (2 * 86400000);
    const healthColor = isCritical ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-emerald-500';

    return (
        <>
            {/* Subtle backdrop - no blur, we'll blur cards individually */}
            <div 
                className={`fixed inset-0 bg-black/10 transition-opacity duration-500 z-30 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            <div 
                onWheel={handleWheel}
                className={`
                    fixed bottom-0 right-0 z-40 
                    bg-[var(--color-bg)] dark:bg-[var(--color-surface)] border-t-2 border-indigo-500/30 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.5)]
                    transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col
                    ${isOpen ? 'h-[650px] rounded-tl-[32px]' : 'h-14 cursor-pointer hover:bg-gray-100 dark:hover:bg-[var(--color-surface)] rounded-tl-none'}
                `}
                style={{ left: '80px' }} 
                onClick={() => !isOpen && setIsOpen(true)}
            >
                {/* --- HEADER --- */}
                <div className={`w-full h-14 flex items-center justify-between px-8 shrink-0 relative z-20 bg-[var(--color-surface)]/500 dark:bg-[var(--color-surface)]/50 backdrop-blur-sm border-b border-gray-200 dark:border-white/5 ${isOpen ? 'rounded-tl-[32px]' : ''}`}>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <TreeStructure weight="duotone" className="text-indigo-500" size={20} />
                            <span className="font-bold text-sm text-indigo-900 dark:text-indigo-200 tracking-wide font-['Montserrat'] uppercase">
                                Magic Flow
                            </span>
                        </div>
                        <div className="h-4 w-px bg-gray-300 dark:bg-white/10 mx-2"></div>
                        
                        {/* TAB SWITCHER */}
                        {isOpen && (
                            <div className="flex gap-1 bg-gray-100 dark:bg-black/20 p-1 rounded-lg">
                                <button 
                                    onClick={() => setActiveTab('workflow')}
                                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition ${
                                        activeTab === 'workflow' 
                                            ? 'bg-white dark:bg-white/10 text-indigo-600 shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Workflow {totalCount > 0 && `(${completedCount}/${totalCount})`}
                                </button>
                                {hasDependencies && (
                                    <button 
                                        onClick={() => setActiveTab('dependencies')}
                                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition ${
                                            activeTab === 'dependencies' 
                                                ? 'bg-white dark:bg-white/10 text-purple-600 shadow-sm' 
                                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        Dependencies ({upstreamTasks.length + downstreamTasks.length})
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {!isOpen && (
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold opacity-60">
                                    {task.title}
                                </span>
                                <div className="flex items-center gap-1.5 bg-black/5 dark:bg-[var(--color-surface)]/50 px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5" title={isCritical ? "Critical Status" : "Stable"}>
                                    <Pulse weight="fill" className={`${healthColor} ${isCritical ? 'animate-pulse' : ''}`} size={12} />
                                    <span className="text-[10px] font-mono opacity-60 uppercase">{isCritical ? 'CRIT' : isUrgent ? 'WARN' : 'GOOD'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {isOpen && activeTab === 'workflow' && (
                            <div className="flex gap-2 mr-4">
                                <button onClick={(e) => { e.stopPropagation(); scroll('left'); }} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"><CaretLeft weight="bold" /></button>
                                <button onClick={(e) => { e.stopPropagation(); scroll('right'); }} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition"><CaretRight weight="bold" /></button>
                            </div>
                        )}
                        <div className="text-xs font-bold uppercase tracking-widest opacity-40">
                            {isOpen ? <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}><CaretDown weight="bold" size={16} /></button> : <span className="flex items-center gap-2"><CaretUp weight="bold" /> Expand</span>}
                        </div>
                    </div>
                </div>

                {/* --- CONTENT --- */}
                <div className={`flex-1 overflow-hidden p-0 transition-opacity duration-300 relative flex ${isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}`}>
                    
                    {/* 1. STICKY MAIN CARD (Left) */}
                    <div className="w-[420px] shrink-0 border-r border-gray-200 dark:border-white/5 flex flex-col bg-white dark:bg-[var(--color-surface)] shadow-xl z-20">
                        {/* Purple Section (Details) */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shrink-0 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded tracking-wider">{task.priority} Priority</span>
                                    <button 
                                        onClick={() => onAddSubtask(task.id)}
                                        className="bg-white/20 hover:bg-white/30 text-white rounded-lg px-2 py-1 text-[10px] font-bold flex items-center gap-1 transition"
                                        title="Add New Step"
                                    >
                                        <Plus weight="bold" /> Add Step
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold font-['Montserrat'] leading-tight mb-2">{task.title}</h2>
                                <div className="flex gap-2 mt-4">
                                    {task.collaborators.map((c, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold ring-1 ring-white/30" title={c}>{c.charAt(0)}</div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Grey Section (Desc & Notes) */}
                        <div className="flex-1 bg-gray-50 dark:bg-[var(--color-surface)] flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-white/5 shrink-0 max-h-[150px] overflow-y-auto custom-scrollbar">
                                <h4 className="text-[10px] uppercase font-bold opacity-40 mb-2">Description</h4>
                                <p className="text-sm opacity-80 leading-relaxed whitespace-pre-wrap">{task.desc || "No description provided."}</p>
                            </div>
                            
                            <div className="flex-1 flex flex-col min-h-0">
                                <div className="p-4 pb-2 shrink-0 flex items-center gap-2 text-indigo-500 opacity-60">
                                    <Chats weight="bold" /> <span className="text-xs font-bold uppercase">Live Notes</span>
                                </div>
                                <div className="flex-1 overflow-y-auto px-4 space-y-3 custom-scrollbar">
                                    {(task.notes || []).length === 0 && <div className="text-center text-xs opacity-30 mt-4">No notes yet.</div>}
                                    {task.notes?.map(note => (
                                        <div key={note.id} className="bg-white dark:bg-[var(--color-surface)]/50 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{note.user}</span>
                                                <span className="text-[9px] opacity-40">{note.timestamp}</span>
                                            </div>
                                            <p className="text-xs opacity-80">{note.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[var(--color-surface)]">
                                    <div className="flex gap-2">
                                        <input 
                                            value={noteInput} 
                                            onChange={e => setNoteInput(e.target.value)} 
                                            onKeyDown={e => e.key === 'Enter' && handleSendNote()}
                                            placeholder="Add a note..." 
                                            className="flex-1 bg-gray-100 dark:bg-black/20 border-none rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 ring-indigo-500" 
                                        />
                                        <button onClick={handleSendNote} className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"><PaperPlaneRight weight="bold" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. SCROLLABLE FLOW (Right) */}
                    {activeTab === 'workflow' ? (
                        // WORKFLOW TAB - Existing subtasks flow
                        <div 
                            ref={scrollRef}
                            className="flex-1 flex flex-col overflow-x-auto overflow-y-hidden no-scrollbar pb-12 relative bg-gray-50/50 dark:bg-[#0b1121]"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                        <div className="flex items-center gap-8 min-w-max px-12 h-full pt-4">
                            
                            {/* Start Node */}
                            <div className="flex flex-col items-center justify-center opacity-40">
                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-400 dark:border-white/30 flex items-center justify-center mb-2 bg-gray-100 dark:bg-[var(--color-surface)]/50">
                                    <span className="text-[10px] font-bold">START</span>
                                </div>
                            </div>

                            <ArrowRight className="text-gray-300 /20" weight="bold" size={24} />

                            {task.subtasks?.map((sub: Subtask, idx: number) => {
                                const isNext = !sub.isCompleted && (idx === 0 || task.subtasks[idx-1].isCompleted);
                                
                                return (
                                    <div 
                                        key={sub.id} 
                                        ref={el => {
                                            if (el) nodesRef.current.set(sub.id, el);
                                        }}
                                        className="flex items-center gap-8 group/node relative"
                                    >
                                        <div className={`
                                            relative w-80 p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between h-56 shadow-sm hover:shadow-xl
                                            ${sub.isCompleted 
                                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/30 opacity-70 grayscale-[0.5] hover:grayscale-0' 
                                                : isNext 
                                                    ? 'bg-[var(--color-surface)] border-indigo-500 ring-4 ring-indigo-500/10 scale-105 z-10 shadow-2xl' 
                                                    : 'bg-[var(--color-surface)] border-gray-200 dark:border-white/10 opacity-90'}
                                        `}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold font-mono">
                                                        {idx + 1}
                                                    </div>
                                                    {sub.isRequired && <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 uppercase tracking-wide">Required</span>}
                                                </div>
                                                <button onClick={() => onToggleSubtask(task.id, sub.id)} className={`transition-colors ${sub.isCompleted ? 'text-emerald-500' : 'text-gray-300 hover:text-indigo-500'}`}>
                                                    {sub.isCompleted ? <CheckCircle size={28} weight="fill" /> : <Circle size={28} weight="bold" />}
                                                </button>
                                            </div>
                                            
                                            <div className="font-bold text-sm leading-snug mb-1">{sub.title}</div>
                                            <div className="text-xs opacity-60 mb-auto line-clamp-2">{sub.desc || "No description provided."}</div>

                                            <div className="mt-4 flex flex-col gap-2">
                                                {sub.isCompleted ? (
                                                    <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-1 rounded w-fit">
                                                        <CheckCircle weight="fill" /> 
                                                        Completed {sub.completedAt ? new Date(sub.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-[10px] text-blue-500 font-bold bg-blue-500/10 px-2 py-1 rounded w-fit">
                                                        <Clock weight="fill" /> 
                                                        Pending
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                                                {sub.assignee ? (
                                                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-[#1e293b]">{sub.assignee.charAt(0)}</div>
                                                        {sub.assignee}
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => onPickUpSubtask(task.id, sub.id)}
                                                        className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-indigo-500 bg-gray-100 dark:bg-[var(--color-surface)]/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition"
                                                    >
                                                        <UserPlus weight="bold" /> Pick Up
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {idx < (task.subtasks.length || 0) && (
                                            <ArrowRight className="text-gray-300 /20" weight="bold" size={24} />
                                        )}
                                    </div>
                                );
                            })}

                            {canComplete ? (
                                <div className="relative group/complete">
                                    <button 
                                        onClick={() => setShowCompleteMenu(!showCompleteMenu)}
                                        className="flex flex-col items-center justify-center transition-all duration-500 scale-110 animate-bounce-slow cursor-pointer"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-500/20 hover:scale-110 transition-transform">
                                            <Check weight="bold" size={32} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Finish Task</span>
                                    </button>
                                    
                                    {showCompleteMenu && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-[var(--color-surface)] rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 p-2 z-50 animate-fade-in-up">
                                            <div className="text-[10px] uppercase font-bold opacity-50 px-2 py-1 mb-1">Move to...</div>
                                            {['Review', 'Done'].map(col => (
                                                <button 
                                                    key={col} 
                                                    onClick={() => { onMoveTask(task.id, col); setIsOpen(false); }}
                                                    className="w-full text-left px-3 py-2 hover:bg-indigo-50 dark:hover:bg-[var(--color-surface)]/50 rounded-lg text-xs font-bold transition flex items-center justify-between group/item"
                                                >
                                                    {col} <ArrowRight className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center opacity-30">
                                    <div className="w-14 h-14 rounded-full border-4 border-double border-current flex items-center justify-center mb-2 bg-white dark:bg-[var(--color-surface)] shadow-lg">
                                        <ShieldCheck size={24} weight="fill" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Complete</span>
                                </div>
                            )}

                        </div>
                    </div>
                    ) : (
                        // DEPENDENCIES TAB - Show linked tasks
                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 dark:bg-[#0b1121]">
                            <div className="max-w-4xl mx-auto space-y-6">
                                {/* UPSTREAM - Tasks blocking this one */}
                                {upstreamTasks.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                                                <LinkIcon weight="bold" className="text-orange-600 dark:text-orange-400" size={16} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm">Blocked By ({upstreamTasks.length})</h3>
                                                <p className="text-[10px] opacity-60">These tasks must complete before this one can finish</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {upstreamTasks.map(upTask => {
                                                const isComplete = upTask.status === 'Done';
                                                return (
                                                    <div key={upTask.id} className={`p-4 rounded-xl border-2 ${isComplete ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/30' : 'bg-[var(--color-surface)] border-orange-200 dark:border-orange-500/20'}`}>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2">
                                                                {isComplete ? (
                                                                    <CheckCircle size={20} weight="fill" className="text-emerald-500" />
                                                                ) : (
                                                                    <Clock size={20} weight="fill" className="text-orange-500" />
                                                                )}
                                                                <div>
                                                                    <div className="font-bold text-sm">{upTask.title}</div>
                                                                    <div className="text-[10px] opacity-60">{upTask.status}</div>
                                                                </div>
                                                            </div>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${upTask.priority === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                                                {upTask.priority}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs opacity-70 leading-relaxed">{upTask.desc || 'No description'}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* DOWNSTREAM - Tasks this blocks */}
                                {downstreamTasks.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                                                <ShareNetwork weight="bold" className="text-purple-600 dark:text-purple-400" size={16} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm">Blocking ({downstreamTasks.length})</h3>
                                                <p className="text-[10px] opacity-60">These tasks are waiting for this one to complete</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {downstreamTasks.map((downTask: Task) => {
                                                const isBlocked = task.status !== 'Done';
                                                return (
                                                    <div key={downTask.id} className={`p-4 rounded-xl border-2 ${isBlocked ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-500/20' : 'bg-[var(--color-surface)] border-gray-200 dark:border-white/10'}`}>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2">
                                                                {isBlocked ? (
                                                                    <Clock size={20} weight="fill" className="text-purple-500" />
                                                                ) : (
                                                                    <CheckCircle size={20} weight="fill" className="text-emerald-500" />
                                                                )}
                                                                <div>
                                                                    <div className="font-bold text-sm">{downTask.title}</div>
                                                                    <div className="text-[10px] opacity-60">{downTask.status}</div>
                                                                </div>
                                                            </div>
                                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${downTask.priority === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                                                {downTask.priority}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs opacity-70 leading-relaxed">{downTask.desc || 'No description'}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {upstreamTasks.length === 0 && downstreamTasks.length === 0 && (
                                    <div className="text-center py-12 opacity-50">
                                        <ShareNetwork size={48} weight="duotone" className="mx-auto mb-3 opacity-30" />
                                        <p className="text-sm font-bold">No Dependencies</p>
                                        <p className="text-xs mt-1">This task has no upstream or downstream links</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- FOOTER --- */}
                    <div className="absolute bottom-0 right-0 left-[420px] bg-white/80 dark:bg-[var(--color-surface)]/90 backdrop-blur-md border-t border-gray-200 dark:border-white/10 px-8 py-3 flex justify-between items-center text-xs opacity-70 z-30">
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <User weight="bold" className="text-indigo-500" />
                                <span>Creator: <strong>{task.creator || 'System'}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <UsersThree weight="bold" className="text-blue-500" />
                                <span>Collaborators: <strong>{task.collaborators?.join(', ') || 'None'}</strong></span>
                            </div>
                        </div>
                        
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <Clock weight="bold" />
                                <span>Created: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            {task.completedAt && (
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                                    <CheckCircle weight="fill" />
                                    <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}