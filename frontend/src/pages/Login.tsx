import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: any[] = [];
    const colors = ['rgba(139, 92, 246, 0.5)', 'rgba(16, 185, 129, 0.5)', 'rgba(234, 179, 8, 0.5)'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 4 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg({ type: 'error', text: error.message });
    else navigate('/dashboard');
    setLoading(false);
  };

  const enterDevMode = () => {
    sessionStorage.setItem('dev_bypass', 'true');
    window.location.reload(); // Reload to trigger AuthContext
  };

  return (
    <div className="relative min-h-screen w-full bg-[#111827] flex items-center justify-center overflow-hidden font-['Raleway']">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" />
      
      <div className="relative z-10 w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white font-['Montserrat'] mb-2">Welcome!</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-emerald-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400">PB // HRIS Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          
          <button disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:-translate-y-0.5">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <button onClick={enterDevMode} className="w-full mt-4 text-xs text-gray-600 hover:text-gray-400 transition">
          ( Developer Bypass )
        </button>

        {msg && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${msg.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}