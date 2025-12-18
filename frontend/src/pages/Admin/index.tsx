import { useState } from 'react';
import { Globe, ShieldCheck, UserSwitch, Palette, CaretRight, UserCircle } from '@phosphor-icons/react';
import GeneralTab from './components/GeneralTab';
import LayoutTab from './components/LayoutTab';
import SecurityTab from './components/SecurityTab';
import LookAndFeelTab from './components/LookAndFeelTab';
import ProfileTab from './components/ProfileTab';

type Tab = 'profile' | 'general' | 'layout' | 'security' | 'theme';

export default function Admin() {
    const [activeTab, setActiveTab] = useState<Tab>('general');

    const MENU_ITEMS = [
        { id: 'profile', label: 'My Profile', icon: UserCircle, desc: 'Account Details' },
        { id: 'general', label: 'General Settings', icon: Globe, desc: 'Environment & Reset' },
        { id: 'layout', label: 'Roles & Layouts', icon: UserSwitch, desc: 'Widget Configuration' },
        { id: 'security', label: 'Security & Audit', icon: ShieldCheck, desc: '2FA & Access Logs' },
        { id: 'theme', label: 'Look & Feel', icon: Palette, desc: 'Themes & Dark Mode' },
    ];

    return (
        // FIXED: Uses var(--color-bg) instead of hardcoded colors
        <div className="flex h-full bg-[var(--color-bg)] text-[var(--color-text)] animate-fade-in overflow-hidden relative transition-colors duration-500">
            
            {/* SIDEBAR NAVIGATION */}
            <div className="w-80 bg-[var(--color-surface)] border-r border-gray-200 dark:border-white/10 flex flex-col shrink-0 z-20 shadow-2xl transition-colors duration-500">
                <div className="p-8 pb-4">
                    <h1 className="text-2xl font-black font-['Montserrat'] tracking-tight flex items-center gap-2">
                        <ShieldCheck className="text-[var(--color-primary)]" weight="duotone" />
                        Admin
                    </h1>
                    <p className="text-xs opacity-50 font-medium mt-1 pl-1">System Control Panel</p>
                </div>
                
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as Tab)}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-300 group relative flex items-center gap-4 ${
                                    isActive 
                                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-indigo-500/20 translate-x-1' 
                                    : 'hover:bg-gray-100 dark:hover:bg-[var(--color-surface)]/50 text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                <div className={`p-2.5 rounded-lg transition-colors ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-[var(--color-surface)]/50 group-hover:bg-white/10'}`}>
                                    <Icon size={20} weight={isActive ? 'fill' : 'duotone'} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm leading-tight">{item.label}</div>
                                    <div className={`text-[10px] transition-opacity ${isActive ? 'opacity-80' : 'opacity-50'}`}>{item.desc}</div>
                                </div>
                                {isActive && <CaretRight weight="bold" className="opacity-50" />}
                            </button>
                        );
                    })}
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">System Operational</span>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[var(--color-bg)] transition-colors duration-500">
                {/* REMOVED: The Gradient line that was causing the visual break */}
                
                <div className="relative z-10 max-w-5xl mx-auto p-10 min-h-full">
                    {activeTab === 'profile' && <ProfileTab />}
                    {activeTab === 'general' && <GeneralTab />}
                    {activeTab === 'layout' && <LayoutTab />}
                    {activeTab === 'security' && <SecurityTab />}
                    {activeTab === 'theme' && <LookAndFeelTab />}
                </div>
            </div>
        </div>
    );
}
