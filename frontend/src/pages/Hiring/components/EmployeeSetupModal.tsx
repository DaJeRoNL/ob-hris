import { useState, useEffect } from 'react';
import { X, CheckCircle, CircleNotch, PaperPlaneRight, FileText, UserPlus, Fingerprint } from '@phosphor-icons/react';
import { CandidateDetails } from './CandidateModal';

interface Props {
    candidate: CandidateDetails;
    onClose: () => void;
    onComplete: () => void;
}

export default function EmployeeSetupModal({ candidate, onClose, onComplete }: Props) {
    const [step, setStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // Automation Steps
    const steps = [
        { icon: FileText, label: "Generating Employee Contract & NDA", duration: 1200 },
        { icon: Fingerprint, label: "Creating Secure Identity (SSO)", duration: 1500 },
        { icon: PaperPlaneRight, label: "Sending Welcome Packet Email", duration: 1000 },
        { icon: UserPlus, label: "Provisioning to People Directory", duration: 800 }
    ];

    const startAutomation = () => {
        setIsProcessing(true);
    };

    useEffect(() => {
        if (!isProcessing) return;

        let currentStep = 0;
        const runStep = () => {
            if (currentStep >= steps.length) {
                setTimeout(() => {
                    onComplete();
                }, 500);
                return;
            }
            
            setTimeout(() => {
                setStep(prev => prev + 1);
                currentStep++;
                runStep();
            }, steps[currentStep].duration);
        };

        runStep();
    }, [isProcessing]);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--color-surface)] w-full max-w-sm rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                
                <div className="bg-[var(--color-success)] p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner border border-white/20">
                        <UserPlus size={32} weight="fill" />
                    </div>
                    <h2 className="text-xl font-bold font-['Montserrat']">New Employee Setup</h2>
                    <p className="text-xs opacity-80 mt-1">Finalizing {candidate.name}</p>
                    <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition"><X size={18} /></button>
                </div>

                <div className="p-6 space-y-4 bg-[var(--color-bg)]">
                    {steps.map((s, i) => {
                        const isCompleted = step > i;
                        const isCurrent = step === i && isProcessing;
                        
                        return (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${isCurrent ? 'bg-[var(--color-surface)] border-[var(--color-success)] shadow-lg scale-105' : 'bg-transparent border-transparent opacity-50'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-[var(--color-success)] text-white' : isCurrent ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-bg)]'}`}>
                                    {isCompleted ? <CheckCircle weight="fill" /> : isCurrent ? <CircleNotch className="animate-spin" weight="bold" /> : <s.icon weight="bold" />}
                                </div>
                                <span className={`text-xs font-bold ${isCurrent ? 'text-[var(--color-success)]' : 'text-[var(--color-text)]'}`}>{s.label}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                    {!isProcessing ? (
                        <button 
                            onClick={startAutomation}
                            className="w-full py-3 bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 text-white rounded-xl font-bold text-sm shadow-lg shadow-[var(--color-success)]/20 transition transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            <PaperPlaneRight weight="bold" /> Initialize Setup
                        </button>
                    ) : (
                        <div className="text-center text-xs font-bold opacity-50 py-3 animate-pulse text-[var(--color-text)]">Processing... do not close</div>
                    )}
                </div>
            </div>
        </div>
    );
}