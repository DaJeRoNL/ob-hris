import { useState, useMemo, useRef, useEffect } from 'react';
import { 
    Plus, Kanban, List, MagnifyingGlass, 
    DotsThree, UserPlus, Fire, FlowArrow, 
    PencilSimple, CaretLeft, CaretRight, X, LockKey, Pencil, CheckCircle, Archive, SortAscending,
    CalendarBlank, Graph, ShareNetwork, BezierCurve, Link as LinkIcon
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
    links?: string[]; // Flow Links
}

const INITIAL_TASKS: Task[] = [
    { 
        id: 't-1', title: 'Migrate Legacy Auth', desc: 'Switch from v1 tokens to JWT.', 
        assignee: null, collaborators: [], priority: 'High', status: 'New Tickets', tags: ['Backend', 'Security'],
        deadline: '2024-11-30', creator: 'Admin', createdAt: '2024-10-01', links: ['t-3'],
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
        creator: 'Marketing Lead', createdAt: '2024-10-10', links: ['t-5'],
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

// SVG Layer Component (Dual Color Logic)
const ConnectionsOverlay = ({ tasks, cardRefs, flowFocusId, isDragging }: { tasks: Task[], cardRefs: React.MutableRefObject<any>, flowFocusId: string | null, isDragging: boolean }) => {
    // Hide immediately if dragging
    if (!flowFocusId || isDragging) return null;

    // Explicitly type the paths array
    const paths: React.ReactNode[] = [];
    
    for (const task of tasks) {
        if (!task.links) continue;
        
        const isSourceFocused = task.id === flowFocusId;
        
        task.links.forEach(targetId => {
            const isDestFocused = targetId === flowFocusId;
            
            if (isSourceFocused || isDestFocused) {
                const sourceEl = cardRefs.current[task.id];
                const destEl = cardRefs.current[targetId];

                if (sourceEl && destEl) {
                    const sLeft = sourceEl.offsetLeft;
                    const sTop = sourceEl.offsetTop;
                    const sWidth = sourceEl.offsetWidth;
                    const sHeight = sourceEl.offsetHeight;

                    const dLeft = destEl.offsetLeft;
                    const dTop = destEl.offsetTop;
                    const dWidth = destEl.offsetWidth;
                    const dHeight = destEl.offsetHeight;

                    let x1 = sLeft + sWidth / 2;
                    let y1 = sTop + sHeight;
                    let x2 = dLeft + dWidth / 2;
                    let y2 = dTop;

                    const isSameColumn = Math.abs(x1 - x2) < 50; 
                    let pathData = '';

                    if (isSameColumn) {
                         // Shift to Right Edge
                         x1 = sLeft + sWidth;
                         y1 = sTop + sHeight / 2;

                         x2 = dLeft + dWidth;
                         y2 = dTop + dHeight / 2;

                         const controlX = Math.max(x1, x2) + 100; 
                         pathData = `M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}`;
                    } else {
                         // Standard S-Curve
                         pathData = `M ${x1} ${y1} C ${x1} ${y1 + 150}, ${x2} ${y2 - 150}, ${x2} ${y2}`;
                    }

                    // COLOR LOGIC - Kept static/functional colors for arrows, but could map to CSS vars if needed.
                    // Source Focused = Green (Forward)
                    // Dest Focused = Grey (Backward)
                    const lineColor = isSourceFocused ? '#10b981' : '#64748b'; 
                    const markerId = isSourceFocused ? 'url(#arrowhead-green)' : 'url(#arrowhead-grey)';
                    const strokeStyle = isSourceFocused ? '6,4' : '4,4'; 

                    paths.push(
                        <g key={`${task.id}-${targetId}`}>
                            <path 
                                d={pathData} 
                                stroke={lineColor} 
                                strokeWidth="2" 
                                fill="none" 
                                strokeDasharray={strokeStyle}
                                markerEnd={markerId}
                                className="animate-draw"
                            />
                            {/* Halo */}
                            <path 
                                d={pathData} 
                                stroke={isSourceFocused ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)"} 
                                strokeWidth="6" 
                                fill="none" 
                            />
                        </g>
                    );
                }
            }
        });
    }

    return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" style={{ minWidth: '100%', minHeight: '100%' }}>
            <defs>
                {/* Green Arrow (Forward) */}
                <marker id="arrowhead-green" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                    <path d="M 0 0 L 10 6 L 0 12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                </marker>
                
                {/* Grey Arrow (Backward) */}
                <marker id="arrowhead-grey" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                    <path d="M 0 0 L 10 6 L 0 12" fill="none" stroke="#64748b" strokeWidth="1.5" />
                </marker>
            </defs>
            {paths}
        </svg>
    );
};

export default function TaskBoard() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [columns, setColumns] = useState(['New Tickets', 'Ready', 'In Progress', 'Review', 'Done']);
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'newest'>('priority');
    const [isAdmin] = useState(true); 
    
    // UI States
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isFlowOpen, setIsFlowOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [dragOverCol, setDragOverCol] = useState<string | null>(null); 
    
    // DROP FLASH STATE
    const [justDroppedId, setJustDroppedId] = useState<string | null>(null);
    
    // FLOW STATE
    const [flowFocusId, setFlowFocusId] = useState<string | null>(null);
    const cardRefs = useRef<any>({});
    
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

    // Sort Menu Handlers
    const handleSortEnter = () => {
        if (sortTimeoutRef.current) clearTimeout(sortTimeoutRef.current);
        setIsSortMenuOpen(true);
    };

    const handleSortLeave = () => {
        sortTimeoutRef.current = window.setTimeout(() => {
            setIsSortMenuOpen(false);
        }, 400); 
    };

    // Drag & Drop
    const handleDragStart = (e: React.DragEvent, id: string) => {
        setFlowFocusId(null);
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
        
        // TRIGGER FLASH
        setJustDroppedId(draggedTaskId);
        setTimeout(() => setJustDroppedId(null), 600); // 600ms Flash duration

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

    const moveColumn = (col: string, direction: 'left' | 'right') => {
        const currentIndex = columns.indexOf(col);
        const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
        
        // Don't allow moving out of bounds
        if (targetIndex < 0 || targetIndex >= columns.length) return;
        
        // Don't allow moving into protected column positions
        const targetCol = columns[targetIndex];
        if (PROTECTED_COLUMNS.includes(targetCol)) return;
        
        const newColumns = [...columns];
        [newColumns[currentIndex], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[currentIndex]];
        setColumns(newColumns);
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

    // Creates a new task linked TO by the sourceId
    const handleCreateLinkedTask = (sourceId: string) => {
        const sourceTask = tasks.find(t => t.id === sourceId);
        if (!sourceTask) return;

        const newId = `t-${Date.now()}`;
        const newTask: Task = {
            id: newId,
            title: 'Linked Task',
            desc: `Follow-up to ${sourceTask.title}`,
            assignee: null,
            priority: 'Medium',
            status: 'New Tickets',
            tags: ['Linked'],
            subtasks: [],
            notes: [],
            collaborators: [],
            links: [],
            creator: 'Me',
            createdAt: new Date().toISOString()
        };

        // Update Source to point to New
        const updatedSource = { ...sourceTask, links: [...(sourceTask.links || []), newId] };
        
        setTasks(prev => [...prev.map(t => t.id === sourceId ? updatedSource : t), newTask]);
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

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (flowFocusId) {
            setFlowFocusId(null);
        }
    };

    const handleCardClick = (task: Task, e: React.MouseEvent) => {
        e.stopPropagation();
        setFlowFocusId(null);
        setSelectedTask(task);
        setIsFlowOpen(true);
    };

    return (
        <div className="h-full flex flex-col p-6 animate-fade-in bg-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden transition-colors duration-300" onClick={handleBackgroundClick}>
            
            <header className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6 shrink-0 z-20">
                <div>
                    <h1 className="text-3xl font-black font-['Montserrat'] flex items-center gap-3 text-[var(--color-text)]">
                        <Kanban weight="duotone" className="text-[var(--color-primary)]" /> Central Task Board
                    </h1>
                    <p className="text-sm opacity-60 font-medium mt-1 text-[var(--color-text-muted)]">Global Operations Center • {tasks.length} Active Items</p>
                </div>
                
                <div className="flex gap-3">
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 text-[var(--color-text-muted)]" />
                        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search tasks..." className="pl-9 pr-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none w-64 shadow-sm" />
                    </div>
                    
                    <div 
                        className="relative group"
                        onMouseEnter={handleSortEnter}
                        onMouseLeave={handleSortLeave}
                    >
                        <button className={`p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] text-[var(--color-primary)] transition shadow-sm ${isSortMenuOpen ? 'border-[var(--color-primary)]' : ''}`}>
                            <SortAscending weight="bold" size={20} />
                        </button>
                        {isSortMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-[var(--color-surface)] rounded-xl shadow-xl border border-[var(--color-border)] p-2 z-50 animate-fade-in-up">
                                <button onClick={() => setSortBy('priority')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition text-[var(--color-text)] ${sortBy === 'priority' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'hover:bg-[var(--color-bg)]'}`}>Priority (High-Low)</button>
                                <button onClick={() => setSortBy('deadline')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition text-[var(--color-text)] ${sortBy === 'deadline' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'hover:bg-[var(--color-bg)]'}`}>Deadline (Soonest)</button>
                                <button onClick={() => setSortBy('newest')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition text-[var(--color-text)] ${sortBy === 'newest' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'hover:bg-[var(--color-bg)]'}`}>Newest First</button>
                            </div>
                        )}
                    </div>

                    {isAdmin && <button onClick={handleAddColumn} className="px-4 py-2.5 bg-[var(--color-surface)]/50 hover:bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl font-bold flex items-center gap-2 transition text-xs uppercase text-[var(--color-text)]">Add Column</button>}
                    <button onClick={() => openEditModal()} className="px-4 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl flex items-center gap-2 shadow-lg transition"><Plus weight="bold" /> New Ticket</button>
                </div>
            </header>

            {canScrollLeft && !isFlowOpen && (
                <button onClick={() => scrollBoard('left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-[var(--color-surface)] text-[var(--color-primary)] transition-all border border-[var(--color-border)]"><CaretLeft weight="bold" size={24} /></button>
            )}
            {canScrollRight && !isFlowOpen && (
                <button onClick={() => scrollBoard('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-[var(--color-surface)] text-[var(--color-primary)] transition-all border border-[var(--color-border)]"><CaretRight weight="bold" size={24} /></button>
            )}

            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-x-auto overflow-y-hidden pb-4 transition-all duration-500 no-scrollbar relative"
            >
                {/* SVG Overlay Container */}
                <div className="flex gap-6 h-full min-w-max px-2 relative z-10">
                    
                    <ConnectionsOverlay 
                        tasks={tasks} 
                        cardRefs={cardRefs} 
                        flowFocusId={flowFocusId} 
                        isDragging={draggedTaskId !== null} 
                    />

                    {columns.map((col, idx) => {
                        const colTasks = filteredTasks.filter(t => t.status === col);
                        const isProtected = PROTECTED_COLUMNS.includes(col);
                        const isDragOver = dragOverCol === col;
                        let dragClasses = '';
                        if (isDragOver) {
                            if (col === 'Review') dragClasses = 'border-[var(--color-success)] border-4 bg-[var(--color-success)]/5';
                            else if (col === 'Done') dragClasses = 'border-[var(--color-warning)] border-4 bg-[var(--color-warning)]/5';
                            else dragClasses = 'border-[var(--color-primary)] border-4 bg-[var(--color-primary)]/5';
                        }

                        return (
                            <div 
                                key={col} 
                                className={`w-[350px] flex flex-col bg-[var(--color-surface)]/30 rounded-2xl border border-[var(--color-border)] h-full transition-all duration-300 ${dragClasses}`}
                                onDragEnter={() => handleDragEnter(col)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, col)}
                            >
                                <div className="p-4 flex justify-between items-center border-b border-[var(--color-border)] shrink-0 group/col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm uppercase tracking-wider text-[var(--color-text)]">{col}</span>
                                        <span className="bg-[var(--color-surface)] text-[var(--color-text)] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--color-border)]">{colTasks.length}</span>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        {!isProtected && (
                                            <>
                                                {/* Column Move Arrows */}
                                                <div className="opacity-0 group-hover/col:opacity-100 transition-opacity flex gap-1 mr-2">
                                                    <button 
                                                        onClick={() => moveColumn(col, 'left')} 
                                                        disabled={idx === 0 || PROTECTED_COLUMNS.includes(columns[idx - 1])}
                                                        className="p-1 hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded disabled:opacity-30 disabled:cursor-not-allowed transition"
                                                        title="Move Left"
                                                    >
                                                        <CaretLeft size={14} weight="bold" />
                                                    </button>
                                                    <button 
                                                        onClick={() => moveColumn(col, 'right')} 
                                                        disabled={idx === columns.length - 1 || PROTECTED_COLUMNS.includes(columns[idx + 1])}
                                                        className="p-1 hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded disabled:opacity-30 disabled:cursor-not-allowed transition"
                                                        title="Move Right"
                                                    >
                                                        <CaretRight size={14} weight="bold" />
                                                    </button>
                                                </div>
                                                
                                                <div className="opacity-0 group-hover/col:opacity-100 transition-opacity flex gap-1 text-[var(--color-text-muted)]">
                                                    <button onClick={() => {
                                                        const newName = prompt("Rename column:", col);
                                                        if(newName) setColumns(prev => prev.map(c => c === col ? newName : c));
                                                    }} className="p-1 hover:bg-[var(--color-bg)] rounded"><PencilSimple size={12} /></button>
                                                    <button onClick={() => handleDeleteColumn(col)} className="p-1 hover:bg-[var(--color-danger)]/10 text-[var(--color-danger)] rounded"><X size={12} /></button>
                                                </div>
                                            </>
                                        )}
                                        {isProtected && <LockKey className="opacity-30 text-[var(--color-text-muted)]" weight="bold" />}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                    {colTasks.map(task => {
                                        const completed = task.subtasks.filter(s => s.isCompleted).length;
                                        const total = task.subtasks.length;
                                        const pct = total > 0 ? (completed / total) * 100 : 0;
                                        
                                        const isActiveInFlow = selectedTask?.id === task.id && isFlowOpen;
                                        
                                        const isFocused = flowFocusId === task.id;
                                        const isLinkedToFocused = flowFocusId && (
                                            (tasks.find(t => t.id === flowFocusId)?.links?.includes(task.id)) || 
                                            (task.links?.includes(flowFocusId)) 
                                        );
                                        
                                        const isDimmed = (isFlowOpen && !isActiveInFlow && !flowFocusId) || 
                                                        (!isActiveInFlow && flowFocusId && !isFocused && !isLinkedToFocused);

                                        let cardStateClass = '';
                                        if (isDimmed) {
                                            cardStateClass = 'opacity-30 blur-sm grayscale transition-all duration-500';
                                        } else if (isFocused) {
                                            cardStateClass = 'ring-4 ring-purple-500 shadow-2xl scale-105 z-50 !bg-[var(--color-surface)]';
                                        } else if (isActiveInFlow) {
                                            cardStateClass = 'ring-2 ring-[var(--color-primary)]/50 shadow-2xl scale-105 z-50 !bg-[var(--color-surface)] transition-all duration-500';
                                        }

                                        const isDraggingThis = draggedTaskId === task.id;
                                        const isJustDropped = justDroppedId === task.id;

                                        let tiltClass = isDraggingThis ? 'scale-105 shadow-2xl z-50' : 'hover:-translate-y-1 hover:shadow-xl';
                                        if (isJustDropped) tiltClass += ' brightness-125 ring-2 ring-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-500';

                                        const getUrgency = (t: Task) => {
                                            if (!t.deadline) return false;
                                            const days = (new Date(t.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
                                            return days <= 1 || t.subtasks.length > days;
                                        };

                                        const incomingLinkTask = tasks.find(t => t.links?.includes(task.id));

                                        return (
                                            <div 
                                                key={task.id} 
                                                ref={el => cardRefs.current[task.id] = el}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task.id)}
                                                onClick={(e) => handleCardClick(task, e)}
                                                className={`
                                                    glass-card !p-4 group hover:border-[var(--color-primary)]/30 transition-all duration-300 relative bg-[var(--color-surface)] cursor-pointer
                                                    ${cardStateClass}
                                                    ${tiltClass}
                                                `}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {task.tags.map(tag => (<span key={tag} className="text-[9px] font-bold uppercase bg-[var(--color-bg)] border border-[var(--color-border)] px-1.5 py-0.5 rounded text-[var(--color-text-muted)]">{tag}</span>))}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={(e) => openEditModal(task, e)} className="p-1 hover:bg-[var(--color-bg)] rounded text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"><PencilSimple /></button>
                                                        {(task.priority === 'Critical' || getUrgency(task)) && (
                                                            <div title={task.priority === 'Critical' ? "Critical Priority" : "High Risk: Deadline approaching"}>
                                                                <Fire weight="fill" className={`${task.priority === 'Critical' ? 'text-[var(--color-danger)]' : 'text-[var(--color-warning)]'} animate-pulse`} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-sm mb-2 leading-tight text-[var(--color-text)]">{task.title}</h3>
                                                
                                                {task.deadline && (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold opacity-60 mb-2 text-[var(--color-text-muted)]">
                                                        <CalendarBlank weight="bold" /> {task.deadline}
                                                    </div>
                                                )}

                                                {total > 0 && (
                                                    <div className="mb-3">
                                                        <div className="w-full h-1.5 bg-[var(--color-bg)] rounded-full overflow-hidden">
                                                            <div className="h-full bg-[var(--color-primary)] transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {task.collaborators.length > 0 ? (
                                                            task.collaborators.map((c, i) => (
                                                                <div key={i} className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-[var(--color-surface)]" title={c}>
                                                                    {c.charAt(0)}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-[var(--color-bg)] text-[var(--color-text-muted)] flex items-center justify-center text-[10px] opacity-50">?</div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {/* UPSTREAM INDICATOR */}
                                                        {incomingLinkTask && (
                                                            <div className="group/link relative flex items-center justify-center">
                                                                <div className="flex items-center gap-1 text-[10px] font-bold bg-[var(--color-warning)]/10 text-[var(--color-warning)] px-2 py-1 rounded shadow-sm border border-[var(--color-warning)]/20 cursor-help">
                                                                    <LinkIcon weight="bold" size={12} />
                                                                    <span>Blocked</span>
                                                                </div>
                                                                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/link:block w-max max-w-[200px] bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-[60] pointer-events-none">
                                                                    Depends on: {incomingLinkTask.title}
                                                                    <div className="absolute top-full right-1 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* DOWNSTREAM INDICATOR */}
                                                        {task.links && task.links.length > 0 && (
                                                            <button 
                                                                onClick={(e) => { 
                                                                    e.stopPropagation(); 
                                                                    setFlowFocusId(flowFocusId === task.id ? null : task.id);
                                                                }}
                                                                title="Show Flow Dependencies"
                                                                className={`text-[10px] font-bold flex items-center gap-1.5 px-2 py-1 rounded transition shadow-sm border
                                                                    ${flowFocusId === task.id 
                                                                        ? 'bg-purple-600 text-white ring-2 ring-purple-300 border-purple-600' 
                                                                        : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20 dark:border-purple-500/20'
                                                                    }
                                                                `}
                                                            >
                                                                <span className="uppercase tracking-wide">Blocks {task.links.length}</span>
                                                                <BezierCurve weight="bold" size={14} />
                                                            </button>
                                                        )}

                                                        {task.subtasks.length > 0 && (
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleCardClick(task, e); }}
                                                                className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1 hover:underline"
                                                                title="Open Workflow"
                                                            >
                                                                <FlowArrow weight="bold" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {task.status === 'Review' && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); moveTaskToColumn(task.id, 'Done'); }}
                                                        className="w-full mt-3 py-1.5 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded text-[10px] font-bold border border-[var(--color-success)]/20 hover:bg-[var(--color-success)] hover:text-white transition flex items-center justify-center gap-1"
                                                    >
                                                        <CheckCircle weight="fill" /> Approve & Finish
                                                    </button>
                                                )}
                                                {task.status === 'Done' && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleArchiveTask(task.id); }}
                                                        className="w-full mt-3 py-1.5 bg-[var(--color-bg)] text-[var(--color-text-muted)] rounded text-[10px] font-bold hover:bg-[var(--color-border)] transition flex items-center justify-center gap-1"
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
                allTasks={tasks}
            />

            {isEditModalOpen && (
                <EditTaskModal 
                    task={editingTask} 
                    allTasks={tasks} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={saveTask} 
                    onCreateLinked={handleCreateLinkedTask}
                />
            )}
        </div>
    );
}