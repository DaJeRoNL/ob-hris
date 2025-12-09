import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS we just created

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  
  // Ref for the background element
  const bgRef = useRef<HTMLDivElement>(null);

  // --- ANIMATION SCRIPT PORT ---
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    const layers = [
        { strength: 20, phase: Math.random() * 2 * Math.PI, speed: 0.0003 },
        { strength: 15, phase: Math.random() * 2 * Math.PI, speed: 0.0004 },
        { strength: 10, phase: Math.random() * 2 * Math.PI, speed: 0.0005 }
    ];

    const state = layers.map(() => ({ x: 50, y: 50 }));

    let noiseX = 0, noiseY = 0;
    let mouseX: number | null = null; 
    let mouseY: number | null = null;
    let lastMouseX: number | null = null; 
    let lastMouseY: number | null = null;
    let lastMouseTime = 0;
    let mouseSpeedNorm = 0;
    let animationFrameId: number;

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const handleMouseMove = (e: MouseEvent) => {
        const now = performance.now();
        if (lastMouseTime) {
            const dt = Math.max(1, now - lastMouseTime);
            // safe check for nulls
            const dist = Math.hypot(e.clientX - (lastMouseX ?? e.clientX), e.clientY - (lastMouseY ?? e.clientY));
            const raw = clamp((dist / dt) / 1.5, 0, 2);
            mouseSpeedNorm = lerp(mouseSpeedNorm, clamp(raw, 0, 1), 0.35);
        }
        lastMouseTime = now;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
        mouseX = null; 
        mouseY = null;
        mouseSpeedNorm = lerp(mouseSpeedNorm, 0, 0.2);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const updateNoise = () => {
        noiseX = lerp(noiseX, noiseX + (Math.random() - 0.5) * 0.04, 0.08);
        noiseY = lerp(noiseY, noiseY + (Math.random() - 0.5) * 0.04, 0.08);
        noiseX = clamp(noiseX, -5, 5);
        noiseY = clamp(noiseY, -5, 5);
    };

    const animate = (ts: number) => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        updateNoise();

        for (let i = 0; i < layers.length; i++) {
            const l = layers[i];
            const s = state[i];
            const t = ts * l.speed;

            const amp1 = 15, amp2 = 8;
            const ambientX = (Math.sin(t * (0.6 + i * 0.13) + l.phase) * amp1) + (Math.sin(t * (1.3 + i * 0.2)) * amp2);
            const ambientY = (Math.cos(t * (0.7 + i * 0.11) + l.phase) * amp1) + (Math.cos(t * (1.5 + i * 0.25)) * amp2);

            let targetX = 50 + ambientX + noiseX * (1 + i * 0.2);
            let targetY = 50 + ambientY + noiseY * (1 + i * 0.2);

            if (mouseX !== null && mouseY !== null) {
                const layerPxX = (s.x / 100) * w;
                const layerPxY = (s.y / 100) * h;

                let vx = layerPxX - mouseX;
                let vy = layerPxY - mouseY;
                const dist = Math.hypot(vx, vy);
                if (dist > 0.0001) { vx /= dist; vy /= dist; } 
                else { vx = 0; vy = 0; }

                const maxInfluenceDist = Math.max(w, h) * 0.5;
                const falloff = clamp(1 - dist / maxInfluenceDist, 0, 1);
                const speedAmpl = 0.5 + 0.5 * clamp(mouseSpeedNorm, 0, 1);

                const repulse = l.strength * falloff * speedAmpl * 1.5;
                targetX += (vx * repulse) * (100 / w);
                targetY += (vy * repulse) * (100 / h);

                const mouseInfluenceX = lerp(0, (mouseX - w / 2) / w * 100, 0.1);
                const mouseInfluenceY = lerp(0, (mouseY - h / 2) / h * 100, 0.1);
                targetX += mouseInfluenceX * 0.5;
                targetY += mouseInfluenceY * 0.5;
            }

            targetX = clamp(targetX, 2, 98);
            targetY = clamp(targetY, 2, 98);

            const ease = 0.05 + i * 0.01;
            s.x = lerp(s.x, targetX, ease);
            s.y = lerp(s.y, targetY, ease);
        }

        const css = `${state[0].x.toFixed(2)}% ${state[0].y.toFixed(2)}%, ` +
                    `${state[1].x.toFixed(2)}% ${state[1].y.toFixed(2)}%, ` +
                    `${state[2].x.toFixed(2)}% ${state[2].y.toFixed(2)}%`;
        
        if (bg) bg.style.backgroundPosition = css;

        animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    const intervalId = setInterval(() => { mouseSpeedNorm = lerp(mouseSpeedNorm, 0, 0.07); }, 120);

    // Cleanup
    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        cancelAnimationFrame(animationFrameId);
        clearInterval(intervalId);
    };
  }, []);
  // -----------------------------

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setMsg({ type: 'error', text: 'Enter email and password' });
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg({ type: 'error', text: error.message });
    else navigate('/dashboard');
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setMsg({ type: 'error', text: 'Enter email and password' });

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg({ type: 'error', text: error.message });
    else setMsg({ type: 'success', text: 'Account created! Check email.' });
    setLoading(false);
  };

  const enterDevMode = () => {
    sessionStorage.setItem('dev_bypass', 'true');
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Overlay mapped to the Ref */}
      <div id="bg-overlay" ref={bgRef}></div>

      {/* Login Container */}
      <div className="login-glass-container">
        <div className="title-sequence">
            <h1 className="welcome-text">Welcome!</h1>
            <div className="title-line"></div>
            <h1 className="pb-text">PB // HRIS</h1>
        </div>

        <form className="w-full max-w-[350px]">
            <div className="input-group">
                <input 
                    type="email" 
                    className="login-input" 
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="input-group">
                <input 
                    type="password" 
                    className="login-input" 
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <div className="btn-container">
                <button 
                    onClick={handleSignIn} 
                    className="action-button btn-primary"
                    disabled={loading}
                >
                    {loading ? '...' : 'Sign In'}
                </button>
                <button 
                    onClick={handleSignUp} 
                    className="action-button btn-secondary"
                    disabled={loading}
                >
                    Sign Up
                </button>
            </div>
        </form>

        <button onClick={enterDevMode} className="dev-mode-btn">
            ( Developer Bypass )
        </button>

        {msg && (
            <div className={`mt-4 p-2 rounded text-sm text-center w-full animate-fade-in ${msg.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                {msg.text}
            </div>
        )}
      </div>

      <footer className="footer">
          <span className="footer-text">Powered by CoreByte!</span>
      </footer>
    </div>
  );
}