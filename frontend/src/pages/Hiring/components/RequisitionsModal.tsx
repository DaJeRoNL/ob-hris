import { useState } from 'react';
import { X, Plus, PaperPlaneRight, Note, Envelope, Briefcase, CurrencyDollar, CheckCircle, FloppyDisk, Trash, WarningCircle } from '@phosphor-icons/react';

export interface Requisition { id: string; title: string; department: string; budget: string; status: 'Draft' | 'Pending' | 'Sent' | 'Approved'; notes: string; emailSubject: string; emailBody: string; createdAt: string; }
interface Props { onClose: () => void; }
const MOCK_REQS: Requisition[] = [
    { id: 'REQ-101', title: 'Senior Frontend Engineer', department: 'Engineering', budget: '$140k - $160k', status: 'Draft', notes: 'React + WebGL', emailSubject: 'New Req: Frontend', emailBody: 'Please open req...', createdAt: '10/12/2024' },
    { id: 'REQ-102', title: 'Product Marketing Manager', department: 'Marketing', budget: '$110k', status: 'Sent', notes: 'Replacement', emailSubject: 'New Req: PMM', emailBody: '...', createdAt: '10/14/2024' }
];

export default function RequisitionsModal({ onClose }: Props) {
    const [requisitions, setRequisitions] = useState<Requisition[]>(MOCK_REQS);
    const [selectedReqId, setSelectedReqId] = useState<string | null>(MOCK_REQS[0].id);
    const [activeTab, setActiveTab] = useState<'details' | 'email'>('details');
    const selectedReq = requisitions.find(r => r.id === selectedReqId);

    const createNewReq = () => { const newReq: Requisition = { id: `REQ-${Math.floor(Math.random()*1000)}`, title: 'New Position', department: 'General', budget: '$0', status: 'Draft', notes: '', emailSubject: 'Approval Needed', emailBody: 'Hi Team...', createdAt: new Date().toLocaleDateString() }; setRequisitions([newReq, ...requisitions]); setSelectedReqId(newReq.id); };
    const updateReq = (id: string, updates: Partial<Requisition>) => { setRequisitions(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r)); };
    const deleteReq = (id: string) => { if(window.confirm('Delete?')) { setRequisitions(prev => prev.filter(r => r.id !== id)); if(selectedReqId === id) setSelectedReqId(null); } };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-white/10 flex overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="w-1/3 border-r border-gray-200 dark:border-white/10 flex flex-col bg-gray-50/50 dark:bg-[#111827]/50">
                    <div className="p-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center"><div><h2 className="text-lg font-bold font-['Montserrat']">Requisitions</h2></div><button onClick={createNewReq} className="p-2 bg-indigo-600 text-white rounded-lg"><Plus weight="bold" /></button></div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">{requisitions.map(req => (<div key={req.id} onClick={() => setSelectedReqId(req.id)} className={`p-3 rounded-xl border cursor-pointer ${selectedReqId === req.id ? 'bg-white dark:bg-[#1e293b] border-indigo-500 shadow' : 'border-transparent hover:bg-white/50 dark:hover:bg-white/5'}`}><div className="flex justify-between font-bold text-sm"><span>{req.title}</span>{req.status === 'Sent' && <CheckCircle className="text-emerald-500" weight="fill" />}</div><div className="text-xs opacity-60">{req.id} • {req.department}</div></div>))}</div>
                </div>
                <div className="flex-1 flex flex-col bg-white dark:bg-[#1e293b]">
                    {selectedReq ? (<>
                        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-start bg-gray-50/30 dark:bg-white/[0.02]"><div><div className="flex items-center gap-3 mb-1"><h2 className="text-2xl font-bold font-['Montserrat']">{selectedReq.title}</h2><span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border opacity-70">{selectedReq.status}</span></div></div><button onClick={onClose}><X size={20} /></button></div>
                        <div className="flex px-6 border-b border-gray-200 dark:border-white/10"><button onClick={() => setActiveTab('details')} className={`py-3 px-4 text-xs font-bold uppercase border-b-2 ${activeTab === 'details' ? 'border-indigo-500 text-indigo-500' : 'border-transparent opacity-50'}`}>Details</button><button onClick={() => setActiveTab('email')} className={`py-3 px-4 text-xs font-bold uppercase border-b-2 ${activeTab === 'email' ? 'border-indigo-500 text-indigo-500' : 'border-transparent opacity-50'}`}>Email</button></div>
                        <div className="flex-1 p-8 overflow-y-auto">
                            {activeTab === 'details' ? (
                                <div className="space-y-6 max-w-2xl"><div className="grid grid-cols-2 gap-6"><div><label className="text-xs font-bold uppercase opacity-50 block mb-2">Title</label><input className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none font-bold" value={selectedReq.title} onChange={e => updateReq(selectedReq.id, {title:e.target.value})} /></div><div><label className="text-xs font-bold uppercase opacity-50 block mb-2">Dept</label><input className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 outline-none font-bold" value={selectedReq.department} onChange={e => updateReq(selectedReq.id, {department:e.target.value})} /></div></div><div><label className="text-xs font-bold uppercase opacity-50 block mb-2">Notes</label><textarea className="w-full bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 rounded-xl p-4 text-sm h-40 outline-none resize-none" value={selectedReq.notes} onChange={e => updateReq(selectedReq.id, {notes:e.target.value})} /></div></div>
                            ) : (
                                <div className="h-full flex flex-col"><div className="mb-4 space-y-3"><input className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-bold outline-none" value={selectedReq.emailSubject} onChange={e => updateReq(selectedReq.id, {emailSubject:e.target.value})} /></div><textarea className="flex-1 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm font-mono leading-relaxed outline-none resize-none mb-4" value={selectedReq.emailBody} onChange={e => updateReq(selectedReq.id, {emailBody:e.target.value})} /><div className="flex justify-end gap-3"><button onClick={() => alert('Sent!')} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg">Send</button></div></div>
                            )}
                        </div>
                    </>) : <div className="flex-1 flex items-center justify-center opacity-30"><WarningCircle size={48} /></div>}
                </div>
            </div>
        </div>
    );
}