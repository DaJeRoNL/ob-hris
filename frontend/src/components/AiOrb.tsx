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

const PARTICLE_COUNT = 7;

export default function AiOrb({ onClick, state, thinkingIntensity = 0.5 }: Props) {
  const [visualState, setVisualState] =
    useState<'idle' | 'active' | 'converging' | 'success'>('idle');
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (state === 'idle') setVisualState('idle');
    else if (state === 'loading' || state === 'thinking') setVisualState('active');
    else if (state === 'answered') {
      setVisualState('converging');
      const timer = setTimeout(() => setVisualState('success'), 800);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const isIdle = visualState === 'idle';
  const isActive = visualState === 'active';
  const isConverging = visualState === 'converging';
  const isSuccess = visualState === 'success';

  const showParticles = (isActive || isHovered || isConverging) && !isSuccess;

  const diamondTransform = isPressed
    ? 'scale(0.9) scaleY(1.4)'
    : 'scale(1.0) scaleY(1.6)';

  // --- PARTICLE DATA ---
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      radius: 26 + Math.random(),
      initialRotation: [
        Math.random() * 360,
        Math.random() * 360,
        Math.random() * 360,
      ],
      cloudDuration: 6 + Math.random() * 4,
      cloudDelay: -(Math.random() * 8),
      fig8Delay: (i / PARTICLE_COUNT) * -2,

      // 🔴 BIGGER DOTS
      size: 5,
    }));
  }, []);

  // --- LIQUID ANIMATION GENERATOR ---
const dynamicStyles = useMemo(() => {
    let keyframes = '';
    const steps = 100;

    for (let i = 0; i <= steps; i++) {
      const percent = i;
      const t = (i / steps) * 2 * Math.PI;
      const x = Math.cos(t);
      const z = Math.sin(2 * t);

      // Hide dots only at ONE center crossing
      let opacity = 1;
      const cyclePercent = (i / steps) * 100;
      
      if (cyclePercent > 16 && cyclePercent < 34) {
          opacity = 0;
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
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
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

      {/* PARTICLES */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none z-0" style={{ transformStyle: 'preserve-3d' }}>
          {particles.map((p) => {
            const isFigure8Mode = isHovered && !isConverging && !isActive;

            const containerRotation = isFigure8Mode
              ? 'rotateX(35deg)'
              : isActive && !isConverging
              ? 'rotateX(0deg) rotateY(0deg)'
              : `rotateX(${p.initialRotation[0]}deg)
                 rotateY(${p.initialRotation[1]}deg)
                 rotateZ(${p.initialRotation[2]}deg)`;

            let animName = 'orbit-cloud';
            if (isFigure8Mode) animName = 'figure-8-liquid';
            else if (isActive && !isConverging) animName = 'orbit-energetic';
            if (isConverging) animName = 'converge-spiral';

            const duration = isFigure8Mode ? '4s' : isActive ? '1.8s' : `${p.cloudDuration}s`;
            const delay = isFigure8Mode ? `${p.fig8Delay}s` : isActive ? `${(p.id * -0.36)}s` : `${p.cloudDelay}s`;
            const timing = isConverging ? 'ease-in-out' : 'linear';

            return (
              <div
                key={p.id}
                className="absolute top-1/2 left-1/2 w-0 h-0"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: containerRotation,
                  transition: 'transform 0.8s cubic-bezier(0.2, 0, 0.2, 1)',
                }}
              >
                <div
                  className={`rounded-full bg-[var(--color-text)] absolute shadow-[0_0_10px_rgba(255,255,255,0.8)] ${isActive && !isFigure8Mode ? 'animate-pulse' : ''}`}
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    marginLeft: `${-p.size / 2}px`,
                    marginTop: `${-p.size / 2}px`,
                    opacity: 1,
                    '--orbit-radius': `${isActive && !isFigure8Mode ? p.radius * 0.8 : p.radius}px`,
                    '--orbit-depth': `${p.radius * 0.75}px`,
                    animation: `${animName} ${isConverging ? '0.8s' : duration} ${timing} infinite`,
                    animationFillMode: isConverging ? 'forwards' : 'none',
                    animationDelay: isConverging ? '0s' : delay,
                  } as React.CSSProperties}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ORB */}
      <div className="relative z-10">
        <svg width="0" height="0">
          <defs>
            <linearGradient id="plumbob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="relative transition-all duration-500 ease-out" style={{ transform: diamondTransform }}>
          <Diamond
            weight={isSuccess ? 'fill' : 'light'}
            className={`transition-all duration-700 ease-out ${
              isSuccess
                ? 'drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]'
                : 'text-[var(--color-text)] drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]'
            } ${isActive ? 'animate-pulse' : ''}`}
            style={{ width: '44px', height: '44px', fill: isSuccess ? 'url(#plumbob-gradient)' : undefined }}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isSuccess ? 'opacity-100 scale-y-[0.6] scale-x-100' : 'opacity-0 scale-0'
            }`}
          >
            <Check weight="bold" className="text-white drop-shadow-md" size={24} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbit-cloud {
          0%   { transform: rotateZ(0deg) translateX(var(--orbit-radius)); opacity: 1; }
          50%  { transform: rotateZ(180deg) translateX(var(--orbit-radius)); opacity: 1; }
          100% { transform: rotateZ(360deg) translateX(var(--orbit-radius)); opacity: 1; }
        }

        @keyframes orbit-energetic {
          0%   { transform: rotateZ(0deg) translateX(var(--orbit-radius)) scale(1); opacity: 1; }
          25%  { transform: rotateZ(90deg) translateX(var(--orbit-radius)) scale(1.3); opacity: 1; }
          50%  { transform: rotateZ(180deg) translateX(var(--orbit-radius)) scale(1); opacity: 1; }
          75%  { transform: rotateZ(270deg) translateX(var(--orbit-radius)) scale(1.3); opacity: 1; }
          100% { transform: rotateZ(360deg) translateX(var(--orbit-radius)) scale(1); opacity: 1; }
        }

        @keyframes converge {
          0% { 
            offset-distance: 100%;
            scale: 1; 
            opacity: 1; 
          }
          70% {
            offset-distance: 10%;
            scale: 0.8;
            opacity: 0.8;
          }
          100% { 
            offset-distance: 0%;
            scale: 0; 
            opacity: 0; 
          }
        }
        
        @keyframes converge-spiral {
          from { 
            transform: translateX(var(--orbit-radius)) rotate(0deg); 
            scale: 1; 
            opacity: 1; 
          }
          to { 
            transform: translateX(0px) rotate(1080deg); 
            scale: 0; 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
}