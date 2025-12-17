import { useState, useMemo, useRef, useEffect } from 'react';
import { 
    Plus, Kanban, List, MagnifyingGlass, 
    DotsThree, UserPlus, Fire, FlowArrow, 
    PencilSimple, CaretLeft, CaretRight, X, LockKey, Pencil, CheckCircle, Archive, SortAscending,
    CalendarBlank
} from '@phosphor-icons/react';
import TaskFlowPanel from './components/TaskFlowPanel';
import EditTaskModal from './components/EditTaskModal';

interface Note {
    id: string;
    user: string;
    text: string;
    timestamp: string;
}

interface Subtask {
    id: string;
    title: string;
    desc?: string;
    isCompleted: boolean;
    isRequired?: boolean;
    assignee?: string;
    completedAt?: string;
}

interface Task {
    id: string;
    title: string;
    desc: string;
    assignee: string | null;
    collaborators: string[];
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'New Tickets' | 'Ready' | 'In Progress' | 'Review' | 'Done';
    tags: string[];
    subtasks: Subtask[];
    notes?: Note[];
    deadline?: string;
    creator?: string;
    createdAt?: string;
    completedAt?: string;
}

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
    
    // Sort Menu State with Delay
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

    // Sort Menu Handlers
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
                alert(`Cannot move to ${targetCol}: Please complete all REQUIRED subtasks first.`);
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

    const handleDeleteColumn = (col: string) => {
        if (confirm(`Delete column "${col}"? Tasks will be moved to New Tickets.`)) {
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
            id: `n-${Date.now()}`,
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
                        <button className={`p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-indigo-500 text-indigo-500 transition shadow-sm ${isSortMenuOpen ? 'border-indigo-500' : ''}`}>
                            <SortAscending weight="bold" size={20} />
                        </button>
                        {isSortMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 p-2 z-50 animate-fade-in-up">
                                <button onClick={() => setSortBy('priority')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition ${sortBy === 'priority' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>Priority (High-Low)</button>
                                <button onClick={() => setSortBy('deadline')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition ${sortBy === 'deadline' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>Deadline (Soonest)</button>
                                <button onClick={() => setSortBy('newest')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition ${sortBy === 'newest' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>Newest First</button>
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
                className="flex-1 overflow-x-auto overflow-y-hidden pb-4 transition-all duration-500 no-scrollbar"
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

                        return (
                            <div 
                                key={col} 
                                className={`w-[350px] flex flex-col bg-gray-100/50 dark:bg-white/[0.02] rounded-2xl border border-gray-200 dark:border-white/5 h-full transition-all duration-300 ${dragClasses}`}
                                onDragEnter={() => handleDragEnter(col)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, col)}
                            >
                                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-white/5 shrink-0 group/col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm uppercase tracking-wider">{col}</span>
                                        <span className="bg-gray-200 dark:bg-white/10 text-[10px] font-bold px-2 py-0.5 rounded-full">{colTasks.length}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {/* FIXED: No editing of first/last col positions */}
                                        {!isProtected && (
                                            <div className="opacity-0 group-hover/col:opacity-100 transition-opacity flex gap-1">
                                                <button onClick={() => {
                                                    const newName = prompt("Rename column:", col);
                                                    if(newName) setColumns(prev => prev.map(c => c === col ? newName : c));
                                                }} className="p-1 hover:bg-black/5 rounded"><PencilSimple size={12} /></button>
                                                <button onClick={() => handleDeleteColumn(col)} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><X size={12} /></button>
                                            </div>
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
                                        
                                        // Card Visual State
                                        let cardStateClass = '';
                                        if (isFlowOpen) {
                                            if (isActive) {
                                                cardStateClass = 'ring-4 ring-indigo-500 border-transparent z-50 scale-105 shadow-2xl !blur-0 !brightness-100 !pointer-events-auto';
                                            } else {
                                                cardStateClass = 'blur-sm brightness-50 pointer-events-none opacity-50';
                                            }
                                        }

                                        // Dynamic Tilt on Drag
                                        const isDraggingThis = draggedTaskId === task.id;
                                        const tiltClass = isDraggingThis ? 'rotate-3 scale-105 shadow-2xl z-50' : 'hover:-translate-y-1 hover:shadow-xl';

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
                                                className={`
                                                    glass-card !p-4 group hover:border-indigo-500/30 transition-all duration-300 relative bg-white dark:bg-[#1e293b] cursor-pointer
                                                    ${cardStateClass}
                                                    ${tiltClass}
                                                `}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {task.tags.map(tag => (<span key={tag} className="text-[9px] font-bold uppercase bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-1.5 py-0.5 rounded text-gray-500">{tag}</span>))}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={(e) => openEditModal(task, e)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-400 hover:text-indigo-500"><PencilSimple /></button>
                                                        {(task.priority === 'Critical' || getUrgency(task)) && (
                                                            <div title={task.priority === 'Critical' ? "Critical Priority" : "High Risk: Deadline approaching"}>
                                                                <Fire weight="fill" className={`${task.priority === 'Critical' ? 'text-red-500' : 'text-orange-400'} animate-pulse`} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-sm mb-2 leading-tight">{task.title}</h3>
                                                
                                                {/* Deadline Badge */}
                                                {task.deadline && (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold opacity-60 mb-2">
                                                        <CalendarBlank weight="bold" /> {task.deadline}
                                                    </div>
                                                )}

                                                {total > 0 && (
                                                    <div className="mb-3">
                                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {task.collaborators.length > 0 ? (
                                                            task.collaborators.map((c, i) => (
                                                                <div key={i} className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-[#1e293b]" title={c}>
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
