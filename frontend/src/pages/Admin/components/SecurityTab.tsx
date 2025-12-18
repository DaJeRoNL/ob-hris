import { useState } from 'react';
import { ShieldCheck, ToggleRight, LockKey, LockOpen } from '@phosphor-icons/react';
import { getCurrentRole } from '../../../utils/dashboardConfig';

export default function SecurityTab() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const isSystemAdmin = getCurrentRole() === 'System Admin';

    if (!isUnlocked) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-red-50 dark:bg-red-900/5 rounded-2xl border-2 border-dashed border-red-200 dark:border-red-900/20 animate-fade-in">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4"><LockKey size={32} weight="duotone" /></div>
                <h2 className="text-xl font-bold mb-2">Security Audit Log</h2>
                <p className="text-sm max-w-md mb-6 opacity-70">Security policies affect global login parameters. Access is restricted to System Administrators.</p>
                {isSystemAdmin && (
                    <button onClick={() => setIsUnlocked(true)} className="px-6 py-2 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition flex items-center gap-2">
                        <LockOpen weight="fill" /> Unlock Security Console
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">Security & Access</h2>
                <p className="opacity-60 text-sm">Manage authentication protocols and audit logging.</p>
            </div>

            <div className="bg-[var(--color-surface)] border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-lg"><ShieldCheck size={24} className="text-[var(--color-primary)]" /> Policies</h3>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[var(--color-surface)]/50 rounded-xl border border-gray-200 dark:border-white/10">
                        <div>
                            <div className="font-bold text-sm">Enforce Two-Factor Authentication</div>
                            <div className="text-xs opacity-60">Require 2FA for all Admin and Manager roles.</div>
                        </div>
                        <button className="text-emerald-500"><ToggleRight size={32} weight="fill" /></button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[var(--color-surface)]/50 rounded-xl border border-gray-200 dark:border-white/10 opacity-50">
                        <div>
                            <div className="font-bold text-sm">SSO Enforcement (Enterprise)</div>
                            <div className="text-xs opacity-60">Redirect all logins through Azure AD / Okta.</div>
                        </div>
                        <span className="text-[10px] font-bold bg-gray-200 dark:bg-white/10 px-2 py-1 rounded">LICENSE REQ</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
