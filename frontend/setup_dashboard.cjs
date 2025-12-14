/* frontend/fix_ui_v13.cjs */
const fs = require('fs');
const path = require('path');

const PAGES_PATH = path.join(__dirname, 'src', 'pages');
const COMPONENTS_PATH = path.join(__dirname, 'src', 'components');

// --- 1. FIX SIDEBAR TOOLTIPS ---
// Problem: 'fixed' position inside a transformed or scrolling parent can behave unexpectedly.
// Fix: Ensure z-index is maxed and removed 'transform' interference from the tooltip container.
const SIDEBAR_PATH = path.join(COMPONENTS_PATH, 'Sidebar.tsx');
const sidebarContent = `
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  SquaresFour, Users, Briefcase, Clock, ChatCircleDots, SignOut, 
  Moon, Sun, CurrencyDollar, TrendUp, Globe, Files, Gear 
} from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { getSystemConfig, SystemConfig, getCurrentRole, UserRole } from '../utils/dashboardConfig';

export default function Sidebar() {
  const { signOut } = useAuth();
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'dark');
  
  const [config, setConfig] = useState<SystemConfig>(getSystemConfig());
  const [currentRole, setCurrentRoleState] = useState<UserRole>(getCurrentRole());

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
      const handleConfig = () => setConfig(getSystemConfig());
      const handleRole = () => setCurrentRoleState(getCurrentRole());
      
      window.addEventListener('sys-config-updated', handleConfig);
      window.addEventListener('role-updated', handleRole);
      return () => {
          window.removeEventListener('sys-config-updated', handleConfig);
          window.removeEventListener('role-updated', handleRole);
      };
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const Item = ({ to, icon: Icon, title, id }: { to: string, icon: any, title: string, id: string }) => {
      const roleConfig = config.layout[currentRole];
      if (!roleConfig || !roleConfig.tabs[id as keyof typeof roleConfig.tabs]) return null;

      return (
        <NavLink 
          to={to} 
          className={({ isActive }) => \`nav-item group relative flex items-center justify-center \${isActive ? 'active' : ''}\`}
        >
          <Icon weight="bold" style={{ fontSize: '1.4rem' }} className="relative z-10" />
          
          {/* Tooltip: Fixed to viewport, high Z-Index, pushed right */}
          <div className="fixed left-[70px] bg-[#1f2937] text-white px-3 py-1.5 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/10 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[100] ml-4">
            {title}
            {/* Arrow */}
            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-[6px] border-transparent border-r-[#1f2937]"></div>
          </div>
        </NavLink>
      );
  };

  return (
    <aside 
        className="h-full flex flex-col items-center py-6 border-r z-50 overflow-visible bg-[var(--bg-sidebar)] border-[var(--border-color)] w-[80px]"
    >
      <Link 
        to="/context"
        className="mb-6 flex items-center justify-center font-extrabold text-xl cursor-pointer hover:scale-105 transition-transform w-12 h-12 rounded-xl bg-[var(--bg-panel)] text-[var(--accent-primary)] shadow-lg z-50"
        title="Workspace Hub"
      >
        PB
      </Link>
      
      <div className="w-8 border-t mb-6 border-[var(--border-color)]"></div>

      {/* Navigation Items Container - Allow overflow for tooltips if needed */}
      <div className="flex-1 w-full flex flex-col items-center overflow-y-auto no-scrollbar space-y-2 pb-4">
          <Item to="/dashboard" icon={SquaresFour} title="Dashboard" id="dashboard" />
          <Item to="/hiring" icon={Briefcase} title="Hiring" id="hiring" />
          <Item to="/people" icon={Users} title="People" id="people" />
          <Item to="/time" icon={Clock} title="Time" id="time" />
          <Item to="/finance" icon={CurrencyDollar} title="Finance" id="finance" />
          <Item to="/growth" icon={TrendUp} title="Growth" id="growth" />
          <Item to="/compliance" icon={Globe} title="Compliance" id="compliance" />
          <Item to="/docs" icon={Files} title="Documents" id="docs" />
          <Item to="/chat" icon={ChatCircleDots} title="Chat" id="chat" />
          
          <div className="mt-4 pt-4 border-t border-[var(--border-color)] w-8"></div>
          <Item to="/admin" icon={Gear} title="Admin Settings" id="admin" />
      </div>

      <div className="flex-col gap-4 mt-auto flex items-center pb-2">
          <button onClick={toggleTheme} className="nav-item group relative">
            {theme === 'dark' ? <Moon weight="fill" style={{ fontSize: '1.4rem' }} /> : <Sun weight="fill" style={{ fontSize: '1.4rem' }} />}
            <div className="fixed left-[70px] bg-[#1f2937] text-white px-3 py-1.5 rounded-md shadow-xl border border-white/10 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] ml-4">
                Toggle Theme
                <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-[6px] border-transparent border-r-[#1f2937]"></div>
            </div>
          </button>
          
          <button 
            onClick={signOut} 
            className="nav-item text-red-400 hover:text-red-500 hover:bg-red-500/10 group relative"
          >
            <SignOut weight="bold" style={{ fontSize: '1.4rem' }} />
            <div className="fixed left-[70px] bg-red-900/90 text-white px-3 py-1.5 rounded-md shadow-xl border border-red-500/30 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100] ml-4">
                Sign Out
                <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-[6px] border-transparent border-r-red-900/90"></div>
            </div>
          </button>
      </div>
    </aside>
  );
}
`;

// --- 2. FIX CLIENT PROFILE (SYSTEM INTELLIGENCE MODAL) ---
// Problem: 'absolute' positioning during slide-in caused overlap/cropping.
// Fix: Use CSS Grid columns exclusively for the layout shift (col-span-12 vs col-span-8).
const CLIENT_PROFILE_PATH = path.join(PAGES_PATH, 'ClientProfile.tsx');
const clientProfileContent = `
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_DB } from '../utils/mockData';
import { 
    CheckCircle, Crown, ShieldCheck, User, Sparkle, Clock, 
    CalendarCheck, ArrowRight, Play, Briefcase, CaretRight, 
    WarningCircle, TrendUp, Users, Files 
} from '@phosphor-icons/react';
import { getCurrentRole, getSystemConfig, SystemConfig, UserRole } from '../utils/dashboardConfig';
import { useSystemSettings } from '../hooks/useSystemSettings';

const ACTION_MAP: Record<string, { route: string, tabKey: string, label: string, icon: any, color: string }> = {
    'compliance': { route: '/compliance', tabKey: 'compliance', label: 'Resolve Alert', icon: ShieldCheck, color: 'rose' },
    'financial': { route: '/finance', tabKey: 'finance', label: 'Review Report', icon: TrendUp, color: 'emerald' },
    'candidate': { route: '/hiring', tabKey: 'hiring', label: 'View Pipeline', icon: Users, color: 'amber' },
};

export default function ClientProfile() {
  const navigate = useNavigate();
  const { currentClientId } = useAuth();
  const { formatDate } = useSystemSettings();
  
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
      setLoading(true);
      setShowAction(false);
      setSuggestedAction(null);

      setTimeout(() => {
          const dateStr = lastOnline.split(' ')[0];
          const mockResponse = \`Welcome back. Since \${dateStr}, system activity has been normal. Priority: Check new compliance alerts in Germany regarding Visa updates.\`;
          
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

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50 dark:bg-[#020617] text-[var(--text-main)] relative custom-scrollbar">
      
      {/* Background Decor */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none"></div>

      <div className="p-8 md:p-16 w-full max-w-7xl mx-auto flex flex-col items-center relative z-10 min-h-screen">
          
          {/* --- 1. IDENTITY HEADER --- */}
          <div className="text-center mb-12 animate-fade-in-down">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-white/10 border-4 border-white/20 shadow-2xl mb-6 relative backdrop-blur-md group hover:scale-105 transition-transform duration-500">
                  <User size={54} weight="duotone" className="text-indigo-400" />
                  <div className="absolute bottom-1 right-1 bg-emerald-500 w-7 h-7 rounded-full border-4 border-[#020617] shadow-lg"></div>
              </div>
              <h1 className="text-5xl md:text-6xl font-black font-['Montserrat'] tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-600 dark:from-white dark:via-indigo-200 dark:to-gray-400">
                  {userName}
              </h1>
              <div className="flex items-center justify-center gap-3">
                  <span className="text-sm bg-indigo-500/10 text-indigo-500 px-4 py-1.5 rounded-full border border-indigo-500/20 font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                      <Briefcase weight="fill" /> {userRole}
                  </span>
              </div>
          </div>

          {/* --- 2. INTELLIGENCE CONSOLE (Fixed Cropping) --- */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-16 h-auto min-h-[300px]">
              
              {/* Main Briefing Area: Expands/Contracts using Col Span */}
              <div className={\`glass-card border border-indigo-500/20 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center text-center transition-[grid-column] duration-500 ease-in-out \${showAction ? 'lg:col-span-8' : 'lg:col-span-12'}\`}>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 to-purple-900/10 pointer-events-none"></div>
                  
                  <div className="p-10 relative z-10 flex flex-col items-center max-w-2xl w-full">
                      {!aiAnalysis ? (
                          <div className="flex flex-col items-center">
                              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white mb-6 animate-pulse border border-white/10">
                                  <Sparkle weight="fill" size={32} />
                              </div>
                              <h3 className="text-3xl font-bold mb-3">System Intelligence</h3>
                              <p className="opacity-60 mb-8 text-base leading-relaxed">
                                  Last active: <span className="font-mono text-indigo-400">{lastOnline}</span>.<br/>
                                  Ready to analyze logs and generate your personalized executive brief.
                              </p>
                              <button 
                                  onClick={generateBriefing}
                                  disabled={loading}
                                  className="group px-8 py-4 bg-white dark:bg-[#1e293b] text-indigo-600 dark:text-indigo-300 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 border border-indigo-500/10 text-sm tracking-wide"
                              >
                                  {loading ? <><Clock className="animate-spin" /> Processing Data...</> : <><Sparkle weight="fill" /> Generate Briefing</>}
                              </button>
                          </div>
                      ) : (
                          <div className="animate-fade-in w-full text-left">
                              <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 border border-emerald-500/20"><CalendarCheck weight="fill" size={24} /></div>
                                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-60">Status Report</h4>
                              </div>
                              <p className="text-xl leading-relaxed font-medium">"{aiAnalysis}"</p>
                          </div>
                      )}
                  </div>
              </div>

              {/* Dynamic Action Slide-in (No longer absolute positioning that causes overlap) */}
              {showAction && suggestedAction && (
                  <div className="glass-card bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 border lg:col-span-4 flex flex-col justify-center items-center text-center p-8 animate-fade-in-right">
                      <div className={\`w-20 h-20 rounded-2xl bg-\${suggestedAction.color}-500 flex items-center justify-center text-white shadow-2xl mb-6 animate-bounce-slow\`}>
                          <suggestedAction.icon size={40} weight="duotone" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Priority Item</h4>
                      <p className="text-sm opacity-70 mb-8 max-w-[200px] leading-relaxed">System flagged this module for immediate review.</p>
                      <button 
                          onClick={() => navigate(suggestedAction.route)}
                          className={\`w-full py-4 rounded-xl bg-\${suggestedAction.color}-600 hover:bg-\${suggestedAction.color}-700 text-white font-bold shadow-lg transition flex items-center justify-center gap-2 group text-sm tracking-wide\`}
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
          <div className="mt-auto w-full pt-8 border-t border-gray-200 dark:border-white/5 flex justify-between items-center text-[10px] opacity-40 uppercase font-bold tracking-widest">
              <span>Environment: {currentClient?.name} ({currentClientId})</span>
              <span className="flex items-center gap-1"><Crown weight="fill" /> Enterprise License</span>
          </div>

      </div>
    </div>
  );
}

const ActionBtn = ({ onClick, icon: Icon, color, label }: any) => (
    <button 
        onClick={onClick}
        className={\`glass-card p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all group border border-white/5 hover:border-\${color}-500/30 hover:-translate-y-1 duration-300\`}
    >
        <div className={\`p-4 rounded-full bg-\${color}-500/10 text-\${color}-500 group-hover:bg-\${color}-500 group-hover:text-white transition-colors duration-300 shadow-sm\`}>
            <Icon weight="fill" size={24} />
        </div>
        <span className="text-sm font-bold">{label}</span>
    </button>
);
`;

fs.writeFileSync(SIDEBAR_PATH, sidebarContent.trim());
fs.writeFileSync(CLIENT_PROFILE_PATH, clientProfileContent.trim());

console.log("✅ Applied Fixes:");
console.log("   1. Sidebar Tooltips: Z-Index maxed, removed constraints.");
console.log("   2. System Modal: Fixed cropping/overlap issue via Grid Layout.");