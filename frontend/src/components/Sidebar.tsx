import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SquaresFour, Users, Briefcase, Clock, ChatCircleDots, SignOut, Moon, Sun, IconProps } from '@phosphor-icons/react';
import { useState, useEffect, ElementType } from 'react';

// Helper Interface for NavItem Props
interface NavItemProps {
  to: string;
  icon: ElementType<IconProps>; // Phosphor Icon Type
  title: string;
}

export default function Sidebar() {
  const { signOut } = useAuth();
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const NavItem = ({ to, icon: Icon, title }: NavItemProps) => (
    <NavLink 
      to={to} 
      title={title}
      className={({ isActive }) => 
        `w-11 h-11 rounded-xl flex items-center justify-center transition-all mb-2 cursor-pointer
        ${isActive ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 hover:bg-indigo-500/10 hover:text-[#4f46e5]'}`
      }
    >
      <Icon size={22} weight="bold" />
    </NavLink>
  );

  return (
    <aside className="w-20 h-full flex flex-col items-center py-6 bg-gray-50 dark:bg-[#0f172a] border-r border-gray-200 dark:border-white/10 z-20">
      <div className="w-12 h-12 rounded-xl bg-gray-800 text-indigo-500 font-extrabold text-xl flex items-center justify-center mb-6 shadow-md">PB</div>
      <div className="w-8 border-t border-gray-500/20 mb-6"></div>

      <NavItem to="/dashboard" icon={SquaresFour} title="Dashboard" />
      <NavItem to="/hiring" icon={Briefcase} title="Hiring" />
      <NavItem to="/people" icon={Users} title="People" />
      <NavItem to="/time" icon={Clock} title="Time" />
      <NavItem to="/chat" icon={ChatCircleDots} title="Chat" />

      <div className="flex-grow"></div>
      
      <button onClick={toggleTheme} className="w-11 h-11 rounded-xl flex items-center justify-center text-gray-500 hover:text-indigo-500 mb-2">
        {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
      </button>
      <button onClick={signOut} className="w-11 h-11 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/10">
        <SignOut size={22} />
      </button>
    </aside>
  );
}