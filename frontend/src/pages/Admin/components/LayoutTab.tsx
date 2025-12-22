import { useState, useEffect } from 'react';
// FIX: Added CheckCircle to imports
import { ToggleLeft, ToggleRight, LockKey, LockOpen, Layout, ShieldCheck, CheckCircle } from '@phosphor-icons/react';
import { getSystemConfig, saveSystemConfig, getCurrentRole, UserRole, SystemConfig } from '../../../utils/dashboardConfig';
import { WIDGET_REGISTRY } from '../../../utils/widgetRegistry';

export default function LayoutTab() {
    const [config, setConfig] = useState<SystemConfig>(getSystemConfig());
    const [isUnlocked, setIsUnlocked] = useState(false);
    const activeUserRole = getCurrentRole();
    const isSystemAdmin = activeUserRole === 'System Admin';

    useEffect(() => { setConfig(getSystemConfig()); }, []);

    const toggleDefaultWidget = (role: UserRole, widgetId: string) => {
        const newConfig = { ...config };
        const currentDefaults = newConfig.layout[role].defaultLayout;
        
        if (currentDefaults.includes(widgetId)) {
            newConfig.layout[role].defaultLayout = currentDefaults.filter(id => id !== widgetId);
        } else {
            newConfig.layout[role].defaultLayout = [...currentDefaults, widgetId];
        }
        
        setConfig(newConfig);
        saveSystemConfig(newConfig);
    };

    const togglePermission = (role: UserRole, permission: string) => {
        const newConfig = { ...config };
        const currentPerms = newConfig.layout[role].permissions;
        
        if (currentPerms.includes(permission)) {
            newConfig.layout[role].permissions = currentPerms.filter(p => p !== permission);
        } else {
            newConfig.layout[role].permissions = [...currentPerms, permission];
        }
        
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
        <div className="space-y-8 animate-fade-in text-[var(--color-text)]">
            <div className="mb-6 flex justify-between items-end border-b border-[var(--color-border)] pb-4">
                <div>
                    <h2 className="text-2xl font-bold mb-1">Role Configuration</h2>
                    <p className="opacity-60 text-sm text-[var(--color-text-muted)]">Set default widgets and permissions per role.</p>
                </div>
                <button onClick={() => setIsUnlocked(false)} className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text)]">Lock Changes</button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {['System Admin', 'Executive', 'Manager', 'HR_Admin', 'Employee'].map(role => (
                    <div key={role} className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></span>
                            <h4 className="font-bold text-lg uppercase tracking-wide opacity-90">{role.replace('_', ' ')}</h4>
                        </div>

                        {/* Default Widgets */}
                        <div className="mb-6">
                            <h5 className="text-xs font-bold uppercase opacity-50 mb-3 flex items-center gap-2"><Layout /> Default Widgets</h5>
                            <div className="space-y-2">
                                {Object.values(WIDGET_REGISTRY).map((widget) => {
                                    // @ts-ignore
                                    const isEnabled = config.layout[role].defaultLayout.includes(widget.id);
                                    return (
                                        <div key={widget.id} className="flex items-center justify-between p-2 hover:bg-[var(--color-bg)]/50 rounded-lg transition group">
                                            <span className="text-sm font-medium opacity-80 group-hover:opacity-100">{widget.title}</span>
                                            <button onClick={() => toggleDefaultWidget(role as UserRole, widget.id)} className="text-[var(--color-primary)] opacity-80 hover:opacity-100 transition">
                                                {isEnabled ? <ToggleRight size={24} weight="fill" /> : <ToggleLeft size={24} className="text-[var(--color-text-muted)]" />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="pt-4 border-t border-[var(--color-border)]">
                            <h5 className="text-xs font-bold uppercase opacity-50 mb-3 flex items-center gap-2"><ShieldCheck /> Access Controls</h5>
                            <div className="space-y-2">
                                {['view_finance', 'view_hiring', 'view_activity', 'view_global', 'view_ai'].map((perm) => {
                                    // @ts-ignore
                                    const hasPerm = config.layout[role].permissions.includes(perm);
                                    return (
                                        <div key={perm} className="flex items-center justify-between p-2 hover:bg-[var(--color-bg)]/50 rounded-lg transition group">
                                            <span className="text-xs font-mono opacity-60 group-hover:opacity-100">{perm}</span>
                                            <button onClick={() => togglePermission(role as UserRole, perm)} className={`opacity-80 hover:opacity-100 transition ${hasPerm ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}`}>
                                                {hasPerm ? <CheckCircle size={18} weight="fill" /> : <div className="w-4 h-4 rounded-full border-2 border-[var(--color-text-muted)]"></div>}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}