import { useState, useEffect } from 'react';
import { Sparkle, CircleNotch, Brain, CheckCircle } from '@phosphor-icons/react';

interface Props {
    onClick: () => void;
    isLoading: boolean;
    isAnswered: boolean;
}

export default function AiStatusButton({ onClick, isLoading, isAnswered }: Props) {
    const [visualState, setVisualState] = useState<'idle' | 'loading' | 'thinking' | 'answered'>('idle');

    // Handle State Transitions
    useEffect(() => {
        if (isAnswered) {
            setVisualState('answered');
            const timer = setTimeout(() => setVisualState('idle'), 3000);
            return () => clearTimeout(timer);
        } else if (isLoading) {
            setVisualState('loading');
            const timer = setTimeout(() => setVisualState('thinking'), 1500);
            return () => clearTimeout(timer);
        } else {
            setVisualState('idle');
        }
    }, [isLoading, isAnswered]);

    // 3D CSS Styles
    const baseStyles = "relative group px-8 py-4 rounded-2xl transition-all duration-500 ease-out transform hover:-translate-y-1 active:translate-y-0.5 active:scale-95 overflow-hidden isolate cursor-pointer";
    
    // Lighting & Depth Layers
    const layers = (
        <>
            {/* 1. Deep Shadow */}
            <div className="absolute inset-0 rounded-2xl shadow-[0_20px_50px_-12px_rgba(79,70,229,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* 2. Bottom Lip */}
            <div className="absolute inset-x-0 bottom-0 h-full rounded-2xl bg-gradient-to-b from-transparent to-indigo-900/50 translate-y-1 blur-[1px]" />
            
            {/* 3. Surface Gradient */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800" />
            
            {/* 4. Top Highlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl opacity-80" />
            
            {/* 5. Inner Glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_-20%,_rgba(255,255,255,0.4),_transparent_70%)]" />
        </>
    );

    return (
        <button 
            onClick={onClick}
            disabled={visualState !== 'idle'}
            className={baseStyles}
        >
            {layers}

            {/* Content Layer */}
            <div className="relative z-10 flex items-center gap-3 font-bold text-white tracking-wide text-sm min-w-[180px] justify-center">
                
                {/* IDLE */}
                {visualState === 'idle' && (
                    <span className="flex items-center gap-2 animate-fade-in-up">
                        <Sparkle weight="fill" className="text-indigo-200 animate-pulse" size={18} />
                        <span className="text-shadow">Generate Briefing</span>
                    </span>
                )}

                {/* LOADING */}
                {visualState === 'loading' && (
                    <span className="flex items-center gap-2 animate-fade-in">
                        <CircleNotch weight="bold" className="animate-spin text-white/80" size={18} />
                        <span className="opacity-90">Initializing...</span>
                    </span>
                )}

                {/* THINKING */}
                {visualState === 'thinking' && (
                    <span className="flex items-center gap-2 animate-fade-in text-indigo-100">
                        <Brain weight="fill" className="animate-bounce-slow" size={18} />
                        <span className="animate-pulse">AI Thinking...</span>
                    </span>
                )}

                {/* ANSWERED */}
                {visualState === 'answered' && (
                    <span className="flex items-center gap-2 animate-scale-in text-white">
                        <div className="bg-emerald-500 rounded-full p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                            <CheckCircle weight="fill" size={16} />
                        </div>
                        <span className="drop-shadow-md">Insight Ready</span>
                    </span>
                )}
            </div>
        </button>
    );
}
