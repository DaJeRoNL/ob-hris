import { useState, useEffect, useRef } from 'react';
import { 
    X, Plus, Trash, CalendarBlank, CheckSquare, Square, 
    CaretUp, CaretDown, TextT, Link as LinkIcon, TreeStructure
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
    links?: string[]; // IDs of downstream tasks
}

interface Props {
    task?: Task | null;
    allTasks: Task[]; // Passed to select existing
    onClose: () => void;
    onSave: (task: Task) => void;
    onCreateLinked: (sourceId: string) => void; // Quick create handler
}

const PRESET_TAGS = ['Backend', 'Frontend', 'Design', 'Bug', 'Urgent', 'Feature', 'Ops'];

export default function EditTaskModal({ task, allTasks, onClose, onSave, onCreateLinked }: Props) {
    const [form, setForm] = useState<Task>({
        id: `t-${Date.now()}`,
        title: '',
        desc: '',
        assignee: null,
        priority: 'Medium',
        status: 'New Tickets',
        tags: [],
        subtasks: [],
        notes: [],
        collaborators: [],
        links: [],
        deadline: '',
        creator: 'Me',
        createdAt: new Date().toISOString()
    });

    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [newSubtaskDesc, setNewSubtaskDesc] = useState('');
    const [showSubtaskDescInput, setShowSubtaskDescInput] = useState(false);
    
    // Tag State
    const [tagInput, setTagInput] = useState('');
    const [showTagMenu, setShowTagMenu] = useState(false);

    // Link Menu State
    const [showLinkMenu, setShowLinkMenu] = useState(false);
    const [showExistingSelector, setShowExistingSelector] = useState(false);
    const linkMenuTimer = useRef<number | null>(null);

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
                    id: `s-${Date.now()}`, 
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

    const addLink = (targetId: string) => {
        if (form.links?.includes(targetId)) return;
        setForm(prev => ({ ...prev, links: [...(prev.links || []), targetId] }));
        setShowExistingSelector(false);
        setShowLinkMenu(false);
    };

    const removeLink = (targetId: string) => {
        setForm(prev => ({ ...prev, links: prev.links?.filter(id => id !== targetId) }));
    };

    // Hover Handlers with Delay
    const handleLinkEnter = () => {
        if (linkMenuTimer.current) clearTimeout(linkMenuTimer.current);
        setShowLinkMenu(true);
    };

    const handleLinkLeave = () => {
        if (!showExistingSelector) {
            linkMenuTimer.current = window.setTimeout(() => {
                setShowLinkMenu(false);
            }, 400); // 0.4s delay
        }
    };

    // Candidates for linking (exclude self and already linked)
    const linkableTasks = allTasks.filter(t => t.id !== form.id && !form.links?.includes(t.id));

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
                
                {/* --- PURPLE ACTION BUTTON (The "Idea") --- */}
                <div 
                    className="absolute -right-5 top-1/2 -translate-y-1/2 z-50 group"
                    onMouseEnter={handleLinkEnter}
                    onMouseLeave={handleLinkLeave}
                >
                    <button className="w-10 h-10 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center transition-transform hover:scale-110">
                        <TreeStructure weight="bold" size={20} />
                    </button>

                    {showLinkMenu && (
                        <div 
                            className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-white dark:bg-[#0f172a] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 p-2 w-48 animate-fade-in-right origin-left"
                            onMouseEnter={handleLinkEnter} // Keep open if moving to menu
                            onMouseLeave={handleLinkLeave}
                        >
                            <div className="text-[10px] uppercase font-bold opacity-50 mb-2 px-2">Flow Connections</div>
                            
                            <button 
                                onClick={() => { onSave(form); onCreateLinked(form.id); onClose(); }}
                                className="w-full text-left px-3 py-2 hover:bg-purple-50 dark:hover:bg-purple-500/20 rounded-lg text-xs font-bold transition flex items-center gap-2 text-purple-600 dark:text-purple-400"
                            >
                                <Plus weight="bold" /> Add New Card
                            </button>
                            
                            <button 
                                onClick={() => setShowExistingSelector(true)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-xs font-bold transition flex items-center gap-2"
                            >
                                <LinkIcon weight="bold" /> Select Existing
                            </button>

                            {/* Existing Selector Sub-menu */}
                            {showExistingSelector && (
                                <div className="mt-2 border-t border-gray-100 dark:border-white/5 pt-2 max-h-40 overflow-y-auto custom-scrollbar">
                                    {linkableTasks.length === 0 && <div className="px-2 text-[10px] opacity-50">No other tasks available.</div>}
                                    {linkableTasks.map(t => (
                                        <button 
                                            key={t.id}
                                            onClick={() => addLink(t.id)}
                                            className="w-full text-left px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded text-[10px] font-medium truncate transition"
                                        >
                                            {t.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <h2 className="text-lg font-bold font-['Montserrat']">{task ? 'Edit Task' : 'New Ticket'}</h2>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    <div>
                        <label className="text-xs font-bold uppercase opacity-60 mb-1 block">Title</label>
                        <input className="w-full bg-transparent border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2 font-bold outline-none focus:border-indigo-500" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Task Title" />
                    </div>
                    
                    {/* Active Links Visualization in Form */}
                    {form.links && form.links.length > 0 && (
                        <div>
                            <label className="text-xs font-bold uppercase opacity-60 mb-1 flex items-center gap-2">
                                <TreeStructure weight="fill" className="text-purple-500" /> Linked Downstream
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {form.links.map(linkId => {
                                    const linkedTask = allTasks.find(t => t.id === linkId);
                                    return (
                                        <div key={linkId} className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                                            <span>{linkedTask ? linkedTask.title : 'Unknown Task'}</span>
                                            <button onClick={() => removeLink(linkId)} className="hover:text-red-500"><X weight="bold" /></button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

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
                                            className={`text-[10px] font-bold px-2 py-1 rounded border transition ${form.tags.includes(t) ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-transparent border-gray-200 dark:border-white/10 hover:border-indigo-500 text-gray-500'}`}
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
                                <button onClick={() => setShowSubtaskDescInput(!showSubtaskDescInput)} className={`p-2 rounded-lg transition ${showSubtaskDescInput ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-white/10'}`} title="Add Description"><TextT weight="bold" /></button>
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
                                            <div className={`text-sm ${s.isRequired ? 'font-bold' : ''}`}>{s.title}</div>
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
