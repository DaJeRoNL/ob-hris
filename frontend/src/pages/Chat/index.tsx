import { useState } from 'react';
import { 
    SlackLogo, MicrosoftTeamsLogo, Envelope, 
    Lightning, CheckCircle, X, 
    ArrowRight, Robot, 
    CalendarPlus, Receipt, Hash, ArrowSquareOut,
    User, ChatCircleDots, Clock, Phone,
    PlugsConnected, Gear, Users,
    MagicWand, PaperPlaneRight, Tag, Money,
    ListChecks, Kanban, Warning, Check, UserPlus,
    DotsThree
} from '@phosphor-icons/react';

// --- TYPES ---
interface StreamMessage {
    id: number;
    source: string;
    user: string;
    text: string;
    time: string;
    intent: string;
    priority: string;
    aiAnalysis: string;
    resolved?: boolean; // Optional property for UI state
}

interface Task {
    id: string;
    title: string;
    assignee: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority: string;
}

// --- MOCK DATA ---
const INITIAL_STREAM: StreamMessage[] = [
    { 
        id: 1, source: 'slack', user: 'Marcus (Dev)', 
        text: 'Hey, I woke up feeling terrible. Not gonna make standup, taking a sick day.', 
        time: '5m ago', intent: 'leave_request', priority: 'high',
        aiAnalysis: 'Intent: Sick Leave. Confidence: 92%.',
    },
    { 
        id: 2, source: 'email', user: 'Vendor: AWS', 
        text: 'Invoice #9921 is overdue. Amount: $4,200. Please process immediately.', 
        time: '32m ago', intent: 'invoice', priority: 'critical',
        aiAnalysis: 'Intent: Invoice Payment. Entity: AWS.',
    },
    { 
        id: 3, source: 'teams', user: 'Sarah (HR)', 
        text: 'Can someone review the offer letter for Alex? It needs approval before 2pm.', 
        time: '1h ago', intent: 'review', priority: 'medium',
        aiAnalysis: 'Action: Document Review. Deadline: 2:00 PM.',
    },
];

const INITIAL_TASKS: Task[] = [
    { id: 't1', title: 'Process AWS Invoice', assignee: 'Finance', status: 'To Do', priority: 'Critical' },
    { id: 't2', title: 'Onboard Alex M.', assignee: 'HR Team', status: 'In Progress', priority: 'High' },
];

export default function CommLink() {
    const [activeTab, setActiveTab] = useState<'stream' | 'tasks' | 'team'>('stream');
    const [stream, setStream] = useState<StreamMessage[]>(INITIAL_STREAM);
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [selectedMsg, setSelectedMsg] = useState<StreamMessage | null>(null);
    const [replyText, setReplyText] = useState('');

    // --- ACTIONS ---
    const convertToTask = (msg: StreamMessage) => {
        const newTask: Task = {
            id: `t-${Date.now()}`,
            title: `Resolve: ${msg.intent} from ${msg.user}`,
            assignee: 'Unassigned',
            status: 'To Do',
            priority: msg.priority === 'critical' ? 'Critical' : 'Normal'
        };
        setTasks([newTask, ...tasks]);
        setStream(prev => prev.map(m => m.id === msg.id ? { ...m, resolved: true } : m));
        setSelectedMsg(null);
        alert('Ticket Created & Added to Task Board');
    };

    const handleAssign = (taskId: string, person: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assignee: person } : t));
    };

    return (
        <div className="p-6 md:p-8 text-[var(--text-main)] animate-fade-in h-full flex flex-col max-w-[1600px] mx-auto relative">
            
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-black font-['Montserrat'] tracking-tight flex items-center gap-3">
                        CommLink
                        <span className="text-xs bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-full border border-indigo-500/20 font-bold uppercase tracking-widest flex items-center gap-1">
                            <ListChecks weight="fill" /> Operations
                        </span>
                    </h1>
                    <p className="text-sm opacity-70 font-medium max-w-2xl mt-2 leading-relaxed">
                        The bridge between communication and execution. Convert noise into tasks.
                    </p>
                </div>
                
                <div className="flex bg-gray-200 dark:bg-white/5 p-1 rounded-xl shrink-0">
                    <button onClick={() => setActiveTab('stream')} className={`px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${activeTab === 'stream' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-indigo-600' : 'opacity-60 hover:opacity-100'}`}>
                        <ChatCircleDots weight="bold" /> Stream
                    </button>
                    <button onClick={() => setActiveTab('tasks')} className={`px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${activeTab === 'tasks' ? 'bg-white dark:bg-[#1e293b] shadow-sm text-indigo-600' : 'opacity-60 hover:opacity-100'}`}>
                        <Kanban weight="bold" /> Tasks <span className="bg-indigo-500 text-white px-1.5 rounded-full text-[9px]">{tasks.length}</span>
                    </button>
                </div>
            </header>

            {/* STREAM VIEW */}
            {activeTab === 'stream' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                    <div className={`flex flex-col gap-4 transition-all duration-500 ${selectedMsg ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                        <div className="glass-card flex-1 flex flex-col p-0 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center">
                                <span className="text-xs font-bold opacity-60">Incoming Signals</span>
                                <div className="flex gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase opacity-50">Listening</span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                                {stream.map(msg => (
                                    <div 
                                        key={msg.id} 
                                        onClick={() => setSelectedMsg(msg)}
                                        className={`
                                            group p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden
                                            ${selectedMsg?.id === msg.id ? 'bg-indigo-50/80 dark:bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white dark:bg-[#1e293b] border-gray-200 dark:border-white/5 hover:border-indigo-300'}
                                            ${msg.resolved ? 'opacity-60 grayscale' : ''}
                                        `}
                                    >
                                        <div className="flex gap-4">
                                            <div className="mt-1">
                                                {msg.source === 'slack' && <SlackLogo size={20} className="text-[#E01E5A]" weight="fill" />}
                                                {msg.source === 'email' && <Envelope size={20} className="text-blue-500" weight="fill" />}
                                                {msg.source === 'teams' && <MicrosoftTeamsLogo size={20} className="text-[#6264A7]" weight="fill" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-bold text-sm">{msg.user}</span>
                                                    <span className="text-[10px] opacity-50 font-mono">{msg.time}</span>
                                                </div>
                                                <p className="text-xs opacity-80 line-clamp-2">{msg.text}</p>
                                                {msg.priority === 'critical' && <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded"><Warning weight="fill" /> Critical</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {selectedMsg && (
                        <div className="lg:col-span-5 flex flex-col h-full animate-fade-in-right">
                            <div className="glass-card h-full flex flex-col p-0 overflow-hidden border-indigo-500/20 shadow-2xl">
                                <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shrink-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-indigo-200 text-xs font-bold uppercase tracking-widest">
                                                <Robot weight="fill" /> Context Engine
                                            </div>
                                            <h2 className="text-lg font-bold leading-tight">{selectedMsg.aiAnalysis}</h2>
                                        </div>
                                        <button onClick={() => setSelectedMsg(null)} className="p-1 hover:bg-white/20 rounded-full"><X size={20} /></button>
                                    </div>
                                </div>
                                
                                <div className="flex-1 p-6 bg-gray-50 dark:bg-[#0f172a]/50 flex flex-col">
                                    <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-white/5 mb-6">
                                        <div className="text-[10px] uppercase font-bold opacity-40 mb-2">Original Text</div>
                                        <p className="text-sm italic opacity-80">"{selectedMsg.text}"</p>
                                    </div>

                                    {!selectedMsg.resolved ? (
                                        <div className="space-y-3">
                                            <button 
                                                onClick={() => convertToTask(selectedMsg)}
                                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
                                            >
                                                <ListChecks weight="bold" /> Convert to Task
                                            </button>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button className="py-3 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-xs hover:bg-gray-100 dark:hover:bg-white/5">
                                                    Ignore
                                                </button>
                                                <button className="py-3 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-xs hover:bg-gray-100 dark:hover:bg-white/5">
                                                    Snooze 1h
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 opacity-50">
                                            <CheckCircle size={48} className="mx-auto mb-2 text-emerald-500" weight="fill" />
                                            <div className="font-bold">Ticket Resolved</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TASKS VIEW */}
            {activeTab === 'tasks' && (
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['To Do', 'In Progress', 'Done'].map(status => (
                            <div key={status} className="flex flex-col gap-4">
                                <h3 className="font-bold text-sm uppercase opacity-50 tracking-widest pl-2 border-b border-gray-200 dark:border-white/10 pb-2">{status}</h3>
                                {tasks.filter(t => t.status === status).map(task => (
                                    <div key={task.id} className="glass-card p-4 hover:border-indigo-500/30 transition group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${task.priority === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                {task.priority}
                                            </span>
                                            <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-indigo-500 transition"><DotsThree size={20} weight="bold" /></button>
                                        </div>
                                        <h4 className="font-bold text-sm mb-3">{task.title}</h4>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                                                    {task.assignee.charAt(0)}
                                                </div>
                                                <span className="text-xs opacity-60">{task.assignee}</span>
                                            </div>
                                            {task.assignee === 'Unassigned' && (
                                                <button onClick={() => handleAssign(task.id, 'Me')} className="text-[10px] font-bold text-indigo-500 hover:underline">
                                                    Take It
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {tasks.filter(t => t.status === status).length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-xl flex items-center justify-center text-xs opacity-30 font-bold uppercase">Empty</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
