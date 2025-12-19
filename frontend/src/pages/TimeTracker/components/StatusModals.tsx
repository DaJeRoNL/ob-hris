import { FirstAid, Smiley, User, Check, Sparkle, Phone, EnvelopeSimple } from '@phosphor-icons/react';

export function StatusModals({ states }: any) {
    const { 
        showSickPolicyModal, setShowSickPolicyModal,
        showVacationModal, setShowVacationModal,
        showPersonalModal, setShowPersonalModal,
        showEndSickModal, setShowEndSickModal,
        showAiSummary, setShowAiSummary,
        deactivateSick
    } = states;

    return (
        <>
            {/* SICK POLICY MODAL */}
            {showSickPolicyModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-[var(--color-surface)] w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-[var(--color-border)]">
                        <div className="flex items-center gap-3 mb-4 text-[var(--color-danger)]">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-danger)]/10 flex items-center justify-center">
                                <FirstAid weight="fill" size={24} />
                            </div>
                            <h2 className="text-xl font-bold font-['Montserrat']">Sick Leave Active</h2>
                        </div>
                        
                        <p className="text-sm opacity-80 mb-4 text-[var(--color-text)]">
                            Your sick leave has been logged. Access to work systems is now restricted to ensure rest.
                        </p>

                        <div className="bg-[var(--color-danger)]/5 border border-[var(--color-danger)]/10 rounded-xl p-4 mb-6">
                            <h4 className="font-bold text-[var(--color-danger)] text-xs uppercase mb-3">Emergency / HR Contact</h4>
                            
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-danger)]">
                                    <Phone weight="fill" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold opacity-50 uppercase text-[var(--color-text)]">Hotline</div>
                                    <div className="font-mono text-sm font-bold text-[var(--color-text)]">+1 (555) 012-3456</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-danger)]">
                                    <EnvelopeSimple weight="fill" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold opacity-50 uppercase text-[var(--color-text)]">Email</div>
                                    <div className="font-mono text-sm font-bold text-[var(--color-text)]">hr-benefits@acme.com</div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowSickPolicyModal(false)} 
                            className="w-full py-3 rounded-xl bg-[var(--color-bg)] font-bold hover:bg-[var(--color-bg)]/80 transition text-[var(--color-text)]"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}
            
            {showVacationModal && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in"><div className="bg-[var(--color-surface)] w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-[var(--color-border)]"><div className="flex items-center gap-3 mb-4 text-[var(--color-success)]"><div className="w-10 h-10 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center"><Smiley weight="fill" size={24} /></div><h2 className="text-xl font-bold font-['Montserrat']">Vacation Request Sent!</h2></div><p className="text-sm opacity-80 mb-6 text-[var(--color-text)]">Enjoy your time off! Recharge and relax. We've notified your manager.</p><button onClick={() => setShowVacationModal(false)} className="w-full py-3 rounded-xl bg-[var(--color-success)] text-white font-bold hover:bg-[var(--color-success)]/90 transition">Awesome</button></div></div>}
            
            {showPersonalModal && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in"><div className="bg-[var(--color-surface)] w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-[var(--color-border)]"><div className="flex items-center gap-3 mb-4 text-[var(--color-primary)]"><div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center"><User weight="fill" size={24} /></div><h2 className="text-xl font-bold font-['Montserrat']">Personal Leave Logged</h2></div><p className="text-sm opacity-80 mb-6 text-[var(--color-text)]">Your personal leave request has been submitted for approval.</p><button onClick={() => setShowPersonalModal(false)} className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-hover)] transition">Close</button></div></div>}
            
            {showEndSickModal && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in"><div className="bg-[var(--color-surface)] w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-[var(--color-border)]"><div className="flex items-center gap-3 mb-4 text-[var(--color-success)]"><div className="w-10 h-10 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center"><Check weight="bold" size={24} /></div><h2 className="text-xl font-bold font-['Montserrat']">Return to Work?</h2></div><p className="text-sm opacity-80 mb-6 text-[var(--color-text)]">Confirming this will mark your return from Sick Leave as of now. You will be able to clock in immediately.</p><div className="flex gap-3 mt-4"><button onClick={() => setShowEndSickModal(false)} className="flex-1 py-3 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg)] text-[var(--color-text)]">Cancel</button><button onClick={deactivateSick} className="flex-1 py-3 rounded-xl bg-[var(--color-success)] text-white font-bold hover:bg-[var(--color-success)]/90 shadow-lg shadow-[var(--color-success)]/30">Confirm Return</button></div></div></div>}
            
            {showAiSummary && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-fade-in"><div className="bg-[var(--color-surface)] w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-[var(--color-border)] relative overflow-hidden"><div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div><div className="flex items-center gap-3 mb-4 text-[var(--color-primary)]"><div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center animate-pulse"><Sparkle weight="fill" size={24} /></div><h2 className="text-xl font-bold font-['Montserrat']">Welcome Back!</h2></div><p className="text-sm opacity-80 mb-6 text-[var(--color-text)]">Here is an AI-generated summary of what you missed while you were away:</p><div className="space-y-3 mb-6"><div className="flex items-start gap-3 p-3 bg-[var(--color-bg)] rounded-xl"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0"></div><div className="text-sm opacity-70"><span className="font-bold block text-[var(--color-text)]">3 Team Meetings</span>Notes are available in the #general channel.</div></div><div className="flex items-start gap-3 p-3 bg-[var(--color-bg)] rounded-xl"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] mt-1.5 shrink-0"></div><div className="text-sm opacity-70"><span className="font-bold block text-[var(--color-text)]">Project Alpha Update</span>Client feedback was positive. New tasks assigned.</div></div><div className="flex items-start gap-3 p-3 bg-[var(--color-bg)] rounded-xl"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] mt-1.5 shrink-0"></div><div className="text-sm opacity-70"><span className="font-bold block text-[var(--color-text)]">12 New Emails</span>Priority: High (2) from HR regarding benefits.</div></div></div><button onClick={() => setShowAiSummary(false)} className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-hover)] transition shadow-lg shadow-[var(--color-primary)]/20">Thanks, I'm caught up</button></div></div>}
        </>
    );
}