import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_DB } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { 
    Plus, CheckCircle, XCircle, User, Clock, 
    ChatCenteredText, MagnifyingGlass, Funnel, 
    UserPlus, ArrowRight, CaretLeft, CaretRight, Note, 
    ClockCounterClockwise, ShieldCheck, Files 
} from '@phosphor-icons/react';
import CandidateModal, { CandidateDetails } from './components/CandidateModal';
import VerificationModal from './components/VerificationModal';
import RequisitionsModal from './components/RequisitionsModal';

// --- Types ---
interface ExtendedCandidate extends CandidateDetails {
    originalId: string;
}

interface LogEntry {
    id: string;
    text: string;
    timestamp: string;
}

const STAGES = ['Screening', 'Interview', 'Offer', 'Hired', 'Onboarding'];

const hydrateCandidates = (baseCandidates: any[]): ExtendedCandidate[] => {
    return baseCandidates.map(c => {
        const randomDays = Math.floor(Math.random() * 5);
        const d = new Date();
        d.setDate(d.getDate() - randomDays);
        return {
            id: c.id,
            originalId: c.id,
            name: c.name,
            role: c.role,
            stage: c.stage,
            tags: ['Senior', 'Remote'],
            notes: [{ id: 'n1', text: 'Initial screening passed. Strong comms.', date: d.toLocaleString(), author: 'Recruiter' }],
            files: [{ name: 'Resume_2024.pdf', size: '2.4 MB', date: 'Oct 12', type: 'PDF' }],
            email: `${c.name.split(' ')[0].toLowerCase()}@example.com`,
            phone: '+1 (555) 000-0000',
            location: 'New York, USA',
            lastUpdated: d.toISOString(),
            summary: "Strong candidate with experience in relevant fields.",
            rating: 0 // Unused but kept for interface compatibility if needed
        };
    });
};

const Hiring: React.FC = () => {
  const { currentClientId } = useAuth();
  
  // -- State --
  const [candidates, setCandidates] = useState<ExtendedCandidate[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<ExtendedCandidate | null>(null);
  const [search, setSearch] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [hiredCandidateId, setHiredCandidateId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showRequisitions, setShowRequisitions] = useState(false);
  const [showNewReqModal, setShowNewReqModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState<{ show: boolean, type: 'verify' | 'revoke', candidateId: string | null }>({ show: false, type: 'verify', candidateId: null });
  const [newReqForm, setNewReqForm] = useState({ title: '', dept: '', budget: '' });

  // Scroll & Tooltip
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ canLeft: false, canRight: true });
  const [hoveredNote, setHoveredNote] = useState<{ text: string, x: number, y: number } | null>(null);

  // Tag Filters
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Derived Data
  const allTags = useMemo(() => Array.from(new Set(candidates.flatMap(c => c.tags))), [candidates]);

  const filteredCandidates = useMemo(() => {
      return candidates.filter(c => {
          const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
          const matchesTags = selectedTags.length === 0 || selectedTags.every(t => c.tags.includes(t));
          return matchesSearch && matchesTags;
      });
  }, [candidates, search, selectedTags]);

  const hiredCandidate = useMemo(() => candidates.find(c => c.id === hiredCandidateId), [candidates, hiredCandidateId]);

  useEffect(() => {
      const baseData = MOCK_DB.hiring.filter(h => h.clientId === currentClientId);
      setCandidates(hydrateCandidates(baseData));
  }, [currentClientId]);

  // -- Handlers --

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
          // Initial check after render
          setTimeout(checkScroll, 100);
          return () => el.removeEventListener('scroll', checkScroll);
      }
  }, []);

  const addLog = (text: string) => setLogs(prev => [{ id: Math.random().toString(), text, timestamp: new Date().toLocaleTimeString() }, ...prev]);

  const handleCardHover = (e: React.MouseEvent, note: string) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredNote({ text: note, x: rect.left, y: rect.top - 15 }); // 15px Offset up
  };

  const scrollBoard = (dir: 'left' | 'right') => {
      if (scrollContainerRef.current) {
          const amount = dir === 'left' ? -400 : 400;
          scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
          setTimeout(checkScroll, 500); // Re-check after scroll animation
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

  // -- Drag & Drop Logic --

  const handleDragStart = (e: React.DragEvent, id: string) => {
      setDraggedId(id);
      e.dataTransfer.effectAllowed = "move";
      // Hide tooltip on drag
      setHoveredNote(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
      e.preventDefault();
      if (!draggedId) return;
      const candidate = candidates.find(c => c.id === draggedId);
      if (!candidate || candidate.stage === targetStage) return;

      const currentStage = candidate.stage;

      // 1. Strict Rule: Can only enter 'Onboarding' from 'Hired'
      if (targetStage === 'Onboarding') {
          if (currentStage !== 'Hired') {
              alert("Candidates must be 'Hired' before they can be Onboarded.");
              setDraggedId(null);
              return;
          }
          // Valid transition: Trigger Verification Modal
          setVerificationModal({ show: true, type: 'verify', candidateId: candidate.id });
          setDraggedId(null);
          return;
      }

      // 2. Revoke Rule: Moving BACK from Hired/Onboarding to Recruiting stages
      const recruitmentStages = ['Screening', 'Interview', 'Offer'];
      if ((currentStage === 'Hired' || currentStage === 'Onboarding') && recruitmentStages.includes(targetStage)) {
          setVerificationModal({ show: true, type: 'revoke', candidateId: candidate.id });
          setDraggedId(null);
          return;
      }

      // 3. Standard Move
      const updated = { ...candidate, stage: targetStage, lastUpdated: new Date().toISOString() };
      setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
      addLog(`Moved ${candidate.name} to ${targetStage}`);

      // 4. Hired Trigger
      if (targetStage === 'Hired') {
          setHiredCandidateId(candidate.id);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000);
      }
      setDraggedId(null);
  };

  // -- Modal Action Handlers --

  const handleConfirmVerification = () => {
      const { type, candidateId } = verificationModal;
      const c = candidates.find(x => x.id === candidateId);
      if (!c) return;

      if (type === 'verify') {
          // Move to Onboarding
          const updated = { ...c, stage: 'Onboarding', lastUpdated: new Date().toISOString() };
          setCandidates(prev => prev.map(x => x.id === c.id ? updated : x));
          addLog(`Verified & Onboarded ${c.name}`);
          alert(`${c.name} has been added to the People Directory.`);
      } else {
          // Revoke to Offer (Default fallback)
          const updated = { ...c, stage: 'Offer', lastUpdated: new Date().toISOString() };
          setCandidates(prev => prev.map(x => x.id === c.id ? updated : x));
          addLog(`Revoked ${c.name} back to Recruitment`);
          alert(`${c.name} removed from People Directory.`);
      }
      setVerificationModal({ show: false, type: 'verify', candidateId: null });
  };

  return (
    <div className="p-8 h-full flex flex-col text-[var(--text-main)] animate-fade-in overflow-hidden relative">
      
      {/* Tooltip Portal (Root Level) */}
      {hoveredNote && !draggedId && (
          <div 
            className="fixed z-[9999] pointer-events-none animate-fade-in bg-slate-800 text-white text-[10px] p-3 rounded-lg shadow-xl border border-white/10 max-w-[250px] backdrop-blur-md"
            style={{ left: hoveredNote.x, top: hoveredNote.y, transform: 'translateY(-100%)' }}
          >
              <div className="font-bold text-indigo-300 mb-1 flex items-center gap-1"><Note weight="fill" /> Latest Note:</div>
              <div className="italic opacity-80 line-clamp-3 leading-relaxed">"{hoveredNote.text}"</div>
              {/* Arrow */}
              <div className="absolute bottom-0 left-4 translate-y-full border-[6px] border-transparent border-t-slate-800"></div>
          </div>
      )}

      {/* Confetti Banner */}
      {showConfetti && hiredCandidate && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
              <div className="bg-indigo-900 text-white pl-6 pr-2 py-2 rounded-full shadow-2xl flex items-center gap-4 border border-indigo-500/50">
                  <div className="flex items-center gap-2">
                      <span className="bg-green-500 rounded-full p-1"><CheckCircle weight="fill" /></span>
                      <span className="font-bold text-sm">{hiredCandidate.name} Hired!</span>
                  </div>
                  <button onClick={() => { setShowConfetti(false); setVerificationModal({ show: true, type: 'verify', candidateId: hiredCandidate.id }); }} className="bg-white text-indigo-900 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-100 transition flex items-center gap-1">Verify & Onboard <ArrowRight weight="bold" /></button>
                  <button onClick={() => setShowConfetti(false)} className="p-1 hover:bg-white/10 rounded-full"><XCircle size={18} /></button>
              </div>
          </div>
      )}

      {/* Header */}
      <header className="mb-6 shrink-0 space-y-4">
        <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black font-['Montserrat'] tracking-tight flex items-center gap-3">Talent Pipeline <span className="text-xs bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-1 rounded-full font-bold shadow-sm">ATS v2.5</span></h1>
              <div className="flex gap-6 mt-4 text-sm font-medium opacity-70">
                  <span className="flex items-center gap-2"><User weight="fill" className="text-blue-500" /> {candidates.length} Total</span>
                  <span className="flex items-center gap-2"><CheckCircle weight="fill" className="text-emerald-500" /> {candidates.filter(c => c.stage === 'Hired').length} Hired</span>
              </div>
            </div>
            <button onClick={() => setShowRequisitions(true)} className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 group"><Files weight="bold" size={18} /> <span>Requisitions</span></button>
        </div>

        <div className="flex gap-4">
            <div className="relative flex-1 max-w-md group">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" weight="bold" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition backdrop-blur-sm shadow-sm" />
            </div>
            <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar items-center mask-fade-right">
                {allTags.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition whitespace-nowrap ${selectedTags.includes(tag) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'}`}>
                        {tag}
                    </button>
                ))}
            </div>
            <div className="relative">
                <button onClick={() => setShowLogs(!showLogs)} className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition border ${showLogs ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/50 dark:bg-black/20 border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5'}`}><ClockCounterClockwise weight="bold" /> History</button>
                {showLogs && <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 p-4 z-50 animate-fade-in-up"><h4 className="text-xs font-bold uppercase opacity-50 mb-3">Activity Log</h4><div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">{logs.map(log => (<div key={log.id} className="text-xs border-l-2 border-indigo-500 pl-2"><div className="font-medium opacity-80">{log.text}</div><div className="opacity-40 text-[10px]">{log.timestamp}</div></div>))}</div></div>}
            </div>
        </div>
      </header>

      {/* Board */}
      <div className="flex-1 relative overflow-hidden group/board">
          {scrollState.canLeft && <button onClick={() => scrollBoard('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm rounded-r-2xl shadow-xl hover:pl-4 transition-all opacity-0 group-hover/board:opacity-100 hover:scale-110"><CaretLeft weight="bold" size={24} className="text-indigo-500" /></button>}
          {scrollState.canRight && <button onClick={() => scrollBoard('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm rounded-l-2xl shadow-xl hover:pr-4 transition-all opacity-0 group-hover/board:opacity-100 hover:scale-110"><CaretRight weight="bold" size={24} className="text-indigo-500" /></button>}

          <div ref={scrollContainerRef} className="flex gap-6 h-full overflow-x-auto overflow-y-hidden pb-4 px-1 scroll-smooth no-scrollbar">
            {STAGES.map(stage => {
                const stageCandidates = filteredCandidates.filter(c => c.stage === stage).sort((a,b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
                const isHired = stage === 'Hired';
                const isOnboarding = stage === 'Onboarding';
                let colBorder = 'border-t-4 border-t-indigo-500';
                let colBg = 'bg-gray-50/50 dark:bg-white/[0.02]';
                
                if (isHired) colBorder = 'border-t-4 border-t-emerald-500';
                if (isOnboarding) { colBorder = 'border-t-4 border-t-blue-500'; colBg = 'bg-blue-500/5 dark:bg-blue-500/5 border-blue-500/10'; }

                return (
                <div key={stage} className={`flex-1 flex flex-col min-w-[280px] max-w-[350px] ${colBg} rounded-2xl p-3 border border-gray-200 dark:border-white/5 ${colBorder} transition-colors`} onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }} onDrop={(e) => handleDrop(e, stage)}>
                    <div className="flex justify-between items-center mb-4 px-2 pt-2"><h3 className="font-bold text-xs uppercase opacity-80 tracking-widest">{stage}</h3><span className="bg-white dark:bg-white/10 text-[10px] font-bold px-2 py-0.5 rounded-md opacity-60 shadow-sm">{stageCandidates.length}</span></div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 px-1 pb-2">
                        {stageCandidates.length === 0 && <div className="h-full flex flex-col items-center justify-center opacity-20 text-center border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl m-1"><UserPlus size={32} weight="duotone" className="mb-2" /><span className="text-xs font-bold">Drop Here</span></div>}
                        {stageCandidates.map(c => (
                            <div key={c.id} className="glass-card !p-4 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-all duration-300 group relative overflow-visible !bg-white dark:!bg-[#1e293b] border border-gray-100 dark:border-white/5 hover:shadow-lg hover:border-indigo-500/30" draggable onDragStart={(e) => handleDragStart(e, c.id)} onClick={() => setSelectedCandidate(c)} onMouseEnter={(e) => c.notes.length > 0 && handleCardHover(e, c.notes[0].text)} onMouseLeave={() => setHoveredNote(null)}>
                                <div className={`absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity ${isHired ? 'bg-emerald-500' : isOnboarding ? 'bg-blue-500' : 'bg-indigo-500'}`}></div>
                                <div className="flex justify-between items-start mb-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold shadow-inner text-gray-700 dark:text-gray-200 shrink-0">{c.name.charAt(0)}</div><div><div className="font-bold text-sm leading-tight text-gray-900 dark:text-gray-100">{c.name}</div><div className="text-[10px] opacity-60 flex items-center gap-1 mt-0.5 font-medium">{c.role}</div></div></div></div>
                                <div className="flex flex-wrap gap-1.5 mb-3">{c.tags.slice(0, 3).map(tag => (<span key={tag} className="text-[9px] font-bold uppercase bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">{tag}</span>))}</div>
                                <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-[10px] opacity-50 font-medium"><div className="flex items-center gap-1 group-hover:text-indigo-500 transition-colors"><Clock weight="bold" /> {new Date(c.lastUpdated).toLocaleDateString()}</div><div className="flex items-center gap-1"><ChatCenteredText weight="bold" /> {c.notes.length}</div></div>
                                {isHired && <button onClick={(e) => { e.stopPropagation(); setVerificationModal({ show: true, type: 'verify', candidateId: c.id }); }} className="mt-3 w-full py-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded text-[10px] font-bold uppercase transition flex items-center justify-center gap-1"><ShieldCheck weight="fill" /> Verify & Onboard</button>}
                            </div>
                        ))}
                    </div>
                </div>
                );
            })}
          </div>
      </div>

      {/* Modals */}
      {selectedCandidate && <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} onUpdate={(u) => { setCandidates(prev => prev.map(c => c.id === u.id ? u : c)); addLog(`Updated ${u.name}`); }} onReject={(id) => { setCandidates(prev => prev.filter(c => c.id !== id)); addLog('Rejected candidate'); setSelectedCandidate(null); }} />}
      {verificationModal.show && verificationModal.candidateId && (() => { const c = candidates.find(x => x.id === verificationModal.candidateId); return c ? <VerificationModal candidate={c} type={verificationModal.type} onConfirm={handleConfirmVerification} onClose={() => setVerificationModal({ ...verificationModal, show: false })} /> : null; })()}
      
      {showRequisitions && <RequisitionsModal onClose={() => setShowRequisitions(false)} />}
      
      {showNewReqModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowNewReqModal(false)}>
              <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 p-6" onClick={e => e.stopPropagation()}>
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