/* frontend/src/components/Sidebar.tsx */
import { NavLink, Link } from 'react-router-dom'; // Added Link
import { useAuth } from '../context/AuthContext';
import { 
  SquaresFour, Users, Briefcase, Clock, ChatCircleDots, SignOut, 
  Moon, Sun, CurrencyDollar, TrendUp, Globe, Files, Gear 
} from '@phosphor-icons/react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const { signOut } = useAuth();
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const Item = ({ to, icon: Icon, title }: { to: string, icon: any, title: string }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    >
      <Icon weight="bold" style={{ fontSize: '1.4rem' }} />
      <div className="nav-item-tooltip">{title}</div>
    </NavLink>
  );

  return (
    <aside 
        className="h-full flex flex-col items-center py-6 border-r z-20 overflow-y-auto no-scrollbar"
        // Added overflowX: 'hidden' to prevent horizontal scroll
        style={{ width: '80px', background: 'var(--bg-sidebar)', borderColor: 'var(--border-color)', overflowX: 'hidden' }}
    >
      {/* Updated Link to Context Manager */}
      <Link 
        to="/context"
        className="mb-6 flex items-center justify-center font-extrabold text-xl cursor-pointer hover:scale-105 transition-transform"
        style={{ 
            width: '48px', height: '48px', borderRadius: '12px', 
            background: 'var(--bg-panel)', color: 'var(--accent-primary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)' 
        }}
        title="Switch Environment"
      >
        PB
      </Link>
      
      <div className="w-8 border-t mb-6" style={{ borderColor: 'var(--border-color)' }}></div>

      <Item to="/dashboard" icon={SquaresFour} title="Dashboard" />
      <Item to="/hiring" icon={Briefcase} title="Hiring" />
      <Item to="/people" icon={Users} title="People" />
      <Item to="/time" icon={Clock} title="Time" />
      <Item to="/finance" icon={CurrencyDollar} title="Finance" />
      <Item to="/growth" icon={TrendUp} title="Growth" />
      <Item to="/compliance" icon={Globe} title="Compliance" />
      <Item to="/docs" icon={Files} title="Documents" />
      <Item to="/chat" icon={ChatCircleDots} title="Chat" />
      
      <div className="mt-2">
        <Item to="/admin" icon={Gear} title="Admin" />
      </div>

      <div className="flex-grow"></div>
      
      <button onClick={toggleTheme} className="nav-item">
        {theme === 'dark' ? <Moon weight="fill" style={{ fontSize: '1.4rem' }} /> : <Sun weight="fill" style={{ fontSize: '1.4rem' }} />}
      </button>
      
      <button 
        onClick={signOut} 
        className="nav-item text-red-400 hover:text-red-500 hover:bg-red-500/10"
        style={{ color: '#f87171' }}
      >
        <SignOut weight="bold" style={{ fontSize: '1.4rem' }} />
      </button>
    </aside>
  );
}