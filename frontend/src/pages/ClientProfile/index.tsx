import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_DB } from '../../utils/mockData';
import { 
    CheckCircle, Crown, ShieldCheck, User, Sparkle, Clock, 
    CalendarCheck, ArrowRight, Play, Briefcase, CaretRight, 
    WarningCircle, TrendUp, Users, Files 
} from '@phosphor-icons/react';
import { getCurrentRole, getSystemConfig, SystemConfig, UserRole } from '../../utils/dashboardConfig';
import { useSystemSettings } from '../../hooks/useSystemSettings';
import { useTheme } from '../../context/ThemeContext'; // Import useTheme
import AiOrb from '../../components/AiOrb';
import UserAvatar from '../../components/UserAvatar'; // Import component

const ACTION_MAP: Record<string, { route: string, tabKey: string, label: string, icon: any, color: string }> = {
    'compliance': { route: '/compliance', tabKey: 'compliance', label: 'Resolve Alert', icon: ShieldCheck, color: 'rose' },
    'financial': { route: '/finance', tabKey: 'finance', label: 'Review Report', icon: TrendUp, color: 'emerald' },
    'candidate': { route: '/hiring', tabKey: 'hiring', label: 'View Pipeline', icon: Users, color: 'amber' },
};

// ... (Keep COLOR_MAP unchanged) ...

const COLOR_MAP: Record<string, any> = {
    rose: { 
        bg: 'bg-[var(--color-danger)]', 
        bgLight: 'bg-[var(--color-danger)]/10',
        text: 'text-[var(--color-danger)]',
        border: 'border-[var(--color-danger)]/20',
        hover: 'hover:bg-[var(--color-danger)]',
        button: 'bg-[var(--color-danger)] hover:bg-[var(--color-danger)]/80',
        hoverBorder: 'hover:border-[var(--color-danger)]/30',
        hoverBg: 'group-hover:bg-[var(--color-danger)]'
    },
    emerald: { 
        bg: 'bg-[var(--color-success)]', 
        bgLight: 'bg-[var(--color-success)]/10',
        text: 'text-[var(--color-success)]',
        border: 'border-[var(--color-success)]/20',
        hover: 'hover:bg-[var(--color-success)]',
        button: 'bg-[var(--color-success)] hover:bg-[var(--color-success)]/80',
        hoverBorder: 'hover:border-[var(--color-success)]/30',
        hoverBg: 'group-hover:bg-[var(--color-success)]'
    },
    amber: { 
        bg: 'bg-[var(--color-warning)]', 
        bgLight: 'bg-[var(--color-warning)]/10',
        text: 'text-[var(--color-warning)]',
        border: 'border-[var(--color-warning)]/20',
        hover: 'hover:bg-[var(--color-warning)]',
        button: 'bg-[var(--color-warning)] hover:bg-[var(--color-warning)]/80',
        hoverBorder: 'hover:border-[var(--color-warning)]/30',
        hoverBg: 'group-hover:bg-[var(--color-warning)]'
    },
    indigo: { 
        bg: 'bg-[var(--color-primary)]', 
        bgLight: 'bg-[var(--color-primary)]/10',
        text: 'text-[var(--color-primary)]',
        border: 'border-[var(--color-primary)]/20',
        hover: 'hover:bg-[var(--color-primary)]',
        button: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80',
        hoverBorder: 'hover:border-[var(--color-primary)]/30',
        hoverBg: 'group-hover:bg-[var(--color-primary)]'
    },
    blue: { 
        bg: 'bg-[var(--color-info)]', 
        bgLight: 'bg-[var(--color-info)]/10',
        text: 'text-[var(--color-info)]',
        border: 'border-[var(--color-info)]/20',
        hover: 'hover:bg-[var(--color-info)]',
        button: 'bg-[var(--color-info)] hover:bg-[var(--color-info)]/80',
        hoverBorder: 'hover:border-[var(--color-info)]/30',
        hoverBg: 'group-hover:bg-[var(--color-info)]'
    }
};

export default function ClientProfile() {
  const navigate = useNavigate();
  const { currentClientId } = useAuth();
  const { formatDate } = useSystemSettings();
  const { currentAvatar } = useTheme(); // Use the hook
  
  const [lastOnline, setLastOnline] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(getCurrentRole());
  const [config, setConfig] = useState<SystemConfig>(getSystemConfig());
  
  const [suggestedAction, setSuggestedAction] = useState<any | null>(null);
  const [showAction, setShowAction] = useState(false);

  const currentClient = MOCK_DB.clients.find(c => c.id === currentClientId);
  const userName = "System User"; 

  useEffect(() => {
      const now = new Date();
      now.setHours(now.getHours() - 14); 
      setLastOnline(formatDate(now) + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
      setUserRole(getCurrentRole());
      setConfig(getSystemConfig());
  }, []);

  const generateBriefing = () => {
      if (loading || aiAnalysis) return; 
      
      setLoading(true);
      setShowAction(false);
      setSuggestedAction(null);

      setTimeout(() => {
          const dateStr = lastOnline.split(' ')[0];
          const mockResponse = `Welcome back. Since ${dateStr}, system activity has been normal. Priority: Check new compliance alerts in Germany regarding Visa updates.`;
          
          setAiAnalysis(mockResponse);
          
          const keyword = Object.keys(ACTION_MAP).find(k => mockResponse.toLowerCase().includes(k));
          
          if (keyword) {
              const action = ACTION_MAP[keyword];
              // @ts-ignore
              const hasAccess = config.layout[userRole].tabs[action.tabKey];
              if (hasAccess) {
                  setSuggestedAction(action);
                  setTimeout(() => setShowAction(true), 100); 
              }
          }
          setLoading(false);
      }, 1500);
  };

  const actionTheme = suggestedAction ? COLOR_MAP[suggestedAction.color] : COLOR_MAP['indigo'];

  return (
    <div className="w-full h-full overflow-y-auto bg-[var(--color-bg)] text-[var(--color-text)] relative custom-scrollbar transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--color-primary)]/20 via-transparent to-transparent pointer-events-none"></div>

      <div className="p-8 md:p-16 w-full max-w-7xl mx-auto flex flex-col items-center relative z-10 min-h-screen">
          
          {/* --- 1. IDENTITY HEADER --- */}
          <div className="text-center mb-12 animate-fade-in-down">
              <div className="inline-flex items-center justify-center mb-6 relative group hover:scale-105 transition-transform duration-500">
                  {/* Replaced Static Icon with UserAvatar */}
                  <UserAvatar avatarId={currentAvatar} size="xl" className="border-4 border-[var(--color-surface)] shadow-2xl" />
                  
                  <div className="absolute bottom-1 right-1 bg-[var(--color-success)] w-7 h-7 rounded-full border-4 border-[var(--color-bg)] shadow-lg"></div>
              </div>
              <h1 className="text-5xl md:text-6xl font-black font-['Montserrat'] tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-text)] via-[var(--color-primary)] to-[var(--color-text-muted)]">
                  {userName}
              </h1>
              <div className="flex items-center justify-center gap-3">
                  <span className="text-sm bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-1.5 rounded-full border border-[var(--color-primary)]/20 font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                      <Briefcase weight="fill" /> {userRole}
                  </span>
              </div>
          </div>

          {/* ... (Rest of file unchanged, just keeping context) ... */}
          
          {/* --- 2. INTELLIGENCE CONSOLE --- */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-16 h-auto min-h-[300px]">
              
              {/* Main Briefing Area */}
              <div className={`glass-card border border-[var(--color-primary)]/20 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center text-center transition-[grid-column] duration-500 ease-in-out ${showAction ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 pointer-events-none"></div>
                  
                  <div className="p-10 relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center gap-10">
                      
                      {/* Left: Orb */}
                      <div className="shrink-0 scale-125">
                          <AiOrb 
                              onClick={generateBriefing} 
                              state={aiAnalysis ? 'answered' : (loading ? 'thinking' : 'idle')} 
                          />
                      </div>

                      {/* Right: Content */}
                      <div className="flex-1 min-w-0">
                          {!aiAnalysis ? (
                              <div className="animate-fade-in text-center md:text-left">
                                  <h3 className="text-3xl font-bold mb-3">System Intelligence</h3>
                                  <p className="opacity-60 text-base leading-relaxed">
                                      Last active: <span className="font-mono text-[var(--color-primary)]">{lastOnline}</span>.<br/>
                                      Click the Orb to analyze logs and generate your executive brief.
                                  </p>
                              </div>
                          ) : (
                              <div className="animate-fade-in w-full text-left">
                                  <div className="flex items-center gap-3 mb-4">
                                      <div className="p-2 bg-[var(--color-success)]/10 rounded-lg text-[var(--color-success)] border border-[var(--color-success)]/20">
                                          <CalendarCheck weight="fill" size={24} />
                                      </div>
                                      <h4 className="text-xs font-bold uppercase tracking-widest opacity-60">Status Report</h4>
                                  </div>
                                  <p className="text-xl leading-relaxed font-medium">"{aiAnalysis}"</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* Dynamic Action Slide-in */}
              {showAction && suggestedAction && (
                  <div className="glass-card bg-gradient-to-br from-[var(--color-surface)] to-transparent border border-[var(--color-border)] lg:col-span-4 flex flex-col justify-center items-center text-center p-8 animate-fade-in-right">
                      <div className={`w-20 h-20 rounded-2xl ${actionTheme.bg} flex items-center justify-center ${actionTheme.text} shadow-2xl mb-6 animate-bounce-slow`}>
                          <suggestedAction.icon size={40} weight="duotone" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Priority Item</h4>
                      <p className="text-sm opacity-70 mb-8 max-w-[200px] leading-relaxed">System flagged this module for immediate review.</p>
                      <button 
                          onClick={() => navigate(suggestedAction.route)}
                          className={`w-full py-4 rounded-xl ${actionTheme.button} text-[var(--color-bg)] font-bold shadow-lg transition flex items-center justify-center gap-2 group text-sm tracking-wide`}
                      >
                          {suggestedAction.label} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
              )}
          </div>

          {/* --- 3. QUICK ACTIONS --- */}
          <div className="w-full mb-20">
              <h4 className="text-xs font-bold uppercase opacity-40 mb-6 tracking-widest pl-2">Operations Deck</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <ActionBtn onClick={() => navigate('/time')} icon={Play} color="emerald" label="Start Timer" />
                  <ActionBtn onClick={() => navigate('/dashboard')} icon={Crown} color="indigo" label="Main Dashboard" />
                  <ActionBtn onClick={() => navigate('/compliance')} icon={WarningCircle} color="rose" label="Audits" />
                  <ActionBtn onClick={() => navigate('/docs')} icon={Files} color="blue" label="Repository" />
              </div>
          </div>

          {/* Footer */}
          <div className="mt-auto w-full pt-8 border-t border-[var(--color-border)] flex justify-between items-center text-[10px] opacity-40 uppercase font-bold tracking-widest">
              <span>Environment: {currentClient?.name} ({currentClientId})</span>
              <span className="flex items-center gap-1"><Crown weight="fill" /> Enterprise License</span>
          </div>

      </div>
    </div>
  );
}

const ActionBtn = ({ onClick, icon: Icon, color, label }: any) => {
    const theme = COLOR_MAP[color];
    return (
        <button 
            onClick={onClick}
            className={`glass-card p-6 flex flex-col items-center justify-center gap-4 hover:bg-[var(--color-surface)]/50 transition-all group border border-[var(--color-border)] ${theme.hoverBorder} hover:-translate-y-1 duration-300`}
        >
            <div className={`p-4 rounded-full ${theme.bgLight} ${theme.text} ${theme.hoverBg} group-hover:text-[var(--color-bg)] transition-colors duration-300 shadow-sm`}>
                <Icon weight="fill" size={24} />
            </div>
            <span className="text-sm font-bold">{label}</span>
        </button>
    );
};