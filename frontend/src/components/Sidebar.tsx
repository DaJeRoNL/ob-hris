import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  SquaresFour, Users, Briefcase, Clock, PlugsConnected, SignOut, 
  Moon, Sun, CurrencyDollar, TrendUp, Globe, HardDrives, Gear,
  Kanban 
} from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { getSystemConfig, SystemConfig, getCurrentRole, UserRole } from '../utils/dashboardConfig';
import { useSystemSettings } from '../hooks/useSystemSettings';

export default function Sidebar() {
  const { signOut } = useAuth();
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'dark');
  const { settings } = useSystemSettings();
  const systemName = settings?.systemName;
  const [config, setConfig] = useState<SystemConfig>(getSystemConfig());
  const [currentRole, setCurrentRoleState] = useState<UserRole>(getCurrentRole());

  useEffect(() => { document.documentElement.className = theme; localStorage.setItem('theme', theme); }, [theme]);

  useEffect(() => {
      const handleConfig = () => setConfig(getSystemConfig());
      const handleRole = () => setCurrentRoleState(getCurrentRole());
      window.addEventListener('sys-config-updated', handleConfig);
      window.addEventListener('role-updated', handleRole);
      return () => { window.removeEventListener('sys-config-updated', handleConfig); window.removeEventListener('role-updated', handleRole); };
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const logoText = (systemName || 'PB').split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);

  const Item = ({ to, icon: Icon, title, id }: { to: string, icon: any, title: string, id: string }) => {
      const roleConfig = config.layout[currentRole];
      if (!roleConfig || !roleConfig.tabs[id as keyof typeof roleConfig.tabs]) return null;
      return (
        <NavLink to={to} className={({ isActive }) => `nav-item group relative flex items-center justify-center ${isActive ? 'active' : ''}`}>
          <Icon weight="bold" style={{ fontSize: '1.4rem' }} className="relative z-10" />
          <div className="fixed left-[70px] bg-[var(--color-surface)] text-[var(--color-text)] px-3 py-1.5 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-[var(--color-border)] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[100] ml-4">
            {title}
            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-[6px] border-transparent border-r-[var(--color-surface)]"></div>
          </div>
        </NavLink>
      );
  };

  return (
    <aside className="h-full flex flex-col items-center py-6 border-r z-50 overflow-visible bg-[var(--color-sidebar)] border-[var(--color-border)] w-[80px]">
      <Link to="/context" className="mb-2 flex items-center justify-center font-extrabold text-xl cursor-pointer hover:scale-105 transition-transform w-12 h-12 rounded-xl bg-[var(--color-surface)] text-[var(--color-primary)] shadow-lg z-50" title="Workspace Hub">{logoText}</Link>
      <Item to="/dashboard" icon={SquaresFour} title="Dashboard" id="dashboard" />
      <div className="w-8 border-t my-4 border-[var(--color-border)]"></div>
      <div className="flex-1 w-full flex flex-col items-center overflow-y-auto no-scrollbar space-y-2 pb-4">
          <Item to="/tasks" icon={Kanban} title="Task Board" id="tasks" />
          <Item to="/chat" icon={PlugsConnected} title="CommLink" id="chat" />
          <Item to="/hiring" icon={Briefcase} title="Hiring" id="hiring" />
          <Item to="/people" icon={Users} title="People" id="people" />
          <Item to="/time" icon={Clock} title="Time" id="time" />
          <Item to="/finance" icon={CurrencyDollar} title="Finance" id="finance" />
          <Item to="/growth" icon={TrendUp} title="Growth" id="growth" />
          <Item to="/compliance" icon={Globe} title="Compliance" id="compliance" />
          <Item to="/docs" icon={HardDrives} title="Data Vault" id="docs" />
          <div className="mt-4 pt-4 border-t border-[var(--color-border)] w-8"></div>
          <Item to="/admin" icon={Gear} title="Admin Settings" id="admin" />
      </div>
      <div className="flex-col gap-4 mt-auto flex items-center pb-2">
          <button onClick={toggleTheme} className="nav-item group relative">{theme === 'dark' ? <Moon weight="fill" style={{ fontSize: '1.4rem' }} /> : <Sun weight="fill" style={{ fontSize: '1.4rem' }} />}</button>
          <button onClick={signOut} className="nav-item text-[var(--color-danger)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] group relative"><SignOut weight="bold" style={{ fontSize: '1.4rem' }} /></button>
      </div>
    </aside>
  );
}