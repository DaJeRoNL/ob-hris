// frontend/src/pages/ClientProfile/components/AiOrb.tsx
import { useEffect, useState, useMemo } from 'react';
import { Diamond, Check } from '@phosphor-icons/react';

interface Props {
  onClick?: () => void;
  state: 'idle' | 'loading' | 'thinking' | 'answered';
  thinkingIntensity?: number;
}

interface Particle {
  id: number;
  initialRotation: [number, number, number];
  radius: number; 
  cloudDuration: number;
  cloudDelay: number;
  fig8Delay: number;
  size: number;
}

const PARTICLE_COUNT = 32;

export default function AiOrb({ onClick, state, thinkingIntensity = 0.5 }: Props) {
  const [visualState, setVisualState] = useState<'idle' | 'active' | 'converging' | 'success'>('idle');
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (state === 'idle') {
        setVisualState('idle');
    } else if (state === 'loading' || state === 'thinking') {
        setVisualState('active');
    } else if (state === 'answered') {
      setVisualState('converging');
      const timer = setTimeout(() => setVisualState('success'), 800);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const isIdle = visualState === 'idle';
  const isActive = visualState === 'active';
  const isConverging = visualState === 'converging';
  const isSuccess = visualState === 'success';

  const showParticles = isActive || isHovered || isConverging;

  const diamondTransform = isPressed 
    ? 'scale(0.9) scaleY(1.4)' 
    : 'scale(1.0) scaleY(1.6)';

  // --- PARTICLE DATA ---
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      // Radius: 28px - 40px
      // Very tight to the 44px diamond
      radius: 28 + Math.random() * 12, 
      
      initialRotation: [Math.random() * 360, Math.random() * 360, Math.random() * 360],
      cloudDuration: 6 + Math.random() * 4, 
      cloudDelay: -(Math.random() * 8),     
      
      // Snake effect: Spaced over 2.5s
      fig8Delay: (i / PARTICLE_COUNT) * -2.5, 

      size: 1.5 + Math.random() * 2.5,
    }));
  }, []);

  // --- LIQUID ANIMATION GENERATOR ---
  const dynamicStyles = useMemo(() => {
    let keyframes = '';
    const steps = 100; 

    for (let i = 0; i <= steps; i++) {
      const percent = i;
      const t = (i / steps) * 2 * Math.PI;

      // --- GEOMETRY: Standard Horizontal Figure 8 ---
      // x = cos(t)  -> Left/Right oscillation
      // z = sin(2t) -> Front/Back oscillation (crossing in middle)
      const x = Math.cos(t); 
      const z = Math.sin(2 * t);

      // --- HIDING LOGIC (FIXED) ---
      let opacity = 1;
      
      // 1. Z Check: Is the particle physically BEHIND the center?
      if (z < -0.15) {
        const absX = Math.abs(x);
        
        // 2. Width Check: Is it BLOCKED by the diamond?
        // PREVIOUSLY: absX < 0.8 (Too wide, hid the curves)
        // FIXED: absX < 0.35 (Only hides the narrow center strip behind the diamond)
        // This ensures the left/right lobes remain visible in the background.
        if (absX < 0.35) {
           opacity = 0; 
        }
        // Smooth fade buffer
        else if (absX < 0.5) {
           opacity = (absX - 0.35) * 6.6; // Linear fade up
        }
      }

      keyframes += `
        ${percent}% {
          transform: translate3d(
            calc(var(--orbit-radius) * ${x.toFixed(3)}), 
            0, 
            calc(var(--orbit-depth) * ${z.toFixed(3)})
          );
          opacity: ${opacity.toFixed(2)};
        }
      `;
    }

    return `
      @keyframes figure-8-liquid {
        ${keyframes}
      }
    `;
  }, []);

  return (
    <div 
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => { setIsPressed(false); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      onClick={isIdle ? onClick : undefined}
      className={`
        relative w-32 h-32 flex items-center justify-center 
        transition-transform duration-300 ease-out select-none
        ${onClick && isIdle ? 'cursor-pointer' : 'cursor-default'}
        ${isIdle && !isPressed && onClick ? 'hover:scale-105' : ''}
      `}
      style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
    >
      <style>{dynamicStyles}</style>

      {/* SVG Gradient */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="plumbob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6b21a8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ambient Glow */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[50px] transition-all duration-700 ease-out pointer-events-none
          ${isSuccess ? 'bg-purple-500/40 opacity-50' : 'bg-indigo-600/30'}
          ${showParticles && !isSuccess ? 'opacity-80 scale-110' : 'opacity-30 scale-90'}
        `}
        style={{ transform: 'translateZ(-20px) translate(-50%, -50%)' }}
      ></div>

      {/* --- PARTICLES --- */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {particles.map((p) => {
            const isFigure8Mode = isHovered && !isConverging;

            // ORIENTATION: 
            // 85deg = "Tabletop" view.
            // X axis is left/right. Y axis is into the screen (flattened). Z axis is up/down relative to table.
            // Note: Since we are rotating X, the "translate3d(x, 0, z)" in keyframes maps:
            // x -> Screen X
            // 0 -> Screen Y (flat on table)
            // z -> Screen Depth (vertical relative to table surface, depth relative to screen)
            const containerRotation = isFigure8Mode
              ? 'rotateX(85deg) rotateY(0deg) rotateZ(0deg)'
              : `rotateX(${p.initialRotation[0]}deg) rotateY(${p.initialRotation[1]}deg) rotateZ(${p.initialRotation[2]}deg)`;

            let animName = 'orbit-cloud'; 
            if (isFigure8Mode) animName = 'figure-8-liquid'; 
            if (isConverging) animName = 'converge';

            const duration = isFigure8Mode ? '2.5s' : `${p.cloudDuration}s`;
            const delay = isFigure8Mode ? `${p.fig8Delay}s` : `${p.cloudDelay}s`;
            const timing = (isFigure8Mode || !isConverging) ? 'linear' : 'ease-in-out';

            return (
              <div
                key={p.id}
                className="absolute top-1/2 left-1/2 w-0 h-0"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: containerRotation,
                  transition: 'transform 0.8s cubic-bezier(0.2, 0, 0.2, 1)' 
                }}
              >
                <div
                  className="rounded-full bg-white absolute -top-1/2 -left-1/2 shadow-[0_0_3px_rgba(255,255,255,1)]"
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    '--orbit-radius': `${p.radius}px`,
                    // Depth determines how far Front/Back the dots go.
                    // Slightly flatter (0.75) looks better in tabletop view
                    '--orbit-depth': `${p.radius * 0.75}px`, 
                    
                    animation: `${animName} ${isConverging ? '0.8s' : duration} ${timing} infinite`,
                    animationFillMode: isConverging ? 'forwards' : 'none',
                    animationDelay: isConverging ? '0s' : delay,
                  } as React.CSSProperties}
                ></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Central Diamond */}
      {/* Lifted Z-index ensures correct occlusion layering */}
      <div className="absolute flex items-center justify-center transition-all duration-700 z-10" style={{ transform: 'translateZ(0px)' }}>
        <div className="relative transition-all duration-500 ease-out" style={{ transform: diamondTransform }}>
          <Diamond 
            weight={isSuccess ? "fill" : "light"}
            className={`transition-all duration-700 ease-out ${
              isSuccess 
                ? 'drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]' 
                : 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]'
            } ${isActive ? 'animate-pulse' : ''}`}
            style={{ width: '44px', height: '44px', fill: isSuccess ? "url(#plumbob-gradient)" : undefined }}
          />
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            isSuccess ? 'opacity-100 scale-y-[0.6] scale-x-100' : 'opacity-0 scale-0'
          }`}>
            <Check weight="bold" className="text-white drop-shadow-md" size={24} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbit-cloud {
          0%   { transform: rotateZ(0deg) translateX(var(--orbit-radius)); opacity: 1; }
          50%  { transform: rotateZ(180deg) translateX(var(--orbit-radius)); opacity: 0.5; }
          100% { transform: rotateZ(360deg) translateX(var(--orbit-radius)); opacity: 1; }
        }

        @keyframes converge {
          0% { transform: translateX(var(--orbit-radius)); scale: 1; opacity: 1; }
          100% { transform: translateX(0px); scale: 0.3; opacity: 0; }
        }
      `}</style>
    </div>
  );
}