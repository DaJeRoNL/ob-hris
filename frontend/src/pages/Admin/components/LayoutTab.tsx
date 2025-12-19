import { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, LockKey, LockOpen } from '@phosphor-icons/react';
import { getSystemConfig, saveSystemConfig, getCurrentRole } from '../../../utils/dashboardConfig';

// Mock Type
interface SystemConfig { settings: any; layout: any; }
type UserRole = 'System Admin' | 'Executive' | 'Manager' | 'HR_Admin' | 'Employee';

export default function LayoutTab() {
    const [config, setConfig] = useState<SystemConfig>(getSystemConfig());
    const [isUnlocked, setIsUnlocked] = useState(false);
    const activeUserRole = getCurrentRole();
    const isSystemAdmin = activeUserRole === 'System Admin';

    useEffect(() => { setConfig(getSystemConfig()); }, []);

    const toggleConfig = (role: UserRole, key: string) => {
        const newConfig = { ...config };
        // @ts-ignore
        newConfig.layout[role].widgets[key] = !newConfig.layout[role].widgets[key];
        setConfig(newConfig);
        saveSystemConfig(newConfig);
    };

    if (!isUnlocked) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-[var(--color-bg)]/50 rounded-2xl border-2 border-dashed border-[var(--color-border)] animate-fade-in">
                <div className="w-16 h-16 bg-[var(--color-surface)] text-[var(--color-text-muted)] rounded-full flex items-center justify-center mb-4"><LockKey size={32} weight="duotone" /></div>
                <h2 className="text-xl font-bold mb-2 text-[var(--color-text)]">Configuration Locked</h2>
                <p className="text-sm max-w-md mb-6 opacity-70 text-[var(--color-text-muted)]">Role-based layout configurations are protected to prevent accidental overrides during demos.</p>
                {isSystemAdmin && (
                    <button onClick={() => setIsUnlocked(true)} className="px-6 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition flex items-center gap-2">
                        <LockOpen weight="fill" /> Unlock Editor
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in text-[var(--color-text)]">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Roles & Layouts</h2>
                    <p className="opacity-60 text-sm text-[var(--color-text-muted)]">Configure default widgets for each user persona.</p>
                </div>
                <button onClick={() => setIsUnlocked(false)} className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text)]">Lock Changes</button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {['System Admin', 'Executive', 'Manager', 'HR_Admin', 'Employee'].map(role => (
                    <div key={role} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-4 border-b border-[var(--color-border)] pb-3">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                            <h4 className="font-bold text-sm uppercase tracking-wide opacity-80">{role.replace('_', ' ')}</h4>
                        </div>
                        <div className="space-y-1">
                            {Object.keys(config.layout[role as UserRole].widgets).map((key) => (
                                <div key={key} className="flex items-center justify-between p-2 hover:bg-[var(--color-bg)]/50 rounded-lg transition group">
                                    <span className="capitalize text-xs font-bold opacity-70 group-hover:opacity-100">{key}</span>
                                    <button onClick={() => toggleConfig(role as UserRole, key)} className="text-[var(--color-primary)] opacity-80 hover:opacity-100 transition">
                                        {/* @ts-ignore */}
                                        {config.layout[role].widgets[key] ? <ToggleRight size={24} weight="fill" /> : <ToggleLeft size={24} className="text-[var(--color-text-muted)]" />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}