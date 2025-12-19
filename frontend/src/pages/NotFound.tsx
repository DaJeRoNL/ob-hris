import { useNavigate } from 'react-router-dom';
import { WarningCircle, House, ArrowLeft, CloudWarning } from '@phosphor-icons/react';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] relative overflow-hidden p-6">
            
            {/* Background Decor - consistent with your other pages */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--color-secondary)]/10 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Main Card */}
            <div className="glass-card max-w-md w-full text-center p-12 border border-[var(--color-border)] relative z-10 flex flex-col items-center shadow-2xl animate-fade-in-up">
                
                {/* Icon Pulse Effect */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-[var(--color-danger)]/20 rounded-full blur-xl animate-pulse-slow"></div>
                    <div className="relative w-24 h-24 bg-[var(--color-surface)] rounded-full flex items-center justify-center border-4 border-[var(--color-bg)] shadow-lg">
                        <CloudWarning size={48} weight="duotone" className="text-[var(--color-danger)]" />
                    </div>
                </div>

                {/* Typography */}
                <h1 className="text-6xl font-black font-['Montserrat'] text-[var(--color-text)] tracking-tighter mb-2">
                    404
                </h1>
                <h2 className="text-xl font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-6">
                    Signal Lost
                </h2>
                
                <p className="text-sm opacity-70 leading-relaxed mb-8 text-[var(--color-text)]">
                    The resource you are looking for has been moved, deleted, or does not exist in this sector.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex-1 py-3 px-4 rounded-xl border border-[var(--color-border)] font-bold text-sm hover:bg-[var(--color-surface)]/50 transition flex items-center justify-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                        <ArrowLeft weight="bold" /> Go Back
                    </button>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 py-3 px-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm shadow-lg shadow-[var(--color-primary)]/30 hover:bg-[var(--color-primary-hover)] transition flex items-center justify-center gap-2 transform active:scale-95"
                    >
                        <House weight="fill" /> Dashboard
                    </button>
                </div>

                {/* Footer System Status */}
                <div className="mt-8 pt-6 border-t border-[var(--color-border)] w-full flex justify-between items-center text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                    <span>Error: ERR_NOT_FOUND</span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse"></span>
                        System Online
                    </span>
                </div>
            </div>
        </div>
    );
}