import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_DB } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { 
    Plus, CheckCircle, XCircle, User, Clock, 
    ChatCenteredText, MagnifyingGlass, Funnel, 
    UserPlus, ArrowRight, CaretLeft, CaretRight, Note, 
    ClockCounterClockwise, ShieldCheck, Files, Archive,
    Sparkle, EnvelopeSimple, Phone, CalendarPlus, DotsThree,
    UserGear, Lightning, Warning
} from '@phosphor-icons/react';
import CandidateModal, { CandidateDetails } from './components/CandidateModal';
import VerificationModal from './components/VerificationModal';
import EmployeeSetupModal from './components/EmployeeSetupModal';
import RequisitionsModal from './components/RequisitionsModal';
import AddCandidateModal from './components/AddCandidateModal';
import HiringForesightPanel from './components/HiringForesightPanel';

// --- Types ---
interface ExtendedCandidate extends CandidateDetails {
    originalId: string;
    aiMatch: number;
    aiReason: string; 
    daysInStage: number; 
}

interface LogEntry {
    id: string;
    text: string;
    timestamp: string;
}

const STAGES = ['Screening', 'Interview', 'Offer', 'Hired', 'Onboarding'];

const hydrateCandidates = (baseCandidates: any[]): ExtendedCandidate[] => {
    return baseCandidates.map(c => {
        const daysInStage = Math.floor(Math.random() * 10);
        const d = new Date();
        d.setDate(d.getDate() - daysInStage);
        
        const aiMatch = Math.floor(Math.random() * (99 - 75) + 75);
        let aiReason = "Strong skill match.";
        if (aiMatch > 90) aiReason = "Top 1% Trajectory. Highly Recommended.";
        else if (aiMatch > 85) aiReason = "Solid skills, but check salary expectations.";
        else aiReason = "Good cultural fit, missing some React exp.";

        return {
            id: c.id,
            originalId: c.id,
            name: c.name,
            role: c.role,
            stage: c.stage,
            tags: ['Senior', 'Remote', 'Top Talent'],
            notes: [{ id: 'n1', text: 'Initial screening passed.', date: d.toLocaleString(), author: 'Recruiter' }],
            files: [],
            email: `${c.name.split(' ')[0].toLowerCase()}@example.com`,
            phone: '+1 (555) 000-0000',
            location: 'New York, USA',
            lastUpdated: d.toISOString(),
            summary: "Strong candidate with experience in relevant fields.",
            rating: 0,
            aiMatch,
            aiReason,
            daysInStage
        };
    });
};

const ConfettiRain = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[100]">
            <style>
                {`
                @keyframes fall {
                    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                `}
            </style>
            {[...Array(50)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute top-[-20px]"
                    style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'][Math.floor(Math.random() * 5)],
                        width: `${Math.random() * 8 + 4}px`,
                        height: `${Math.random() * 8 + 4}px`,
                        animation: `fall ${Math.random() * 2 + 1.5}s linear forwards`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px'
                    }}
                />
            ))}
        </div>
    );
};

const Hiring: React.FC = () => {
  const { currentClientId } = useAuth();
  
  const [candidates, setCandidates] = useState<ExtendedCandidate[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<ExtendedCandidate | null>(null);
  const [search, setSearch] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [hiredCandidateId, setHiredCandidateId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const [highlightedForesightId, setHighlightedForesightId] = useState<string | null>(null);

  const [showRequisitions, setShowRequisitions] = useState(false);
  const [showNewReqModal, setShowNewReqModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [setupModalCandidate, setSetupModalCandidate] = useState<ExtendedCandidate | null>(null);
  
  const [verificationModal, setVerificationModal] = useState<{ 
      show: boolean, 
      type: 'verify' | 'revoke', 
      candidateId: string | null,
      targetStage?: string 
  }>({ show: false, type: 'verify', candidateId: null });
  
  const [newReqForm, setNewReqForm] = useState({ title: '', dept: '', budget: '' });
  
  const [showFilters, setShowFilters] = useState(false);
  const [showRejections, setShowRejections] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const historyTimer = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ canLeft: false, canRight: true });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const activeCandidates = useMemo(() => candidates.filter(c => c.stage !== 'Rejected'), [candidates]);
  const allTags = useMemo(() => Array.from(new Set(activeCandidates.flatMap(c => c.tags))), [activeCandidates]);

  const filteredCandidates = useMemo(() => {
      return candidates.filter(c => {
          if (c.stage === 'Rejected') return false; 
          const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
          const matchesTags = selectedTags.length === 0 || selectedTags.every(t => c.tags.includes(t));
          return matchesSearch && matchesTags;
      });
  }, [candidates, search, selectedTags]);

  const rejectedCandidates = useMemo(() => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return candidates.filter(c => c.stage === 'Rejected' && new Date(c.lastUpdated) > thirtyDaysAgo);
  }, [candidates]);

  const hiredCandidate = useMemo(() => candidates.find(c => c.id === hiredCandidateId), [candidates, hiredCandidateId]);

  useEffect(() => {
      const baseData = MOCK_DB.hiring.filter(h => h.clientId === currentClientId);
      setCandidates(hydrateCandidates(baseData));
  }, [currentClientId]);

  const checkScroll = () => {
      if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          setScrollState({
              canLeft: scrollLeft > 10,
              canRight: scrollLeft < scrollWidth - clientWidth - 10
          });
      }
  };

  useEffect(() => {
      const el = scrollContainerRef.current;
      if (el) {
          el.addEventListener('scroll', checkScroll);
          setTimeout(checkScroll, 100);
          return () => el.removeEventListener('scroll', checkScroll);
      }
  }, []);

  const addLog = (text: string) => setLogs(prev => [{ id: Math.random().toString(), text, timestamp: new Date().toLocaleTimeString() }, ...prev]);

  const scrollBoard = (dir: 'left' | 'right') => {
      if (scrollContainerRef.current) {
          const amount = dir === 'left' ? -400 : 400;
          scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
          setTimeout(checkScroll, 500);
      }
  };

  const toggleTag = (tag: string) => {
      setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const createRequisition = () => {
      if (!newReqForm.title) return;
      addLog(`Created Requisition: ${newReqForm.title}`);
      setShowNewReqModal(false);
      setNewReqForm({ title: '', dept: '', budget: '' });
      alert("New Requisition Created Successfully!");
  };

  const updateCandidate = (updated: ExtendedCandidate) => {
      setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
      if (selectedCandidate?.id === updated.id) {
          setSelectedCandidate(updated);
      }
  };

  const addCandidate = (newCandidate: ExtendedCandidate) => {
      setCandidates(prev => [...prev, newCandidate]);
      addLog(`Added new candidate: ${newCandidate.name}`);
  };

  const handleHistoryEnter = () => {
      if (historyTimer.current) clearTimeout(historyTimer.current);
      setShowHistory(true);
  };
  const handleHistoryLeave = () => {
      historyTimer.current = window.setTimeout(() => {
          setShowHistory(false); 
      }, 400); 
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
      setDraggedId(id);
      e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragOverStage !== stage) setDragOverStage(stage);
  };

  const handleDragLeave = () => {
      setDragOverStage(null);
  }

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
      e.preventDefault();
      setDragOverStage(null);
      if (!draggedId) return;
      const candidate = candidates.find(c => c.id === draggedId);
      if (!candidate || candidate.stage === targetStage) return;

      const currentStage = candidate.stage;

      if (targetStage === 'Onboarding') {
          if (currentStage !== 'Hired') {
              alert("Candidates must be 'Hired' before they can be Onboarded.");
              setDraggedId(null);
              return;
          }
          setVerificationModal({ show: true, type: 'verify', candidateId: candidate.id, targetStage });
          setDraggedId(null);
          return;
      }

      const recruitmentStages = ['Screening', 'Interview', 'Offer'];
      const isRevokingFromHired = currentStage === 'Hired' && recruitmentStages.includes(targetStage);
      const isRevokingFromOnboarding = currentStage === 'Onboarding' && (recruitmentStages.includes(targetStage) || targetStage === 'Hired');

      if (isRevokingFromHired || isRevokingFromOnboarding) {
          setVerificationModal({ show: true, type: 'revoke', candidateId: candidate.id, targetStage });
          setDraggedId(null);
          return;
      }

      const updated = { ...candidate, stage: targetStage, lastUpdated: new Date().toISOString(), daysInStage: 0 };
      setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
      addLog(`Moved ${candidate.name} to ${targetStage}`);

      if (targetStage === 'Hired') {
          setHiredCandidateId(candidate.id);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000); 
      }
      setDraggedId(null);
  };

  const handleConfirmVerification = () => {
      const { type, candidateId, targetStage } = verificationModal;
      const c = candidates.find(x => x.id === candidateId);
      if (!c) return;

      if (type === 'verify') {
          const updated = { ...c, stage: 'Onboarding', lastUpdated: new Date().toISOString(), daysInStage: 0 };
          setCandidates(prev => prev.map(x => x.id === c.id ? updated : x));
          addLog(`Verified & Onboarded ${c.name}`);
          alert(`${c.name} has been marked as verified. You can now finalize their setup.`);
      } else {
          const fallbackStage = c.stage === 'Onboarding' ? 'Hired' : 'Offer';
          const finalStage = targetStage || fallbackStage;
          
          const updated = { ...c, stage: finalStage, lastUpdated: new Date().toISOString(), daysInStage: 0 };
          setCandidates(prev => prev.map(x => x.id === c.id ? updated : x));
          addLog(`Revoked ${c.name} status to ${finalStage}`);
          
          alert(`${c.name} status revoked (returned to ${finalStage}).`);
      }
      setVerificationModal({ show: false, type: 'verify', candidateId: null });
  };

  const handleFinalizeSetup = (c: ExtendedCandidate) => setSetupModalCandidate(c);
  
  const onSetupComplete = () => {
      if (setupModalCandidate) {
          alert(`${setupModalCandidate.name} is now ACTIVE in the People Directory!`);
          setSetupModalCandidate(null);
          addLog(`Activated employee ${setupModalCandidate.name}`);
      }
  };

  const handleForesightAction = (candidateId: string, action: string) => {
      const candidate = candidates.find(c => c.id === candidateId);
      if (!candidate) return;

      if (action.includes("Email") || action.includes("Contact")) {
          alert(`Opening email draft for ${candidate.name}...`);
      } else if (action.includes("Details") || action.includes("Review")) {
          setSelectedCandidate(candidate);
      } else {
          addLog(`Action taken via Foresight: ${action} on ${candidate.name}`);
      }
  };

  const rejectCandidate = (id: string) => {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage: 'Rejected', lastUpdated: new Date().toISOString() } : c));
      addLog('Rejected candidate');
      setSelectedCandidate(null);
  };

  return (
    <div className="p-8 h-full flex flex-col text-[var(--text-main)] animate-fade-in overflow-hidden relative">
      {showConfetti && <ConfettiRain />}

      {showConfetti && hiredCandidate && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[70] animate-pop-in">
              <div className="bg-indigo-900 text-white pl-6 pr-2 py-2 rounded-full shadow-2xl flex items-center gap-4 border border-indigo-500/50 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                      <span className="bg-green-500 rounded-full p-1"><CheckCircle weight="fill" /></span>
                      <span className="font-bold text-sm">{hiredCandidate.name} Hired!</span>
                  </div>
                  <button onClick={() => { setShowConfetti(false); setVerificationModal({ show: true, type: 'verify', candidateId: hiredCandidate.id, targetStage: 'Onboarding' }); }} className="bg-white text-indigo-900 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-100 transition flex items-center gap-1">Verify & Onboard <ArrowRight weight="bold" /></button>
                  <button onClick={() => setShowConfetti(false)} className="p-1 hover:bg-white/10 rounded-full"><XCircle size={18} /></button>
              </div>
          </div>
      )}

      <header className="mb-6 shrink-0 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black font-['Montserrat'] tracking-tight flex items-center gap-3">
                  Talent Pipeline 
                  <span className="text-xs bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                      <Sparkle weight="fill" /> AI Enhanced
                  </span>
              </h1>
              <div className="flex gap-6 mt-4 text-sm font-medium opacity-70 items-center">
                  <span className="flex items-center gap-2"><User weight="fill" className="text-blue-500" /> {candidates.filter(c => c.stage !== 'Rejected').length} Active</span>
                  <span className="flex items-center gap-2"><CheckCircle weight="fill" className="text-emerald-500" /> {candidates.filter(c => c.stage === 'Hired').length} Hired</span>
                  <button onClick={() => setShowRejections(true)} className="flex items-center gap-2 hover:text-indigo-500 transition"><Archive weight="bold" /> {rejectedCandidates.length} Rejected (30d)</button>
              </div>
            </div>
            
            <div className="flex gap-3">
                <button onClick={() => setShowAddCandidateModal(true)} className="flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 rounded-xl font-bold transition hover:bg-indigo-50 dark:hover:bg-indigo-500/10 whitespace-nowrap"><UserPlus weight="bold" size={18} /> <span>Add Candidate</span></button>
                <button onClick={() => setShowRequisitions(true)} className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 group whitespace-nowrap"><Files weight="bold" size={18} /> <span>Requisitions</span></button>
            </div>
        </div>

        <div className="flex gap-4">
            <div className="relative flex-1 max-w-md group flex items-center">
                <MagnifyingGlass size={18} className="absolute left-3 text-gray-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10" weight="bold" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full bg-[var(--color-surface)]/500 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition backdrop-blur-sm shadow-sm" />
            </div>
            
            <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition border ${selectedTags.length > 0 ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30' : 'bg-[var(--color-surface)]/500 dark:bg-black/20 border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-[var(--color-surface)]/50'}`}
            >
                <Funnel weight="bold" /> Filter
                {selectedTags.length > 0 && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
            </button>

            {showFilters && (
                <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar items-center mask-fade-right animate-fade-in-right">
                    {allTags.map(tag => (
                        <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition whitespace-nowrap ${selectedTags.includes(tag) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-[var(--color-surface)]/500 dark:bg-[var(--color-surface)]/50 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            <div className="relative ml-auto" onMouseEnter={handleHistoryEnter} onMouseLeave={handleHistoryLeave}>
                <button className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition border ${showHistory ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-[var(--color-surface)]/500 dark:bg-black/20 border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-[var(--color-surface)]/50'}`}><ClockCounterClockwise weight="bold" /> History</button>
                {showHistory && (
                    <div className="absolute top-full right-0 mt-2 w-96 bg-[var(--color-surface)] rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 p-4 z-50 animate-fade-in-up">
                        <h4 className="text-xs font-bold uppercase opacity-50 mb-3">Activity Log</h4>
                        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                            {logs.map(log => (
                                <div key={log.id} className="text-xs border-l-2 border-indigo-500 pl-2">
                                    <div className="font-medium opacity-80">{log.text}</div>
                                    <div className="opacity-40 text-[10px]">{log.timestamp}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </header>

      {/* Board */}
      <div className="flex-1 relative overflow-hidden group/board">
          {/* UPDATED SCROLL BUTTONS (Consistent with TaskBoard) */}
          {scrollState.canLeft && <button onClick={() => scrollBoard('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 dark:bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-r-2xl shadow-xl hover:pl-4 transition-all opacity-0 group-hover/board:opacity-100 hover:scale-110 border border-gray-200 dark:border-white/10 text-indigo-500"><CaretLeft weight="bold" size={24} /></button>}
          {scrollState.canRight && <button onClick={() => scrollBoard('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 dark:bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-l-2xl shadow-xl hover:pr-4 transition-all opacity-0 group-hover/board:opacity-100 hover:scale-110 border border-gray-200 dark:border-white/10 text-indigo-500"><CaretRight weight="bold" size={24} /></button>}

          <div ref={scrollContainerRef} className="flex gap-6 h-full overflow-x-auto overflow-y-hidden pb-4 px-1 scroll-smooth no-scrollbar">
            {STAGES.map(stage => {
                const stageCandidates = filteredCandidates.filter(c => c.stage === stage).sort((a,b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
                const isHired = stage === 'Hired';
                const isOnboarding = stage === 'Onboarding';
                const isOffer = stage === 'Offer';
                const isDragOver = dragOverStage === stage;
                
                let colBorder = 'border-t-4 border-t-indigo-500';
                let colBg = 'bg-gray-50/50 dark:bg-white/[0.02]';
                
                if (isOffer) { colBorder = 'border-t-4 border-t-amber-500'; colBg = 'bg-amber-500/5 dark:bg-amber-500/5'; }
                if (isHired) { colBorder = 'border-t-4 border-t-emerald-500'; colBg = 'bg-emerald-500/5 dark:bg-emerald-500/5'; }
                if (isOnboarding) { colBorder = 'border-t-4 border-t-blue-500'; colBg = 'bg-blue-500/5 dark:bg-blue-500/5'; }

                if (isDragOver) {
                    colBg = 'bg-indigo-500/10 dark:bg-indigo-500/20';
                    colBorder = 'border-t-4 border-t-white shadow-[0_0_30px_rgba(99,102,241,0.3)]';
                }

                return (
                <div 
                    key={stage} 
                    className={`flex-1 flex flex-col min-w-[320px] max-w-[380px] ${colBg} rounded-2xl p-3 border border-gray-200 dark:border-white/5 ${colBorder} transition-all duration-300`} 
                    onDragOver={(e) => handleDragOver(e, stage)} 
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, stage)}
                >
                    <div className="flex justify-between items-center mb-4 px-2 pt-2">
                        <h3 className="font-bold text-xs uppercase opacity-80 tracking-widest">{stage}</h3>
                        <span className="bg-white dark:bg-white/10 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-60 shadow-sm">{stageCandidates.length}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 px-1 pb-2">
                        {stageCandidates.length === 0 && (
                            <div className={`h-32 flex flex-col items-center justify-center opacity-30 text-center border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl m-1 transition-colors ${isDragOver ? 'border-indigo-400 text-indigo-400 opacity-80 bg-indigo-500/10' : ''}`}>
                                <UserPlus size={32} weight="duotone" className="mb-2" />
                                <span className="text-xs font-bold">{isDragOver ? 'Drop to Move' : 'Empty Stage'}</span>
                            </div>
                        )}
                        
                        {stageCandidates.map(c => {
                            const isFresh = c.daysInStage < 2;
                            const isStale = c.daysInStage > 7;
                            const isHot = c.aiMatch > 90;
                            const isHighlighted = highlightedForesightId === c.id;

                            return (
                            <div 
                                key={c.id} 
                                className={`
                                    glass-card !p-0 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-all duration-300 group relative overflow-visible 
                                    !bg-white dark:!bg-[var(--color-surface)] border hover:shadow-xl hover:border-indigo-500/30
                                    ${isStale ? 'opacity-70 hover:opacity-100 border-gray-200 dark:border-white/5' : 'border-gray-100 dark:border-white/10'}
                                    ${isFresh ? 'ring-2 ring-indigo-500/30 shadow-indigo-500/20' : ''}
                                    ${isHighlighted ? 'ring-4 ring-indigo-400 scale-105 z-50 shadow-2xl shadow-indigo-500/40' : ''}
                                `}
                                draggable 
                                onDragStart={(e) => handleDragStart(e, c.id)} 
                                onClick={() => setSelectedCandidate(c)}
                            >
                                <div className={`absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity ${isHired ? 'bg-emerald-500' : isOnboarding ? 'bg-blue-500' : 'bg-indigo-500'}`}></div>
                                
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <button className="p-1.5 bg-gray-100 dark:bg-white/10 hover:bg-indigo-500 hover:text-white rounded-lg text-gray-500 transition shadow-sm" title="Email"><EnvelopeSimple size={14} weight="bold" /></button>
                                    <button className="p-1.5 bg-gray-100 dark:bg-white/10 hover:bg-emerald-500 hover:text-white rounded-lg text-gray-500 transition shadow-sm" title="Call"><Phone size={14} weight="bold" /></button>
                                    <button className="p-1.5 bg-gray-100 dark:bg-white/10 hover:bg-indigo-500 hover:text-white rounded-lg text-gray-500 transition shadow-sm" title="Schedule"><CalendarPlus size={14} weight="bold" /></button>
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-inner text-white shrink-0">
                                                {c.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm leading-tight text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition-colors flex items-center gap-1">
                                                    {c.name}
                                                    {isHot && <Lightning weight="fill" className="text-amber-400" size={12} />}
                                                </div>
                                                <div className="text-[10px] opacity-60 flex items-center gap-1 mt-0.5 font-medium">{c.role}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex flex-wrap gap-1">
                                            {c.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[9px] font-bold uppercase bg-gray-100 dark:bg-[var(--color-surface)]/50 border border-gray-200 dark:border-white/10 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">{tag}</span>
                                            ))}
                                        </div>
                                        
                                        <div className="relative group/ai">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 cursor-help">
                                                <Sparkle weight="fill" /> {c.aiMatch}% Match
                                            </div>
                                            <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-[var(--color-surface)] text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover/ai:opacity-100 transition pointer-events-none z-50">
                                                <div className="font-bold mb-1 text-indigo-300">AI Insight:</div>
                                                {c.aiReason}
                                                <div className="absolute bottom-[-4px] right-4 w-2 h-2 bg-[var(--color-surface)] rotate-45"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-[10px] opacity-50 font-medium">
                                        <div className={`flex items-center gap-1 transition-colors ${isStale ? 'text-red-400 opacity-100' : 'group-hover:text-indigo-500'}`}>
                                            {isStale ? <Warning weight="fill" /> : <Clock weight="bold" />} 
                                            {c.daysInStage === 0 ? 'Today' : `${c.daysInStage}d in stage`}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ChatCenteredText weight="bold" /> {c.notes.length}
                                        </div>
                                    </div>
                                    
                                    {isHired && (
                                        <button onClick={(e) => { e.stopPropagation(); setVerificationModal({ show: true, type: 'verify', candidateId: c.id, targetStage: 'Onboarding' }); }} className="mt-3 w-full py-2 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-lg text-[10px] font-bold uppercase transition flex items-center justify-center gap-2 border border-emerald-500/20">
                                            <ShieldCheck weight="fill" size={14} /> Verify & Onboard
                                        </button>
                                    )}

                                    {isOnboarding && (
                                        <button onClick={(e) => { e.stopPropagation(); handleFinalizeSetup(c); }} className="mt-3 w-full py-2 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-600 rounded-lg text-[10px] font-bold uppercase transition flex items-center justify-center gap-2 border border-indigo-500/20">
                                            <UserGear weight="fill" size={14} /> Finalize Setup
                                        </button>
                                    )}
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
                );
            })}
          </div>
      </div>

      <HiringForesightPanel 
          candidates={candidates} 
          onAction={handleForesightAction} 
          onHoverCandidate={setHighlightedForesightId} 
      />

      {selectedCandidate && (
          <CandidateModal 
            candidate={selectedCandidate} 
            onClose={() => setSelectedCandidate(null)} 
            onUpdate={(u) => { 
                updateCandidate(u as ExtendedCandidate); 
                addLog(`Updated ${u.name}`); 
            }}
            onReject={(id) => { rejectCandidate(id); }}
          />
      )}
      
      {verificationModal.show && verificationModal.candidateId && (() => { const c = candidates.find(x => x.id === verificationModal.candidateId); return c ? <VerificationModal candidate={c} type={verificationModal.type} onConfirm={handleConfirmVerification} onClose={() => setVerificationModal({ ...verificationModal, show: false })} /> : null; })()}
      
      {showRequisitions && <RequisitionsModal onClose={() => setShowRequisitions(false)} />}
      
      {showAddCandidateModal && (
          <AddCandidateModal 
            onClose={() => setShowAddCandidateModal(false)}
            onAdd={(c) => { 
                addCandidate({ 
                    ...c, 
                    aiMatch: Math.floor(Math.random() * 30) + 70,
                    aiReason: "New candidate analysis pending...",
                    daysInStage: 0 
                } as ExtendedCandidate); 
            }}
          />
      )}

      {setupModalCandidate && (
          <EmployeeSetupModal 
            candidate={setupModalCandidate}
            onClose={() => setSetupModalCandidate(null)}
            onComplete={onSetupComplete}
          />
      )}

      {showRejections && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowRejections(false)}>
              <div className="bg-[var(--color-surface)] w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 p-6 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold font-['Montserrat']">Rejected Candidates <span className="text-xs opacity-50 font-normal">(Last 30 Days)</span></h2>
                      <button onClick={() => setShowRejections(false)}><XCircle size={24} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                      {rejectedCandidates.length === 0 ? <div className="text-center opacity-50 py-10">No rejections in the last 30 days.</div> : 
                        rejectedCandidates.map(c => (
                            <div key={c.id} className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 flex justify-between items-center">
                                <div>
                                    <div className="font-bold">{c.name}</div>
                                    <div className="text-xs opacity-60">{c.role} • Rejected on {new Date(c.lastUpdated).toLocaleDateString()}</div>
                                </div>
                                <span className="text-xs font-bold text-red-500 uppercase">Archived</span>
                            </div>
                        ))
                      }
                  </div>
              </div>
          </div>
      )}

      {showNewReqModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowNewReqModal(false)}>
              <div className="bg-[var(--color-surface)] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 p-6" onClick={e => e.stopPropagation()}>
                  <h2 className="text-xl font-bold mb-4 font-['Montserrat']">Create New Requisition</h2>
                  <div className="space-y-4">
                      <div><label className="text-xs font-bold uppercase opacity-60 block mb-1">Job Title</label><input className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-indigo-500" value={newReqForm.title} onChange={e => setNewReqForm({...newReqForm, title: e.target.value})} placeholder="e.g. Senior Backend Engineer" /></div>
                      <div><label className="text-xs font-bold uppercase opacity-60 block mb-1">Department</label><select className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-indigo-500" value={newReqForm.dept} onChange={e => setNewReqForm({...newReqForm, dept: e.target.value})}><option value="">Select Department</option><option value="Engineering">Engineering</option><option value="Sales">Sales</option><option value="Marketing">Marketing</option></select></div>
                      <div><label className="text-xs font-bold uppercase opacity-60 block mb-1">Budget (Annual)</label><input className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 ring-indigo-500" value={newReqForm.budget} onChange={e => setNewReqForm({...newReqForm, budget: e.target.value})} placeholder="$120,000" /></div>
                      <button onClick={createRequisition} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg mt-2">Create Requisition</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

export default Hiring;
