import { NavLink } from 'react-router-dom';
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

  // Helper to DRY up nav items
  const Item = ({ to, icon: Icon, title }: { to: string, icon: any, title: string }) => (
    <NavLink 
      to={to} 
      title={title}
      className={({ isActive }) => 
        `w-11 h-11 rounded-xl flex items-center justify-center transition-all mb-2 cursor-pointer group relative
        ${isActive ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 hover:bg-indigo-500/10 hover:text-[#4f46e5]'}`
      }
    >
      <Icon size={22} weight="bold" />
      {/* Tooltip implementation */}
      <div className="absolute left-[120%] bg-[#1f2937] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-white/10 shadow-xl">
        {title}
      </div>
    </NavLink>
  );

  return (
    <aside className="w-20 h-full flex flex-col items-center py-6 bg-[#f8fafc] dark:bg-[#0f172a] border-r border-gray-200 dark:border-white/10 z-20 overflow-y-auto no-scrollbar">
      <div className="w-12 h-12 rounded-xl bg-gray-800 text-indigo-500 font-extrabold text-xl flex items-center justify-center mb-6 shadow-md cursor-pointer hover:scale-105 transition-transform">
        PB
      </div>
      <div className="w-8 border-t border-gray-500/20 mb-6"></div>

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
      
      <button onClick={toggleTheme} className="w-11 h-11 rounded-xl flex items-center justify-center text-gray-500 hover:text-indigo-500 mb-2">
        {theme === 'dark' ? <Moon size={22} weight="fill" /> : <Sun size={22} weight="fill" />}
      </button>
      <button onClick={signOut} className="w-11 h-11 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/10 hover:text-red-500">
        <SignOut size={22} weight="bold" />
      </button>
    </aside>
  );
}