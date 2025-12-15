import { useState, useMemo, useEffect, useRef } from 'react';
import { 
    CaretUp, CaretDown, Sparkle, ArrowRight, X, Clock, 
    CheckCircle, TrendUp, ArrowDown, Lightning, Users, Handshake,
    CalendarCheck, Timer, Heart, ChatCircleDots, Target, Trophy, Info,
    Funnel, Star
} from '@phosphor-icons/react';

interface Candidate {
    id: string;
    name: string;
    role: string;
    stage: string;
    daysInStage: number;
    aiMatch: number;
}

interface Props {
    candidates: Candidate[];
    onAction: (id: string, action: string) => void;
    onHoverCandidate: (id: string | null) => void;
}

// --- HELPER: Smart Pluralization ---
const formatCount = (count: number, singular: string, plural?: string) => {
    const label = count === 1 ? singular : (plural || `${singular}s`);
    return `${count} ${label}`;
};

// --- COMPONENT: Abstract "Flow" Graphic ---
const FlowGraphic = () => (
    <div className="relative w-full h-64 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/20 shadow-2xl flex items-center justify-center">
        <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
            <defs>
                <linearGradient id="flowGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                </linearGradient>
            </defs>
            <path d="M0,100 C100,100 100,50 200,50 C300,50 300,150 400,150" fill="none" stroke="url(#flowGrad)" strokeWidth="40" className="animate-pulse-slow" />
            <path d="M0,120 C120,120 120,80 240,80 C360,80 360,140 400,140" fill="none" stroke="url(#flowGrad)" strokeWidth="20" style={{ filter: 'blur(10px)' }} />
        </svg>
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
        <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                <TrendUp weight="bold" className="text-white text-3xl" />
            </div>
            <div className="text-white font-bold text-lg tracking-wide font-['Montserrat']">Positive Momentum</div>
            <div className="text-indigo-200 text-xs uppercase tracking-widest opacity-80 mt-1">System Health Healthy</div>
        </div>
    </div>
);

// --- MOCK: Friendly Metrics ---
const generateMomentum = (window: '7d' | '30d') => {
    if (window === '7d') {
        return [
            { label: "Pipeline Health", value: "Active Flow", desc: "3 candidates advanced stages", icon: Lightning, color: "indigo", type: "stat" },
            { label: "Team Sync", value: "100%", desc: "All feedback logged on time", icon: ChatCircleDots, color: "blue", type: "stat" },
            { label: "Candidate Experience", value: "4.9/5", desc: "Positive sentiment signals", icon: Heart, color: "rose", type: "stat" },
            { label: "Outcomes", value: "1 Accepted", desc: "Offer signed in Engineering", icon: Handshake, color: "emerald", type: "stat" }
        ];
    } else {
        return [
            { label: "Growth", value: "4 Joined", desc: "Engineering & Design", icon: Users, color: "indigo", type: "stat" },
            { label: "Efficiency", value: "High", desc: "Low stagnation rate", icon: Timer, color: "blue", type: "stat" },
            { label: "Quality", value: "95%", desc: "Offer acceptance rate", icon: CheckCircle, color: "emerald", type: "stat" },
            { label: "Reach", value: "Referrals", desc: "Top sourcing channel", icon: Target, color: "purple", type: "stat" },
        ];
    }
};

// --- LOGIC: Future Recommendations ---
const generateRecommendations = (candidates: Candidate[]) => {
    const today: any[] = [];
    const tomorrow: any[] = [];
    const later: any[] = [];

    candidates.forEach(c => {
        if (c.stage === 'Offer') {
            today.push({
                id: c.id, name: c.name, role: c.role,
                action: "Close the deal",
                reason: `Offer pending for ${c.daysInStage} days. Momentum is high.`,
                confidence: "High Impact", context: "Based on recent acceptances",
                buttons: ["Send Nudge", "View Details"]
            });
            return;
        }
        if (c.stage === 'Interview' && c.daysInStage > 3) {
            tomorrow.push({
                id: c.id, name: c.name, role: c.role,
                action: "Collect Feedback",
                reason: "Interview was 3 days ago. Don't let them cool off.",
                confidence: "Risk Reducing", context: "Typical loop: 2 days",
                buttons: ["Remind Team", "Email"]
            });
            return;
        }
        if (c.stage === 'Screening' && c.daysInStage > 5) {
            today.push({
                id: c.id, name: c.name, role: c.role,
                action: "Unblock or Reject",
                reason: "Sitting in Screening for nearly a week.",
                confidence: "Low Effort",
                buttons: ["Review", "Snooze"]
            });
            return;
        }
        if (c.aiMatch > 85 && c.daysInStage > 2) {
            later.push({
                id: c.id, name: c.name, role: c.role,
                action: "Keep Warm",
                reason: "Top talent (90% match). Worth a quick check-in.",
                confidence: "High Impact",
                buttons: ["Send Update"]
            });
        }
    });

    return { today, tomorrow, later };
};

export default function HiringForesightPanel({ candidates, onAction, onHoverCandidate }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);
    const [pastTimeWindow, setPastTimeWindow] = useState<'7d' | '30d'>('7d');
    
    // Default collapse logic
    const [sections, setSections] = useState({ today: true, tomorrow: false, later: false });
    
    // NEW: Track the actively expanded card ID for the Today column
    const [activeTodayId, setActiveTodayId] = useState<string | null>(null);

    const [barTextIndex, setBarTextIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const momentumRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<number | null>(null);

    const recs = useMemo(() => {
        const r = generateRecommendations(candidates);
        // Filter dismissed & SLICE TO TOP 5
        r.today = r.today.filter(i => !dismissedIds.includes(i.id)).slice(0, 5);
        r.tomorrow = r.tomorrow.filter(i => !dismissedIds.includes(i.id)).slice(0, 5);
        r.later = r.later.filter(i => !dismissedIds.includes(i.id)).slice(0, 5);
        return r;
    }, [candidates, dismissedIds]);

    const momentum = useMemo(() => generateMomentum(pastTimeWindow), [pastTimeWindow]);

    const barTexts = useMemo(() => {
        const total = recs.today.length + recs.tomorrow.length + recs.later.length;
        const list = [`${formatCount(total, "item")} need attention`];
        if (recs.today.length > 0) list.push(`${formatCount(recs.today.length, "Action")} for Today`);
        if (recs.tomorrow.length > 0) list.push(`${formatCount(recs.tomorrow.length, "Item")} for Tomorrow`);
        return list;
    }, [recs]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBarTextIndex((prev) => (prev + 1) % barTexts.length);
        }, 4000); 
        return () => clearInterval(interval);
    }, [barTexts]);

    // NEW: Ensure the first "Today" item is expanded by default when data loads or panel opens
    useEffect(() => {
        if (recs.today.length > 0) {
            // If we don't have an active ID, or the active ID is no longer in the list (e.g. dismissed)
            if (!activeTodayId || !recs.today.find(r => r.id === activeTodayId)) {
                setActiveTodayId(recs.today[0].id);
            }
        }
    }, [recs.today, activeTodayId]);

    const handleDismiss = (id: string) => setDismissedIds(prev => [...prev, id]);

    // --- SCROLL LOGIC ---
    const handleWheel = (e: React.WheelEvent) => {
        if (!scrollRef.current) return;
        if (scrollRef.current.scrollTop <= 0 && e.deltaY < -30) {
            if (!scrollTimeout.current) {
                scrollTimeout.current = window.setTimeout(() => {
                    setIsOpen(false);
                    scrollTimeout.current = null;
                }, 100);
            }
        }
    };

    const scrollToMomentum = () => {
        if (momentumRef.current) {
            momentumRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (isOpen && scrollRef.current) scrollRef.current.scrollTop = 0;
    }, [isOpen]);

    return (
        <>
            <div 
                className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-500 z-40 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            <div 
                className={`
                    absolute bottom-0 left-0 right-0 z-50 
                    bg-white dark:bg-[#0f172a] border-t border-indigo-500/20 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.3)]
                    transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col
                    ${isOpen ? 'h-[85dvh] rounded-t-[32px]' : 'h-14 hover:h-16 cursor-pointer'}
                `}
            >
                {/* --- 1. SLIM BAR --- */}
                <div 
                    onClick={() => !isOpen && setIsOpen(true)}
                    className={`w-full h-14 flex items-center justify-between px-8 transition-all duration-300 shrink-0 ${isOpen ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="font-bold text-sm text-indigo-900 dark:text-indigo-200 tracking-wide font-['Montserrat']">
                                Hiring Foresight
                            </span>
                        </div>
                        <span className="text-xs opacity-60 border-l-2 border-gray-200 dark:border-white/10 pl-4 font-medium animate-fade-in key={barTextIndex}">
                            {barTexts[barTextIndex]}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                        <CaretUp weight="bold" /> Next 7 Days
                    </div>
                </div>

                {/* --- 2. EXPANDED CONTENT --- */}
                <div 
                    onWheel={handleWheel}
                    ref={scrollRef}
                    className={`flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory no-scrollbar ${isOpen ? 'opacity-100 delay-150' : 'opacity-0 hidden'}`}
                >
                    
                    {/* --- FUTURE SECTION (Snap Start) --- */}
                    <div className="min-h-full snap-start flex flex-col relative">
                        <div className="flex justify-between items-start px-10 py-8 shrink-0 sticky top-0 z-20 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md transition-all rounded-t-[32px]">
                            <div>
                                <h2 className="text-3xl font-black font-['Montserrat'] flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                    <Sparkle weight="fill" className="text-indigo-500" />
                                    Foresight
                                </h2>
                                <p className="text-base opacity-70 mt-2 max-w-xl font-medium leading-relaxed">
                                    Here is how the week looks if nothing changes.
                                </p>
                                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-500/20 mt-3 inline-block uppercase tracking-wide">
                                    Based on this pipeline only
                                </span>
                            </div>
                            
                            <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition shadow-sm text-[var(--text-main)]">
                                <X weight="bold" size={20} />
                            </button>
                        </div>

                        {/* Stream Content */}
                        <div className="flex-1 px-10 pb-20 overflow-x-auto overflow-y-hidden flex flex-col md:flex-row items-stretch gap-10 py-6">
                            
                            {/* TODAY - SINGLE COLUMN, MAX 5 - (ACCORDION BEHAVIOR) */}
                            <div className="w-full md:min-w-[360px] flex flex-col gap-5">
                                <div 
                                    className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-3 cursor-pointer hover:opacity-80 select-none border-b border-emerald-500/20 pb-2"
                                    onClick={() => setSections(prev => ({...prev, today: !prev.today}))}
                                >
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div> 
                                    Today {sections.today ? <CaretDown weight="bold" /> : <ArrowRight weight="bold" />}
                                </div>
                                {sections.today ? (
                                    recs.today.length === 0 ? <EmptyState label="All clear for today" /> : (
                                        <div className="flex flex-col gap-3">
                                            {recs.today.map((item, i) => (
                                                <RecommendationCard 
                                                    key={i} 
                                                    item={item} 
                                                    onAction={onAction} 
                                                    onHover={onHoverCandidate} 
                                                    onDismiss={handleDismiss} 
                                                    delay={i * 100}
                                                    // Pass accordion props for "Today" column
                                                    isExpanded={item.id === activeTodayId}
                                                    onExpand={() => setActiveTodayId(item.id)}
                                                />
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    <CollapsedPlaceholder count={recs.today.length} onClick={() => setSections(prev => ({...prev, today: true}))} />
                                )}
                            </div>

                            {/* TOMORROW - SINGLE COLUMN, MAX 5 (INDEPENDENT HOVER) */}
                            <div className="w-full md:min-w-[360px] flex flex-col gap-5">
                                <div 
                                    className={`text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-3 cursor-pointer hover:opacity-80 select-none border-b pb-2 ${sections.tomorrow ? 'text-blue-600 dark:text-blue-400 border-blue-500/20' : 'text-gray-400 border-gray-200 dark:border-white/10'}`}
                                    onClick={() => setSections(prev => ({...prev, tomorrow: !prev.tomorrow}))}
                                >
                                    <div className={`w-2.5 h-2.5 rounded-full ${sections.tomorrow ? 'bg-blue-500' : 'bg-gray-300 dark:bg-white/20'}`}></div> 
                                    Tomorrow {sections.tomorrow ? <CaretDown weight="bold" /> : <ArrowRight weight="bold" />}
                                </div>
                                {sections.tomorrow ? (
                                    recs.tomorrow.length === 0 ? <EmptyState label="Nothing urgent" /> : (
                                        <div className="flex flex-col gap-3">
                                            {recs.tomorrow.map((item, i) => (
                                                <RecommendationCard key={i} item={item} onAction={onAction} onHover={onHoverCandidate} onDismiss={handleDismiss} delay={i * 100 + 200} />
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    <CollapsedPlaceholder count={recs.tomorrow.length} onClick={() => setSections(prev => ({...prev, tomorrow: true}))} />
                                )}
                            </div>

                            {/* LATER - SINGLE COLUMN, MAX 5 (INDEPENDENT HOVER) */}
                            <div className="w-full md:min-w-[360px] flex flex-col gap-5 md:border-l-2 border-dashed border-gray-100 dark:border-white/5 md:pl-10">
                                <div 
                                    className="text-xs font-black uppercase tracking-widest opacity-40 mb-2 flex items-center gap-3 cursor-pointer hover:opacity-80 select-none border-b border-gray-200 dark:border-white/5 pb-2"
                                    onClick={() => setSections(prev => ({...prev, later: !prev.later}))}
                                >
                                    If Nothing Changes {sections.later ? <CaretDown weight="bold" /> : <ArrowRight weight="bold" />}
                                </div>
                                {sections.later ? (
                                    recs.later.length === 0 ? <EmptyState label="Pipeline is healthy" /> : (
                                        <div className="flex flex-col gap-3">
                                            {recs.later.map((item, i) => (
                                                <RecommendationCard key={i} item={item} onAction={onAction} onHover={onHoverCandidate} onDismiss={handleDismiss} delay={i * 100 + 400} isGhost />
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    <CollapsedPlaceholder count={recs.later.length} onClick={() => setSections(prev => ({...prev, later: true}))} />
                                )}
                            </div>
                        </div>

                        {/* Snap Transition / Divider */}
                        <div 
                            className="absolute bottom-6 left-0 right-0 flex justify-center opacity-60 hover:opacity-100 transition-opacity animate-pulse z-20"
                            onClick={scrollToMomentum}
                        >
                            <div className="flex flex-col items-center gap-1 cursor-pointer group">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 group-hover:text-indigo-500 transition-colors">See Recent Momentum</span>
                                <ArrowDown weight="bold" className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* --- PAGE 2: REFLECT (Snap Start) --- */}
                    <div ref={momentumRef} className="min-h-full snap-start bg-gradient-to-b from-gray-50/50 to-white dark:from-black/20 dark:to-[#0f172a] p-10 pt-16 flex flex-col relative border-t border-gray-100 dark:border-white/5 rounded-t-[32px]">
                        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
                            
                            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-200 dark:border-white/10 pb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500 shadow-sm"><Clock weight="duotone" size={28} /></div>
                                        <h3 className="text-4xl font-black text-[var(--text-main)] font-['Montserrat']">
                                            What just happened?
                                        </h3>
                                    </div>
                                    <p className="text-base opacity-60 font-medium max-w-lg">
                                        Reflecting on recent outcomes and momentum. <br/>
                                        <span className="text-xs font-normal opacity-50 italic">These outcomes influence how future recommendations are weighted.</span>
                                    </p>
                                </div>
                                
                                <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1.5 border border-gray-200 dark:border-white/5 mt-4 md:mt-0">
                                    <button 
                                        onClick={() => setPastTimeWindow('7d')}
                                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition shadow-sm ${pastTimeWindow === '7d' ? 'bg-white dark:bg-[#1e293b] text-indigo-600 dark:text-indigo-400 shadow-md ring-1 ring-black/5' : 'opacity-50 hover:opacity-100 text-[var(--text-main)]'}`}
                                    >
                                        Last 7 Days
                                    </button>
                                    <button 
                                        onClick={() => setPastTimeWindow('30d')}
                                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition shadow-sm ${pastTimeWindow === '30d' ? 'bg-white dark:bg-[#1e293b] text-indigo-600 dark:text-indigo-400 shadow-md ring-1 ring-black/5' : 'opacity-50 hover:opacity-100 text-[var(--text-main)]'}`}
                                    >
                                        Last 30 Days
                                    </button>
                                </div>
                            </div>
                            
                            {/* NEW LAYOUT: Graphic + Metrics */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                                {/* 1. The stylized "River" Graphic */}
                                <div className="lg:col-span-1">
                                    <FlowGraphic />
                                </div>

                                {/* 2. The Metrics List */}
                                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                    {momentum.map((m, i) => (
                                        <div key={i} className="flex gap-5 group">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-all group-hover:scale-110 shadow-sm ${
                                                m.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                                                m.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                                                m.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-500' :
                                                m.color === 'rose' ? 'bg-rose-500/10 text-rose-500' :
                                                'bg-purple-500/10 text-purple-500'
                                            }`}>
                                                <m.icon weight="duotone" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{m.label}</div>
                                                <div className="font-bold text-2xl text-gray-900 dark:text-white leading-none mb-2 font-['Montserrat']">{m.value}</div>
                                                <div className="text-sm font-medium opacity-70 border-l-2 border-gray-200 dark:border-white/10 pl-2">
                                                    {m.desc}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-16 text-center">
                                <div className="inline-flex items-center gap-2 opacity-30 text-sm font-serif italic">
                                    <Info weight="bold" />
                                    "Metrics are updated in real-time based on pipeline movements."
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

// --- RECOMMENDATION CARD (Updated with Props for Control & Delay) ---
const RecommendationCard = ({ 
    item, onAction, onHover, onDismiss, delay, isGhost, 
    isExpanded, onExpand 
}: any) => {
    // Internal state for "uncontrolled" cards (Tomorrow/Later columns)
    const [internalHover, setInternalHover] = useState(false);
    const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);

    // Determine effective state (Controlled via props OR Internal state)
    const isControlled = isExpanded !== undefined;
    const isActive = isControlled ? isExpanded : internalHover;

    return (
        <div 
            className={`
                group rounded-2xl border transition-all duration-300 ease-out delay-200 animate-fade-in-up relative overflow-hidden flex flex-col cursor-default
                ${isGhost ? 'bg-transparent border-gray-200 dark:border-white/5 opacity-60' : 'bg-white dark:bg-white/5 border-indigo-100 dark:border-white/10 shadow-sm'}
                ${isActive ? 'p-6 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:-translate-y-1 z-10' : 'p-4'}
            `}
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
            onMouseEnter={() => { 
                if (isControlled) {
                    onExpand(); // Trigger parent change
                } else {
                    setInternalHover(true); 
                }
                onHover(item.id); 
            }}
            onMouseLeave={() => { 
                if (!isControlled) {
                    setInternalHover(false); 
                }
                onHover(null); 
            }}
        >
            {/* Header (Always Visible) */}
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className={`font-bold text-gray-900 dark:text-white leading-tight transition-all delay-200 duration-300 ${isActive ? 'text-lg mb-1' : 'text-sm mb-0'}`}>{item.name}</div>
                    <div className="text-xs opacity-50 font-bold uppercase tracking-wider">{item.role}</div>
                </div>
                
                {/* Expand Indicator (Rotates on Hover) */}
                <div className={`text-indigo-400 transition-transform duration-300 delay-200 ${isActive ? 'rotate-180 opacity-0' : 'opacity-50'}`}>
                    <CaretDown weight="bold" />
                </div>
            </div>

            {/* Always Visible Badge (Compact) */}
            <div className={`mt-3 flex flex-wrap items-center gap-2 ${isActive ? 'hidden' : 'block'}`}>
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-500/10 truncate">
                    {item.action}
                </span>
            </div>

            {/* Expanded Content (Reason, Context, Buttons) */}
            {isActive && (
                <div className="mt-4 animate-fade-in space-y-3">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDismiss(item.id); }}
                        className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-red-500 transition-all"
                        title="Dismiss"
                    >
                        <X weight="bold" size={14} />
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-500/10">
                            {item.action}
                        </span>
                        {item.confidence && (
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md uppercase tracking-wide border border-emerald-100 dark:border-emerald-500/10">
                                {item.confidence}
                            </span>
                        )}
                    </div>
                    
                    <p className="text-sm opacity-80 leading-relaxed font-medium text-gray-600 dark:text-gray-300 border-l-2 border-gray-200 dark:border-white/10 pl-3">
                        {item.reason}
                    </p>
                    
                    {item.context && (
                        <div className="flex items-center gap-1.5 text-[10px] opacity-50 font-bold uppercase tracking-wider mt-2">
                            <div className="w-1 h-1 rounded-full bg-current"></div> {item.context}
                        </div>
                    )}

                    <div className="flex gap-2 pt-4 mt-2 border-t border-gray-100 dark:border-white/5">
                        {item.buttons.map((btn: string) => {
                            if (btn === 'Snooze') {
                                return (
                                    <div key={btn} className="flex-1 relative" onMouseLeave={() => setShowSnoozeOptions(false)}>
                                        {!showSnoozeOptions ? (
                                            <button onClick={() => setShowSnoozeOptions(true)} className="w-full py-2 text-xs font-bold uppercase tracking-wide rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Snooze</button>
                                        ) : (
                                            <div className="absolute bottom-0 left-0 w-full flex gap-2 animate-scale-in">
                                                <button onClick={() => onAction(item.id, 'Snooze 1d')} className="flex-1 py-2 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg whitespace-nowrap">1d</button>
                                                <button onClick={() => onAction(item.id, 'Snooze 1w')} className="flex-1 py-2 text-[10px] bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold shadow-lg whitespace-nowrap">1w</button>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return (
                                <button 
                                    key={btn} 
                                    onClick={() => onAction(item.id, btn)} 
                                    className="flex-1 py-2 text-xs font-bold uppercase tracking-wide rounded-xl border border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-sm"
                                >
                                    {btn}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const EmptyState = ({ label }: { label: string }) => (<div className="h-24 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-xs font-bold opacity-40 uppercase tracking-widest bg-gray-50/30 dark:bg-white/5">{label}</div>);
const CollapsedPlaceholder = ({ count, onClick }: { count: number, onClick: () => void }) => (<div onClick={onClick} className="h-14 rounded-xl border border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition opacity-60 hover:opacity-100 group"><span className="text-xs font-bold uppercase tracking-widest group-hover:text-indigo-500 transition-colors">Click to expand {formatCount(count, "action")}</span><CaretDown weight="bold" size={12} /></div>);