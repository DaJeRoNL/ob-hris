// frontend/upgrade_pages.cjs
const fs = require('fs');
const path = require('path');

const ensureDir = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) return true;
    ensureDir(dirname);
    fs.mkdirSync(dirname);
};

const write = (relPath, content) => {
    const absPath = path.join(__dirname, relPath);
    ensureDir(absPath);
    fs.writeFileSync(absPath, content);
    console.log(`✅ Updated: ${relPath}`);
};

console.log("🚀 Starting System Upgrade...");

// ============================================================================
// SHARED TYPES
// ============================================================================
const SHARED_TYPES = `
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
}
`;

// ============================================================================
// 1. EDIT TASK MODAL
// ============================================================================
const EDIT_TASK_MODAL = `import { useState, useEffect } from 'react';
import { 
    X, Plus, Trash, CalendarBlank, CheckSquare, Square, 
    CaretUp, CaretDown, TextT 
} from '@phosphor-icons/react';

${SHARED_TYPES}

interface Props {
    task?: Task | null;
    onClose: () => void;
    onSave: (task: Task) => void;
}

const PRESET_TAGS = ['Backend', 'Frontend', 'Design', 'Bug', 'Urgent', 'Feature', 'Ops'];

export default function EditTaskModal({ task, onClose, onSave }: Props) {
    const [form, setForm] = useState<Task>({
        id: \`t-\${Date.now()}\`,
        title: '',
        desc: '',
        assignee: null,
        priority: 'Medium',
        status: 'New Tickets',
        tags: [],
        subtasks: [],
        notes: [],
        collaborators: [],
        deadline: '',
        creator: 'Me',
        createdAt: new Date().toISOString()
    });

    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [newSubtaskDesc, setNewSubtaskDesc] = useState('');
    const [showSubtaskDescInput, setShowSubtaskDescInput] = useState(false);
    
    const [tagInput, setTagInput] = useState('');
    const [showTagMenu, setShowTagMenu] = useState(false);

    useEffect(() => {
        if (task) setForm(task);
    }, [task]);

    const handleSave = () => {
        if (!form.title) return alert('Title required');
        onSave(form);
        onClose();
    };

    const addSubtask = () => {
        if (!newSubtaskTitle.trim()) return;
        setForm(prev => ({
            ...prev,
            subtasks: [
                ...prev.subtasks, 
                { 
                    id: \`s-\${Date.now()}\`, 
                    title: newSubtaskTitle, 
                    desc: newSubtaskDesc,
                    isCompleted: false, 
                    isRequired: true 
                }
            ]
        }));
        setNewSubtaskTitle('');
        setNewSubtaskDesc('');
        setShowSubtaskDescInput(false);
    };

    const moveSubtask = (index: number, direction: 'up' | 'down') => {
        const newSubtasks = [...form.subtasks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newSubtasks.length) {
            const temp = newSubtasks[index];
            newSubtasks[index] = newSubtasks[targetIndex];
            newSubtasks[targetIndex] = temp;
            setForm(prev => ({ ...prev, subtasks: newSubtasks }));
        }
    };

    const removeSubtask = (id: string) => {
        setForm(prev => ({ ...prev, subtasks: prev.subtasks.filter(s => s.id !== id) }));
    };

    const updateSubtask = (id: string, field: string, value: any) => {
        setForm(prev => ({ ...prev, subtasks: prev.subtasks.map(s => s.id === id ? { ...s, [field]: value } : s) }));
    };

    const toggleTag = (tag: string) => {
        setForm(prev => {
            const exists = prev.tags.includes(tag);
            return {
                ...prev,
                tags: exists ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
            };
        });
    };

    const addCustomTag = () => {
        if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
            toggleTag(tagInput.trim());
            setTagInput('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <h2 className="text-lg font-bold font-['Montserrat']">{task ? 'Edit Task' : 'New Ticket'}</h2>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    <div>
                        <label className="text-xs font-bold uppercase opacity-60 mb-1 block">Title</label>
                        <input className="w-full bg-transparent border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2 font-bold outline-none focus:border-indigo-500" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Task Title" />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold uppercase opacity-60 mb-1 block">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {form.tags.map(tag => (
                                <span key={tag} className="bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                    {tag}
                                    <button onClick={() => toggleTag(tag)} className="hover:text-red-500"><X weight="bold" /></button>
                                </span>
                            ))}
                            <button onClick={() => setShowTagMenu(!showTagMenu)} className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition">
                                <Plus weight="bold" /> Add Tag
                            </button>
                        </div>
                        
                        {showTagMenu && (
                            <div className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-xl p-3 shadow-lg mb-4 animate-fade-in-down">
                                <div className="flex gap-2 mb-2">
                                    <input 
                                        className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs outline-none" 
                                        placeholder="Custom tag..." 
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addCustomTag()}
                                    />
                                    <button onClick={addCustomTag} className="p-1 bg-indigo-500 text-white rounded-lg"><Plus /></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {PRESET_TAGS.map(t => (
                                        <button 
                                            key={t} 
                                            onClick={() => toggleTag(t)}
                                            className={\`text-[10px] font-bold px-2 py-1 rounded border transition \${form.tags.includes(t) ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-transparent border-gray-200 dark:border-white/10 hover:border-indigo-500 text-gray-500'}\`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase opacity-60 mb-1 block">Priority</label>
                            <select className="w-full bg-transparent border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2 outline-none focus:border-indigo-500" value={form.priority} onChange={e => setForm({...form, priority: e.target.value as any})}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase opacity-60 mb-1 block">Deadline</label>
                            <div className="relative">
                                <input type="date" className="w-full bg-transparent border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2 outline-none focus:border-indigo-500" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
                                <CalendarBlank className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase opacity-60 mb-1 block">Description</label>
                        <textarea className="w-full bg-transparent border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 h-20 resize-none" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder="Main task details..." />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase opacity-60 mb-2 block">Subtasks (Workflow)</label>
                        
                        <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-dashed border-gray-300 dark:border-white/10 mb-3">
                            <div className="flex gap-2 mb-2">
                                <input 
                                    className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none" 
                                    placeholder="New subtask title..." 
                                    value={newSubtaskTitle}
                                    onChange={e => setNewSubtaskTitle(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addSubtask()}
                                />
                                <button onClick={() => setShowSubtaskDescInput(!showSubtaskDescInput)} className={\`p-2 rounded-lg transition \${showSubtaskDescInput ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-white/10'}\`} title="Add Description"><TextT weight="bold" /></button>
                                <button onClick={addSubtask} className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"><Plus weight="bold" /></button>
                            </div>
                            {showSubtaskDescInput && (
                                <input 
                                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none animate-fade-in" 
                                    placeholder="Optional short description..." 
                                    value={newSubtaskDesc}
                                    onChange={e => setNewSubtaskDesc(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addSubtask()}
                                />
                            )}
                        </div>

                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                            {form.subtasks.map((s, idx) => (
                                <div key={s.id} className="flex flex-col gap-1 p-2 border border-gray-100 dark:border-white/5 rounded-lg group bg-white dark:bg-[#1e293b]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => moveSubtask(idx, 'up')} disabled={idx === 0} className="hover:text-indigo-500 disabled:opacity-30"><CaretUp size={12} weight="bold" /></button>
                                            <button onClick={() => moveSubtask(idx, 'down')} disabled={idx === form.subtasks.length - 1} className="hover:text-indigo-500 disabled:opacity-30"><CaretDown size={12} weight="bold" /></button>
                                        </div>
                                        
                                        <button onClick={() => updateSubtask(s.id, 'isRequired', !s.isRequired)} className={s.isRequired ? "text-red-500" : "text-gray-400"} title="Toggle Required">
                                            {s.isRequired ? <CheckSquare weight="fill" /> : <Square />}
                                        </button>
                                        
                                        <div className="flex-1">
                                            <div className={\`text-sm \${s.isRequired ? 'font-bold' : ''}\`}>{s.title}</div>
                                            {s.desc && <div className="text-[10px] opacity-60">{s.desc}</div>}
                                        </div>
                                        
                                        <button onClick={() => removeSubtask(s.id)} className="opacity-0 group-hover:opacity-100 text-red-400 transition hover:bg-red-500/10 p-1 rounded"><Trash /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50/50 dark:bg-black/20">
                    <button onClick={onClose} className="px-6 py-2 rounded-xl font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg">Save Task</button>
                </div>
            </div>
        </div>
    );
}
`;

// ============================================================================
// 2. TASK FLOW PANEL
// ============================================================================
const TASK_FLOW_PANEL = `import { useState, useRef, useEffect } from 'react';
import { 
    CheckCircle, Circle, CaretUp, CaretDown, 
    ArrowRight, ArrowDown, TreeStructure, CaretLeft, CaretRight, 
    UserPlus, ShieldCheck, CalendarCheck, User, Clock, 
    UsersThree, Plus, PaperPlaneRight, Chats, Check, Fire, Pulse
} from '@phosphor-icons/react';

${SHARED_TYPES}

interface Props {
    task: Task | null;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
    onPickUpSubtask: (taskId: string, subtaskId: string) => void;
    onAddSubtask: (taskId: string) => void;
    onAddNote: (taskId: string, text: string) => void;
    onMoveTask: (taskId: string, column: string) => void;
}

export default function TaskFlowPanel({ task, isOpen, setIsOpen, onToggleSubtask, onPickUpSubtask, onAddSubtask, onAddNote, onMoveTask }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const [noteInput, setNoteInput] = useState('');
    const [showCompleteMenu, setShowCompleteMenu] = useState(false);
    const scrollTimeout = useRef<number | null>(null);

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
    
    // Header Health Status
    const isCritical = task.priority === 'Critical';
    const isUrgent = task.deadline && (new Date(task.deadline).getTime() - new Date().getTime()) < (2 * 86400000);
    const healthColor = isCritical ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-emerald-500';

    return (
        <>
            <div 
                className={\`fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-500 z-30 \${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}\`}
                onClick={() => setIsOpen(false)}
            />

            <div 
                onWheel={handleWheel}
                className={\`
                    fixed bottom-0 right-0 z-40 
                    bg-[#f8fafc] dark:bg-[#0f172a] border-t-2 border-indigo-500/30 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.5)]
                    transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col
                    \${isOpen ? 'h-[650px] rounded-tl-[32px]' : 'h-14 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1e293b] rounded-tl-none'}
                \`}
                style={{ left: '80px' }} 
                onClick={() => !isOpen && setIsOpen(true)}
            >
                {/* --- HEADER --- */}
                <div className={\`w-full h-14 flex items-center justify-between px-8 shrink-0 relative z-20 bg-white/50 dark:bg-white/5 backdrop-blur-sm border-b border-gray-200 dark:border-white/5 \${isOpen ? 'rounded-tl-[32px]' : ''}\`}>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <TreeStructure weight="duotone" className="text-indigo-500" size={20} />
                            <span className="font-bold text-sm text-indigo-900 dark:text-indigo-200 tracking-wide font-['Montserrat'] uppercase">
                                Magic Flow
                            </span>
                        </div>
                        <div className="h-4 w-px bg-gray-300 dark:bg-white/10 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold opacity-60">
                                {task.title}
                            </span>
                            <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5" title={isCritical ? "Critical Status" : "Stable"}>
                                <Pulse weight="fill" className={\`\${healthColor} \${isCritical ? 'animate-pulse' : ''}\`} size={12} />
                                <span className="text-[10px] font-mono opacity-60 uppercase">{isCritical ? 'CRIT' : isUrgent ? 'WARN' : 'GOOD'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {isOpen && (
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
                <div className={\`flex-1 overflow-hidden p-0 transition-opacity duration-300 relative flex \${isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}\`}>
                    
                    {/* 1. STICKY MAIN CARD (Left) */}
                    <div className="w-[420px] shrink-0 border-r border-gray-200 dark:border-white/5 flex flex-col bg-white dark:bg-[#111827] shadow-xl z-20">
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
                        <div className="flex-1 bg-gray-50 dark:bg-[#0f172a] flex flex-col overflow-hidden">
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
                                        <div key={note.id} className="bg-white dark:bg-white/5 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{note.user}</span>
                                                <span className="text-[9px] opacity-40">{note.timestamp}</span>
                                            </div>
                                            <p className="text-xs opacity-80">{note.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#111827]">
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
                    <div 
                        ref={scrollRef}
                        className="flex-1 flex flex-col overflow-x-auto overflow-y-hidden no-scrollbar pb-12 relative bg-gray-50/50 dark:bg-[#0b1121]"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div className="flex items-center gap-8 min-w-max px-12 h-full pt-4">
                            
                            {/* Start Node */}
                            <div className="flex flex-col items-center justify-center opacity-40">
                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-400 dark:border-white/30 flex items-center justify-center mb-2 bg-gray-100 dark:bg-white/5">
                                    <span className="text-[10px] font-bold">START</span>
                                </div>
                            </div>

                            <ArrowRight className="text-gray-300 dark:text-white/20" weight="bold" size={24} />

                            {task.subtasks?.map((sub: Subtask, idx: number) => {
                                const isNext = !sub.isCompleted && (idx === 0 || task.subtasks[idx-1].isCompleted);
                                
                                return (
                                    <div 
                                        key={sub.id} 
                                        // @ts-ignore
                                        ref={el => nodesRef.current.set(sub.id, el)}
                                        className="flex items-center gap-8 group/node relative"
                                    >
                                        <div className={\`
                                            relative w-80 p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between h-56 shadow-sm hover:shadow-xl
                                            \${sub.isCompleted 
                                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/30 opacity-70 grayscale-[0.5] hover:grayscale-0' 
                                                : isNext 
                                                    ? 'bg-white dark:bg-[#1e293b] border-indigo-500 ring-4 ring-indigo-500/10 scale-105 z-10 shadow-2xl' 
                                                    : 'bg-white dark:bg-[#1e293b] border-gray-200 dark:border-white/10 opacity-90'}
                                        \`}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold font-mono">
                                                        {idx + 1}
                                                    </div>
                                                    {sub.isRequired && <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 uppercase tracking-wide">Required</span>}
                                                </div>
                                                <button onClick={() => onToggleSubtask(task.id, sub.id)} className={\`transition-colors \${sub.isCompleted ? 'text-emerald-500' : 'text-gray-300 hover:text-indigo-500'}\`}>
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
                                                        className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-indigo-500 bg-gray-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition"
                                                    >
                                                        <UserPlus weight="bold" /> Pick Up
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {idx < (task.subtasks.length || 0) && (
                                            <ArrowRight className="text-gray-300 dark:text-white/20" weight="bold" size={24} />
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
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 p-2 z-50 animate-fade-in-up">
                                            <div className="text-[10px] uppercase font-bold opacity-50 px-2 py-1 mb-1">Move to...</div>
                                            {['Review', 'Done'].map(col => (
                                                <button 
                                                    key={col} 
                                                    onClick={() => { onMoveTask(task.id, col); setIsOpen(false); }}
                                                    className="w-full text-left px-3 py-2 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-lg text-xs font-bold transition flex items-center justify-between group/item"
                                                >
                                                    {col} <ArrowRight className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center opacity-30">
                                    <div className="w-14 h-14 rounded-full border-4 border-double border-current flex items-center justify-center mb-2 bg-white dark:bg-[#0f172a] shadow-lg">
                                        <ShieldCheck size={24} weight="fill" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Complete</span>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* --- FOOTER --- */}
                    <div className="absolute bottom-0 right-0 left-[420px] bg-white/80 dark:bg-[#0f172a]/90 backdrop-blur-md border-t border-gray-200 dark:border-white/10 px-8 py-3 flex justify-between items-center text-xs opacity-70 z-30">
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
`;

// ============================================================================
// 3. TASK BOARD
// ============================================================================
const TASKBOARD_PAGE = `import { useState, useMemo, useRef, useEffect } from 'react';
import { 
    Plus, Kanban, List, MagnifyingGlass, 
    DotsThree, UserPlus, Fire, FlowArrow, 
    PencilSimple, CaretLeft, CaretRight, X, LockKey, Pencil, CheckCircle, Archive, SortAscending,
    CalendarBlank
} from '@phosphor-icons/react';
import TaskFlowPanel from './components/TaskFlowPanel';
import EditTaskModal from './components/EditTaskModal';

${SHARED_TYPES}

const INITIAL_TASKS: Task[] = [
    { 
        id: 't-1', title: 'Migrate Legacy Auth', desc: 'Switch from v1 tokens to JWT.', 
        assignee: null, collaborators: [], priority: 'High', status: 'New Tickets', tags: ['Backend', 'Security'],
        deadline: '2024-11-30', creator: 'Admin', createdAt: '2024-10-01',
        subtasks: [
            { id: 's1', title: 'Audit current token usage', desc: 'Check all API endpoints.', isCompleted: true, isRequired: true, completedAt: '2024-10-02T10:00:00' },
            { id: 's2', title: 'Implement JWT Provider', desc: 'Use standard library.', isCompleted: false, isRequired: true },
            { id: 's3', title: 'Update Frontend Interceptors', isCompleted: false, isRequired: false }
        ],
        notes: [{ id: 'n1', user: 'Admin', text: 'Should we use Auth0?', timestamp: '10:00 AM' }]
    },
    { 
        id: 't-2', title: 'Q4 Financial Report', desc: 'Compile revenue sheets.', 
        assignee: 'Finance Bot', collaborators: ['Finance Bot'], priority: 'Medium', status: 'In Progress', tags: ['Finance'],
        creator: 'CFO', createdAt: '2024-10-05',
        subtasks: [
            { id: 's1', title: 'Pull Stripe Data', isCompleted: true, assignee: 'Finance Bot', completedAt: '2024-10-05T14:00:00' },
            { id: 's2', title: 'Reconcile Expenses', isCompleted: true, assignee: 'Finance Bot', completedAt: '2024-10-05T16:30:00' }
        ]
    },
    { 
        id: 't-3', title: 'Deploy to Production', desc: 'Release v2.4 to main cluster.', 
        assignee: 'DevOps Lead', collaborators: ['DevOps Lead'], priority: 'Critical', status: 'Ready', tags: ['Ops', 'Deploy'],
        creator: 'CTO', createdAt: '2024-10-08',
        subtasks: [
            { id: 's1', title: 'Run Integration Tests', isCompleted: true, isRequired: true, completedAt: '2024-10-08T09:00:00' },
            { id: 's2', title: 'Backup Database', isCompleted: false, isRequired: true },
            { id: 's3', title: 'Switch Traffic', isCompleted: false, isRequired: true }
        ]
    },
    { 
        id: 't-4', title: 'Update Landing Page', desc: 'Refresh hero image and copy.', 
        assignee: null, collaborators: [], priority: 'Low', status: 'New Tickets', tags: ['Design', 'Marketing'],
        creator: 'Marketing Lead', createdAt: '2024-10-10',
        subtasks: [
            { id: 's1', title: 'Design Mockup', isCompleted: false, isRequired: true },
            { id: 's2', title: 'Copy Review', isCompleted: false, isRequired: false }
        ]
    },
    { 
        id: 't-5', title: 'Fix Mobile Nav Bug', desc: 'Menu overlaps logo on iPhone SE.', 
        assignee: 'Frontend Dev', collaborators: ['Frontend Dev'], priority: 'High', status: 'Review', tags: ['Bug', 'Frontend'],
        creator: 'QA', createdAt: '2024-10-06',
        subtasks: [
            { id: 's1', title: 'Reproduce Issue', isCompleted: true, isRequired: true, completedAt: '2024-10-06T11:00:00' },
            { id: 's2', title: 'Fix CSS z-index', isCompleted: true, isRequired: true, completedAt: '2024-10-07T14:00:00' }
        ]
    },
    { 
        id: 't-6', title: 'Onboard New Sales Rep', desc: 'Setup CRM account and email.', 
        assignee: 'HR', collaborators: ['HR'], priority: 'Medium', status: 'Done', tags: ['HR', 'Onboarding'],
        creator: 'Sales Manager', createdAt: '2024-09-25', completedAt: '2024-09-28T16:00:00',
        subtasks: [
            { id: 's1', title: 'Create Accounts', isCompleted: true, isRequired: true, completedAt: '2024-09-26T10:00:00' },
            { id: 's2', title: 'Send Welcome Email', isCompleted: true, isRequired: true, completedAt: '2024-09-28T15:00:00' }
        ]
    },
    {
        id: 't-7', title: 'API Documentation', desc: 'Update Swagger docs for v2 endpoints.',
        assignee: null, collaborators: [], priority: 'Medium', status: 'Ready', tags: ['Backend', 'Docs'],
        deadline: new Date().toISOString().split('T')[0], // Today
        creator: 'Lead Dev', createdAt: '2024-10-15',
        subtasks: []
    }
];

const PROTECTED_COLUMNS = ['New Tickets', 'Review', 'Done'];

export default function TaskBoard() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [columns, setColumns] = useState(['New Tickets', 'Ready', 'In Progress', 'Review', 'Done']);
    const [filter, setFilter] = useState('');
    const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
    const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'newest'>('priority');
    const [isAdmin] = useState(true); 
    
    // UI States
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isFlowOpen, setIsFlowOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [dragOverCol, setDragOverCol] = useState<string | null>(null); 
    
    // Sort Menu State
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const sortTimeoutRef = useRef<number | null>(null);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            checkScroll(); 
            return () => el.removeEventListener('scroll', checkScroll);
        }
    }, [tasks, columns]);

    const scrollBoard = (dir: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const amount = dir === 'left' ? -400 : 400;
            scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    // Sort Handlers
    const handleSortEnter = () => {
        if (sortTimeoutRef.current) clearTimeout(sortTimeoutRef.current);
        setIsSortMenuOpen(true);
    };

    const handleSortLeave = () => {
        sortTimeoutRef.current = window.setTimeout(() => {
            setIsSortMenuOpen(false);
        }, 400); // 0.4s delay
    };

    // Drag & Drop
    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedTaskId(id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnter = (col: string) => {
        setDragOverCol(col);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, targetCol: string) => {
        e.preventDefault();
        setDragOverCol(null);
        if (!draggedTaskId) return;

        const task = tasks.find(t => t.id === draggedTaskId);
        if (!task) return;

        // Gatekeeper
        if (targetCol === 'Review' || targetCol === 'Done') {
            const incompleteRequired = task.subtasks.some(s => s.isRequired && !s.isCompleted);
            if (incompleteRequired) {
                alert(\`Cannot move to \${targetCol}: Please complete all REQUIRED subtasks first.\`);
                setDraggedTaskId(null);
                return;
            }
        }

        const isDone = targetCol === 'Done';
        const updatedTask = { 
            ...task, 
            status: targetCol as any,
            completedAt: isDone ? new Date().toISOString() : undefined 
        };

        setTasks(prev => prev.map(t => t.id === draggedTaskId ? updatedTask : t));
        setDraggedTaskId(null);
    };

    const handleAddColumn = () => {
        const name = prompt("Enter new column name:");
        if (name && !columns.includes(name)) {
            const newCols = [...columns];
            const reviewIdx = newCols.indexOf('Review');
            newCols.splice(reviewIdx, 0, name);
            setColumns(newCols);
        }
    };

    const moveColumn = (index: number, direction: 'left' | 'right') => {
        const newCols = [...columns];
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        
        // Safety range: >0 (New Tickets) and < length-2 (Review/Done)
        if (targetIndex < 1 || targetIndex > columns.length - 3) return;

        const temp = newCols[index];
        newCols[index] = newCols[targetIndex];
        newCols[targetIndex] = temp;
        setColumns(newCols);
    };

    const handleDeleteColumn = (col: string) => {
        if (confirm(\`Delete column "\${col}"? Tasks will be moved to New Tickets.\`)) {
            setTasks(prev => prev.map(t => t.status === col ? { ...t, status: 'New Tickets' as any } : t));
            setColumns(prev => prev.filter(c => c !== col));
        }
    };

    const handlePickUp = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setTasks(prev => prev.map(t => t.id === id ? { ...t, assignee: 'Me', status: 'In Progress', collaborators: [...new Set([...t.collaborators, 'Me'])] } : t));
    };

    const handlePickUpSubtask = (taskId: string, subtaskId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) return t;
            const updatedSubtasks = t.subtasks.map(s => s.id === subtaskId ? { ...s, assignee: 'Me' } : s);
            const newCollaborators = [...new Set([...t.collaborators, 'Me'])];
            const updatedTask = { ...t, subtasks: updatedSubtasks, collaborators: newCollaborators };
            if (selectedTask?.id === taskId) setSelectedTask(updatedTask);
            return updatedTask;
        }));
    };

    const toggleSubtask = (taskId: string, subtaskId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) return t;
            const updatedSubtasks = t.subtasks.map(s => s.id === subtaskId ? { 
                ...s, 
                isCompleted: !s.isCompleted,
                completedAt: !s.isCompleted ? new Date().toISOString() : undefined 
            } : s);
            const updatedTask = { ...t, subtasks: updatedSubtasks };
            if (selectedTask?.id === taskId) setSelectedTask(updatedTask);
            return updatedTask;
        }));
    };

    const handleAddNote = (taskId: string, text: string) => {
        const newNote: Note = {
            id: \`n-\${Date.now()}\`,
            user: 'Me',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) return t;
            const updatedTask = { ...t, notes: [...(t.notes || []), newNote] };
            if (selectedTask?.id === taskId) setSelectedTask(updatedTask);
            return updatedTask;
        }));
    };

    const moveTaskToColumn = (taskId: string, column: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) return t;
            const isDone = column === 'Done';
            const updatedTask = { 
                ...t, 
                status: column as any, 
                completedAt: isDone ? new Date().toISOString() : t.completedAt 
            };
            if (selectedTask?.id === taskId) setSelectedTask(updatedTask);
            return updatedTask;
        }));
    };

    const handleArchiveTask = (taskId: string) => {
        if(confirm("Archive this task?")) {
            setTasks(prev => prev.filter(t => t.id !== taskId));
        }
    };

    const saveTask = (updatedTask: Task) => {
        if (tasks.some(t => t.id === updatedTask.id)) {
            setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        } else {
            setTasks(prev => [...prev, updatedTask]);
        }
        if (selectedTask?.id === updatedTask.id) setSelectedTask(updatedTask);
    };

    const openEditModal = (task?: Task, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setEditingTask(task || null);
        setIsEditModalOpen(true);
    };

    const openAddSubtaskModal = (taskId: string) => {
        const t = tasks.find(x => x.id === taskId);
        if (t) {
            setEditingTask(t);
            setIsEditModalOpen(true);
        }
    };

    const filteredTasks = useMemo(() => {
        let result = tasks.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())));
        
        return result.sort((a, b) => {
            if (sortBy === 'priority') {
                const weights = { Critical: 4, High: 3, Medium: 2, Low: 1 };
                return weights[b.priority] - weights[a.priority];
            }
            if (sortBy === 'deadline') {
                return (a.deadline || '9999').localeCompare(b.deadline || '9999');
            }
            if (sortBy === 'newest') {
                return (b.createdAt || '').localeCompare(a.createdAt || '');
            }
            return 0;
        });
    }, [tasks, filter, sortBy]);

    return (
        <div className="h-full flex flex-col p-6 animate-fade-in bg-[#f3f4f6] dark:bg-[#020617] text-[var(--text-main)] relative overflow-hidden">
            
            <header className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6 shrink-0 z-20">
                <div>
                    <h1 className="text-3xl font-black font-['Montserrat'] flex items-center gap-3">
                        <Kanban weight="duotone" className="text-indigo-500" /> Central Task Board
                    </h1>
                    <p className="text-sm opacity-60 font-medium mt-1">Global Operations Center • {tasks.length} Active Items</p>
                </div>
                
                <div className="flex gap-3">
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search tasks..." className="pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm" />
                    </div>
                    
                    {/* Sort Button with Delay */}
                    <div 
                        className="relative group"
                        onMouseEnter={handleSortEnter}
                        onMouseLeave={handleSortLeave}
                    >
                        <button className={\`p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-indigo-500 text-indigo-500 transition shadow-sm \${isSortMenuOpen ? 'border-indigo-500' : ''}\`}>
                            <SortAscending weight="bold" size={20} />
                        </button>
                        {isSortMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 p-2 z-50 animate-fade-in-up">
                                <button onClick={() => setSortBy('priority')} className={\`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition \${sortBy === 'priority' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 dark:hover:bg-white/5'}\`}>Priority (High-Low)</button>
                                <button onClick={() => setSortBy('deadline')} className={\`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition \${sortBy === 'deadline' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 dark:hover:bg-white/5'}\`}>Deadline (Soonest)</button>
                                <button onClick={() => setSortBy('newest')} className={\`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition \${sortBy === 'newest' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 dark:hover:bg-white/5'}\`}>Newest First</button>
                            </div>
                        )}
                    </div>

                    {isAdmin && <button onClick={handleAddColumn} className="px-4 py-2.5 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-xl font-bold flex items-center gap-2 transition text-xs uppercase">Add Column</button>}
                    <button onClick={() => openEditModal()} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg transition"><Plus weight="bold" /> New Ticket</button>
                </div>
            </header>

            {canScrollLeft && !isFlowOpen && (
                <button onClick={() => scrollBoard('left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-white dark:hover:bg-[#1e293b] text-indigo-600 transition-all border border-gray-200 dark:border-white/10"><CaretLeft weight="bold" size={24} /></button>
            )}
            {canScrollRight && !isFlowOpen && (
                <button onClick={() => scrollBoard('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-white dark:hover:bg-[#1e293b] text-indigo-600 transition-all border border-gray-200 dark:border-white/10"><CaretRight weight="bold" size={24} /></button>
            )}

            <div 
                ref={scrollContainerRef}
                className={\`flex-1 overflow-x-auto overflow-y-hidden pb-4 transition-all duration-500 no-scrollbar \${isFlowOpen ? 'select-none' : ''}\`} // Removed blur from container
            >
                <div className="flex gap-6 h-full min-w-max px-2">
                    {columns.map((col, idx) => {
                        const colTasks = filteredTasks.filter(t => t.status === col);
                        const isProtected = PROTECTED_COLUMNS.includes(col);
                        
                        // Dynamic Drag Glow
                        const isDragOver = dragOverCol === col;
                        let dragClasses = '';
                        if (isDragOver) {
                            if (col === 'Review') dragClasses = 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-emerald-500/5';
                            else if (col === 'Done') dragClasses = 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] bg-amber-500/5';
                            else dragClasses = 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] bg-indigo-500/5';
                        }

                        // Column Borders
                        let colBorder = 'border-t-4 border-indigo-500'; 
                        if (col === 'Review') colBorder = 'border-t-4 border-emerald-500';
                        if (col === 'Done') colBorder = 'border-t-4 border-amber-500';
                        if (col !== 'New Tickets' && col !== 'Review' && col !== 'Done') colBorder = 'border-t-4 border-blue-500';

                        let bgClass = 'bg-gray-100/50 dark:bg-white/[0.02] border-gray-200 dark:border-white/5';

                        if (isDragOver) {
                             bgClass = 'bg-indigo-500/10 dark:bg-indigo-500/20';
                             if (col === 'Review') colBorder = 'border-t-4 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]';
                             else if (col === 'Done') colBorder = 'border-t-4 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]';
                             else colBorder = 'border-t-4 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]';
                        }

                        return (
                            <div 
                                key={col} 
                                className={\`w-[350px] flex flex-col rounded-2xl border \${bgClass} \${colBorder} h-full transition-all duration-300 \${dragClasses}\`}
                                onDragEnter={() => handleDragEnter(col)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, col)}
                            >
                                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-white/5 shrink-0 group/col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm uppercase tracking-wider">{col}</span>
                                        <span className="bg-gray-200 dark:bg-white/10 text-[10px] font-bold px-2 py-0.5 rounded-full">{colTasks.length}</span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity">
                                        {!isProtected && (
                                            <>
                                                <button onClick={() => moveColumn(idx, 'left')} disabled={idx <= 1} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded disabled:opacity-30"><CaretLeft weight="bold" size={12} /></button>
                                                <button onClick={() => moveColumn(idx, 'right')} disabled={idx >= columns.length - 2} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded disabled:opacity-30"><CaretRight weight="bold" size={12} /></button>
                                                <div className="w-px h-3 bg-gray-300 dark:bg-white/20 mx-1"></div>
                                                <button onClick={() => {
                                                    const newName = prompt("Rename column:", col);
                                                    if(newName) setColumns(prev => prev.map(c => c === col ? newName : c));
                                                }} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded"><PencilSimple size={12} /></button>
                                                <button onClick={() => handleDeleteColumn(col)} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><X size={12} /></button>
                                            </>
                                        )}
                                        {isProtected && <LockKey className="opacity-30" weight="bold" />}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                    {colTasks.map(task => {
                                        const completed = task.subtasks.filter(s => s.isCompleted).length;
                                        const total = task.subtasks.length;
                                        const pct = total > 0 ? (completed / total) * 100 : 0;
                                        const isActive = selectedTask?.id === task.id && isFlowOpen;
                                        
                                        // Selective Blur: Blurred if panel open AND NOT active
                                        let cardStateClass = '';
                                        if (isFlowOpen) {
                                            if (isActive) {
                                                // Active Card: Pop out, no blur
                                                cardStateClass = 'ring-4 ring-indigo-500 border-transparent z-50 scale-105 shadow-2xl !blur-0 !brightness-100 !pointer-events-auto';
                                            } else {
                                                // Inactive Cards: Blur, dim slightly, disable pointer events
                                                cardStateClass = 'blur-sm opacity-80 pointer-events-none';
                                            }
                                        }

                                        // Dynamic Tilt on Drag
                                        const isDraggingThis = draggedTaskId === task.id;
                                        // FIXED: No rotation, just lift
                                        const tiltClass = isDraggingThis ? 'scale-105 shadow-2xl z-50' : 'hover:-translate-y-1 hover:shadow-xl';

                                        // Determine Date Status for Card (Burnout Logic)
                                        const getUrgency = (t: Task) => {
                                            if (!t.deadline) return false;
                                            const days = (new Date(t.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
                                            return days <= 1 || t.subtasks.length > days;
                                        };

                                        return (
                                            <div 
                                                key={task.id} 
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task.id)}
                                                onClick={() => { setSelectedTask(task); setIsFlowOpen(true); }}
                                                className={\`
                                                    glass-card !p-4 group hover:border-indigo-500/30 transition-all duration-300 relative bg-white dark:bg-[#1e293b] cursor-pointer
                                                    \${cardStateClass}
                                                    \${tiltClass}
                                                \`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {task.tags.map(tag => (<span key={tag} className="text-[9px] font-bold uppercase bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400 tracking-wider">{tag}</span>))}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={(e) => openEditModal(task, e)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-400 hover:text-indigo-500"><PencilSimple /></button>
                                                        {(task.priority === 'Critical' || getUrgency(task)) && (
                                                            <div title={task.priority === 'Critical' ? "Critical Priority" : "High Risk: Deadline approaching"}>
                                                                <Fire weight="fill" className={\`\${task.priority === 'Critical' ? 'text-red-500' : 'text-orange-400'} animate-pulse\`} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 mb-2">
                                                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-inner text-white shrink-0">
                                                        {task.title.charAt(0)}
                                                    </div>
                                                    <h3 className="font-bold text-sm leading-tight">{task.title}</h3>
                                                </div>
                                                
                                                {task.deadline && (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold opacity-60 mb-2">
                                                        <CalendarBlank weight="bold" /> {task.deadline}
                                                    </div>
                                                )}

                                                {total > 0 && (
                                                    <div className="mb-3">
                                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: \`\${pct}%\` }}></div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {task.collaborators.length > 0 ? (
                                                            task.collaborators.map((c, i) => (
                                                                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-[#1e293b]" title={c}>
                                                                    {c.charAt(0)}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-[10px] opacity-50">?</div>
                                                        )}
                                                    </div>

                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setSelectedTask(task); setIsFlowOpen(true); }}
                                                        className="text-xs font-bold text-indigo-500 flex items-center gap-1 hover:underline"
                                                    >
                                                        <FlowArrow weight="bold" /> View Flow
                                                    </button>
                                                </div>

                                                {/* Context Actions */}
                                                {task.status === 'Review' && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); moveTaskToColumn(task.id, 'Done'); }}
                                                        className="w-full mt-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded text-[10px] font-bold border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition flex items-center justify-center gap-1"
                                                    >
                                                        <CheckCircle weight="fill" /> Approve & Finish
                                                    </button>
                                                )}
                                                {task.status === 'Done' && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleArchiveTask(task.id); }}
                                                        className="w-full mt-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-500 rounded text-[10px] font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition flex items-center justify-center gap-1"
                                                    >
                                                        <Archive weight="fill" /> Archive Ticket
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <TaskFlowPanel 
                task={selectedTask} 
                isOpen={isFlowOpen} 
                setIsOpen={setIsFlowOpen} 
                onToggleSubtask={toggleSubtask} 
                onPickUpSubtask={handlePickUpSubtask}
                onAddSubtask={openAddSubtaskModal}
                onAddNote={handleAddNote}
                onMoveTask={moveTaskToColumn}
            />

            {isEditModalOpen && (
                <EditTaskModal 
                    task={editingTask} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={saveTask} 
                />
            )}
        </div>
    );
}
`;

// --- WRITE FILES ---
write('src/pages/TaskBoard/components/EditTaskModal.tsx', EDIT_TASK_MODAL);
write('src/pages/TaskBoard/components/TaskFlowPanel.tsx', TASK_FLOW_PANEL);
write('src/pages/TaskBoard/index.tsx', TASKBOARD_PAGE);

console.log("✅ UPGRADE COMPLETE: Task Board Full Suite Installed.");