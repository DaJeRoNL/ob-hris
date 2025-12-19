import { X, CheckCircle, ShieldCheck, Database, LockKey, Globe } from '@phosphor-icons/react';

export default function SystemHealthModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--color-surface)] w-full max-w-lg rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-[var(--color-success)] p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={32} weight="fill" />
                        <div>
                            <h2 className="text-xl font-bold font-['Montserrat']">System Secure</h2>
                            <p className="text-xs opacity-80 uppercase font-bold tracking-wider">All Systems Operational</p>
                        </div>
                    </div>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-lg"><Database size={20} weight="fill" /></div>
                            <div>
                                <div className="font-bold text-sm text-[var(--color-text)]">Database Integrity</div>
                                <div className="text-xs opacity-50 text-[var(--color-text-muted)]">Backups Synced (2 mins ago)</div>
                            </div>
                        </div>
                        <CheckCircle size={20} className="text-[var(--color-success)]" weight="fill" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-lg"><LockKey size={20} weight="fill" /></div>
                            <div>
                                <div className="font-bold text-sm text-[var(--color-text)]">Encryption Layer</div>
                                <div className="text-xs opacity-50 text-[var(--color-text-muted)]">AES-256 Enabled</div>
                            </div>
                        </div>
                        <CheckCircle size={20} className="text-[var(--color-success)]" weight="fill" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-lg"><Globe size={20} weight="fill" /></div>
                            <div>
                                <div className="font-bold text-sm text-[var(--color-text)]">Global CDN</div>
                                <div className="text-xs opacity-50 text-[var(--color-text-muted)]">Latency: 24ms</div>
                            </div>
                        </div>
                        <CheckCircle size={20} className="text-[var(--color-success)]" weight="fill" />
                    </div>
                </div>
            </div>
        </div>
    );
}