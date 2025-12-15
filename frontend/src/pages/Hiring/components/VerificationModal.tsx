import { ShieldCheck, Warning, User, EnvelopeSimple, Briefcase, X } from '@phosphor-icons/react';
import { CandidateDetails } from './CandidateModal';

interface Props {
    candidate: CandidateDetails;
    type: 'verify' | 'revoke';
    onConfirm: () => void;
    onClose: () => void;
}

export default function VerificationModal({ candidate, type, onConfirm, onClose }: Props) {
    const isVerify = type === 'verify';
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className={`p-6 flex items-center gap-4 text-white ${isVerify ? 'bg-indigo-600' : 'bg-orange-500'}`}>
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                        {isVerify ? <ShieldCheck size={32} weight="fill" /> : <Warning size={32} weight="fill" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-['Montserrat']">{isVerify ? 'Verify Employment' : 'Revoke Status'}</h2>
                        <p className="text-xs opacity-80 font-medium uppercase tracking-wider">{isVerify ? 'Provisional -> Verified' : 'Return to Recruitment'}</p>
                    </div>
                    <button onClick={onClose} className="ml-auto p-2 hover:bg-white/20 rounded-full transition"><X size={20} /></button>
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-[#0f172a]/50">
                    <p className="text-sm opacity-70 mb-6 leading-relaxed">
                        {isVerify 
                            ? `You are validating the provisional record for ${candidate.name}. This will move them to Onboarding and create a verified entry in the system.` 
                            : `Are you sure you want to move ${candidate.name} back to the recruitment pipeline? This will void their provisional record.`
                        }
                    </p>
                    
                    <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm mb-6">
                        <div className="flex items-center gap-3 mb-3 border-b border-gray-100 dark:border-white/5 pb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center font-bold text-sm">{candidate.name.charAt(0)}</div>
                            <div>
                                <div className="font-bold text-sm">{candidate.name}</div>
                                <div className="text-[10px] opacity-50 flex items-center gap-1"><Briefcase size={10} weight="fill" /> {candidate.role}</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-xs opacity-70">
                                <EnvelopeSimple weight="bold" className="text-indigo-500" />{candidate.email}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-bold text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition">Cancel</button>
                        <button onClick={onConfirm} className={`flex-1 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition hover:scale-105 active:scale-95 ${isVerify ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-orange-500 hover:bg-orange-600'}`}>
                            {isVerify ? 'Verify & Onboard' : 'Confirm Revoke'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}