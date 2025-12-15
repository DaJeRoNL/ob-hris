import { useEffect, useState, useMemo } from 'react';
import { Check, Diamond, Square, Triangle, Circle } from '@phosphor-icons/react';

interface Props {
    onClick: () => void;
    state: 'idle' | 'loading' | 'thinking' | 'answered';
    thinkingIntensity?: number; // 0.0 to 1.0
}

export default function AiOrb({ onClick, state, thinkingIntensity = 0.5 }: Props) {
    const [visualState, setVisualState] = useState<'idle' | 'active' | 'converging' | 'success'>('idle');
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Handle State Transitions
    useEffect(() => {
        if (state === 'idle') setVisualState('idle');
        else if (state === 'loading' || state === 'thinking') setVisualState('active');
        else if (state === 'answered') {
            setVisualState('converging');
            const timer = setTimeout(() => setVisualState('success'), 450);
            return () => clearTimeout(timer);
        }
    }, [state]);

    const isIdle = visualState === 'idle';
    const isActive = visualState === 'active';
    const isConverging = visualState === 'converging';
    const isSuccess = visualState === 'success';

    // --- DYNAMIC PHYSICS ---

    // Rotation Speed
    const spinDuration = useMemo(() => {
        if (isActive) return `${2.5 - (thinkingIntensity * 2)}s`;
        if (isHovered) return '4s';
        return '12s';
    }, [isActive, isHovered, thinkingIntensity]);
    
    // Blur Intensity
    const liquidBlur = useMemo(() => `${thinkingIntensity * 4}px`, [thinkingIntensity]);

    // Glow Intensity
    const glowOpacity = useMemo(() => isIdle ? 0.2 : 0.3 + (thinkingIntensity * 0.4), [isIdle, thinkingIntensity]);

    return (
        <div 
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => { setIsPressed(false); setIsHovered(false); }}
            onMouseEnter={() => setIsHovered(true)}
            onClick={isIdle ? onClick : undefined}
            className={`
                relative w-32 h-32 flex items-center justify-center perspective-1000 
                cursor-pointer transition-transform duration-300 ease-out select-none
                ${isPressed ? 'scale-90' : 'scale-100'}
                ${isIdle && !isPressed ? 'hover:scale-105' : ''}
            `}
        >
            {/* --- 1. ETHEREAL GLOW --- */}
            <div 
                className="absolute inset-0 rounded-full blur-[45px] transition-all duration-700 ease-out"
                style={{
                    backgroundColor: isSuccess ? 'rgba(52, 211, 153, 0.4)' : 'rgba(165, 180, 252, 0.6)', 
                    opacity: isSuccess ? 0.6 : glowOpacity,
                    transform: isConverging ? 'scale(0.1)' : `scale(${isSuccess ? 1.3 : (isHovered ? 1.1 : 0.9)})`
                }}
            ></div>

            {/* --- 2. ORBITAL RINGS (Restored & Persistent) --- */}
            <div className={`absolute inset-0 scale-90 pointer-events-none z-10 transition-all duration-500 ${isConverging ? 'opacity-0 scale-50' : 'opacity-100'}`}>
                <div 
                    className="absolute w-full h-full rounded-full border border-slate-200/10 border-t-cyan-100/60 animate-spin-dynamic"
                    style={{ animationDuration: spinDuration }}
                ></div>
                <div 
                    className="absolute w-[85%] h-[85%] top-[7.5%] left-[7.5%] rounded-full border border-purple-200/10 border-b-purple-100/60 animate-spin-reverse-dynamic"
                    style={{ animationDuration: spinDuration }}
                ></div>
            </div>

            {/* --- 3. THE CRYSTAL CORE --- */}
            <div className="absolute z-20 flex items-center justify-center w-full h-full">
                
                {/* A. BACKGROUND: 3D WIREFRAME --- */}
                <div className={`absolute w-12 h-24 transform-style-3d transition-all duration-700 ${
                    isConverging ? 'scale-0 opacity-0' : 
                    isActive ? 'opacity-30 scale-125' : 
                    'opacity-20 scale-100'
                }`}>
                    <div className={`absolute inset-0 w-full h-full transform-style-3d ${isActive ? 'animate-crystal-tumble-fast' : 'animate-crystal-tumble-slow'}`}>
                        <div className="absolute top-0 left-0 w-full h-1/2 transform-style-3d origin-bottom">
                            {[0, 90, 180, 270].map((deg, i) => (
                                <div key={i} className="absolute inset-0 w-full h-full border border-indigo-100/30 bg-white/5 pyramid-face translate-z-10" style={{ transform: `rotateY(${deg}deg) rotateX(30deg)` }}></div>
                            ))}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 transform-style-3d origin-top">
                            {[0, 90, 180, 270].map((deg, i) => (
                                <div key={i} className="absolute inset-0 w-full h-full border border-indigo-100/30 bg-white/5 pyramid-face-inv translate-z-10" style={{ transform: `rotateY(${deg}deg) rotateX(30deg)` }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* B. IDLE: STATIC DIAMOND --- */}
                <div className={`absolute transition-all duration-500 ease-out ${
                    isIdle ? 'opacity-100 scale-100 animate-idle-float' : 'opacity-0 scale-50 blur-md'
                }`}>
                     <Diamond 
                        weight="regular"
                        className="text-white w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                     />
                </div>

                {/* C. ACTIVE: BIOLOGICAL SHAPE SHIFTER (Sequential Blend) --- */}
                <div 
                    className={`absolute flex items-center justify-center w-16 h-16 transition-all duration-300 ${
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    } ${isConverging ? 'scale-0 opacity-0' : ''}`}
                    style={{ filter: `blur(${liquidBlur})` }}
                >
                    <div className="absolute inset-0 flex items-center justify-center animate-bio-morph-1 mix-blend-screen">
                        <Square weight="bold" className="w-10 h-10 text-cyan-200" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center animate-bio-morph-2 mix-blend-screen">
                        <Triangle weight="bold" className="w-12 h-12 text-purple-200 mb-1" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center animate-bio-morph-3 mix-blend-screen">
                        <Circle weight="bold" className="w-10 h-10 text-white" />
                    </div>
                </div>

            </div>

            {/* --- 4. BLINKING PARTICLES (RESTORED) --- */}
            {isActive && !isConverging && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping" style={{ left: '50%', animationDelay: '0s' }}></div>
                    <div className="absolute bottom-0 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping" style={{ left: '50%', animationDelay: '0.8s' }}></div>
                    <div className="absolute left-0 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping" style={{ top: '50%', animationDelay: '0.4s' }}></div>
                    <div className="absolute right-0 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping" style={{ top: '50%', animationDelay: '1.2s' }}></div>
                </div>
            )}

            {/* --- 5. SUCCESS STATE --- */}
            <div className={`absolute z-30 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${
                isSuccess ? 'opacity-100 scale-110' : 'opacity-0 scale-50 translate-y-4'
            }`}>
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-100/50 blur-xl rounded-full scale-150 animate-pulse-slow"></div>
                    <Check weight="bold" size={44} className="text-emerald-500 drop-shadow-[0_2px_10px_rgba(16,185,129,0.5)]" />
                </div>
            </div>
        </div>
    );
}
