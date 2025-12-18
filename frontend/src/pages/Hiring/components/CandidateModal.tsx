import { useState, useEffect } from 'react';
import { 
    X, User, Briefcase, EnvelopeSimple, Phone, MapPin, 
    Note, Tag, Paperclip, Check, Trash, 
    Clock, Plus, DownloadSimple, FloppyDisk, FileText 
} from '@phosphor-icons/react';

export interface CandidateDetails {
    id: string;
    name: string;
    role: string;
    stage: string;
    tags: string[];
    notes: { id: string; text: string; date: string; author: string }[];
    files: { name: string; size: string; date: string; type: string }[];
    email: string;
    phone: string;
    location: string;
    lastUpdated: string;
    summary: string;
}

interface Props {
    candidate: CandidateDetails;
    onClose: () => void;
    onUpdate: (updated: CandidateDetails) => void;
    onReject: (id: string) => void;
}

export default function CandidateModal({ candidate, onClose, onUpdate, onReject }: Props) {
    const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'files'>('overview');
    const [noteInput, setNoteInput] = useState('');
    const [newTag, setNewTag] = useState('');
    const [isTagInput, setIsTagInput] = useState(false);
    const [summaryText, setSummaryText] = useState(candidate.summary || '');
    const [isEditingSummary, setIsEditingSummary] = useState(false);

    useEffect(() => { setSummaryText(candidate.summary || ''); }, [candidate]);

    const saveSummary = () => {
        onUpdate({ ...candidate, summary: summaryText, lastUpdated: new Date().toISOString() });
        setIsEditingSummary(false);
    };

    const addNote = () => {
        if (!noteInput.trim()) return;
        const newNote = {
            id: Math.random().toString(36).substr(2, 9),
            text: noteInput,
            date: new Date().toLocaleString(),
            author: 'You'
        };
        // Update immediately
        onUpdate({ 
            ...candidate, 
            notes: [newNote, ...candidate.notes], 
            lastUpdated: new Date().toISOString() 
        });
        setNoteInput('');
    };

    const addTag = () => {
        if (!newTag.trim()) return;
        onUpdate({ 
            ...candidate, 
            tags: [...candidate.tags, newTag.trim()], 
            lastUpdated: new Date().toISOString() 
        });
        setNewTag('');
        setIsTagInput(false);
    };

    const removeTag = (tagToRemove: string) => {
        onUpdate({
            ...candidate,
            tags: candidate.tags.filter(t => t !== tagToRemove),
            lastUpdated: new Date().toISOString()
        });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--color-surface)] w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="relative bg-gradient-to-r from-indigo-900 to-[#0f172a] p-8 shrink-0 text-white">
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl font-bold shadow-xl">
                                {candidate.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-black font-['Montserrat']">{candidate.name}</h2>
                                <div className="flex items-center gap-4 mt-2 text-sm opacity-80">
                                    <span className="flex items-center gap-1.5"><Briefcase weight="fill" className="text-indigo-400" /> {candidate.role}</span>
                                    <span className="flex items-center gap-1.5"><MapPin weight="fill" className="text-indigo-400" /> {candidate.location}</span>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 flex items-center gap-2">
                                        <Clock size={12} /> Updated: {new Date(candidate.lastUpdated).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"><X size={20} /></button>
                    </div>
                </div>

                <div className="flex border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-6 shrink-0">
                    <button onClick={() => setActiveTab('overview')} className={`py-4 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-500' : 'border-transparent opacity-60'}`}><User size={18} /> Overview</button>
                    <button onClick={() => setActiveTab('notes')} className={`py-4 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${activeTab === 'notes' ? 'border-indigo-500 text-indigo-500' : 'border-transparent opacity-60'}`}><Note size={18} /> Notes</button>
                    <button onClick={() => setActiveTab('files')} className={`py-4 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${activeTab === 'files' ? 'border-indigo-500 text-indigo-500' : 'border-transparent opacity-60'}`}><Paperclip size={18} /> Files</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-100/50 dark:bg-[var(--color-surface)]/50 custom-scrollbar">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                            <div className="space-y-6">
                                <div className="glass-card !p-6">
                                    <h3 className="text-xs font-bold uppercase opacity-50 mb-4 flex items-center gap-2"><Tag /> Skills & Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 rounded-full text-xs font-bold flex items-center gap-2 group cursor-default">
                                                {tag}
                                                <button onClick={() => removeTag(tag)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition"><X weight="bold" /></button>
                                            </span>
                                        ))}
                                        {isTagInput ? (
                                            <div className="flex items-center gap-2">
                                                <input autoFocus value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} className="w-24 px-2 py-1 text-xs rounded border border-indigo-500 outline-none bg-transparent" placeholder="New tag..." />
                                                <button onClick={addTag} className="text-emerald-500"><Check weight="bold" /></button>
                                                <button onClick={() => setIsTagInput(false)} className="text-red-500"><X weight="bold" /></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setIsTagInput(true)} className="px-3 py-1 border border-dashed border-gray-400 opacity-50 rounded-full text-xs font-bold hover:opacity-100 hover:border-indigo-500 transition">+ Add</button>
                                        )}
                                    </div>
                                </div>
                                <div className="glass-card !p-6">
                                    <h3 className="text-xs font-bold uppercase opacity-50 mb-4 flex items-center gap-2"><User /> Contact</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center"><EnvelopeSimple weight="fill" size={20} /></div><div><div className="text-sm font-bold">{candidate.email}</div><div className="text-xs opacity-60">Personal</div></div></div>
                                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><Phone weight="fill" size={20} /></div><div><div className="text-sm font-bold">{candidate.phone}</div><div className="text-xs opacity-60">Mobile</div></div></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col h-full">
                                <div className="glass-card !p-6 h-full border-l-4 border-l-indigo-500 flex flex-col min-h-[400px]">
                                    <div className="flex justify-between items-center mb-4 shrink-0">
                                        <h3 className="text-xs font-bold uppercase opacity-50 flex items-center gap-2"><Briefcase /> Application Summary</h3>
                                        {!isEditingSummary ? <button onClick={() => setIsEditingSummary(true)} className="text-xs text-indigo-500 hover:underline font-bold">Edit</button> : <button onClick={saveSummary} className="text-xs text-emerald-500 hover:underline font-bold flex items-center gap-1"><FloppyDisk /> Save</button>}
                                    </div>
                                    {isEditingSummary ? <textarea value={summaryText} onChange={(e) => setSummaryText(e.target.value)} className="w-full flex-1 bg-[var(--color-surface)]/500 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-2 ring-indigo-500 outline-none resize-none custom-scrollbar" /> : <div className="text-sm leading-relaxed opacity-80 text-justify whitespace-pre-wrap flex-1 overflow-y-auto custom-scrollbar pr-2">{summaryText || "No summary."}</div>}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'notes' && (
                        <div className="flex flex-col h-full">
                            <div className="flex gap-2 mb-6"><input value={noteInput} onChange={e => setNoteInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} placeholder="Add note..." className="flex-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" /><button onClick={addNote} className="px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Post</button></div>
                            <div className="space-y-6 relative pl-4 border-l-2 border-gray-200 dark:border-white/10 ml-2">{candidate.notes.map(note => (<div key={note.id} className="relative pl-6"><div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white dark:border-white/10"></div><div className="glass-card !p-4"><div className="flex justify-between items-start mb-2"><span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{note.author}</span><span className="text-[10px] opacity-50 font-mono">{note.date}</span></div><p className="text-sm opacity-80">{note.text}</p></div></div>))}</div>
                        </div>
                    )}
                    {activeTab === 'files' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-500/5 hover:border-indigo-500 transition"><div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[var(--color-surface)]/50 flex items-center justify-center mb-3"><Plus weight="bold" size={24} /></div><div className="font-bold text-sm">Upload</div></div>
                            {candidate.files.map((file, i) => (<div key={i} className="glass-card !p-4 flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center"><FileText weight="duotone" size={24} /></div><div><div className="font-bold text-sm">{file.name}</div><div className="text-[10px] opacity-50 uppercase font-bold">{file.type} • {file.size}</div></div></div><button className="p-2 hover:bg-black/5 rounded-lg text-indigo-500"><DownloadSimple weight="bold" size={18} /></button></div>))}
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-between bg-gray-50 dark:bg-black/20">
                    <button onClick={() => { if(window.confirm('Reject candidate?')) { onReject(candidate.id); onClose(); } }} className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-2"><Trash weight="bold" /> Reject Candidate</button>
                    <button onClick={onClose} className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-lg">Done</button>
                </div>
            </div>
        </div>
    );
}