import { useState, useEffect } from 'react';
import { X, Plus, PaperPlaneRight, CheckCircle, Trash, WarningCircle, EnvelopeSimple } from '@phosphor-icons/react';

export interface Requisition { id: string; title: string; department: string; budget: string; status: 'Draft' | 'Pending' | 'Sent' | 'Approved'; notes: string; emailTo: string; emailSubject: string; emailBody: string; createdAt: string; }
interface Props { onClose: () => void; }

const MOCK_REQS: Requisition[] = [
    { 
        id: 'REQ-101', title: 'Senior Frontend Engineer', department: 'Engineering', budget: '$140k - $160k', status: 'Draft', notes: 'Must have React + WebGL experience.', 
        emailTo: 'team@placebyte.com', emailSubject: 'New Req: Senior Frontend Engineer', emailBody: '', createdAt: '10/12/2024' 
    },
    { 
        id: 'REQ-102', title: 'Product Marketing Manager', department: 'Marketing', budget: '$110k', status: 'Sent', notes: 'Replacement for Sarah.', 
        emailTo: 'team@placebyte.com', emailSubject: 'Approval Needed: PMM Role', emailBody: '', createdAt: '10/14/2024' 
    }
];

export default function RequisitionsModal({ onClose }: Props) {
    const [requisitions, setRequisitions] = useState<Requisition[]>(MOCK_REQS);
    const [selectedReqId, setSelectedReqId] = useState<string | null>(MOCK_REQS[0]?.id || null);
    const [activeTab, setActiveTab] = useState<'details' | 'email'>('details');
    
    const selectedReq = requisitions.find(r => r.id === selectedReqId);

    // Auto-generate draft if empty when switching to email tab
    useEffect(() => {
        if (activeTab === 'email' && selectedReq && !selectedReq.emailBody) {
            const draft = `Hi Team,

I'd like to submit a new requisition request for your approval.

Role: ${selectedReq.title}
Department: ${selectedReq.department}
Budget Allocation: ${selectedReq.budget}

Additional Notes:
${selectedReq.notes || "N/A"}

Please let me know if you need any further details.

Best regards,
Admin`;
            updateReq(selectedReq.id, { emailBody: draft });
        }
    }, [activeTab, selectedReqId]);

    const createNewReq = () => { 
        const newReq: Requisition = { 
            id: `REQ-${Math.floor(Math.random()*1000)}`, 
            title: 'New Position', 
            department: 'General', 
            budget: '$0', 
            status: 'Draft', 
            notes: '', 
            emailTo: 'team@placebyte.com',
            emailSubject: 'New Requisition Request', 
            emailBody: '', 
            createdAt: new Date().toLocaleDateString() 
        }; 
        setRequisitions([newReq, ...requisitions]); 
        setSelectedReqId(newReq.id); 
    };

    const updateReq = (id: string, updates: Partial<Requisition>) => { 
        setRequisitions(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r)); 
    };
    
    const deleteReq = (id: string, e: React.MouseEvent) => { 
        e.stopPropagation();
        if(window.confirm('Delete this requisition?')) { 
            setRequisitions(prev => prev.filter(r => r.id !== id)); 
            if(selectedReqId === id) setSelectedReqId(null); 
        } 
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--color-surface)] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-[var(--color-border)] flex overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Sidebar */}
                <div className="w-1/3 border-r border-[var(--color-border)] flex flex-col bg-[var(--color-bg)]/50">
                    <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center">
                        <div><h2 className="text-lg font-bold font-['Montserrat'] text-[var(--color-text)]">Requisitions</h2></div>
                        <button onClick={createNewReq} className="p-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition"><Plus weight="bold" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {requisitions.map(req => (
                            <div key={req.id} onClick={() => setSelectedReqId(req.id)} className={`p-3 rounded-xl border cursor-pointer group relative transition-all ${selectedReqId === req.id ? 'bg-[var(--color-surface)] border-[var(--color-primary)] shadow-md' : 'border-transparent hover:bg-[var(--color-surface)]'}`}>
                                <div className="flex justify-between font-bold text-sm text-[var(--color-text)]"><span>{req.title}</span>{req.status === 'Sent' && <CheckCircle className="text-[var(--color-success)]" weight="fill" />}</div>
                                <div className="text-xs opacity-60 text-[var(--color-text-muted)]">{req.id} • {req.department}</div>
                                <button onClick={(e) => deleteReq(req.id, e)} className="absolute right-2 bottom-2 p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded opacity-0 group-hover:opacity-100 transition"><Trash weight="bold" /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-[var(--color-surface)]">
                    {selectedReq ? (<>
                        <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-start bg-[var(--color-bg)]/30">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-bold font-['Montserrat'] text-[var(--color-text)]">{selectedReq.title}</h2>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${selectedReq.status === 'Sent' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20' : 'opacity-70 text-[var(--color-text-muted)]'}`}>{selectedReq.status}</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="hover:bg-[var(--color-bg)] p-2 rounded-full transition text-[var(--color-text-muted)]"><X size={20} /></button>
                        </div>
                        
                        <div className="flex px-6 border-b border-[var(--color-border)]">
                            <button onClick={() => setActiveTab('details')} className={`py-3 px-4 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'details' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent opacity-50 hover:opacity-100 text-[var(--color-text)]'}`}>Details</button>
                            <button onClick={() => setActiveTab('email')} className={`py-3 px-4 text-xs font-bold uppercase border-b-2 transition-colors ${activeTab === 'email' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent opacity-50 hover:opacity-100 text-[var(--color-text)]'}`}>Email Draft</button>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto bg-[var(--color-bg)]/30">
                            {activeTab === 'details' ? (
                                <div className="space-y-6 max-w-2xl animate-fade-in">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div><label className="text-xs font-bold uppercase opacity-50 block mb-2 text-[var(--color-text)]">Title</label><input className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none font-bold focus:border-[var(--color-primary)] transition text-[var(--color-text)]" value={selectedReq.title} onChange={e => updateReq(selectedReq.id, {title:e.target.value})} /></div>
                                        <div><label className="text-xs font-bold uppercase opacity-50 block mb-2 text-[var(--color-text)]">Dept</label><input className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none font-bold focus:border-[var(--color-primary)] transition text-[var(--color-text)]" value={selectedReq.department} onChange={e => updateReq(selectedReq.id, {department:e.target.value})} /></div>
                                    </div>
                                    <div><label className="text-xs font-bold uppercase opacity-50 block mb-2 text-[var(--color-text)]">Notes & Requirements</label><textarea className="w-full bg-[var(--color-warning)]/5 border border-[var(--color-warning)]/20 rounded-xl p-4 text-sm h-40 outline-none resize-none focus:border-[var(--color-warning)] transition text-[var(--color-text)]" value={selectedReq.notes} onChange={e => updateReq(selectedReq.id, {notes:e.target.value})} placeholder="Add key requirements here..." /></div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col animate-fade-in max-w-3xl mx-auto w-full">
                                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden mb-4">
                                        <div className="flex items-center border-b border-[var(--color-border)] px-4 py-3">
                                            <span className="text-[var(--color-text-muted)] font-bold text-xs w-16 uppercase tracking-wider">To</span>
                                            <input className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[var(--color-primary)]" value={selectedReq.emailTo} onChange={e => updateReq(selectedReq.id, {emailTo:e.target.value})} />
                                        </div>
                                        <div className="flex items-center px-4 py-3">
                                            <span className="text-[var(--color-text-muted)] font-bold text-xs w-16 uppercase tracking-wider">Subject</span>
                                            <input className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-[var(--color-text)]" value={selectedReq.emailSubject} onChange={e => updateReq(selectedReq.id, {emailSubject:e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 relative">
                                        <textarea 
                                            className="w-full h-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 text-sm font-mono leading-relaxed outline-none resize-none focus:ring-2 ring-[var(--color-primary)]/20 transition shadow-sm text-[var(--color-text)]" 
                                            value={selectedReq.emailBody} 
                                            onChange={e => updateReq(selectedReq.id, {emailBody:e.target.value})} 
                                            placeholder="Write your email..."
                                        />
                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xs opacity-50 italic text-[var(--color-text-muted)]">Draft saved automatically</span>
                                        <button 
                                            onClick={() => { updateReq(selectedReq.id, {status: 'Sent'}); alert(`Sent to ${selectedReq.emailTo}!`); }} 
                                            className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl font-bold text-sm shadow-lg shadow-[var(--color-primary)]/30 flex items-center gap-2 transition transform active:scale-95"
                                        >
                                            <PaperPlaneRight weight="bold" /> Send Request
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>) : <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-4 text-[var(--color-text-muted)]"><WarningCircle size={64} /><span className="font-bold">Select a requisition</span></div>}
                </div>
            </div>
        </div>
    );
}