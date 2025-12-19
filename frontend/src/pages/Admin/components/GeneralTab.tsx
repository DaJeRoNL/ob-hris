import { useState } from 'react';
import { UserSwitch, WarningCircle, ArrowCounterClockwise } from '@phosphor-icons/react';
import { getSystemConfig, getCurrentRole, setCurrentRole } from '../../../utils/dashboardConfig';

type UserRole = 'System Admin' | 'Executive' | 'Manager' | 'HR_Admin' | 'Employee';

export default function GeneralTab() {
    const [currentSimRole, setCurrentSimRole] = useState<UserRole>(getCurrentRole());
    const activeUserRole = getCurrentRole(); 

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as UserRole;
        setCurrentSimRole(newRole);
        setCurrentRole(newRole);
        setTimeout(() => window.location.reload(), 100);
    };

    const handleFactoryReset = () => {
        if(confirm('⚠️ FACTORY RESET: This will wipe all demo data, local changes, and timer history. Are you sure?')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl text-[var(--color-text)]">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">General Settings</h2>
                <p className="opacity-60 text-sm text-[var(--color-text-muted)]">Manage environment simulation and data persistence.</p>
            </div>

            {/* ROLE SIMULATION */}
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm transition-colors duration-300">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-lg text-[var(--color-text)]">
                    <UserSwitch size={24} className="text-[var(--color-primary)]" /> 
                    User Simulation
                </h3>
                
                <div className="p-6 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg)]/50">
                    <label className="text-xs font-bold uppercase opacity-70 block mb-2 text-[var(--color-text-muted)]">Current Active Role</label>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <select 
                            value={currentSimRole} 
                            onChange={handleRoleChange} 
                            className="w-full md:w-auto bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-[var(--color-primary)] outline-none min-w-[250px] shadow-sm cursor-pointer hover:border-[var(--color-primary)] transition-all"
                        >
                            <option value="System Admin">System Admin (Full Access)</option>
                            <option value="Executive">Executive</option>
                            <option value="Manager">Manager</option>
                            <option value="HR_Admin">HR Admin</option>
                            <option value="Employee">Employee (Restricted)</option>
                        </select>
                        <div className="text-xs opacity-60 text-[var(--color-text-muted)]">
                            Logged in as: <span className="font-bold text-[var(--color-primary)]">{activeUserRole}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* DANGER ZONE */}
            <div className="bg-[var(--color-danger)]/5 border border-[var(--color-danger)]/20 p-6 rounded-2xl">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-lg text-[var(--color-danger)]">
                    <WarningCircle size={24} weight="fill" /> 
                    Danger Zone
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-bold text-sm text-[var(--color-danger)]">Factory Reset Demo</div>
                        <div className="text-xs opacity-60 text-[var(--color-danger)]">Wipes LocalStorage, Mock Data, and Auth Tokens.</div>
                    </div>
                    <button 
                        onClick={handleFactoryReset} 
                        className="px-4 py-2 bg-[var(--color-danger)] text-white font-bold rounded-xl shadow-lg hover:bg-[var(--color-danger)]/90 transition flex items-center gap-2"
                    >
                        <ArrowCounterClockwise weight="bold" /> Reset All
                    </button>
                </div>
            </div>
        </div>
    );
}