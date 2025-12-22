import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Envelope, LockKey, TerminalWindow, ArrowRight, ShieldCheck } from '@phosphor-icons/react';
import AiOrb from '../../components/AiOrb';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const { session } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generate architectural background shards
    const backgroundShapes = useMemo(() => {
        const types = ['square', 'triangle'];
        return [...Array(60)].map((_, i) => ({
            id: i,
            type: types[i % 2],
            delay: `${i * 0.1}s`,
            rot: `${(i * 13) % 360}deg`,
            top: `${Math.floor(i / 6) * 10 + (Math.random() * 8 - 4)}%`,
            left: `${(i % 6) * 20 - 10 + (Math.random() * 8 - 4)}%`,
        }));
    }, []);

    useEffect(() => {
        if (session) navigate('/dashboard');
    }, [session, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    const handleDevBypass = () => {
        sessionStorage.setItem('dev_bypass', 'true');
        window.location.reload();
    };

    return (
        <div className="nexus-gateway">
            {/* --- RE-STYLIZED GEOMETRIC BACKGROUND --- */}
            <div className="scale-canvas">
                {backgroundShapes.map((s) => (
                    <div 
                        key={s.id} 
                        className={`faded-island shape-${s.type}`} 
                        style={{
                            '--delay': s.delay,
                            '--rot': s.rot,
                            '--top': s.top,
                            '--left': s.left,
                        } as React.CSSProperties}
                    />
                ))}
                <div className="hue-overlay"></div>
            </div>

            {/* --- CENTERED FROSTED STAGE --- */}
            <div className="login-stage">
                <div className="frosted-modal animate-fade-in">
                    
                    <div className="orb-anchor">
                        {/* We use CSS in Login.css to force the size now */}
                        <AiOrb state={loading ? 'thinking' : 'idle'} onClick={undefined} />
                    </div>

                    <header className="gateway-header">
                        <div className="security-badge-centered">
                            <ShieldCheck weight="fill" />
                            <span>System Authentication</span>
                        </div>
                        
                        <div className="brand-animation-wrapper">
                            <h1 className="brand-logo">
                                <span className="nexus-part tracking-[-0.06em]">NEXUS</span>
                                <span className="themed-dot">.</span>
                                <span className="hris-part tracking-[-0.1em] ml-[-2px]">HRIS</span>
                            </h1>
                        </div>
                        <p className="brand-subtitle">Intelligence & Operations Platform</p>
                    </header>

                    {error && (
                        <div className="error-pill animate-pop-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="auth-form-fields">
                        <div className="auth-input-group">
                            <Envelope className="field-icon" weight="duotone" />
                            <input 
                                type="email" 
                                placeholder="Corporate Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="auth-input-group">
                            <LockKey className="field-icon" weight="duotone" />
                            <input 
                                type="password" 
                                placeholder="Access Key" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="auth-submit-btn">
                            <span>{loading ? 'Authenticating...' : 'Initialize Session'}</span>
                            {!loading && <ArrowRight weight="bold" />}
                        </button>
                    </form>

                    <footer className="gateway-footer">
                        <button onClick={handleDevBypass} className="dev-access-row">
                            <TerminalWindow size={16} weight="bold" /> 
                            <span>Developer Access</span>
                        </button>
                        
                        <div className="meta-container">
                            <div className="system-version">System v1.4 // Active</div>
                            <div className="brand-attribution">Powered by CoreByte</div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}