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
          className={({ isActive }) => `nav-item group relative flex items-center justify-center ${isActive ? 'active' : ''}`}
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
        className="mb-2 flex items-center justify-center font-extrabold text-xl cursor-pointer hover:scale-105 transition-transform w-12 h-12 rounded-xl bg-[var(--bg-panel)] text-[var(--accent-primary)] shadow-lg z-50"
        title="Workspace Hub"
      >
        PB
      </Link>
      
      {/* Grouped Dashboard with Context */}
      <Item to="/dashboard" icon={SquaresFour} title="Dashboard" id="dashboard" />

      {/* Separator moved underneath Dashboard */}
      <div className="w-8 border-t my-4 border-[var(--border-color)]"></div>

      {/* Navigation Items Container */}
      <div className="flex-1 w-full flex flex-col items-center overflow-y-auto no-scrollbar space-y-2 pb-4">
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